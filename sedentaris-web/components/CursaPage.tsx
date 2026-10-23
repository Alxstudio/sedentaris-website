'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useT } from '@/lib/i18n'
import {
  CURSA_EDICIO_PUBLICADA,
  CURSA_HERO,
  CURSA_LATERALS,
  CURSA_SPONSORS,
  CURSA_WIKILOC,
  wikilocId,
  type Sponsor,
  type SponsorGroup,
} from '@/lib/curses'

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-3xl md:text-4xl font-black text-gray-900 mb-5"
      style={{ fontFamily: "'Anton', sans-serif" }}
    >
      {children}
    </h2>
  )
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-[#29ABE2] pl-4">
      <p className="text-[10px] font-semibold tracking-[2px] uppercase text-gray-400 mb-1">{label}</p>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  )
}

type LogoSize = NonNullable<Sponsor['size']> | 'base'

const BLOCK_LOGO_SIZE: Record<LogoSize, string> = {
  base: 'h-14 w-32',
  lg: 'h-20 w-44',
  xl: 'h-24 w-56',
}

const SIDEBAR_LOGO_SIZE: Record<LogoSize, string> = {
  base: 'h-20 w-40',
  lg: 'h-24 w-48',
  xl: 'h-28 w-56',
}

function SponsorBlock({ group, label, className = '' }: { group: SponsorGroup; label: string; className?: string }) {
  return (
    <div className={`mb-10 ${className}`}>
      <p className="text-[10px] font-semibold tracking-[3px] uppercase text-gray-400 mb-5 text-center">
        {label}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-5">
        {group.sponsors.map((s) => (
          <div key={s.name} className={`relative shrink-0 ${BLOCK_LOGO_SIZE[s.size ?? 'base']}`}>
            <Image src={s.logo} alt={s.name} fill className="object-contain" sizes="224px" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SponsorSidebar({ sponsors, label }: { sponsors: Sponsor[]; label: string }) {
  return (
    <aside aria-label={label} className="hidden xl:block">
      <div className="sticky top-24 flex flex-col items-center gap-8 py-16">
        {sponsors.map((s) => (
          <div key={s.name} className={`relative ${SIDEBAR_LOGO_SIZE[s.size ?? 'base']}`}>
            <Image src={s.logo} alt={s.name} fill className="object-contain" sizes="224px" />
          </div>
        ))}
      </div>
    </aside>
  )
}

export type CursaId = 'capo' | 'canicross'

export default function CursaPage({ cursa }: { cursa: CursaId }) {
  const t = useT()
  const pathname = usePathname()
  const prefix = pathname.startsWith('/es') ? '/es' : ''
  const c = t[cursa]
  const g = t.curses

  const introRef = useReveal(100)
  const bodyRef = useReveal(150)
  const sponsorsRef = useReveal(100)

  const hero = CURSA_HERO[cursa]
  const sponsorGroups = CURSA_SPONSORS[cursa]
  const laterals = CURSA_LATERALS[cursa]
  const edicioPublicada = CURSA_EDICIO_PUBLICADA[cursa]
  const wikilocUrl = CURSA_WIKILOC[cursa]
  const wikiloc = wikilocUrl && wikilocId(wikilocUrl)
  const blocLabels: Record<SponsorGroup['key'], string> = {
    organitzacio: g.blocOrganitzacio,
    collaboradors: g.blocCollaboradors,
    patrocinadors: g.blocPatrocinadors,
    entitats: g.blocEntitats,
  }

  const horaris = [c.horari0, c.horari1, c.horari2, c.horari3, c.horari4]
  const inclou = [c.inclou0, c.inclou1, c.inclou2, c.inclou3, c.inclou4]
  const categories =
    cursa === 'capo'
      ? [t.capo.cat0, t.capo.cat1, t.capo.cat2, t.capo.cat3, t.capo.cat4, t.capo.cat5, t.capo.cat6]
      : [t.canicross.cat0, t.canicross.cat1, t.canicross.cat2, t.canicross.cat3, t.canicross.cat4]

  return (
    <>
      {/* Banner */}
      <section className="pt-16 bg-[#29ABE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/60 mb-4 block">
            {c.bannerSub}
          </span>
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-none"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            {c.bannerTitle}
          </h1>
        </div>
      </section>

      <div
        className={
          laterals
            ? 'xl:max-w-340 xl:mx-auto xl:grid xl:grid-cols-[224px_minmax(0,1fr)_224px]'
            : undefined
        }
      >
      {laterals && <SponsorSidebar sponsors={laterals.left} label={g.blocPatrocinadors} />}
      <section className="max-w-4xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-16">

        {/* Presentació */}
        <div ref={introRef} className="mb-12">
          <SectionTitle>{g.presentacioTitle}</SectionTitle>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="space-y-4 text-gray-600 text-base sm:text-lg leading-relaxed">
              <p>{c.p1}</p>
              <p>{c.p2}</p>
              <p>{c.p3}</p>
            </div>
            <Image
              src={hero}
              alt={c.bannerTitle}
              width={337}
              height={369}
              className="w-40 sm:w-48 h-auto shrink-0 mx-auto sm:mx-0"
            />
          </div>
        </div>

        <div ref={bodyRef}>
          {/* Dades ràpides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {edicioPublicada && 'data' in c && <DataItem label={g.dataLabel} value={c.data} />}
            <DataItem label={g.distanciaLabel} value={c.distancia} />
            {'desnivell' in c && <DataItem label={g.desnivellLabel} value={c.desnivell} />}
            <DataItem label={g.sortidaLabel} value={c.sortida} />
            <DataItem label={g.arribadaLabel} value={c.arribada} />
            <DataItem label={g.organitzaLabel} value={g.organitza} />
          </div>

          {/* Avís d'edició */}
          {!edicioPublicada && (
            <p className="mb-12 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-5 py-4">
              {g.lastEditionNotice}
            </p>
          )}

          {/* Recorregut */}
          <div className="mb-12">
            <SectionTitle>{g.recorregutTitle}</SectionTitle>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>{c.recorregut1}</p>
              <p>{c.recorregut2}</p>
            </div>
            {wikiloc && (
              <div className="mt-6">
                <iframe
                  src={`https://www.wikiloc.com/wikiloc/embedv2.do?id=${wikiloc}&elevation=on&images=off&maptype=H`}
                  title={`${g.recorregutTitle} · Wikiloc`}
                  loading="lazy"
                  className="w-full h-105 sm:h-125 rounded-lg border border-gray-200"
                />
                <a
                  href={wikilocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs text-gray-400 hover:text-[#29ABE2] transition-colors"
                >
                  Wikiloc ↗
                </a>
              </div>
            )}
          </div>

          {/* Horaris */}
          <div className="mb-12">
            <SectionTitle>{g.horarisTitle}</SectionTitle>
            <ul className="space-y-2.5">
              {horaris.map((h, i) => (
                <li key={i} className="flex gap-3 text-gray-600 leading-relaxed">
                  <span className="text-[#29ABE2] font-bold shrink-0">·</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Inscripcions */}
          <div className="mb-12">
            <SectionTitle>{g.inscripcionsTitle}</SectionTitle>
            <div className="mb-5">
              <DataItem label={g.preuLabel} value={c.preu} />
            </div>
            {'places' in c && <p className="text-gray-600 mb-5">{c.places}</p>}
            {'reglamentNota' in c && <p className="text-gray-600 mb-5">{c.reglamentNota}</p>}
            <p className="text-[10px] font-semibold tracking-[2px] uppercase text-gray-400 mb-3">
              {g.inclouTitle}
            </p>
            <ul className="space-y-2.5">
              {inclou.map((item, i) => (
                <li key={i} className="flex gap-3 text-gray-600">
                  <span className="text-[#29ABE2] font-bold shrink-0">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <SectionTitle>{g.categoriesTitle}</SectionTitle>
            <p className="text-gray-600 mb-4">{c.categoriesIntro}</p>
            <ul className="space-y-2.5 mb-5">
              {categories.map((cat, i) => (
                <li key={i} className="flex gap-3 text-gray-600 leading-relaxed">
                  <span className="text-[#29ABE2] font-bold shrink-0">·</span>
                  <span>{cat}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 leading-relaxed">{c.categoriesNota}</p>
          </div>
        </div>
      </section>
      {laterals && <SponsorSidebar sponsors={laterals.right} label={g.blocPatrocinadors} />}
      </div>

      {/* Patrocinadors de la cursa */}
      <section className="border-t border-gray-200 bg-gray-50/60">
        <div ref={sponsorsRef} className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
          {sponsorGroups.map((group) => (
            <SponsorBlock
              key={group.key}
              group={group}
              label={blocLabels[group.key]}
              // Amb laterals, els patrocinadors només es repeteixen aquí quan no hi caben.
              className={laterals && group.key === 'patrocinadors' ? 'xl:hidden' : ''}
            />
          ))}
        </div>
      </section>

      {/* CTA cap a Fes-te soci */}
      <section className="bg-[#29ABE2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-14 text-center">
          <h2
            className="text-3xl md:text-4xl font-black text-white mb-3"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            {g.ctaTitle}
          </h2>
          <p className="text-white/80 mb-7">{g.ctaSub}</p>
          <Link
            href={`${prefix}/tarifes`}
            className="inline-block px-8 py-4 bg-white text-[#1a8bbf] text-sm font-bold tracking-wide uppercase rounded hover:bg-gray-100 transition-colors duration-150"
          >
            {g.ctaBtn}
          </Link>
        </div>
      </section>
    </>
  )
}
