import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/canicross', 'es')

export default function CanicrossEsLayout({ children }: { children: React.ReactNode }) {
  return children
}
