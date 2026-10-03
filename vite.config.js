import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "robots.txt",
      ],

      manifest: {
        name: "MT LUXOR",
        short_name: "MT LUXOR",
        description: "MT LUXOR — Premium Timepieces",
        theme_color: "#0b0b0b",
        background_color: "#0b0b0b",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",

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
        cleanupOutdatedCaches: true,
      },

      devOptions: {
        enabled: true,
      },
    }),
  ],
});