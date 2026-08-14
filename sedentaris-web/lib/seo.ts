import type { Metadata } from 'next'

export const SITE_URL = 'https://sedentaris.cat'
export const SITE_NAME = 'Sedentaris.Cat'

/** El català viu a l'arrel (/el-club); el castellà sota /es (/es/el-club). */
export type Lang = 'ca' | 'es'

/** Únic locale vàlid per al segment [locale]. Qualsevol altre → 404. */
export const LOCALES = ['es'] as const

export function isLocale(value: string): value is (typeof LOCALES)[number] {
  return (LOCALES as readonly string[]).includes(value)
}

/** Prefix d'URL per a un idioma. */
export function localePrefix(lang: Lang): string {
  return lang === 'es' ? '/es' : ''
}

interface PageSeo {
  title: string
  description: string
}

/**
 * Títols i descripcions per pàgina, únics i descriptius.
 *
 * Abans totes les pàgines heretaven el títol de l'arrel, cosa que deixava
 * Google sense senyals per distingir-les i l'obligava a inventar-se els
 * sitelinks. La clau és el path canònic sense prefix d'idioma.
 */
export const PAGE_SEO: Record<string, Record<Lang, PageSeo>> = {
  '/': {
    ca: {
      title: "Club d'Atletisme Sedentaris.Cat — Castelldefels",
      description:
        "Club d'atletisme federat de Castelldefels fundat el 2008. Entrenaments de trail i asfalt per a tots els nivells, 170 socis i una gran família de corredors.",
    },
    es: {
      title: 'Club de Atletismo Sedentaris.Cat — Castelldefels',
      description:
        'Club de atletismo federado de Castelldefels fundado en 2008. Entrenamientos de trail y asfalto para todos los niveles, 170 socios y una gran familia de corredores.',
    },
  },
  '/el-club': {
    ca: {
      title: 'El Club: qui som i la nostra història',
      description:
        "Coneix el Club d'Atletisme Sedentaris.Cat: més de 18 anys corrent per Castelldefels, 170 socis actius i el primer equip d'atletisme federat de la ciutat. Trail i asfalt per a tots els nivells.",
    },
    es: {
      title: 'El Club: quiénes somos y nuestra historia',
      description:
        'Conoce el Club de Atletismo Sedentaris.Cat: más de 18 años corriendo por Castelldefels, 170 socios activos y el primer equipo de atletismo federado de la ciudad. Trail y asfalto para todos los niveles.',
    },
  },
  '/tarifes': {
    ca: {
      title: 'Fes-te soci: tarifes i alta de nous socis',
      description:
        "Uneix-te al Club d'Atletisme Sedentaris.Cat de Castelldefels. Consulta les tarifes de soci de la temporada 2025-26 i dona't d'alta: entrenaments, assegurança federativa i equipació del club.",
    },
    es: {
      title: 'Hazte socio: tarifas y alta de nuevos socios',
      description:
        'Únete al Club de Atletismo Sedentaris.Cat de Castelldefels. Consulta las tarifas de socio de la temporada 2025-26 y date de alta: entrenamientos, seguro federativo y equipación del club.',
    },
  },
  '/blog': {
    ca: {
      title: 'Blog: notícies i actualitat del club',
      description:
        "Totes les notícies del Club d'Atletisme Sedentaris.Cat: cròniques de curses, resultats dels nostres atletes i novetats del club de Castelldefels.",
    },
    es: {
      title: 'Blog: noticias y actualidad del club',
      description:
        'Todas las noticias del Club de Atletismo Sedentaris.Cat: crónicas de carreras, resultados de nuestros atletas y novedades del club de Castelldefels.',
    },
  },
  '/atletes': {
    ca: {
      title: 'Els atletes: coneix el nostre equip',
      description:
        "Els atletes del Club d'Atletisme Sedentaris.Cat de Castelldefels, temporada 2025-26. Corredors d'asfalt, trail i paraatletisme.",
    },
    es: {
      title: 'Los atletas: conoce nuestro equipo',
      description:
        'Los atletas del Club de Atletismo Sedentaris.Cat de Castelldefels, temporada 2025-26. Corredores de asfalto, trail y paraatletismo.',
    },
  },
  '/roba': {
    ca: {
      title: 'Roba: equipació oficial del club',
      description:
        "Equipació oficial del Club d'Atletisme Sedentaris.Cat: samarretes, pantalons, jaquetes i complements de la temporada 2025-26 per als socis del club.",
    },
    es: {
      title: 'Ropa: equipación oficial del club',
      description:
        'Equipación oficial del Club de Atletismo Sedentaris.Cat: camisetas, pantalones, chaquetas y complementos de la temporada 2025-26 para los socios del club.',
    },
  },
  '/el-capo-puja-al-castell': {
    ca: {
      title: 'El Capó Puja al Castell: cursa de Castelldefels',
      description:
        "Una de les curses més antigues del Baix Llobregat: 6,5 km des del Canal Olímpic fins al Castell de Castelldefels, organitzada pel Club d'Atletisme Sedentaris.Cat. Recorregut, horaris, inscripcions i categories.",
    },
    es: {
      title: 'El Capó Puja al Castell: carrera de Castelldefels',
      description:
        'Una de las carreras más antiguas del Baix Llobregat: 6,5 km desde el Canal Olímpico hasta el Castillo de Castelldefels, organizada por el Club de Atletismo Sedentaris.Cat. Recorrido, horarios, inscripciones y categorías.',
    },
  },
  '/canicross': {
    ca: {
      title: 'Canicross Castelldefels: cursa solidària amb gossos',
      description:
        "Cursa popular de canicross al Castell de Castelldefels: 6,6 km amb 150 m de desnivell per córrer amb el teu gos. Organitzada pel Club d'Atletisme Sedentaris.Cat amb finalitat solidària.",
    },
    es: {
      title: 'Canicross Castelldefels: carrera solidaria con perros',
      description:
        'Carrera popular de canicross en el Castillo de Castelldefels: 6,6 km con 150 m de desnivel para correr con tu perro. Organizada por el Club de Atletismo Sedentaris.Cat con fin solidario.',
    },
  },
  '/contacte': {
    ca: {
      title: 'Contacte: parla amb el club',
      description:
        "Contacta amb el Club d'Atletisme Sedentaris.Cat de Castelldefels. Escriu-nos per resoldre dubtes o per completar la teva inscripció com a soci.",
    },
    es: {
      title: 'Contacto: habla con el club',
      description:
        'Contacta con el Club de Atletismo Sedentaris.Cat de Castelldefels. Escríbenos para resolver dudas o para completar tu inscripción como socio.',
    },
  },
}

/**
 * Metadata d'un post del blog, llegida de Supabase al servidor.
 *
 * Sense això tots els posts heretaven el títol de /blog i quedaven
 * indistingibles entre ells per a Google.
 */
export async function postMetadata(slug: string, lang: Lang): Promise<Metadata> {
  const { supabase } = await import('@/lib/supabase')
  const { data: post } = await supabase
    .from('posts')
    .select('titol, resum, titol_es, resum_es, imatge_url')
    .eq('slug', slug)
    .eq('publicat', true)
    .single()

  if (!post) return pageMetadata('/blog', lang)

  const title = (lang === 'es' ? post.titol_es : null) ?? post.titol
  const description = (lang === 'es' ? post.resum_es : null) ?? post.resum
  const canonical = `${localePrefix(lang)}/blog/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ca: `/blog/${slug}`,
        es: `/es/blog/${slug}`,
        'x-default': `/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: lang === 'es' ? 'es_ES' : 'ca_ES',
      type: 'article',
      images: post.imatge_url ? [post.imatge_url] : undefined,
    },
  }
}

/**
 * Construeix la metadata d'una pàgina amb canonical i hreflang.
 *
 * Els hreflang són el que manté indexables les versions /es ara que el
 * selector d'idioma ja no és un enllaç rastrejable.
 */
export function pageMetadata(path: string, lang: Lang): Metadata {
  const seo = PAGE_SEO[path]?.[lang]
  if (!seo) throw new Error(`Falta la definició de SEO per a "${path}"`)

  const canonical = `${localePrefix(lang)}${path}` || '/'
  const caPath = path
  const esPath = `/es${path === '/' ? '' : path}`

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        ca: caPath,
        es: esPath,
        'x-default': caPath,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: lang === 'es' ? 'es_ES' : 'ca_ES',
      type: 'website',
    },
  }
}
