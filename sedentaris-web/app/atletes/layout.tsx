import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/atletes', 'ca')

export default function AtletesLayout({ children }: { children: React.ReactNode }) {
  return children
}
