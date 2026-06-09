'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

// ── Types ────────────────────────────────────────────────────────────
type Categoria = 'Resultats' | 'Notícies' | 'Trail' | 'Asfalt'

interface Post {
  id: number
  slug: string
  titol: string
  resum: string
  contingut: string
  categoria: Categoria
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
    resum: 'El nostre equip va participar amb 12 atletes a la Marató de Barcelona aconseguint excel·lents temps personals.',
    contingut: `El passat diumenge 15 de març, dotze atletes del Club d'Atletisme Sedentaris.Cat van prendre la sortida a la Marató de Barcelona 2025. Una jornada màgica que va comptar amb unes condicions meteorològiques excel·lents i un ambient inigualable als carrers de la ciutat.

**Els nostres resultats**

El millor temps del club el va aconseguir en Marc Fernández amb un temps de 3h12'45", una marca personal que supera en més de 8 minuts el seu anterior registre. Tot un èxit fruit de mesos d'entrenament constant i dedicació.

La Laura Gómez va ser la primera atleta femenina del club en creuar la línia de meta amb un temps de 3h48'22", demostrant una vegada més el gran nivell del nostre equip.

**Una jornada per recordar**

Tots dotze atletes van completar els 42,195 km, un fet que omple d'orgull a tot el club. Des de la directiva volem felicitar a tots els participants per l'esforç i la dedicació mostrada durant tota la temporada de preparació.

Ja tenim la vista posada en la propera edició. Si vols formar part del nostre equip i viure experiències com aquesta, no dubtis en contactar-nos.`,
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
    resum: 'Quatre atletes van completar el repte del Trail de Montserrat en una edició marcada pel fort vent.',
    contingut: `El Trail de Montserrat torna a demostrar per què és una de les curses de referència del calendari català. Quatre representants del Sedentaris.Cat van afrontar els seus exigents desnivells amb solvència i determinació.

**El recorregut**

Amb més de 1.200 metres de desnivell positiu i un traçat espectacular entre els emblemàtics cingles de Montserrat, la cursa va posar a prova la resistència i la tècnica dels nostres atletes en cada tram.

**Les nostres sensacions**

Malgrat el fort vent que va acompanyar tota la jornada, els quatre atletes van completar el recorregut amb excel·lents sensacions. Una experiència que repetiriem sense dubtar.`,
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
    resum: 'Comencem una nova temporada amb moltes novetats: nous entrenaments, nous atletes i nous reptes.',
    contingut: `Benvinguts a una nova temporada al Club d'Atletisme Sedentaris.Cat. Arriba amb moltes novetats i amb més ganes que mai de seguir creixent com a club i com a equip.

**Novetats de la temporada**

Incorporem cinc nous atletes al club, ampliació dels entrenaments de trail els dissabtes al matí i nou calendari de competicions amb més de 20 curses programades.

**Els nostres objectius**

Aquesta temporada volem consolidar la nostra presència en curses d'àmbit català i seguir creixent com a comunitat. T'esperem a tots els entrenaments!`,
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
    resum: 'La Laura Gómez va pujar al podi aconseguint un tercer lloc a la categoria femenina absoluta.',
    contingut: `Gran actuació del Sedentaris.Cat a la Meia Marató de Gavà. La Laura Gómez va aconseguir pujar al podi en la categoria femenina absoluta amb un tercer lloc molt meritat.

**Una carrera de menys a més**

La Laura va sortir amb prudència els primers quilòmetres i va anar agafant ritme progressivament fins a tancar amb un fort últim tram que li va permetre superar dues corredores i pujar al podi.

Enhorabona Laura, ens tens molt orgullosos!`,
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
    resum: 'A partir del mes de desembre canviem els horaris dels entrenaments per adaptar-nos a les hores de llum.',
    contingut: `Amb l'arribada del fred i la reducció de les hores de llum, adaptem els nostres horaris d'entrenament per garantir la seguretat i el benestar de tots els atletes.

**Nous horaris**

A partir del 1 de desembre els entrenaments de entre setmana passen a les 18:00h i els del dissabte es mantenen a les 9:00h del matí.

Qualsevol dubte podeu contactar-nos pel formulari o per Instagram.`,
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
    resum: 'Cinc atletes van completar el circuit del Garraf amb temps excel·lents.',
    contingut: `El Parc del Garraf va acollir una nova edició del seu popular trail i el Sedentaris.Cat hi va estar ben representat amb cinc atletes que van completar el recorregut de 22km i 900m de desnivell.

**Una de les millors actuacions col·lectives**

Mai havíem tingut tants atletes en un trail amb uns temps tan ajustats entre ells. Això demostra el gran treball d'equip que s'està fent als entrenaments de muntanya.

Ja estem preparant la propera participació. Uniu-vos!`,
    categoria: 'Trail',
    data: '20 Nov 2024',
    autor: 'Pau Martínez',
    imatge: '/blog/post-6.jpg',
    destacat: false,
  },
]

const categoriaStyle: Record<Categoria, string> = {
  'Resultats': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Notícies':  'bg-blue-50 text-[#29ABE2] border border-blue-200',
  'Trail':     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Asfalt':    'bg-purple-50 text-purple-700 border border-purple-200',
}

// ── Related card ─────────────────────────────────────────────────────
function RelatedCard({ post, index }: { post: Post; index: number }) {
  const ref = useReveal(index * 80)
  return (
    <div ref={ref}>
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#29ABE2]/30 hover:shadow-lg transition-all duration-300">
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
            <Image
              src={post.imatge}
              alt={post.titol}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-90"
              sizes="33vw"
            />
          </div>
          <div className="p-4">
            <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded ${categoriaStyle[post.categoria]}`}>
              {post.categoria}
            </span>
            <h4
              className="text-base font-black text-gray-900 mt-2 leading-tight group-hover:text-[#29ABE2] transition-colors duration-200"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {post.titol}
            </h4>
            <p className="text-xs text-gray-400 mt-1">{post.data}</p>
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
        // inline bold
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
  const post = posts.find((p) => p.slug === slug)
  const related = posts.filter((p) => p.slug !== slug).slice(0, 3)

  const heroRef = useReveal(0)
  const contentRef = useReveal(100)
  const relatedRef = useReveal(100)

  if (!post) {
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
        <Image
          src={post.imatge}
          alt={post.titol}
          fill
          className="object-cover opacity-60"
          priority
        />
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
              <span className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded ${categoriaStyle[post.categoria]}`}>
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

        {/* Author + date */}
        <div ref={contentRef}>
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-[#29ABE2]/10 flex items-center justify-center text-[#29ABE2] font-black text-sm">
              {post.autor.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.autor}</p>
              <p className="text-xs text-gray-400">{post.data}</p>
            </div>
          </div>

          {/* Body */}
          <RenderContent text={post.contingut} />

          {/* Share / back */}
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
    </>
  )
}