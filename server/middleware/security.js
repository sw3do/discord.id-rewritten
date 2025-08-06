import rateLimit, { ipKeyGenerator } from 'express-rate-limit'
import slowDown from 'express-slow-down'
import { createClient } from 'redis'

let redisClient = null

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL
  })
  redisClient.connect().catch(console.error)
}

const ipWhitelist = new Set([
  '127.0.0.1',
  '::1'
])

const suspiciousIPs = new Map()
const requestPatterns = new Map()

function getClientIP(event) {
  const forwarded = getHeader(event, 'x-forwarded-for')
  const realIP = getHeader(event, 'x-real-ip')
  const cfIP = getHeader(event, 'cf-connecting-ip')
  
  return cfIP || realIP || (forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1')
}

function isIPSuspicious(ip) {
  if (ipWhitelist.has(ip)) return false
  
  const suspiciousData = suspiciousIPs.get(ip)
  if (!suspiciousData) return false
  
  const now = Date.now()
  if (now - suspiciousData.lastSeen > 3600000) {
    suspiciousIPs.delete(ip)
    return false
  }
  
  return suspiciousData.violations >= 5
}

function markIPSuspicious(ip, reason) {
  if (ipWhitelist.has(ip)) return
  
  const existing = suspiciousIPs.get(ip) || { violations: 0, reasons: [], lastSeen: 0 }
  existing.violations += 1
  existing.reasons.push(reason)
  existing.lastSeen = Date.now()
  
  suspiciousIPs.set(ip, existing)
}

function detectSpamPattern(ip, userAgent, path) {
  const key = `${ip}:${userAgent}`
  const now = Date.now()
  const pattern = requestPatterns.get(key) || { requests: [], paths: new Set() }
  
  pattern.requests = pattern.requests.filter(time => now - time < 60000)
  pattern.requests.push(now)
  pattern.paths.add(path)
  
  requestPatterns.set(key, pattern)
  
  if (pattern.requests.length > 20) {
    markIPSuspicious(ip, 'High frequency requests')
    return true
  }
  
  if (pattern.paths.size === 1 && pattern.requests.length > 10) {
    markIPSuspicious(ip, 'Repeated same endpoint')
    return true
  }
  
  return false
}

export const rateLimiter = rateLimit({
  windowMs: 100 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const ip = req.ip || req.connection.remoteAddress
    return ipWhitelist.has(ip)
  },
  keyGenerator: ipKeyGenerator
})

export const apiRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 30,
  message: {
    error: 'API rate limit exceeded',
    message: 'Too many API requests. Please wait before trying again.',
    retryAfter: 300
  },
  standardHeaders: true,
  legacyHeaders: false
})

export const speedLimiter = slowDown({
  windowMs: 30 * 60 * 1000,
  delayAfter: 50,
  delayMs: () => 500,
  maxDelayMs: 20000,
  validate: { delayMs: false }
})

export default defineEventHandler(async (event) => {
  const ip = getClientIP(event)
  const userAgent = getHeader(event, 'user-agent') || 'unknown'
  const path = getRouterParam(event, '_') || event.node.req.url
  
  if (isIPSuspicious(ip)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'IP temporarily blocked due to suspicious activity'
    })
  }
  
  if (detectSpamPattern(ip, userAgent, path)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Spam pattern detected'
    })
  }
  
  const suspiciousPatterns = [
    /bot|crawler|spider|scraper/i,
    /curl|wget|python|php/i,
    /automated|script/i
  ]
  
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    markIPSuspicious(ip, 'Suspicious user agent')
  }
  
  if (redisClient) {
    try {
      const key = `security:${ip}`
      const requests = await redisClient.incr(key)
      if (requests === 1) {
        await redisClient.expire(key, 3600)
      }
      
      if (requests > 200) {
        markIPSuspicious(ip, 'High request volume')
        throw createError({
          statusCode: 429,
          statusMessage: 'Request limit exceeded'
        })
      }
    } catch (error) {
      console.error('Redis error:', error)
    }
  }
})