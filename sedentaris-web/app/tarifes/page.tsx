'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
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

export default function TarifesPage() {
  const headerRef = useReveal(100)
  const tableRef = useReveal(200)
  const t = useT()
  const tr = t.tarifes

  const features = [tr.feature0, tr.feature1, tr.feature2, tr.feature3, tr.feature4]

  const tarifes = [
    { id: 1, nom: tr.plan0Nom, preu: 20, inclou: [true, true, true, false, false], destacada: false },
    { id: 2, nom: tr.plan1Nom, preu: 45, inclou: [true, true, true, true,  false], destacada: true  },
    { id: 3, nom: tr.plan2Nom, preu: 70, inclou: [true, true, true, true,  true ], destacada: false },
  ]

  return (
    <>
      <NavBar />

      {/* Banner */}
      <section className="pt-16 bg-[#29ABE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/60 mb-4 block">{tr.bannerSub}</span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>
            {tr.bannerTitle}
          </h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16">

        <div ref={headerRef} className="text-center mb-10 sm:mb-14">
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] block mb-3">
            {tr.seasonLabel}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
            {tr.sectionTitle}
          </h2>
          <p className="text-gray-500 text-base sm:text-xl mx-auto leading-relaxed">
            {tr.sectionSub}
          </p>
        </div>

        {/* ── Mobile: cards apilades ── */}
        <div ref={tableRef} className="md:hidden flex flex-col gap-4">
          {tarifes.map((tar) => (
            <div
              key={tar.id}
              className={`rounded-xl border overflow-hidden ${tar.destacada ? 'border-[#29ABE2] shadow-md' : 'border-gray-200 shadow-sm'}`}
            >
              {/* Cap */}
              <div className={`px-5 py-4 ${tar.destacada ? 'bg-[#29ABE2]' : 'bg-gray-50'}`}>
                <p className={`text-[11px] font-semibold tracking-[2px] uppercase mb-1 ${tar.destacada ? 'text-white/70' : 'text-gray-500'}`}>
                  {tar.nom}
                </p>
                <p className={`text-3xl font-black leading-none ${tar.destacada ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Anton', sans-serif" }}>
                  {tar.preu}€
                </p>
              </div>
              {/* Features */}
              <div className="px-5 py-4 bg-white flex flex-col gap-3">
                {features.map((feature, i) => (
                  <div key={feature} className="flex items-center gap-3">
                    {tar.inclou[i] ? <IconCheck /> : <IconX />}
                    <span className={`text-sm ${tar.inclou[i] ? 'text-gray-700' : 'text-gray-400'}`}>{feature}</span>
                  </div>
                ))}
              </div>
              {/* CTA */}
              <div className={`px-5 py-4 border-t border-gray-100 ${tar.destacada ? 'bg-[#29ABE2]/5' : 'bg-white'}`}>
                <Link
                  href={`/contacte?tarifa=${tar.id}`}
                  className={`w-full flex justify-center px-5 py-2.5 rounded text-xs font-bold tracking-wide uppercase transition-all duration-150 ${
                    tar.destacada
                      ? 'bg-[#29ABE2] text-white hover:bg-[#1a9fd4]'
                      : 'border-2 border-gray-200 text-gray-700 hover:border-[#29ABE2] hover:text-[#29ABE2]'
                  }`}
                >
                  {tr.ctaBtn}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ── Desktop: taula grid ── */}
        <div className="hidden md:block rounded-xl overflow-hidden border border-gray-200 shadow-sm">

          {/* Header */}
          <div className="grid grid-cols-[160px_1fr_1fr_1fr] bg-[#29ABE2]/10">
            <div className="px-6 py-5 text-xs font-semibold tracking-widest uppercase text-[#29ABE2]">
              {tr.tableHeader}
            </div>
            {tarifes.map((tar) => (
              <div key={tar.id} className={`px-4 py-5 text-center ${tar.destacada ? 'bg-[#29ABE2]' : ''}`}>
                <p className={`text-[11px] font-semibold tracking-[2px] uppercase mb-1 ${tar.destacada ? 'text-white/70' : 'text-gray-500'}`}>
                  {tar.nom}
                </p>
                <p className={`text-3xl font-black leading-none ${tar.destacada ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Anton', sans-serif" }}>
                  {tar.preu}€
                </p>
              </div>
            ))}
          </div>

          {/* Feature rows */}
          {features.map((feature, i) => (
            <div key={feature} ref={useReveal(i * 60)} className={`grid grid-cols-[160px_1fr_1fr_1fr] items-center border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <div className="px-6 py-4 text-sm text-gray-600 font-medium">{feature}</div>
              {tarifes.map((tar, j) => (
                <div key={j} className={`flex items-center justify-center py-4 ${tar.destacada ? 'bg-[#29ABE2]/5' : ''}`}>
                  {tar.inclou[i] ? <IconCheck /> : <IconX />}
                </div>
              ))}
            </div>
          ))}

          {/* CTA row */}
          <div className="grid grid-cols-[160px_1fr_1fr_1fr] items-center bg-white border-t border-gray-200">
            <div className="px-6 py-6 text-xs text-gray-400 font-medium">{tr.ctaLabel}</div>
            {tarifes.map((tar) => (
              <div key={tar.id} className={`flex justify-center py-6 ${tar.destacada ? 'bg-[#29ABE2]/5' : ''}`}>
                <Link
                  href={`/contacte?tarifa=${tar.id}`}
                  className={`px-5 py-2.5 rounded text-xs font-bold tracking-wide uppercase transition-all duration-150 ${
                    tar.destacada ? 'bg-[#29ABE2] text-white hover:bg-[#1a9fd4]' : 'border-2 border-gray-200 text-gray-700 hover:border-[#29ABE2] hover:text-[#29ABE2]'
                  }`}
                >
                  {tr.ctaBtn}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Nota */}
        <div className="mt-8 text-center">
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            {tr.noteIntro} <span className="font-semibold">{tr.noteBtn}</span> {tr.noteMid}
            <br />{tr.noteContact}{' '}
            <a href="mailto:info@sedentaris.cat" className="text-[#29ABE2] hover:underline">
              info@sedentaris.cat
            </a>
          </p>
        </div>

      </section>
      <Footer />
    </>
  )
}
