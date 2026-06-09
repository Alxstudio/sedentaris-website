import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Club d\'Atletisme Sedentaris.Cat',
  description: 'Club d\'atletisme fundat a Castelldefels el 2008. Trail, asfalt i molta passió per córrer.',
  keywords: ['atletisme', 'club', 'castelldefels', 'trail', 'running', 'sedentaris'],
  openGraph: {
    title: 'Sedentaris.Cat',
    description: 'Club d\'Atletisme de Castelldefels',
    url: 'https://sedentaris.cat',
    siteName: 'Sedentaris.Cat',
    locale: 'ca_ES',
    type: 'website',
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