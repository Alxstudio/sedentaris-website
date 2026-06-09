'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

// ── Types ────────────────────────────────────────────────────────────
type Categoria = 'Tots' | 'Resultats' | 'Notícies' | 'Trail' | 'Asfalt'

interface Post {
  id: number
  slug: string
  titol: string
  resum: string
  categoria: Exclude<Categoria, 'Tots'>
  data: string
  autor: string
  imatge: string
  destacat: boolean
}

// ── Mock data (substituir per Supabase) ──────────────────────────────
const posts: Post[] = [
  {
    id: 1,
    slug: 'resultats-marató-barcelona-2025',
    titol: 'Grans resultats a la Marató de Barcelona 2025',
    resum: 'El nostre equip va participar amb 12 atletes a la Marató de Barcelona aconseguint excel·lents temps personals. Una jornada per recordar per a tot el club.',
    categoria: 'Resultats',
    data: '15 Mar 2025',
    autor: 'Àlex Cortell',
    imatge: '/blog/post-1.jpg',
    destacat: true,
  },
  {
    id: 2,
    slug: 'trail-montserrat-2025',
    titol: 'Crònica del Trail de Montserrat 2025',
    resum: 'Quatre atletes del Sedentaris van completar el repte del Trail de Montserrat en una edició marcada pel fort vent i les vistes espectaculars.',
    categoria: 'Trail',
    data: '2 Mar 2025',
    autor: 'Marc Fernández',
    imatge: '/blog/post-2.jpg',
    destacat: false,
  },
  {
    id: 3,
    slug: 'nova-temporada-2025',
    titol: 'Arrenca la nova temporada 2024–25',
    resum: 'Comencem una nova temporada amb moltes novetats: nous entrenaments, nous atletes i nous reptes per a tot l\'equip. Benvinguts a tots!',
    categoria: 'Notícies',
    data: '10 Feb 2025',
    autor: 'Àlex Cortell',
    imatge: '/blog/post-3.jpg',
    destacat: false,
  },
  {
    id: 4,
    slug: 'meia-marató-gavà-2025',
    titol: 'Podi a la Meia Marató de Gavà',
    resum: 'La Laura Gómez va pujar al podi de la Meia Marató de Gavà aconseguint un tercer lloc a la categoria femenina absoluta. Enhorabona!',
    categoria: 'Resultats',
    data: '28 Gen 2025',
    autor: 'Marc Fernández',
    imatge: '/blog/post-4.jpg',
    destacat: false,
  },
  {
    id: 5,
    slug: 'entrenaments-hivern-2025',
    titol: 'Nous horaris d\'entrenament d\'hivern',
    resum: 'A partir del mes de desembre canviem els horaris dels entrenaments per adaptar-nos a les hores de llum. Consulta el nou calendari.',
    categoria: 'Notícies',
    data: '1 Des 2024',
    autor: 'Àlex Cortell',
    imatge: '/blog/post-5.jpg',
    destacat: false,
  },
  {
    id: 6,
    slug: 'trail-garraf-2024',
    titol: 'El Sedentaris brilla al Trail del Garraf',
    resum: 'Cinc atletes van completar el circuit del Garraf amb temps excel·lents. Una de les millors actuacions col·lectives del club en trail.',
    categoria: 'Trail',
    data: '20 Nov 2024',
    autor: 'Pau Martínez',
    imatge: '/blog/post-6.jpg',
    destacat: false,
  },
]

const categoriaStyle: Record<Exclude<Categoria, 'Tots'>, string> = {
  'Resultats': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Notícies':  'bg-blue-50 text-[#29ABE2] border border-blue-200',
  'Trail':     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Asfalt':    'bg-purple-50 text-purple-700 border border-purple-200',
}

// ── Featured post ─────────────────────────────────────────────────────
function FeaturedPost({ post }: { post: Post }) {
  const ref = useReveal(100)
  return (
    <div ref={ref}>
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="grid md:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-gray-200 hover:border-[#29ABE2]/40 hover:shadow-lg transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[340px] overflow-hidden bg-gray-100">
            <Image
              src={post.imatge}
              alt={post.titol}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#29ABE2]/10 to-transparent" />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-8 md:p-10 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold tracking-[2px] uppercase px-2.5 py-1 rounded bg-[#29ABE2] text-white">
                Destacat
              </span>
              <span className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded ${categoriaStyle[post.categoria]}`}>
                {post.categoria}
              </span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4 group-hover:text-[#29ABE2] transition-colors duration-200"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {post.titol}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {post.resum}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{post.autor}</span>
                <span>·</span>
                <span>{post.data}</span>
              </div>
              <span className="text-xs font-semibold text-[#29ABE2] flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                Llegir
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ── Post card ─────────────────────────────────────────────────────────
function PostCard({ post, index }: { post: Post; index: number }) {
  const ref = useReveal((index % 3) * 80)
  return (
    <div ref={ref}>
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <div className="h-full bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#29ABE2]/30 hover:shadow-lg transition-all duration-300 flex flex-col">
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
            <Image
              src={post.imatge}
              alt={post.titol}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-90"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded ${categoriaStyle[post.categoria]}`}>
                {post.categoria}
              </span>
            </div>
            <h3
              className="text-lg font-black text-gray-900 leading-tight mb-2 group-hover:text-[#29ABE2] transition-colors duration-200 flex-1"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {post.titol}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
              {post.resum}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span>{post.autor}</span>
                <span>·</span>
                <span>{post.data}</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#29ABE2" strokeWidth="2.5" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ── Page banner ───────────────────────────────────────────────────────
function PageBanner() {
  const ref = useReveal()
  return (
    <section className="pt-16 bg-[#29ABE2]">
      <div ref={ref} className="max-w-7xl mx-auto px-8 py-10">
        <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/60 mb-4 block">
          Actualitat
        </span>
        <h1
          className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-none"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          BLOG
        </h1>
      </div>
    </section>
  )
}

// ── Main ─────────────────────────────────────────────────────────────
export default function BlogPage() {
  const featuredPost = posts.find((p) => p.destacat)
  const otherPosts = posts.filter((p) => !p.destacat)

  const headerRef = useReveal(100)

  return (
    <>
      <PageBanner />

      <section className="max-w-7xl mx-auto px-8 py-16">

        {/* Section header */}
        <div ref={headerRef} className="mb-10">
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] block mb-2">
            Novetats del club
          </span>
          <h2
            className="text-4xl font-black text-gray-900"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            ÚLTIMES NOTÍCIES
          </h2>
        </div>

        {/* Featured post */}
        {featuredPost && (
          <div className="mb-10">
            <FeaturedPost post={featuredPost} />
          </div>
        )}

        {/* Posts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherPosts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>

      </section>
    </>
  )
}