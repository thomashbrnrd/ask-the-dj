// https://nuxt.com/docs/api/configuration/nuxt-config
const githubRepo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const githubPagesBaseURL = githubRepo ? `/${githubRepo}/` : "/";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@vite-pwa/nuxt"],

  nitro: {
    preset: "github_pages",
  },

  runtimeConfig: {
    public: {
      umamiSrc: "",
      umamiWebsiteId: "",
    },
  },

  app: {
    baseURL:
      process.env.NUXT_APP_BASE_URL ||
      (process.env.GITHUB_ACTIONS === "true" ? githubPagesBaseURL : "/"),
    head: {
      title: "AskTheDJ",
      meta: [
        {
          name: "description",
          content: "Turn your phone into a message for the DJ.",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        { name: "theme-color", content: "#000000" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap",
        },
      ],
    },
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "AskTheDJ",
      short_name: "AskDJ",
      description: "Turn your phone into a message for the DJ.",
      display: "standalone",
      theme_color: "#000000",
      background_color: "#000000",
      icons: [
        {
          src: "/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
});
