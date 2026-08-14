import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/roba', 'ca')

export default function RobaLayout({ children }: { children: React.ReactNode }) {
  return children
}
