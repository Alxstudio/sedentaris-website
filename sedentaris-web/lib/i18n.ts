'use client'

import { usePathname } from 'next/navigation'
import ca from '@/messages/ca.json'
import es from '@/messages/es.json'

export type Translations = typeof ca

export function useT(): Translations {
  const pathname = usePathname()
  return pathname.startsWith('/es') ? es as unknown as Translations : ca
}
