'use client'

import { useState } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import AtletaCard, { useReveal } from '@/components/AtletaCard'
import { useAtletes } from '@/lib/useAtletes'
import { useT } from '@/lib/i18n'

const DISCIPLINES: { value: string; labelKey: 'filterAsfalt' | 'filterTrail' | 'filterParaatletisme' }[] = [
  { value: 'Asfalt',        labelKey: 'filterAsfalt' },
  { value: 'Trail',         labelKey: 'filterTrail' },
  { value: 'Paraatletisme', labelKey: 'filterParaatletisme' },
]

function PageBanner() {
  const ref = useReveal()
  const t = useT()
  return (
    <section className="pt-16 bg-[#29ABE2]">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/60 mb-4 block">
          {t.atletes.bannerSub}
        </span>
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>
          {t.atletes.bannerTitle}
        </h1>
      </div>
    </section>
  )
}

export default function AtletesPreviewPage() {
  const { atletes, loading, error } = useAtletes()
  const t = useT()
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())

  function toggleFilter(d: string) {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(d)) next.delete(d)
      else next.add(d)
      return next
    })
  }

  const filtered = activeFilters.size === 0
    ? atletes
    : atletes.filter((a) => a.disciplines.some((d) => activeFilters.has(d)))

  return (
    <>
      <NavBar previewMode />
      <PageBanner />

      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] block mb-2">
              {t.atletes.seasonLabel}
            </span>
            <h2 className="text-4xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>
              {t.atletes.sectionTitle}
            </h2>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {DISCIPLINES.map((d) => {
              const active = activeFilters.has(d.value)
              return (
                <button
                  key={d.value}
                  onClick={() => toggleFilter(d.value)}
                  className={`text-xs font-semibold tracking-wide uppercase px-4 py-2 rounded-full border transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#29ABE2] border-[#29ABE2] text-white'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-[#29ABE2] hover:text-[#29ABE2]'
                  }`}
                >
                  {t.atletes[d.labelKey]}
                </button>
              )
            })}
            {activeFilters.size > 0 && (
              <button
                onClick={() => setActiveFilters(new Set())}
                className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors duration-150 px-2"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-3/4 bg-gray-200" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-center py-20 text-sm text-red-400">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-center py-20 text-sm text-gray-400">
            {t.atletes.noResults ?? 'No hi ha atletes per a aquest filtre.'}
          </p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((atlete, i) => (
              <AtletaCard
                key={atlete.id}
                index={i}
                atlete={{
                  id: atlete.id,
                  nom: atlete.nom,
                  disciplines: atlete.disciplines,
                  instagram: atlete.instagram ?? undefined,
                  foto: atlete.foto_url ?? '',
                }}
              />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  )
}
