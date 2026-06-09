'use client'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import AtletaCard, { useReveal } from '@/components/AtletaCard'
import { useAtletes } from '@/lib/useAtletes'

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

export default function AtletesPage() {
  const { atletes, loading, error } = useAtletes()

  return (
    <>
      <NavBar />
      <PageBanner />

      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] block mb-2">
              Temporada 2025–26
            </span>
            <h2
              className="text-4xl font-black text-gray-900"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              CONEIX EL NOSTRE EQUIP
            </h2>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-center py-20 text-sm text-red-400">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {atletes.map((atlete, i) => (
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
