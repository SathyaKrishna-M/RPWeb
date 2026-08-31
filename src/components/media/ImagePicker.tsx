"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ImagePlus, Trash2, ZoomIn, Check, X, Loader2 } from "lucide-react"

/**
 * Picks, crops and resizes an image entirely in the browser.
 *
 * The result comes back as a WebP data URL, small enough to travel in a form
 * and be stored directly. Resizing here rather than on the server means a
 * multi-megabyte photo never has to be uploaded at all.
 *
 * The preview and the exported canvas run off the same transform, so the frame
 * you position is the frame that gets saved. Used for both square avatars and
 * wide banners, which is why the crop window is a width and an aspect rather
 * than a fixed square.
 */
export default function ImagePicker({
  value,
  hasExisting,
  viewportWidth,
  aspect,
  outputWidth,
  round = false,
  quality = 0.85,
  uploadLabel = "Upload picture",
  changeLabel = "Change picture",
  onChange,
  onClear,
}: {
  /** What to show as the current image, if anything. */
  value: string | null
  /** Whether there is something to remove (stored image or a linked URL). */
  hasExisting: boolean
  viewportWidth: number
  /** width / height. 1 is square; 3 is a wide banner. */
  aspect: number
  outputWidth: number
  round?: boolean
  quality?: number
  uploadLabel?: string
  changeLabel?: string
  onChange: (dataUrl: string) => void
  onClear: () => void
}) {
  const [source, setSource] = useState<HTMLImageElement | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null
  )

  const viewportHeight = Math.round(viewportWidth / aspect)

  /** Scale at which the image just covers the crop window. */
  const coverScale = useCallback(
    (img: HTMLImageElement) =>
      Math.max(viewportWidth / img.naturalWidth, viewportHeight / img.naturalHeight),
    [viewportWidth, viewportHeight]
  )

  /** Keeps the image covering the window, so no empty edge can be cropped in. */
  const clamp = useCallback(
    (img: HTMLImageElement, z: number, next: { x: number; y: number }) => {
      const scale = coverScale(img) * z
      const maxX = Math.max(0, (img.naturalWidth * scale - viewportWidth) / 2)
      const maxY = Math.max(0, (img.naturalHeight * scale - viewportHeight) / 2)
      return {
        x: Math.min(maxX, Math.max(-maxX, next.x)),
        y: Math.min(maxY, Math.max(-maxY, next.y)),
      }
    },
    [coverScale, viewportWidth, viewportHeight]
  )

  const pickFile = async (file: File) => {
    setError(null)
    if (!file.type.startsWith("image/")) {
      setError("That file is not an image.")
      return
    }
    setBusy(true)
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error("Could not read that file"))
        reader.readAsDataURL(file)
      })

      // Deliberately the load event rather than img.decode(): decode() never
      // settles when the page is not being rendered — a hidden or backgrounded
      // tab — which would leave the picker stuck with no error to show.
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image()
        el.onload = () => resolve(el)
        el.onerror = () => reject(new Error("Could not decode that image"))
        el.src = dataUrl
      })

      setSource(img)
      setZoom(1)
      setOffset({ x: 0, y: 0 })
    } catch {
      setError("Could not open that image.")
    } finally {
      setBusy(false)
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!source) return
    ;(e.target as Element).setPointerCapture(e.pointerId)
    setDragging(true)
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag || !source) return
    setOffset(
      clamp(source, zoom, {
        x: drag.originX + (e.clientX - drag.startX),
        y: drag.originY + (e.clientY - drag.startY),
      })
    )
  }

  const endDrag = () => {
    dragRef.current = null
    setDragging(false)
  }

  const changeZoom = (next: number) => {
    if (!source) return
    setZoom(next)
    setOffset((o) => clamp(source, next, o))
  }

  /** Draws the visible frame to a canvas at the stored size. */
  const apply = () => {
    if (!source) return
    const outputHeight = Math.round(outputWidth / aspect)
    const canvas = document.createElement("canvas")
    canvas.width = outputWidth
    canvas.height = outputHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setError("This browser cannot process images.")
      return
    }

    // The editor works in viewport pixels and the output is larger; scaling the
    // whole transform by that ratio makes the export match the preview.
    const ratio = outputWidth / viewportWidth
    const scale = coverScale(source) * zoom * ratio
    const w = source.naturalWidth * scale
    const h = source.naturalHeight * scale

    ctx.imageSmoothingQuality = "high"
    ctx.drawImage(
      source,
      (outputWidth - w) / 2 + offset.x * ratio,
      (outputHeight - h) / 2 + offset.y * ratio,
      w,
      h
    )

    // WebP is markedly smaller than JPEG at these sizes, and every browser that
    // can run this app produces it.
    onChange(canvas.toDataURL("image/webp", quality))
    setSource(null)
  }

  // Release the decoded image when the editor closes.
  useEffect(() => () => setSource(null), [])

  const scale = source ? coverScale(source) * zoom : 1

  return (
    <div className="space-y-3">
      {source ? (
        <div className="space-y-3 rounded-2xl border border-line bg-canvas p-3">
          <div
            className={`relative mx-auto touch-none overflow-hidden border border-line bg-black ${
              round ? "rounded-full" : "rounded-xl"
            }`}
            style={{
              width: viewportWidth,
              height: viewportHeight,
              cursor: dragging ? "grabbing" : "grab",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={source.src}
              alt=""
              draggable={false}
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
              style={{
                width: source.naturalWidth * scale,
                height: source.naturalHeight * scale,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              }}
            />
          </div>

          <p className="text-center text-xs text-muted">Drag to reposition</p>

          <label className="flex items-center gap-3">
            <ZoomIn size={15} className="shrink-0 text-muted" />
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => changeZoom(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
              aria-label="Zoom"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={apply}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white hover:bg-accent-soft"
            >
              <Check size={14} /> Use this crop
            </button>
            <button
              type="button"
              onClick={() => setSource(null)}
              className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-muted hover:text-ink"
              aria-label="Cancel crop"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-elevated px-4 py-2 text-xs font-semibold text-ink transition hover:border-accent/50 disabled:opacity-50"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
            {value ? changeLabel : uploadLabel}
          </button>

          {hasExisting && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs font-medium text-muted transition hover:text-red-400"
            >
              <Trash2 size={13} /> Remove
            </button>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          // Reset, so choosing the same file twice still fires a change.
          e.target.value = ""
          if (file) void pickFile(file)
        }}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
