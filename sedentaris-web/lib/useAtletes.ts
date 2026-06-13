'use client'

import { useEffect, useState } from 'react'
import { supabase, Atlete } from '@/lib/supabase'

export function useAtletes() {
  const [atletes, setAtletes] = useState<Atlete[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAtletes() {
      let { data, error } = await supabase
        .from('atletes')
        .select('*')
        .order('ordre', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true })

      if (error) {
        // ordre column doesn't exist yet — fall back to created_at
        const fallback = await supabase
          .from('atletes')
          .select('*')
          .order('created_at', { ascending: true })
        data = fallback.data
        error = fallback.error
      }

      if (error) {
        setError(error.message)
      } else {
        setAtletes(data ?? [])
      }
      setLoading(false)
    }

    fetchAtletes()
  }, [])

  return { atletes, loading, error }
}