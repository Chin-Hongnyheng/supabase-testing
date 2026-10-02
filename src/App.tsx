import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { RootLayout } from "@/components/layout/root-layout"
import { HomePage } from "@/pages/home-page"
import { CoursesPage } from "@/pages/courses-page"
import { SignInPage } from "@/pages/sign-in-page"
import { SignUpPage } from "@/pages/sign-up-page"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { NotFoundPage } from "@/pages/not-found-page"
import { PageSkeleton } from "@/components/common/page-skeleton"

// ─── Lazy-split routes ────────────────────────────────────────────────────────
// These routes are authenticated-only or deep in the navigation tree.
// A first-time visitor never needs them on initial load — splitting them
// keeps the initial JS bundle small and speeds up LCP on the home page.
const CourseDetailPage = lazy(() =>
  import("@/pages/course-detail-page").then((m) => ({ default: m.CourseDetailPage }))
)
const LearningPage = lazy(() =>
  import("@/pages/learning-page").then((m) => ({ default: m.LearningPage }))
)
const HabitsPage = lazy(() =>
  import("@/pages/habits-page").then((m) => ({ default: m.HabitsPage }))
)

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="course" element={<Navigate to="/courses" replace />} />

          {/* Lazy: course detail — only reached after the courses list */}
          <Route
            path="courses/:id"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <CourseDetailPage />
              </Suspense>
            }
          />
          <Route
            path="course/:id"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <CourseDetailPage />
              </Suspense>
            }
          />

          {/* Lazy: learning — authenticated, never needed on first paint */}
          <Route
            path="courses/:id/learn"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <LearningPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="course/:id/learn"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <LearningPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="my-learning"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <LearningPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="my-learning/:id"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <LearningPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Lazy: habits — authenticated-only, anonymous visitors never reach it */}
          <Route
            path="habits"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <HabitsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route path="sign-in/*" element={<SignInPage />} />
          <Route path="sign-up/*" element={<SignUpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
