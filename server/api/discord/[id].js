export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const userId = getRouterParam(event, 'id')
  const ip = getClientIP(event)
  const userAgent = getHeader(event, 'user-agent') || 'unknown'

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required',
    })
  }

  if (!/^\d{17,19}$/.test(userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Discord user ID format',
    })
  }

  const requiresCaptcha = await checkIfCaptchaRequired(event, ip, userAgent, config)
  if (requiresCaptcha) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Captcha verification required',
      data: { requiresCaptcha: true }
    })
  }

  await logRequest(ip, userAgent, userId, config)

  try {
    const discordResponse = await $fetch(
      `https://discord.com/api/v10/users/${userId}`,
      {
        headers: {
          Authorization: `Bot ${config.discordBotToken}`,
        },
      },
    )

    let lanyardData = null
    try {
      const lanyardResponse = await $fetch(
        `https://api.lanyard.rest/v1/users/${userId}`,
      )
      if (lanyardResponse.success) {
        lanyardData = lanyardResponse.data
      }
    }
    catch (lanyardError) {
      console.log('Lanyard data not available for user:', userId)
    }

    const result = {
      ...discordResponse,
      lanyard: lanyardData,
    }

    await logSuccessfulRequest(ip, userId, config)
    return result
  }
  catch (error) {
    await logFailedRequest(ip, userId, error.status || 500, config)
    if (error.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      })
    }

    if (error.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid bot token',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})

function getClientIP(event) {
  const forwarded = getHeader(event, 'x-forwarded-for')
  const realIP = getHeader(event, 'x-real-ip')
  const cfIP = getHeader(event, 'cf-connecting-ip')
  
  return cfIP || realIP || (forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1')
}

async function checkIfCaptchaRequired(event, ip, userAgent, config) {
  const captchaToken = getCookie(event, 'captcha-verified')
  
  if (captchaToken) {
    if (config.redisUrl) {
      try {
        const { createClient } = await import('redis')
        const redisClient = createClient({ url: config.redisUrl })
        await redisClient.connect()
        
        const verified = await redisClient.get(`captcha:${captchaToken}`)
        await redisClient.destroy()
        
        if (verified) {
          const data = JSON.parse(verified)
          if (data.ip === ip && data.verified) {
            return false
          }
        }
      } catch (error) {
        console.error('Redis captcha check error:', error)
      }
    }
  }

  if (config.redisUrl) {
    try {
      const { createClient } = await import('redis')
      const redisClient = createClient({ url: config.redisUrl })
      await redisClient.connect()
      
      const requestCount = await redisClient.get(`requests:${ip}:${Math.floor(Date.now() / 300000)}`)
      await redisClient.destroy();
      
      if (parseInt(requestCount || '0') > 10) {
        return true
      }
    } catch (error) {
      console.error('Redis rate check error:', error)
    }
  }

  const suspiciousPatterns = [
    /bot|crawler|spider|scraper/i,
    /curl|wget|python|php/i,
    /automated|script/i
  ]
  
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    return true
  }

  return false
}

async function logRequest(ip, userAgent, userId, config) {
  if (!config.redisUrl) return
  
  try {
    const { createClient } = await import('redis')
    const redisClient = createClient({ url: config.redisUrl })
    await redisClient.connect()
    
    const timeWindow = Math.floor(Date.now() / 300000)
    const key = `requests:${ip}:${timeWindow}`
    
    await redisClient.incr(key)
    await redisClient.expire(key, 300)
    
    await redisClient.lPush(`logs:requests`, JSON.stringify({
      ip,
      userAgent,
      userId,
      timestamp: Date.now(),
      type: 'request'
    }))
    
    await redisClient.lTrim(`logs:requests`, 0, 999)
    await redisClient.destroy()
  } catch (error) {
    console.error('Request logging error:', error)
  }
}

async function logSuccessfulRequest(ip, userId, config) {
  if (!config.redisUrl) return
  
  try {
    const { createClient } = await import('redis')
    const redisClient = createClient({ url: config.redisUrl })
    await redisClient.connect()
    
    await redisClient.lPush(`logs:success`, JSON.stringify({
      ip,
      userId,
      timestamp: Date.now(),
      type: 'success'
    }))
    
    await redisClient.lTrim(`logs:success`, 0, 999)
    await redisClient.destroy()
  } catch (error) {
    console.error('Success logging error:', error)
  }
}

async function logFailedRequest(ip, userId, statusCode, config) {
  if (!config.redisUrl) return
  
  try {
    const { createClient } = await import('redis')
    const redisClient = createClient({ url: config.redisUrl })
    await redisClient.connect()
    
    await redisClient.lPush(`logs:failed`, JSON.stringify({
      ip,
      userId,
      statusCode,
      timestamp: Date.now(),
      type: 'failed'
    }))
    
    await redisClient.lTrim(`logs:failed`, 0, 999)
    await redisClient.destroy();
  } catch (error) {
    console.error('Failed request logging error:', error)
  }
}
