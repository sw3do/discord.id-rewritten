export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required',
    })
  }

  try {
    const discordResponse = await $fetch(
      `https://discord.com/api/v10/users/${userId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
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

    return result
  }
  catch (error) {
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
