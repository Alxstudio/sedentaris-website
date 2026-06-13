import { createClient } from '@supabase/supabase-js'

// ── Client públic (frontend) ─────────────────────────────────────────
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ── Client admin (backoffice — bypassa RLS) ──────────────────────────
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)

// ── Types ────────────────────────────────────────────────────────────
export interface Atlete {
  id: string
  nom: string
  disciplines: string[]
  instagram: string | null
  foto_url: string | null
  ordre: number | null
  created_at: string
}

export interface Post {
  id: string
  slug: string
  titol: string
  resum: string
  contingut: string
  titol_es: string | null
  resum_es: string | null
  contingut_es: string | null
  categoria: string
  autor: string
  imatge_url: string | null
  destacat: boolean
  publicat: boolean
  created_at: string
}

export interface Contacte {
  id: string
  nom: string
  email: string
  assumpte: string
  missatge: string
  llegit: boolean
  created_at: string
}

// ── Helpers Storage ──────────────────────────────────────────────────
export function getAtleteImageUrl(path: string) {
  return supabase.storage.from('atletes').getPublicUrl(path).data.publicUrl
}

export function getBlogImageUrl(path: string) {
  return supabase.storage.from('blog').getPublicUrl(path).data.publicUrl
}