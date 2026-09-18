'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { usePosts } from '@/lib/usePosts'
import type { Post } from '@/lib/supabase'
import { useT, type Translations } from '@/lib/i18n'
import { usePathname } from 'next/navigation'

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

// ── Helpers ──────────────────────────────────────────────────────────
const categoriaStyle: Record<string, string> = {
  'Resultats': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Notícies':  'bg-blue-50 text-[#29ABE2] border border-blue-200',
  'Trail':     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Asfalt':    'bg-purple-50 text-purple-700 border border-purple-200',
}

function getCategoriaStyle(cat: string) {
  return categoriaStyle[cat] ?? 'bg-gray-50 text-gray-600 border border-gray-200'
}

function formatData(iso: string, locale: string) {
  const lang = locale === 'es' ? 'es-ES' : 'ca-ES'
  return new Date(iso).toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Les notícies importades porten fins a una desena de fotos que només es veuen
 * un cop dins. El comptador ho anuncia des de la portada.
 */
function PhotoCount({ post, t }: { post: Post; t: Translations }) {
  const total = post.imatges?.length ?? 0
  if (total < 2) return null
  return (
    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span className="tabular-nums">{total}</span>
      <span className="sr-only">{t.blog.photos}</span>
    </span>
  )
}

// ── Featured post ─────────────────────────────────────────────────────
function FeaturedPost({ post, t, locale }: { post: Post; t: Translations; locale: string }) {
  const ref = useReveal(100)
  return (
    <div ref={ref}>
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="grid md:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-gray-200 hover:border-[#29ABE2]/40 hover:shadow-lg transition-all duration-300">
          {/* Retall a 4/3 desplaçat amunt: les fotos de mòbil verticals hi
              conserven cares i dorsals i les apaïsades hi caben senceres. */}
          <div className="relative aspect-4/3 md:aspect-auto md:min-h-85 overflow-hidden bg-gray-100">
            {post.imatge_url && (
              <Image src={post.imatge_url} alt={post.titol} fill className="object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            <PhotoCount post={post} t={t} />
          </div>
          <div className="flex flex-col justify-center p-5 sm:p-8 md:p-10 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold tracking-[2px] uppercase px-2.5 py-1 rounded bg-[#29ABE2] text-white">
                {t.blog.featured}
              </span>
              <span className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded ${getCategoriaStyle(post.categoria)}`}>
                {post.categoria}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4 group-hover:text-[#29ABE2] transition-colors duration-200" style={{ fontFamily: "'Anton', sans-serif" }}>
              {post.titol}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{post.resum}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{post.autor}</span>
                <span>·</span>
                <span>{formatData(post.created_at, locale)}</span>
              </div>
              <span className="text-xs font-semibold text-[#29ABE2] flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                {t.blog.readMore}
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
function PostCard({ post, index, locale, t }: { post: Post; index: number; locale: string; t: Translations }) {
  const ref = useReveal((index % 3) * 80)
  return (
    <div ref={ref}>
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <div className="h-full bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#29ABE2]/30 hover:shadow-lg transition-all duration-300 flex flex-col">
          <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
            {post.imatge_url && (
              <Image src={post.imatge_url} alt={post.titol} fill className="object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            )}
            <PhotoCount post={post} t={t} />
          </div>
          <div className="flex flex-col flex-1 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded ${getCategoriaStyle(post.categoria)}`}>
                {post.categoria}
              </span>
            </div>
            <h3 className="text-lg font-black text-gray-900 leading-tight mb-2 group-hover:text-[#29ABE2] transition-colors duration-200 flex-1" style={{ fontFamily: "'Anton', sans-serif" }}>
              {post.titol}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{post.resum}</p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span>{post.autor}</span>
                <span>·</span>
                <span>{formatData(post.created_at, locale)}</span>
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

// ── Skeleton ──────────────────────────────────────────────────────────
function PostSkeleton({ index }: { index: number }) {
  return (
    <div key={index} className="rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-4/3 bg-gray-200" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-2 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  )
}

// ── Filtre d'any ──────────────────────────────────────────────────────
/**
 * Els anys que cobreix l'arxiu, del més recent al més antic. No hi ha opció
 * "tots": el blog obre sempre per l'any en curs de l'arxiu. Quan entrin
 * notícies d'un any nou, cal afegir-lo aquí al davant.
 */
const YEARS = [2025, 2024, 2023] as const

/** Tallem la cadena ISO en comptes de passar per Date: així l'any no balla
 *  segons la zona horària del navegador ni difereix del que renderitza el servidor. */
function postYear(post: Post) {
  return Number(post.created_at.slice(0, 4))
}

function YearFilter({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (year: number) => void
  label: string
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {YEARS.map((year) => {
        const active = year === value
        return (
          <button
            key={year}
            type="button"
            onClick={() => onChange(year)}
            aria-pressed={active}
            className={`rounded-full px-4 py-2 text-sm font-semibold tabular-nums transition-colors duration-200 ${
              active
                ? 'bg-[#29ABE2] text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {year}
          </button>
        )
      })}
    </div>
  )
}

function localizePost(post: Post, locale: string): Post {
  if (locale !== 'es') return post
  return {
    ...post,
    titol: post.titol_es ?? post.titol,
    resum: post.resum_es ?? post.resum,
  }
}

// ── Main ─────────────────────────────────────────────────────────────
export default function BlogPage() {
  const { posts, loading, error } = usePosts()
  const pathname = usePathname()
  const locale = pathname.startsWith('/es') ? 'es' : 'ca'
  const [year, setYear] = useState<number>(YEARS[0])
  const yearPosts = posts.filter((p) => postYear(p) === year)
  const featuredPost = yearPosts.find((p) => p.destacat)
  const otherPosts = yearPosts.filter((p) => !p.destacat)
  const headerRef = useReveal(100)
  const t = useT()

  return (
    <>
      <NavBar />

      <section className="pt-16 bg-[#29ABE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/60 mb-4 block">
            {t.blog.bannerSub}
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>
            {t.blog.bannerTitle}
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div ref={headerRef} className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] block mb-2">
              {t.blog.sectionSub}
            </span>
            <h2 className="text-4xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>
              {t.blog.sectionTitle}
            </h2>
          </div>
          <YearFilter value={year} onChange={setYear} label={t.blog.filterYear} />
        </div>

        {error && <p className="text-center py-20 text-sm text-red-400">{error}</p>}

        {loading && (
          <>
            <div className="mb-10 rounded-xl overflow-hidden border border-gray-100 animate-pulse grid md:grid-cols-2">
              <div className="aspect-4/3 md:aspect-auto md:min-h-85 bg-gray-200" />
              <div className="p-10 flex flex-col gap-4">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} index={i} />)}
            </div>
          </>
        )}

        {!loading && !error && yearPosts.length === 0 && (
          <p className="text-center py-20 text-sm text-gray-400">{t.blog.noPosts}</p>
        )}

        {!loading && !error && yearPosts.length > 0 && (
          <>
            {featuredPost && (
              <div className="mb-10">
                <FeaturedPost post={localizePost(featuredPost, locale)} t={t} locale={locale} />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherPosts.map((post, i) => (
                <PostCard key={post.id} post={localizePost(post, locale)} index={i} locale={locale} t={t} />
              ))}
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  )
}
