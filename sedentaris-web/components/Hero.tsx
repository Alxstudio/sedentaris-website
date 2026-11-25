'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useT } from '@/lib/i18n'
import { CURSA_HERO } from '@/lib/curses'

export default function Hero() {
  const titleRef = useRef<HTMLDivElement>(null)
  const t = useT()
  const pathname = usePathname()
  const prefix = pathname.startsWith('/es') ? '/es' : ''

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(40px)'
    setTimeout(() => {
      el.style.transition = 'opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, 200)
  }, [])

  return (
    <section className="relative h-svh min-h-125 flex items-start justify-center pt-20 sm:pt-24 overflow-hidden">

      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/images/sedentaris_capo.jpg')", backgroundPosition: 'center 60%' }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Title */}
      <div
        ref={titleRef}
        className="relative z-10 px-4 text-[clamp(2rem,9vw,8rem)] font-black text-white tracking-normal sm:tracking-widest text-center leading-none"
        style={{ fontFamily: "'Anton', sans-serif" }}
      >
        SEDENTARIS<span className="text-[#29ABE2]">.</span>CAT
      </div>

      {/* Estandart de la propera cursa: enllaça a la pàgina del Capó */}
      <Link
        href={`${prefix}/el-capo-puja-al-castell`}
        aria-label={t.home.ariaCapo}
        className="group absolute z-10 bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-10 sm:bottom-10 flex flex-col items-center"
      >
        {/* Barra de l'estandart */}
        <span className="block h-1.5 w-40 sm:w-48 rounded-full bg-white/90 shadow" />
        <span
          className="block w-34 sm:w-42 -mt-0.5 bg-[#0a7d3e] px-3 pt-3 pb-9 text-center text-white shadow-xl transition-transform duration-300 group-hover:translate-y-1"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)' }}
        >
          <span className="block text-[10px] font-semibold tracking-[2px] uppercase text-[#f2e14c]">
            {t.home.capoTag}
          </span>
          <Image
            src={CURSA_HERO.capo}
            alt={t.capo.bannerTitle}
            width={940}
            height={1024}
            className="mt-2 w-full h-auto"
            sizes="168px"
          />
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider group-hover:underline">
            {t.home.capoCta} <span aria-hidden>→</span>
          </span>
        </span>
      </Link>

    </section>
  )
}
