'use client'

import { useRef, useEffect } from 'react'
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

// ── Featured post ─────────────────────────────────────────────────────
function FeaturedPost({ post, t, locale }: { post: Post; t: Translations; locale: string }) {
  const ref = useReveal(100)
  return (
    <div ref={ref}>
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="grid md:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-gray-200 hover:border-[#29ABE2]/40 hover:shadow-lg transition-all duration-300">
          <div className="relative aspect-video md:aspect-auto md:min-h-[340px] overflow-hidden bg-gray-100">
            {post.imatge_url && (
              <Image src={post.imatge_url} alt={post.titol} fill className="object-contain transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#29ABE2]/10 to-transparent" />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-10 bg-white">
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
function PostCard({ post, index, locale }: { post: Post; index: number; locale: string }) {
  const ref = useReveal((index % 3) * 80)
  return (
    <div ref={ref}>
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <div className="h-full bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#29ABE2]/30 hover:shadow-lg transition-all duration-300 flex flex-col">
          <div className="relative aspect-video overflow-hidden bg-gray-100">
            {post.imatge_url && (
              <Image src={post.imatge_url} alt={post.titol} fill className="object-contain transition-transform duration-500 group-hover:scale-105 group-hover:brightness-90" sizes="(max-width: 768px) 100vw, 33vw" />
            )}
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
      <div className="aspect-video bg-gray-200" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-2 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────
export default function BlogPage() {
  const { posts, loading, error } = usePosts()
  const featuredPost = posts.find((p) => p.destacat)
  const otherPosts = posts.filter((p) => !p.destacat)
  const headerRef = useReveal(100)
  const t = useT()
  const pathname = usePathname()
  const locale = pathname.startsWith('/es') ? 'es' : 'ca'

  return (
    <>
      <NavBar />

      <section className="pt-16 bg-[#29ABE2]">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/60 mb-4 block">
            {t.blog.bannerSub}
          </span>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>
            {t.blog.bannerTitle}
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-16">
        <div ref={headerRef} className="mb-10">
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] block mb-2">
            {t.blog.sectionSub}
          </span>
          <h2 className="text-4xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>
            {t.blog.sectionTitle}
          </h2>
        </div>

        {error && <p className="text-center py-20 text-sm text-red-400">{error}</p>}

        {loading && (
          <>
            <div className="mb-10 rounded-xl overflow-hidden border border-gray-100 animate-pulse grid md:grid-cols-2">
              <div className="aspect-video md:aspect-auto md:min-h-[340px] bg-gray-200" />
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

        {!loading && !error && (
          <>
            {featuredPost && (
              <div className="mb-10">
                <FeaturedPost post={featuredPost} t={t} locale={locale} />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherPosts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} locale={locale} />
              ))}
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  )
}
