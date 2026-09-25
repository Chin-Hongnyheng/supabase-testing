import React from "react"

// ─── ErrorBoundary ─────────────────────────────────────────────────────────────
// A reusable class component that catches render errors in its subtree.
// Renders a themed fallback card with a "Try again" reset button.

interface ErrorBoundaryProps {
  children: React.ReactNode
  /** Short title shown in the fallback UI, e.g. "Could not load habits" */
  fallbackTitle?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack)
  }

  handleReset() {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 flex flex-col gap-3"
        >
          <p className="font-semibold text-foreground text-sm">
            {this.props.fallbackTitle ?? "Something went wrong"}
          </p>
          {this.state.error?.message && (
            <p className="text-muted-foreground text-xs font-mono break-words">
              {this.state.error.message}
            </p>
          )}
          <button
            id="error-boundary-retry-btn"
            type="button"
            onClick={this.handleReset}
            className="self-start bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
