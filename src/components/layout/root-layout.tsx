import { Outlet } from "react-router-dom"
import { NavigationSection } from "@/sections/navigationsection"
import { Footer } from "@/sections/footer"
import { ErrorBoundary } from "@/components/common/error-boundary"

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ErrorBoundary fallbackTitle="Navigation error — try refreshing the page">
        <NavigationSection />
      </ErrorBoundary>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout
