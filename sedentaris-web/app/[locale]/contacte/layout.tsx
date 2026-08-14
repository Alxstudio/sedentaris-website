import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/contacte', 'es')

export default function ContacteEsLayout({ children }: { children: React.ReactNode }) {
  return children
}
