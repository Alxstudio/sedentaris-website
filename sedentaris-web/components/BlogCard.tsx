'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePost, usePosts } from '@/lib/usePosts'
import type { Post } from '@/lib/supabase'
import { useT } from '@/lib/i18n'
import { usePathname } from 'next/navigation'

// ── Reveal hook ──────────────────────────────────────────────────────
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(28px)'
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

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString('ca-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Related card ─────────────────────────────────────────────────────
function RelatedCard({ post, index }: { post: Post; index: number }) {
  const ref = useReveal(index * 80)
  return (
    <div ref={ref}>
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#29ABE2]/30 hover:shadow-lg transition-all duration-300">
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
            {post.imatge_url && (
              <Image
                src={post.imatge_url}
                alt={post.titol}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105 group-hover:brightness-90"
                sizes="33vw"
              />
            )}
          </div>
          <div className="p-4">
            <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded ${getCategoriaStyle(post.categoria)}`}>
              {post.categoria}
            </span>
            <h4
              className="text-base font-black text-gray-900 mt-2 leading-tight group-hover:text-[#29ABE2] transition-colors duration-200"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {post.titol}
            </h4>
            <p className="text-xs text-gray-400 mt-1">{formatData(post.created_at)}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ── Render markdown-like content ─────────────────────────────────────
function RenderContent({ text }: { text: string }) {
  const paragraphs = text.split('\n\n').filter(Boolean)
  return (
    <div className="flex flex-col gap-5">
      {paragraphs.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return (
            <h3
              key={i}
              className="text-xl font-black text-gray-900 mt-2"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {p.replace(/\*\*/g, '')}
            </h3>
          )
        }
        const parts = p.split(/(\*\*[^*]+\*\*)/)
        return (
          <p key={i} className="text-gray-600 leading-relaxed text-[15px]">
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j} className="text-gray-900 font-semibold">{part.replace(/\*\*/g, '')}</strong>
                : part
            )}
          </p>
        )
      })}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────
export default function BlogPostPage({ slug }: { slug: string }) {
  const { post, loading, error } = usePost(slug)
  const { posts } = usePosts()
  const related = posts.filter((p) => p.slug !== slug).slice(0, 3)

  const heroRef = useReveal(0)
  const contentRef = useReveal(100)
  const relatedRef = useReveal(100)

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-8 h-8 border-2 border-[#29ABE2] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
          POST NO TROBAT
        </h1>
        <Link href="/blog" className="text-sm text-[#29ABE2] hover:underline">
          ← Tornar al blog
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Hero image */}
      <div className="pt-16 relative h-[50vh] min-h-[340px] overflow-hidden bg-gray-900">
        {post.imatge_url && (
          <Image
            src={post.imatge_url}
            alt={post.titol}
            fill
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back link */}
        <div className="absolute top-6 left-0 w-full">
          <div className="max-w-4xl mx-auto px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs font-semibold tracking-wide uppercase transition-colors duration-150"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Blog
            </Link>
          </div>
        </div>

        {/* Post meta over image */}
        <div ref={heroRef} className="absolute bottom-0 left-0 w-full">
          <div className="max-w-4xl mx-auto px-8 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded ${getCategoriaStyle(post.categoria)}`}>
                {post.categoria}
              </span>
              {post.destacat && (
                <span className="text-[10px] font-bold tracking-[2px] uppercase px-2.5 py-1 rounded bg-[#29ABE2] text-white">
                  Destacat
                </span>
              )}
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {post.titol}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div ref={contentRef}>
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-[#29ABE2]/10 flex items-center justify-center text-[#29ABE2] font-black text-sm">
              {post.autor.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.autor}</p>
              <p className="text-xs text-gray-400">{formatData(post.created_at)}</p>
            </div>
          </div>

          <RenderContent text={post.contingut} />

          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#29ABE2] transition-colors duration-150"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Tornar al blog
            </Link>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.titol)}&url=${encodeURIComponent(`https://sedentaris.cat/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#29ABE2] transition-colors duration-150"
            >
              Compartir
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.733-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-100 py-16 px-8">
          <div ref={relatedRef} className="max-w-7xl mx-auto">
            <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] block mb-2">
              Segueix llegint
            </span>
            <h2
              className="text-3xl font-black text-gray-900 mb-8"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              ALTRES NOTÍCIES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <RelatedCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
