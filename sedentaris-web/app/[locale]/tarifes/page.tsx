'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'

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

// ── Data ─────────────────────────────────────────────────────────────
const features = [
  'Inscripció al club',
  'Accés a entrenaments',
  'Assegurança federativa',
  'Camiseta de mànigues',
  'Camiseta de tirants',
]

const tarifes = [
  {
    id: 1,
    nom: 'Bàsica',
    preu: 20,
    descripcio: 'Tot el necessari per córrer amb nosaltres.',
    inclou: [true, true, true, false, false],
    destacada: false,
  },
  {
    id: 2,
    nom: 'Bàsica + Camiseta',
    preu: 45,
    descripcio: 'La inscripció bàsica amb la camiseta oficial de mànigues.',
    inclou: [true, true, true, true, false],
    destacada: true,
  },
  {
    id: 3,
    nom: 'Completa',
    preu: 70,
    descripcio: 'Tot inclòs: inscripció, camiseta de mànigues i camiseta de tirants.',
    inclou: [true, true, true, true, true],
    destacada: false,
  },
]

// ── Icons ────────────────────────────────────────────────────────────
function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#29ABE2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ── Row component ─────────────────────────────────────────────────────
function FeatureRow({ label, values, index }: { label: string; values: boolean[]; index: number }) {
  const ref = useReveal(index * 60)
  return (
    <div ref={ref} className={`grid grid-cols-[160px_1fr_1fr_1fr] items-center border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
      <div className="px-6 py-4 text-sm text-gray-600 font-medium col-span-1">
        {label}
      </div>
      {values.map((val, i) => (
        <div key={i} className={`flex items-center justify-center py-4 ${tarifes[i].destacada ? 'bg-[#29ABE2]/5' : ''}`}>
          {val ? <IconCheck /> : <IconX />}
        </div>
      ))}
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
          Uneix-te
        </span>
        <h1
          className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-none"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          TARIFES
        </h1>
      </div>
    </section>
  )
}

// ── Main ─────────────────────────────────────────────────────────────
export default function TarifesPage() {
  const headerRef = useReveal(100)
  const tableRef = useReveal(200)

  return (
    <>
      <PageBanner />

      <section className="max-w-5xl mx-auto px-8 py-16">

        {/* Intro */}
        <div ref={headerRef} className="text-center mb-14">
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] block mb-3">
            Temporada 2024–25
          </span>
          <h2
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            TRIA EL TEU PLA
          </h2>
          <p className="text-gray-500 text-xl mx-auto leading-relaxed whitespace-nowrap">
            Tots els plans inclouen l&apos;accés complet als entrenaments i l&apos;assegurança federativa.
          </p>
        </div>

        {/* Comparison table */}
        <div ref={tableRef} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">

          {/* Table header */}
          <div className="grid grid-cols-[160px_1fr_1fr_1fr] bg-[#29ABE2]/10">
            <div className="px-6 py-5 text-xs font-semibold tracking-widest uppercase text-[#29ABE2]">
              Inclou
            </div>
            {tarifes.map((t) => (
              <div
                key={t.id}
                className={`px-4 py-5 text-center ${t.destacada ? 'bg-[#29ABE2]' : ''}`}
              >
                <p className={`text-[11px] font-semibold tracking-[2px] uppercase mb-1 ${t.destacada ? 'text-white/70' : 'text-gray-500'}`}>
                  {t.nom}
                </p>
                <p className={`text-3xl font-black leading-none ${t.destacada ? 'text-white' : 'text-gray-900'}`}
                  style={{ fontFamily: "'Anton', sans-serif" }}>
                  {t.preu}€
                </p>
              </div>
            ))}
          </div>

          {/* Feature rows */}
          {features.map((feature, i) => (
            <FeatureRow
              key={feature}
              label={feature}
              values={tarifes.map((t) => t.inclou[i])}
              index={i}
            />
          ))}

          {/* CTA row */}
          <div className="grid grid-cols-[160px_1fr_1fr_1fr] items-center bg-white border-t border-gray-200">
            <div className="px-6 py-6 text-xs text-gray-400 font-medium">
              Fes el pas
            </div>
            {tarifes.map((t) => (
              <div key={t.id} className={`flex justify-center py-6 ${t.destacada ? 'bg-[#29ABE2]/5' : ''}`}>
                <Link
                  href={`/contacte?tarifa=${t.id}`}
                  className={`px-5 py-2.5 rounded text-xs font-bold tracking-wide uppercase transition-all duration-150 ${
                    t.destacada
                      ? 'bg-[#29ABE2] text-white hover:bg-[#1a9fd4]'
                      : 'border-2 border-gray-200 text-gray-700 hover:border-[#29ABE2] hover:text-[#29ABE2]'
                  }`}
                >
                  Uneix-te
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div ref={useReveal()} className="mt-8 text-center">
          <p className="text-lg text-gray-400 leading-relaxed whitespace-nowrap">
            En fer clic a <span className="font-semibold">Uneix-te</span> seràs redirigit al formulari de contacte per completar la teva inscripció.
            <br />Per qualsevol dubte escriu-nos a{' '}
            <a href="mailto:info@sedentaris.cat" className="text-[#29ABE2] hover:underline">
              info@sedentaris.cat
            </a>
          </p>
        </div>

      </section>
    </>
  )
}