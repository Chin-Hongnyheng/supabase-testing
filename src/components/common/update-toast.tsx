import { useRegisterSW } from "virtual:pwa-register/react"

// ─── UpdateToast ──────────────────────────────────────────────────────────────
// Shown when a new service worker is waiting to activate.
// registerType: "prompt" means the SW will NOT auto-update — this component
// gives the user control. Clicking "Refresh" calls skipWaiting() on the SW
// and reloads the page, applying the new version.

export function UpdateToast() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log("[PWA] Service worker registered:", r)
    },
    onRegisterError(error: unknown) {
      console.error("[PWA] Service worker registration error:", error)
    },
  })

  if (!needRefresh) return null

  return (
    <div
      id="pwa-update-toast"
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg"
    >
      <span className="text-sm text-foreground">
        🔄 New version available
      </span>
      <button
        id="pwa-refresh-btn"
        type="button"
        onClick={() => updateServiceWorker(true)}
        className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
      >
        Refresh
      </button>
    </div>
  )
}

export default UpdateToast
