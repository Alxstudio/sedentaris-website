import type { Metadata } from 'next'
import './globals.css'
import { PAGE_SEO, SITE_NAME, SITE_URL, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata('/', 'ca'),
  // `template` afegeix la marca als títols de les pàgines filles; `default`
  // només s'aplica a rutes que no defineixen el seu propi títol.
  title: {
    default: PAGE_SEO['/'].ca.title,
    template: `%s | ${SITE_NAME}`,
  },
  keywords: ['atletisme', 'club', 'castelldefels', 'trail', 'running', 'sedentaris'],
  /**
   * Abans hi havia app/favicon.ico, que era el de Next per defecte: Google
   * indexava el triangle de Vercel com a icona del club.
   *
   * Són dos icones amb feines diferents. L'SVG és el de la pestanya i canvia
   * de negre a blanc segons el tema del navegador. Google, en canvi, només
   * es queda una icona i la serveix igual a tothom, així que el .ico porta
   * la silueta blanca sobre el blau de la marca i es llegeix tant sobre fons
   * clar com fosc. El sizes 48x48 és el que Google prefereix.
   */
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  )
}