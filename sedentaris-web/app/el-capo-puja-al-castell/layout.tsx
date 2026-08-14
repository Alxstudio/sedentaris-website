import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/el-capo-puja-al-castell', 'ca')

export default function CapoLayout({ children }: { children: React.ReactNode }) {
  return children
}
