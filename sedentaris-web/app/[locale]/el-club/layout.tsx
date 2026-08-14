import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/el-club', 'es')

export default function ElClubEsLayout({ children }: { children: React.ReactNode }) {
  return children
}
