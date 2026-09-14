'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const INTERVAL_MS = 5000

// ── Portada del post: fos encadenat entre les imatges ────────────────
export default function HeroCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0)

  // Dependre de `current` reinicia el temporitzador quan es tria una imatge a mà
  useEffect(() => {
    if (images.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => setCurrent((c) => (c + 1) % images.length), INTERVAL_MS)
    return () => clearTimeout(id)
  }, [current, images.length])

  if (images.length === 0) return null

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={images.length > 1 ? `${alt} (${i + 1}/${images.length})` : alt}
          fill
          sizes="100vw"
          loading={i === 0 ? 'eager' : 'lazy'}
          fetchPriority={i === 0 ? 'high' : 'auto'}
          className={`object-cover transition-opacity duration-1000 ${i === current ? 'opacity-60' : 'opacity-0'}`}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute top-6 right-4 sm:right-8 z-10 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Imatge ${i + 1} de ${images.length}`}
              aria-current={i === current ? 'true' : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}
    </>
  )
}
