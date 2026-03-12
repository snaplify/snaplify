export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
          crossorigin: 'anonymous',
        },
      ],
    },
  },
  css: [
    '@commonpub/ui/theme/base.css',
    '@commonpub/ui/theme/dark.css',
    '@commonpub/ui/theme/prose.css',
  ],
  modules: [],
  runtimeConfig: {
    databaseUrl: '',
    authSecret: 'dev-secret-change-me',
    public: {
      siteUrl: 'http://localhost:3000',
      domain: 'localhost:3000',
      siteName: 'CommonPub',
      siteDescription: 'A CommonPub instance',
    },
  },
  routeRules: {
    '/docs/**': { prerender: true },
  },
  nitro: {
    preset: 'node-server',
  },
});
