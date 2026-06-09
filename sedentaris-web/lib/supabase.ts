import { createClient } from '@supabase/supabase-js'

// ── Client ───────────────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Types ────────────────────────────────────────────────────────────
export interface Atlete {
  id: string
  nom: string
  disciplines: string[]
  instagram: string | null
  foto_url: string | null
  created_at: string
}

export interface Post {
  id: string
  slug: string
  titol: string
  resum: string
  contingut: string
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