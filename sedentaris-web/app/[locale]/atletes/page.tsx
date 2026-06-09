'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

// ── Types ────────────────────────────────────────────────────────────
type Disciplina = 'Trail' | 'Asfalt' | 'Trail & Asfalt'

interface Atlete {
  id: number
  nom: string
  nacionalitat: string
  disciplines: Disciplina[]
  instagram?: string
  foto: string
}

const atletes: Atlete[] = [
  { id: 1, nom: 'Àlex Cortell', nacionalitat: '🇪🇸', disciplines: ['Asfalt'], instagram: 'el_teu_instagram', foto: '/images/alexcortell.png.jpg' },
]

// ── Discipline tag colors ────────────────────────────────────────────
const disciplineStyle: Record<Disciplina, string> = {
  'Trail':         'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Asfalt':        'bg-blue-50 text-[#29ABE2] border border-blue-200',
  'Trail & Asfalt':'bg-purple-50 text-purple-700 border border-purple-200',
}

// ── Scroll reveal hook ───────────────────────────────────────────────
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
            el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)'
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

// ── Atlete Card ──────────────────────────────────────────────────────
function AtleteCard({ atlete, index }: { atlete: Atlete; index: number }) {
  const ref = useReveal((index % 4) * 80)

  return (
    <div ref={ref}>
      <div className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-[#29ABE2]/30 hover:shadow-lg transition-all duration-300">

        {/* Photo */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={atlete.foto}
            alt={atlete.nom}
            fill
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-110 group-hover:brightness-90"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Nationality badge */}
          <div className="absolute top-3 right-3 text-xl leading-none">
            {atlete.nacionalitat}
          </div>

          {/* Discipline tags — visible always on mobile, on hover desktop */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {atlete.disciplines.map((d) => (
              <span
                key={d}
                className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-1 rounded ${disciplineStyle[d]}`}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-3.5 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{atlete.nom}</p>
            <div className="flex flex-wrap gap-1 mt-1.5 md:hidden">
              {atlete.disciplines.map((d) => (
                <span
                  key={d}
                  className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded ${disciplineStyle[d]}`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {atlete.instagram && (
            <a
              href={`https://instagram.com/${atlete.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram de ${atlete.nom}`}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-[#29ABE2] hover:border-[#29ABE2] transition-all duration-150"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          )}
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
          L'equip
        </span>
        <h1
          className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-none"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          ELS ATLETES
        </h1>
      </div>
    </section>
  )
}

// ── Main ─────────────────────────────────────────────────────────────
export default function AtletesPage() {
  return (
    <>
      <PageBanner />

      <section className="max-w-7xl mx-auto px-8 py-16">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] block mb-2">
              Temporada 2024–25
            </span>
            <h2
              className="text-4xl font-black text-gray-900"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              CONEIX EL NOSTRE EQUIP
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {atletes.map((atlete, i) => (
            <AtleteCard key={atlete.id} atlete={atlete} index={i} />
          ))}
        </div>
      </section>
    </>
  )
}