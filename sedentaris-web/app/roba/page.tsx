'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { useT } from '@/lib/i18n'

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

const producteBack: Record<number, string> = {
  0: '/ropa/CamisaDetrasHombre.jpg',
  1: '/ropa/mngashombredetras.jpg',
  2: '/ropa/camisetaMujer_detras.jpg',
  3: '/ropa/m_sinmangas_detras.jpg',
  4: '/ropa/paravientos_detras.jpg',
  5: '/ropa/pantalon_trail_detras.jpg',
  6: '/ropa/pantalon_asfalto_detras.jpg',
  8: '/ropa/sudadera_capucha_detras.jpg',
  9: '/ropa/sudadera_sin_capucha_detras.jpg',
  10: '/ropa/pant_asfalto_detras.jpg',
  12: '/ropa/top_detras.jpg',
}

export default function RobaPage() {
  const headerRef = useReveal(100)
  const t = useT()
  const tr = t.roba

  const productes = [
    { id: 0, nom: tr.product6,  preu: 25, imatge: '/ropa/CamisaH_delante.jpg' },
    { id: 2, nom: tr.product8,  preu: 25, imatge: '/ropa/camisetaM_delante.jpg' },
    { id: 1, nom: tr.product7,  preu: 22, imatge: '/ropa/mangasH_delante.jpg' },
    { id: 3, nom: tr.product9,  preu: 22, imatge: '/ropa/sinmangas_m_pordetras.jpg' },
    { id: 12, nom: tr.product18, preu: 22, imatge: '/ropa/top_delante.jpg' },
    { id: 5, nom: tr.product11, preu: 28, imatge: '/ropa/pantalon_trail_delante.jpg' },
    { id: 10, nom: tr.product16, preu: 28, imatge: '/ropa/pant_asfalto_delante.jpg' },
    { id: 6, nom: tr.product12, preu: 28, imatge: '/ropa/pantalon_asfalto_delante.jpg' },
    { id: 4, nom: tr.product10, preu: 55, imatge: '/ropa/paravientos_delante.jpg' },
    { id: 8, nom: tr.product14, preu: 45, imatge: '/ropa/sudadera_capucha_delante.jpg' },
    { id: 9, nom: tr.product15, preu: 40, imatge: '/ropa/sudadera_sin_capucha_delante.jpg' },
    { id: 11, nom: tr.product17, preu: 60, imatge: '/ropa/plumon.jpg' },
    { id: 7, nom: tr.product13, preu: 20, imatge: '/ropa/manguitos.jpg' },
    { id: 13, nom: tr.product19, preu: 10, imatge: '/ropa/buff.jpg' },
  ]

  return (
    <>
      <NavBar />

      <section className="pt-16 bg-[#29ABE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/60 mb-4 block">{tr.bannerSub}</span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>
            {tr.bannerTitle}
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">

        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] block mb-2">{tr.seasonLabel}</span>
            <h2 className="text-4xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>
              {tr.sectionTitle}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {productes.map((producte, i) => {
            const ref = useReveal((i % 3) * 80)
            return (
              <div key={producte.id} ref={ref}>
                <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#29ABE2]/30 hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image src={producte.imatge} alt={producte.nom} fill className={`object-contain transition-opacity duration-500 ${producteBack[producte.id] ? 'group-hover:opacity-0' : ''}`} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                    {producteBack[producte.id] && (
                      <Image src={producteBack[producte.id]} alt={producte.nom} fill className="object-contain transition-opacity duration-500 opacity-0 group-hover:opacity-100" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                    )}
                  </div>
                  <div className="px-4 py-4">
                    <p className="text-sm font-semibold text-gray-900">{producte.nom}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-xl bg-[#29ABE2]/6 border border-[#29ABE2]/20 flex items-start gap-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#29ABE2" strokeWidth="1.5" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{tr.noteText}</p>
        </div>

      </section>
      <Footer />
    </>
  )
}
