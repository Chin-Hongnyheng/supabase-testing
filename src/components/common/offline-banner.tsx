import { useEffect, useState } from "react"

// ─── OfflineBanner ────────────────────────────────────────────────────────────
// Listens to the browser's online/offline events (no third-party library).
// Shows a fixed bottom-left banner when the user is offline, hides on reconnect.
// This is UX — not security. The service worker is the real offline layer.

export function OfflineBanner() {
  // initialise from the current browser state — handles the case where the
  // component mounts while the device is already offline
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div
      id="offline-banner"
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 shadow-lg"
    >
      <span className="text-amber-400 text-lg" aria-hidden="true">
        📡
      </span>
      <p className="text-sm font-medium text-amber-300">
        You're offline — changes will sync when reconnected
      </p>
    </div>
  )
}

export default OfflineBanner
