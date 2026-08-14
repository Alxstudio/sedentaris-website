import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

// La pàgina és un client component i no pot exportar metadata: la definim aquí.
export const metadata: Metadata = pageMetadata('/el-club', 'ca')

export default function ElClubLayout({ children }: { children: React.ReactNode }) {
  return children
}
