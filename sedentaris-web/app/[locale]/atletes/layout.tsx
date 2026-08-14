import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/atletes', 'es')

export default function AtletesEsLayout({ children }: { children: React.ReactNode }) {
  return children
}
