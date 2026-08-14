import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/tarifes', 'es')

export default function TarifesEsLayout({ children }: { children: React.ReactNode }) {
  return children
}
