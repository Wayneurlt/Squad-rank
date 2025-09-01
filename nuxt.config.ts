// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "notivue/nuxt",
    "@pinia/nuxt",
    "@prisma/nuxt",
    "@nuxt/fonts",
    "@nuxt/icon",
    "nuxt-auth-utils",
  ],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: [
    "~/assets/css/main.css",
    "notivue/notification.css",
    "notivue/animations.css",
    "aos/dist/aos.css",
  ],
  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },
  runtimeConfig: {
    adminSecret: process.env.ADMIN_SECRET,
    public: {
      siteName: process.env.SITE_NAME || "SquadRank",
    },
  },
  app: {
    head: {
      title: "SquadRank - Squad Leaderboard",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width,initial-scale=1" },
        { name: "description", content: "Track and rank your squad members across various categories with beautiful leaderboards and engaging animations." },
        { name: "theme-color", content: "#4f46e5" },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" },
      ],
    },
  },
  vite: {
    resolve: {
      alias: {
        ".prisma/client/index-browser":
          "./node_modules/.prisma/client/index-browser.js",
      },
    },
  },
  notivue: {
    limit: 3,
    avoidDuplicates: true,
    notifications: {
      global: {
        duration: 5000,
      },
    },
  },
});
