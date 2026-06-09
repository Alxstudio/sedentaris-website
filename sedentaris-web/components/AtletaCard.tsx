'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export interface AtleteData {
  id: string | number
  nom: string
  nacionalitat?: string
  disciplines: string[]
  instagram?: string
  foto: string
}

const disciplineStyle: Record<string, string> = {
  'Trail':          'bg-blue-50 text-[#29ABE2] border border-blue-200',
  'Asfalt':         'bg-blue-50 text-[#29ABE2] border border-blue-200',
  'Trail & Asfalt': 'bg-blue-50 text-[#29ABE2] border border-blue-200',
}

export function useReveal(delay = 0) {
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
            el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)'
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

export default function AtletaCard({ atlete, index = 0 }: { atlete: AtleteData; index?: number }) {
  const ref = useReveal((index % 4) * 80)

  return (
    <div ref={ref}>
      <div className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-[#29ABE2]/30 hover:shadow-lg transition-all duration-300">

        {/* Photo */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={atlete.foto}
            alt={atlete.nom}
            fill
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-110 group-hover:brightness-90"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Discipline tags on hover */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {atlete.disciplines.map((d) => (
              <span key={d} className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-1 rounded ${disciplineStyle[d]}`}>
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-3.5 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{atlete.nom}</p>
            <div className="flex flex-wrap gap-1 mt-1.5 md:hidden">
              {atlete.disciplines.map((d) => (
                <span key={d} className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded ${disciplineStyle[d]}`}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          {atlete.instagram && (
            <a
              href={`https://instagram.com/${atlete.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram de ${atlete.nom}`}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-[#29ABE2] hover:border-[#29ABE2] transition-all duration-150"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}