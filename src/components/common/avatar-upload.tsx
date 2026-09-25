import { useEffect, useRef, useState } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"
import { supabase as publicSupabase } from "@/lib/supabase"

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_BYTES = 1 * 1024 * 1024 // 1 MB

interface AvatarUploadProps {
  userId: string
  /** Clerk-aware Supabase client that injects the Clerk Bearer JWT */
  db: SupabaseClient
  /** Current avatar URL from the users table (may be null) */
  currentUrl: string | null
}

// ─── CameraIcon ───────────────────────────────────────────────────────────────
function CameraIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

// ─── SpinnerIcon ──────────────────────────────────────────────────────────────
function SpinnerIcon() {
  return (
    <svg
      className="w-4 h-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

// ─── AvatarUpload ─────────────────────────────────────────────────────────────
export function AvatarUpload({ userId, db, currentUrl }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUrl)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<string | null>(null)

  // On mount, fetch the latest avatar_url from the users table
  useEffect(() => {
    let cancelled = false
    async function fetchAvatar() {
      const { data } = await db
        .from("users")
        .select("avatar_url")
        .eq("id", userId)
        .single()
      if (!cancelled && data?.avatar_url) {
        setAvatarUrl(data.avatar_url as string)
      }
    }
    void fetchAvatar()
    return () => {
      cancelled = true
    }
  }, [userId, db])

  // Revoke object URL on unmount
  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    }
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setError(null)
    setSelectedFile(null)

    // Revoke old preview
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current)
      previewRef.current = null
      setPreview(null)
    }

    if (!file) return

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.")
      e.target.value = ""
      return
    }

    // Validate size
    if (file.size > MAX_BYTES) {
      setError("File must be under 1 MB.")
      e.target.value = ""
      return
    }

    // All good — show preview
    const objectUrl = URL.createObjectURL(file)
    previewRef.current = objectUrl
    setPreview(objectUrl)
    setSelectedFile(file)
  }

  async function handleUpload() {
    if (!selectedFile || uploading) return

    setUploading(true)
    setError(null)

    const storagePath = `${userId}/avatar.jpg`

    // 1. Upload to Supabase Storage (upsert to replace existing)
    const { error: uploadError } = await db.storage
      .from("avatars")
      .upload(storagePath, selectedFile, {
        upsert: true,
        contentType: selectedFile.type,
      })

    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`)
      setUploading(false)
      return
    }

    // 2. Get public URL (using public anon client — bucket is public)
    const { data: urlData } = publicSupabase.storage
      .from("avatars")
      .getPublicUrl(storagePath)

    const publicUrl = urlData?.publicUrl
    if (!publicUrl) {
      setError("Could not retrieve public URL.")
      setUploading(false)
      return
    }

    // 3. Save URL to users.avatar_url
    const { error: updateError } = await db
      .from("users")
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (updateError) {
      setError(`Could not save avatar URL: ${updateError.message}`)
      setUploading(false)
      return
    }

    // 4. Commit state
    setAvatarUrl(publicUrl)

    // Revoke preview object URL
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current)
      previewRef.current = null
    }
    setPreview(null)
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ""
    setUploading(false)
  }

  const displaySrc = preview ?? avatarUrl ?? undefined

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Avatar circle with camera overlay */}
      <div className="relative w-16 h-16 shrink-0">
        {displaySrc ? (
          <img
            id="avatar-preview-img"
            src={displaySrc}
            alt="User avatar"
            className="w-16 h-16 rounded-full object-cover border-2 border-border shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center text-muted-foreground shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 opacity-40"
            >
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4Z" />
            </svg>
          </div>
        )}

        {/* Camera button overlay */}
        <button
          id="avatar-camera-btn"
          type="button"
          aria-label="Change avatar"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <CameraIcon />
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        id="avatar-file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload button — visible only when a valid file is selected */}
      {preview && (
        <button
          id="avatar-upload-btn"
          type="button"
          disabled={uploading}
          onClick={handleUpload}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {uploading && <SpinnerIcon />}
          {uploading ? "Uploading…" : "Upload"}
        </button>
      )}

      {/* Inline error */}
      {error && (
        <p id="avatar-error-msg" className="text-destructive text-xs text-center max-w-[8rem]">
          {error}
        </p>
      )}
    </div>
  )
}

export default AvatarUpload
