import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ClerkProvider } from "@clerk/clerk-react"

import "./globals.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { UpdateToast } from "@/components/common/update-toast.tsx"
import { OfflineBanner } from "@/components/common/offline-banner.tsx"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key: Add VITE_CLERK_PUBLISHABLE_KEY to your .env file")
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ThemeProvider defaultTheme="light">
        <App />
        {/* PWA: shows "New version available — Refresh" when a new SW is waiting */}
        <UpdateToast />
        {/* PWA: amber banner driven by native online/offline events */}
        <OfflineBanner />
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>
)
