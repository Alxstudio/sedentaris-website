import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/blog', 'es')

export default function BlogEsLayout({ children }: { children: React.ReactNode }) {
  return children
}
