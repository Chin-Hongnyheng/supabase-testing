import { Platform } from "react-native"

// ─── shareHabits ─────────────────────────────────────────────────────────────
// This is the ONE and only place in the codebase that branches on Platform.
// All other code simply calls shareHabits(url) and knows nothing about
// navigator.share vs React Native Share — the platform detail is fully isolated.
//
// Web path:   uses navigator.share (native share sheet on mobile browser)
//             falls back to navigator.clipboard.writeText on desktop
// Native path: uses React Native's Share.share API

export async function shareHabits(url: string): Promise<void> {
  const handler = Platform.select({
    // ── Web ───────────────────────────────────────────────────────────────────
    web: async () => {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "My Habits — Vibe Learn",
          text: "Check out my learning habits on Vibe Learn!",
          url,
        })
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url)
      }
    },
    // ── Native (iOS / Android) ────────────────────────────────────────────────
    default: async () => {
      // Dynamic import so the native Share module is never bundled on web
      const { Share } = await import("react-native")
      await Share.share({
        message: `Check out my learning habits on Vibe Learn! ${url}`,
        url, // iOS only — ignored on Android
      })
    },
  })

  await handler?.()
}
