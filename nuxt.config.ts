import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: '.',
  typescript: {
    strict: true,
    typeCheck: false
  },
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_KEY || '',
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    public: {
      appName: 'Nuxt Cloud File Manager',
      mockMode: process.env.MOCK_MODE === 'true'
    }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  app: {
    head: {
      title: 'Nuxt Cloud File Manager',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Manage and preview files in the cloud using Nuxt 3.' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
})
