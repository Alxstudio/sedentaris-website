import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { supabase } from '@/lib/supabase'

/**
 * Rutes estàtiques amb la prioritat que volem transmetre a Google.
 *
 * L'ordre i el `priority` són el senyal principal per als sitelinks: El Club,
 * Fes-te soci i Blog van per davant de la resta.
 */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/',          priority: 1.0, changeFrequency: 'monthly' },
  { path: '/el-club',   priority: 0.9, changeFrequency: 'yearly'  },
  { path: '/tarifes',   priority: 0.9, changeFrequency: 'yearly'  },
  { path: '/blog',      priority: 0.8, changeFrequency: 'weekly'  },
  { path: '/el-capo-puja-al-castell', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/canicross',               priority: 0.8, changeFrequency: 'monthly' },
  { path: '/atletes',   priority: 0.6, changeFrequency: 'monthly' },
  { path: '/roba',      priority: 0.5, changeFrequency: 'yearly'  },
  { path: '/contacte',  priority: 0.5, changeFrequency: 'yearly'  },
]

/**
 * Genera l'entrada catalana i la castellana d'una mateixa pàgina.
 *
 * Les llistem totes dues de forma explícita perquè el selector d'idioma ja no
 * és un enllaç rastrejable: el sitemap és ara la via de descobriment de /es.
 */
function entries(
  path: string,
  lastModified: Date,
  extra: Partial<MetadataRoute.Sitemap[number]> = {}
): MetadataRoute.Sitemap {
  const caUrl = `${SITE_URL}${path}`
  const esUrl = `${SITE_URL}/es${path === '/' ? '' : path}`
  const languages = { ca: caUrl, es: esUrl, 'x-default': caUrl }

  return [
    { url: caUrl, lastModified, alternates: { languages }, ...extra },
    { url: esUrl, lastModified, alternates: { languages }, ...extra },
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries = STATIC_ROUTES.flatMap(({ path, priority, changeFrequency }) =>
    entries(path, now, { priority, changeFrequency })
  )

  // Si Supabase falla no volem tombar el build: publiquem el sitemap estàtic.
  let postEntries: MetadataRoute.Sitemap = []
  try {
    const { data } = await supabase
      .from('posts')
      .select('slug, created_at')
      .eq('publicat', true)
      .order('created_at', { ascending: false })

    postEntries = (data ?? []).flatMap((post) =>
      entries(`/blog/${post.slug}`, new Date(post.created_at), {
        priority: 0.7,
        changeFrequency: 'monthly' as const,
      })
    )
  } catch {
    postEntries = []
  }

  return [...staticEntries, ...postEntries]
}
