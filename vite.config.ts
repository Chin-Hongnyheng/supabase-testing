import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // "prompt" — service worker will NOT auto-update.
      // The UpdateToast component handles the "New version available" prompt.
      registerType: "prompt",
      // Include static assets in the precache manifest
      includeAssets: ["logo.png", "icons/*.png"],
      // We manage our own manifest.json in /public — do not auto-generate one
      manifest: false,
      workbox: {
        // Precache everything that makes up the app shell.
        // Vite hashes JS/CSS filenames, so these are safe to cache forever.
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          // ── Google Fonts CSS ─────────────────────────────────────────────
          // StaleWhileRevalidate: serve cached version immediately (fast),
          // but fetch an update in the background so we eventually pick up changes.
          {
            urlPattern: ({ url }: { url: URL }) =>
              url.origin === "https://fonts.googleapis.com",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          // ── Google Fonts files (woff2) ───────────────────────────────────
          // CacheFirst: font files are immutable (versioned URLs).
          // No need to hit the network on repeat visits.
          {
            urlPattern: ({ url }: { url: URL }) =>
              url.origin === "https://fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          // ── Supabase API calls ───────────────────────────────────────────
          // NetworkFirst with 3s timeout: user data must be fresh.
          // Only fall back to cache when the network is unavailable (offline mode).
          {
            urlPattern: ({ url }: { url: URL }) =>
              url.hostname.includes("supabase.co"),
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes stale cache
              },
            },
          },
          // ── Images (avatars, course covers) ─────────────────────────────
          // CacheFirst: images are large and rarely change.
          // Avoids repeated downloads on every page visit.
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
