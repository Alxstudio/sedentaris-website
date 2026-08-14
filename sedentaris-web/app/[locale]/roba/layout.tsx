import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/roba', 'es')

export default function RobaEsLayout({ children }: { children: React.ReactNode }) {
  return children
}
