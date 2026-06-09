'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

// ── Scroll reveal hook ──────────────────────────────────────────────
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

// ── Section data ────────────────────────────────────────────────────
const historiaBlocks = [
  {
    tag: 'Els orígens',
    title: 'Nascuts a Castelldefels',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    image: '/el-club-1.jpg',
    reverse: false,
  },
  {
    tag: 'El creixement',
    title: 'Més de 15 anys corrent',
    text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image: '/el-club-2.jpg',
    reverse: true,
  },
]

const filosofiaBlocks = [
  {
    tag: 'La nostra essència',
    title: 'Córrer és per a tothom',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula justo vitae risus fermentum, at tincidunt nisi tincidunt. Proin euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.',
    image: '/el-club-3.jpg',
    reverse: false,
  },
  {
    tag: 'Trail i Asfalt',
    title: 'Dues disciplines, un sol equip',
    text: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.',
    image: '/el-club-4.jpg',
    reverse: true,
  },
]

// ── Reusable block ───────────────────────────────────────────────────
function StoryBlock({
  tag,
  title,
  text,
  image,
  reverse,
}: {
  tag: string
  title: string
  text: string
  image: string
  reverse: boolean
}) {
  const ref = useReveal()

  return (
    <div
      ref={ref}
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-0 items-stretch`}
    >
      {/* Image */}
      <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-auto md:min-h-[420px] overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Fallback gradient when no image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#29ABE2]/20 to-[#29ABE2]/5" />
      </div>

      {/* Text */}
      <div className="w-full md:w-1/2 flex items-center px-10 py-14 md:px-16 md:py-20">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-0.5 bg-[#29ABE2]" />
            <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2]">
              {tag}
            </span>
          </div>
          <h3
            className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-5"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            {title}
          </h3>
          <p className="text-gray-500 leading-relaxed text-[17px]">{text}</p>
        </div>
      </div>
    </div>
  )
}

// ── Section header ───────────────────────────────────────────────────
function SectionHeader({ label, title }: { label: string; title: string }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="text-center py-20 px-6">
      <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] mb-3 block">
        {label}
      </span>
      <h2
        className="text-5xl md:text-6xl font-black text-gray-900"
        style={{ fontFamily: "'Anton', sans-serif" }}
      >
        {title}
      </h2>
      <div className="w-12 h-1 bg-[#29ABE2] rounded mx-auto mt-5" />
    </div>
  )
}

// ── Page hero banner ─────────────────────────────────────────────────
function PageBanner() {
  const ref = useReveal()
  return (
    <section className="pt-16 bg-[#29ABE2]">
      <div ref={ref} className="max-w-7xl mx-auto px-8 py-10">
        <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/60 mb-4 block">
          Qui som
        </span>
        <h1
          className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-none"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          EL CLUB
        </h1>
      </div>
    </section>
  )
}

// ── Main component ───────────────────────────────────────────────────
export default function ElClubPage() {
  return (
    <>
      <PageBanner />

      {/* HISTORIA */}
      <section>
        <SectionHeader label="Secció 01" title="LA HISTÒRIA" />
        <div className="divide-y divide-gray-100">
          {historiaBlocks.map((block) => (
            <StoryBlock key={block.tag} {...block} />
          ))}
        </div>
      </section>

      {/* FILOSOFIA */}
      <section className="bg-gray-50">
        <SectionHeader label="Secció 02" title="LA FILOSOFIA" />
        <div className="divide-y divide-gray-200">
          {filosofiaBlocks.map((block) => (
            <StoryBlock key={block.tag} {...block} />
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <CtaBanner />
    </>
  )
}

// ── CTA bottom ───────────────────────────────────────────────────────
function CtaBanner() {
  const ref = useReveal()
  return (
    <section className="bg-[#29ABE2] py-20 px-6 text-center">
      <div ref={ref}>
        <h2
          className="text-4xl md:text-5xl font-black text-white mb-4"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          VOLS FORMAR PART DE L'EQUIP?
        </h2>
        <p className="text-white/75 text-sm mb-8 max-w-md mx-auto">
          Uneix-te al Club d'Atletisme Sedentaris.Cat i comença a córrer amb nosaltres.
        </p>
        <a
          href="/tarifes"
          className="inline-block px-8 py-4 bg-white text-[#29ABE2] text-sm font-bold tracking-wide uppercase rounded hover:bg-gray-100 transition-colors duration-150"
        >
          Veure tarifes
        </a>
      </div>
    </section>
  )
}