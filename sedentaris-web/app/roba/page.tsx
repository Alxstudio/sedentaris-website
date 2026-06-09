'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

// ── Reveal hook ──────────────────────────────────────────────────────
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(32px)'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (!el) return
            el.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          }, delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return ref
}

// ── Types ────────────────────────────────────────────────────────────
interface Producte {
  id: number
  nom: string
  preu: number
  imatge: string
}

// ── Mock data (substituir per Supabase) ──────────────────────────────
const productes: Producte[] = [
  { id: 1, nom: 'Camiseta de mànigues',  preu: 25, imatge: '/roba/camiseta-manigues.jpg' },
  { id: 2, nom: 'Camiseta de tirants',   preu: 22, imatge: '/roba/camiseta-tirants.jpg' },
  { id: 3, nom: 'Pantaló curt',          preu: 28, imatge: '/roba/pantalo-curt.jpg' },
  { id: 4, nom: 'Jaqueta',               preu: 55, imatge: '/roba/jaqueta.jpg' },
  { id: 5, nom: 'Mitjons oficials',      preu: 8,  imatge: '/roba/mitjons.jpg' },
  { id: 6, nom: 'Gorra del club',        preu: 15, imatge: '/roba/gorra.jpg' },
]

// ── Product card ─────────────────────────────────────────────────────
function ProducteCard({ producte, index }: { producte: Producte; index: number }) {
  const ref = useReveal((index % 3) * 80)

  return (
    <div ref={ref}>
      <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#29ABE2]/30 hover:shadow-lg transition-all duration-300">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={producte.imatge}
            alt={producte.nom}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Info */}
        <div className="px-4 py-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">{producte.nom}</p>
          <p className="text-sm font-black text-[#29ABE2]">{producte.preu}€</p>
        </div>
      </div>
    </div>
  )
}

// ── Page banner ──────────────────────────────────────────────────────
function PageBanner() {
  const ref = useReveal()
  return (
    <section className="pt-16 bg-[#29ABE2]">
      <div ref={ref} className="max-w-7xl mx-auto px-8 py-10">
        <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/60 mb-4 block">
          Equipació oficial
        </span>
        <h1
          className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-none"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          ROBA
        </h1>
      </div>
    </section>
  )
}

// ── Main ─────────────────────────────────────────────────────────────
export default function RobaPage() {
  const headerRef = useReveal(100)

  return (
    <>
      <NavBar />
      <PageBanner />

      <section className="max-w-7xl mx-auto px-8 py-16">

        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] block mb-2">
              Temporada 2025–26
            </span>
            <h2
              className="text-4xl font-black text-gray-900"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              EQUIPACIÓ DEL CLUB
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {productes.map((producte, i) => (
            <ProducteCard key={producte.id} producte={producte} index={i} />
          ))}
        </div>

        {/* Info note */}
        <div className="mt-12 p-6 rounded-xl bg-[#29ABE2]/6 border border-[#29ABE2]/20 flex items-start gap-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#29ABE2" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-lg text-gray-600 leading-relaxed">
            Per adquirir qualsevol peça d&apos;equipació has de ser membre del club i contactar prèviament amb el president.
          </p>
        </div>

      </section>
      <Footer />
    </>
  )
}
