"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ImagePlus, Trash2, ZoomIn, Check, X, Loader2 } from "lucide-react"
import { AVATAR_SIZE } from "@/lib/characters"

/** Side of the square crop window in the editor, in CSS pixels. */
const VIEWPORT = 240

type Transform = { zoom: number; x: number; y: number }

/**
 * Picks, crops and resizes an avatar entirely in the browser.
 *
 * The cropped result is handed back as a data URL, small enough to travel in
 * the form and be stored directly. Doing the resize here rather than on the
 * server means a 6 MB phone photo never has to be uploaded at all.
 *
 * The preview and the exported canvas are driven by the same transform, so what
 * you position is what gets saved.
 */
export default function AvatarPicker({
  value,
  externalUrl,
  onChange,
  onClear,
}: {
  /** Current image to show: a data URL just cropped, or an existing src. */
  value: string | null
  externalUrl: string
  onChange: (dataUrl: string) => void
  onClear: () => void
}) {
  const [source, setSource] = useState<HTMLImageElement | null>(null)
  const [transform, setTransform] = useState<Transform>({ zoom: 1, x: 0, y: 0 })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Drives the cursor, so it is state rather than the ref below: a ref read
  // during render is not safe.
  const [dragging, setDragging] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null
  )

  /** Scale that makes the image just cover the square window. */
  const coverScale = useCallback(
    (img: HTMLImageElement) => VIEWPORT / Math.min(img.naturalWidth, img.naturalHeight),
    []
  )

  /** Keeps the image covering the window, so no empty corners can be cropped. */
  const clamp = useCallback(
    (img: HTMLImageElement, next: Transform): Transform => {
      const scale = coverScale(img) * next.zoom
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      const maxX = Math.max(0, (w - VIEWPORT) / 2)
      const maxY = Math.max(0, (h - VIEWPORT) / 2)
      return {
        zoom: next.zoom,
        x: Math.min(maxX, Math.max(-maxX, next.x)),
        y: Math.min(maxY, Math.max(-maxY, next.y)),
      }
    },
    [coverScale]
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
      setTransform({ zoom: 1, x: 0, y: 0 })
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
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: transform.x,
      originY: transform.y,
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag || !source) return
    setTransform((t) =>
      clamp(source, {
        zoom: t.zoom,
        x: drag.originX + (e.clientX - drag.startX),
        y: drag.originY + (e.clientY - drag.startY),
      })
    )
  }

  const endDrag = () => {
    dragRef.current = null
    setDragging(false)
  }

  const setZoom = (zoom: number) => {
    if (!source) return
    setTransform((t) => clamp(source, { ...t, zoom }))
  }

  /** Draws the visible square to a canvas at the stored size. */
  const apply = () => {
    if (!source) return
    const canvas = document.createElement("canvas")
    canvas.width = AVATAR_SIZE
    canvas.height = AVATAR_SIZE
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setError("This browser cannot process images.")
      return
    }

    // The editor works in VIEWPORT pixels; the output is AVATAR_SIZE. Scaling
    // the whole transform by that ratio makes the export match the preview.
    const ratio = AVATAR_SIZE / VIEWPORT
    const scale = coverScale(source) * transform.zoom * ratio
    const w = source.naturalWidth * scale
    const h = source.naturalHeight * scale
    const x = (AVATAR_SIZE - w) / 2 + transform.x * ratio
    const y = (AVATAR_SIZE - h) / 2 + transform.y * ratio

    ctx.imageSmoothingQuality = "high"
    ctx.drawImage(source, x, y, w, h)

    // WebP is markedly smaller than JPEG at this size; every browser that can
    // run this app can produce it.
    onChange(canvas.toDataURL("image/webp", 0.85))
    setSource(null)
  }

  // Release the decoded image when the editor closes.
  useEffect(() => () => setSource(null), [])

  const scale = source ? coverScale(source) * transform.zoom : 1

  return (
    <div className="space-y-3">
      {source ? (
        <div className="space-y-3 rounded-2xl border border-line bg-canvas p-4">
          <div
            className="relative mx-auto touch-none overflow-hidden rounded-full border border-line bg-black"
            style={{ width: VIEWPORT, height: VIEWPORT, cursor: dragging ? "grabbing" : "grab" }}
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
                transform: `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px))`,
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
              value={transform.zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
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
            {value ? "Change picture" : "Upload picture"}
          </button>

          {(value || externalUrl) && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs font-medium text-muted transition hover:text-red-400"
            >
              <Trash2 size={13} /> Remove
            </button>
          )}

          <span className="text-[11px] text-muted">
            Cropped square and saved at {AVATAR_SIZE}px
          </span>
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
