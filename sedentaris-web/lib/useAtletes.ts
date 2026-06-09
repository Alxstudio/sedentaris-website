'use client'

import { useEffect, useState } from 'react'
import { supabase, Atlete } from '@/lib/supabase'

export function useAtletes() {
  const [atletes, setAtletes] = useState<Atlete[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAtletes() {
      const { data, error } = await supabase
        .from('atletes')
        .select('*')
        .order('created_at', { ascending: true })

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