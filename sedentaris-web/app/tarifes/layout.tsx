import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/tarifes', 'ca')

export default function TarifesLayout({ children }: { children: React.ReactNode }) {
  return children
}
