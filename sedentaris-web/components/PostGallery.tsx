'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useT } from '@/lib/i18n'

/**
 * Galeria de les fotos d'una notícia.
 *
 * Les fotos importades vénen de mòbil i el 62% són verticals de cos sencer:
 * qualsevol retall a 16/9 les decapita. Per això el mosaic respecta la
 * proporció real de cada foto. Com que les imatges viuen a Supabase i no en
 * coneixem les dimensions fins que carreguen, cada cel·la reserva 4/5 —la
 * proporció dominant— i s'ajusta a la real al `load`.
 */

const PORTRAIT_RATIO = 4 / 5

// ── Una foto del mosaic ──────────────────────────────────────────────
function Tile({
  src,
  alt,
  index,
  onOpen,
}: {
  src: string
  alt: string
  index: number
  onOpen: (index: number) => void
}) {
  const [ratio, setRatio] = useState(PORTRAIT_RATIO)

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={alt}
      className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-lg bg-gray-100 sm:mb-4"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        onLoad={(e) => {
          const img = e.currentTarget
          if (img.naturalWidth && img.naturalHeight) {
            setRatio(img.naturalWidth / img.naturalHeight)
          }
        }}
      />
      {/* El vel només apareix en hover: en repòs la foto no ha de perdre llum. */}
      <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </button>
  )
}

// ── Lightbox ─────────────────────────────────────────────────────────
function Lightbox({
  images,
  alt,
  index,
  onClose,
  onNavigate,
}: {
  images: string[]
  alt: string
  index: number
  onClose: () => void
  onNavigate: (next: number) => void
}) {
  const t = useT()
  const closeRef = useRef<HTMLButtonElement>(null)
  const total = images.length

  const next = useCallback(() => onNavigate((index + 1) % total), [index, total, onNavigate])
  const prev = useCallback(() => onNavigate((index - 1 + total) % total), [index, total, onNavigate])

  useEffect(() => {
    closeRef.current?.focus()
    document.body.dataset.scrollLocked = 'true'
    return () => {
      delete document.body.dataset.scrollLocked
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, next, prev])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.blog.galleryTitle}
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
    >
      {/* Barra superior */}
      <div className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6">
        <span className="text-xs font-semibold tracking-[2px] text-white/60 tabular-nums uppercase">
          {index + 1} / {total}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.blog.galleryClose}
          className="rounded-full p-2 text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* La foto: `contain` perquè aquí sí que es veu sencera, retalli o no el mosaic. */}
      <div className="relative min-h-0 flex-1" onClick={(e) => e.stopPropagation()}>
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${alt} — ${index + 1}/${total}`}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {total > 1 && (
        <div
          className="flex shrink-0 items-center justify-center gap-3 px-4 py-5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={prev}
            aria-label={t.blog.galleryPrev}
            className="rounded-full border border-white/20 p-3 text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={t.blog.galleryNext}
            className="rounded-full border border-white/20 p-3 text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────
export default function PostGallery({ images, alt }: { images: string[]; alt: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const t = useT()

  if (images.length === 0) return null

  return (
    <section className="border-t border-gray-100 pt-8">
      <div className="mb-6 flex items-baseline gap-3">
        <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>
          {t.blog.galleryTitle}
        </h2>
        <span className="text-xs text-gray-400 tabular-nums">
          {images.length} {images.length === 1 ? t.blog.photo : t.blog.photos}
        </span>
      </div>

      <div className="columns-2 gap-3 sm:gap-4 lg:columns-3">
        {images.map((src, i) => (
          <Tile key={src} src={src} alt={`${alt} — ${i + 1}`} index={i} onOpen={setOpen} />
        ))}
      </div>

      {open !== null && (
        <Lightbox
          images={images}
          alt={alt}
          index={open}
          onClose={() => setOpen(null)}
          onNavigate={setOpen}
        />
      )}
    </section>
  )
}
