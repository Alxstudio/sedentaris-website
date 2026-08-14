import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/contacte', 'ca')

export default function ContacteLayout({ children }: { children: React.ReactNode }) {
  return children
}
