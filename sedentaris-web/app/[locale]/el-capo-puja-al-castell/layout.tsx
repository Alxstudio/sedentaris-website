import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/el-capo-puja-al-castell', 'es')

export default function CapoEsLayout({ children }: { children: React.ReactNode }) {
  return children
}
