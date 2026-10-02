// ─── PageSkeleton ─────────────────────────────────────────────────────────────
// Used as the Suspense fallback when a lazy-loaded route chunk is downloading.
// A simple full-page pulse that matches the app's dark/light background.

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {/* Fake heading */}
        <div className="h-8 w-1/3 rounded-lg bg-muted mb-4" />
        <div className="h-4 w-1/4 rounded-lg bg-muted mb-12" />

        {/* Fake cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PageSkeleton
