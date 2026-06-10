'use client'

import { useEffect, useRef } from 'react'

export default function Hero() {
  const titleRef = useRef<HTMLDivElement>(null)

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

    </section>
  )
}
