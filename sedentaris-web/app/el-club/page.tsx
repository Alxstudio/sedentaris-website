'use client'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'

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

const historiaBlocks = [
  {
    tag: 'Els orígens',
    title: 'Nascuts a Castelldefels',
    text: <>
      Som Sedentaris.cat, un grup d&apos;amics i corredors que ens apassiona entrenar i competir en curses d&apos;asfalt i muntanya.
      <br /><br />
      Els nostres inicis es remunten a l&apos;any 2008, quan només érem 4 amics que es reunien a córrer de tant en tant pels camins de Castelldefels,
      <br />
      sense més pretensions que gaudir de l&apos;esport i la bona companyia.
    </>,
    image: '/images/sedentaris_capo.jpg',
    reverse: false,
  },
  {
    tag: 'El creixement',
    title: 'Més de 18 anys corrent',
    text: <>
      Després de tants anys, vam anar sumant aficionats fins a arribar als 170 socis actius, el club va créixer de manera natural, unit per la passió pel running i l&apos;esperit de superació.
      <br /><br />
      L&apos;any 2021 vam fer un pas més i vam iniciar una nova etapa: aquest cop federats, convertint-nos en el primer i únic equip d&apos;atletisme federat a Castelldefels.
    </>,
    image: '/images/sdentaris_nassos.jpg',
    reverse: true,
  },
]

const filosofiaBlocks = [
  {
    tag: 'La nostra essència',
    title: 'Córrer és per a tothom',
    text: <>
      Al Sedentaris creiem que l&apos;atletisme no entén de nivells ni d&apos;edats.
      <br />
      Tant si ets un corredor experimentat com si estàs donant les primeres passes, aquí trobaràs el teu lloc. El nostre club és un espai obert on tothom és benvingut, perquè el més important no és el crono, sinó les ganes de córrer i gaudir.
      <br /><br />
      Els nostres valors són el respecte, l&apos;esforç i el companyonisme. No dubtis a sumar-te a aquesta gran família. T&apos;esperem!
    </>,
    image: '/images/sedentaris-merce.jpg',
    reverse: false,
  },
  {
    tag: 'Trail i Asfalt',
    title: 'Dues disciplines',
    text: <>
      Al Sedentaris competim tant en curses d&apos;asfalt com en trails de muntanya. Dos mons molt diferents, però amb la mateixa essència: superar-se, gaudir del camí i arribar a la meta amb un somriure.
      <br /><br />
      Sigui quin sigui el teu terreny preferit, al Sedentaris.cat trobaràs companys amb qui entrenar, competir i compartir cada quilòmetre.
    </>,
    image: '/images/sedentaris_capo.jpg',
    reverse: true,
  },
]

function StoryBlock({ tag, title, text, image, reverse }: {
  tag: string; title: string; text: React.ReactNode; image: string; reverse: boolean
}) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-stretch`}>
      <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-auto md:min-h-[420px] overflow-hidden bg-gray-100">
        <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#29ABE2]/20 to-[#29ABE2]/5" />
      </div>
      <div className="w-full md:w-1/2 flex items-center px-10 py-14 md:px-16 md:py-20">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-0.5 bg-[#29ABE2]" />
            <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2]">{tag}</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-5" style={{ fontFamily: "'Anton', sans-serif" }}>
            {title}
          </h3>
          <p className="text-gray-500 leading-relaxed text-[17px]">{text}</p>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="text-center py-20 px-6">
      <h2 className="text-5xl md:text-6xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>{title}</h2>
      <div className="w-12 h-1 bg-[#29ABE2] rounded mx-auto mt-5" />
    </div>
  )
}

export default function ElClubPage() {
  return (
    <>
      <NavBar />

      {/* Banner */}
      <section className="pt-16 bg-[#29ABE2]">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/60 mb-4 block">Qui som</span>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>
            EL CLUB
          </h1>
        </div>
      </section>

      {/* Història */}
      <section className="pb-20">
        <SectionHeader title="LA HISTÒRIA" />
        <div className="flex flex-col gap-16">
          {historiaBlocks.map((block) => (
            <StoryBlock key={block.tag} {...block} />
          ))}
        </div>
      </section>

      {/* Filosofia */}
      <section>
        <SectionHeader title="LA FILOSOFIA" />
        <div className="flex flex-col gap-16">
          {filosofiaBlocks.map((block) => (
            <StoryBlock key={block.tag} {...block} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#29ABE2] py-20 px-6 text-center mt-20">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
          VOLS FORMAR PART DE L'EQUIP?
        </h2>
        <p className="text-white/75 text-lg mb-8 whitespace-nowrap mx-auto tracking-[0.12em]">
          Uneix-te al Club d'Atletisme Sedentaris.Cat i comença a córrer amb nosaltres
        </p>
        <a href="/tarifes" className="inline-block px-8 py-4 bg-white text-[#1a8bbf] text-sm font-bold tracking-wide uppercase rounded hover:bg-gray-100 transition-colors duration-150">
          Veure tarifes
        </a>
      </section>

      <Footer />
    </>
  )
}
