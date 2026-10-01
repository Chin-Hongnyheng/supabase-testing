// ─── Offline Habit Queue ──────────────────────────────────────────────────────
// When navigator.onLine === false at the time a habit is added, we push it
// to localStorage under the key QUEUE_KEY instead of calling the API.
//
// On reconnect (online event), the caller flushes the queue by calling each
// entry through the real createHabit API, then clears the queue.
//
// SECURITY: Only non-sensitive habit content is stored (title, category, etc.).
// No JWT or auth tokens are ever written to localStorage.

const QUEUE_KEY = "offline_habit_queue"

export interface QueuedHabit {
  id: string          // temporary client-side ID (used as React key)
  title: string
  category: string
  queuedAt: string    // ISO timestamp
}

/** Push a habit to the offline queue. */
export function enqueueHabit(habit: Omit<QueuedHabit, "id" | "queuedAt">): QueuedHabit {
  const queue = getQueue()
  const entry: QueuedHabit = {
    ...habit,
    id: `queued-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    queuedAt: new Date().toISOString(),
  }
  queue.push(entry)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  return entry
}

/** Return all queued habits. */
export function getQueue(): QueuedHabit[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? (JSON.parse(raw) as QueuedHabit[]) : []
  } catch {
    return []
  }
}

/** Remove a single entry from the queue (after successful sync). */
export function dequeueHabit(id: string): void {
  const remaining = getQueue().filter((h) => h.id !== id)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining))
}

/** Clear the entire queue. */
export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY)
}
