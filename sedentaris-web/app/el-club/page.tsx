'use client'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useT } from '@/lib/i18n'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(40px)'
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function TextBlock({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-3">
      {text.split('\n\n').map((para, i) => (
        <p key={i} className="text-gray-500 leading-relaxed text-[17px]">
          {para.split('\n').map((line, j) => (
            <React.Fragment key={j}>
              {j > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  )
}

function StoryBlock({ tag, title, text, image, reverse, objectPosition = 'center' }: {
  tag: string; title: string; text: string; image: string; reverse: boolean; objectPosition?: string
}) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-stretch`}>
      <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-auto md:min-h-[420px] overflow-hidden bg-gray-100">
        <Image src={image} alt={title} fill className="object-cover" style={{ objectPosition }} sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#29ABE2]/20 to-[#29ABE2]/5" />
      </div>
      <div className="w-full md:w-1/2 flex items-center px-6 py-8 sm:px-10 sm:py-14 md:px-16 md:py-20">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-0.5 bg-[#29ABE2]" />
            <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2]">{tag}</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-5" style={{ fontFamily: "'Anton', sans-serif" }}>
            {title}
          </h3>
          <TextBlock text={text} />
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="text-center py-10 sm:py-16 md:py-20 px-4 sm:px-6">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>{title}</h2>
      <div className="w-12 h-1 bg-[#29ABE2] rounded mx-auto mt-5" />
    </div>
  )
}

export default function ElClubPage() {
  const t = useT()
  const e = t.elClub

  const historiaBlocks = [
    { tag: e.historia1Tag, title: e.historia1Title, text: e.historia1Text, image: '/images/viladecans.jpeg',       reverse: false, objectPosition: 'center 80%' },
    { tag: e.historia2Tag, title: e.historia2Title, text: e.historia2Text, image: '/images/sdentaris_nassos.jpg',  reverse: true,  objectPosition: 'center 80%' },
  ]
  const filosofiaBlocks = [
    { tag: e.filosofia1Tag, title: e.filosofia1Title, text: e.filosofia1Text, image: '/images/sedentaris-merce.jpg', reverse: false },
    { tag: e.filosofia2Tag, title: e.filosofia2Title, text: e.filosofia2Text, image: '/images/sant_antoni.jpeg',   reverse: true  },
  ]

  return (
    <>
      <NavBar />

      <section className="pt-16 bg-[#29ABE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/60 mb-4 block">{e.bannerSub}</span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>
            {e.bannerTitle}
          </h1>
        </div>
      </section>

      <section className="pb-20">
        <SectionHeader title={e.historiaTitle} />
        <div className="flex flex-col gap-8 md:gap-16">
          {historiaBlocks.map((b) => <StoryBlock key={b.tag} {...b} />)}
        </div>
      </section>

      <section>
        <SectionHeader title={e.filosofiaTitle} />
        <div className="flex flex-col gap-8 md:gap-16">
          {filosofiaBlocks.map((b) => <StoryBlock key={b.tag} {...b} />)}
        </div>
      </section>

      <section className="bg-[#29ABE2] py-12 sm:py-16 md:py-20 px-4 sm:px-6 text-center mt-10 sm:mt-16 md:mt-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
          {e.ctaTitle}
        </h2>
        <p className="text-white/75 text-base sm:text-lg mb-8 mx-auto tracking-[0.12em]">
          {e.ctaSub}
        </p>
        <a href="/tarifes" className="inline-block px-8 py-4 bg-white text-[#1a8bbf] text-sm font-bold tracking-wide uppercase rounded hover:bg-gray-100 transition-colors duration-150">
          {e.ctaBtn}
        </a>
      </section>

      <Footer />
    </>
  )
}
