import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/canicross', 'ca')

export default function CanicrossLayout({ children }: { children: React.ReactNode }) {
  return children
}
