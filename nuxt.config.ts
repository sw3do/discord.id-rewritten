// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/icon'],
  image: {
    domains: [
      'cdn.discordapp.com',
      'media.discordapp.net'
    ]
  },
  runtimeConfig: {
    discordBotToken: process.env.DISCORD_BOT_TOKEN,
    hcaptchaSecretKey: process.env.HCAPTCHA_SECRET_KEY,
    redisUrl: process.env.REDIS_URL,
    nodeEnv: process.env.NODE_ENV,
    public: {
      hcaptchaSiteKey: process.env.NUXT_PUBLIC_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001'
    }
  },
  app: {
    head: {
      title: 'DiscordID - Lookup',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'View Discord user information and profiles. Lookup Discord users by their ID and see their badges, bio, avatar, and more details.',
        },
        {
          name: 'keywords',
          content:
            'Discord, user lookup, Discord ID, Discord profile, Discord badges, Discord avatar, Discord bio',
        },
        { name: 'author', content: 'DiscordID' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'DiscordID - Lookup' },
        {
          property: 'og:description',
          content:
            'View Discord user information and profiles. Lookup Discord users by their ID and see their badges, bio, avatar, and more details.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://discordid.space' },
        { property: 'og:site_name', content: 'DiscordID' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'DiscordID - Lookup' },
        {
          name: 'twitter:description',
          content:
            'View Discord user information and profiles. Lookup Discord users by their ID and see their badges, bio, avatar, and more details.',
        },
        { name: 'theme-color', content: '#5865f2' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://discordid.space' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  vite: {
    plugins: [tailwindcss()],
  },
})