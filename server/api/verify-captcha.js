export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  const body = await readBody(event)
  const { token, userId } = body

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Captcha token is required'
    })
  }

  if (!process.env.HCAPTCHA_SECRET_KEY) {
    throw createError({
      statusCode: 500,
      statusMessage: 'hCaptcha not configured'
    })
  }

  try {
    const verifyResponse = await $fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET_KEY,
        response: token,
        remoteip: getClientIP(event)
      })
    })

    if (!verifyResponse.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Captcha verification failed'
      })
    }

    const sessionToken = generateSecureToken()
    const expiresAt = Date.now() + (10 * 60 * 1000)
    
    if (process.env.REDIS_URL) {
      try {
        const { createClient } = await import('redis')
        const redisClient = createClient({ url: process.env.REDIS_URL })
        await redisClient.connect()
        
        await redisClient.setEx(
          `captcha:${sessionToken}`,
          600,
          JSON.stringify({
            userId: userId || null,
            ip: getClientIP(event),
            verified: true,
            timestamp: Date.now()
          })
        )
        
        await redisClient.destroy()
      } catch (redisError) {
        console.error('Redis error:', redisError)
      }
    }

    setCookie(event, 'captcha-verified', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 600
    })

    return {
      success: true,
      message: 'Captcha verified successfully',
      sessionToken,
      expiresAt
    }
  } catch (error) {
    console.error('Captcha verification error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Captcha verification failed'
    })
  }
})

function getClientIP(event) {
  const forwarded = getHeader(event, 'x-forwarded-for')
  const realIP = getHeader(event, 'x-real-ip')
  const cfIP = getHeader(event, 'cf-connecting-ip')
  
  return cfIP || realIP || (forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1')
}

function generateSecureToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}