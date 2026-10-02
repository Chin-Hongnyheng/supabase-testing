// ─── Habits Types (Expo) ──────────────────────────────────────────────────────
// Shared shape — no browser-only APIs in this file.

export type HabitFrequency = "daily" | "weekly"

export type Habit = {
  id: number
  user_id: string | null
  title: string
  description: string | null
  category: string
  frequency: HabitFrequency
  target_count: number
  unit: string
  is_active: boolean
  created_at: string
}
