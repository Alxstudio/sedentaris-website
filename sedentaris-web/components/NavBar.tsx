'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useT } from '@/lib/i18n'

/**
 * Selector d'idioma.
 *
 * Fem servir <button> + router.push() en comptes de <Link> a propòsit: amb
 * enllaços, Google indexava "CA" i "ES" com si fossin pàgines de contingut i
 * els mostrava com a sitelinks. Un botó no és rastrejable, així que les
 * versions /es segueixen sent indexables però només via sitemap i hreflang.
 */
function LangSwitcher({ className = '' }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useT()
  const isEs = pathname.startsWith('/es')
  const basePath = isEs ? pathname.slice(3) || '/' : pathname

  return (
    <div
      role="group"
      aria-label={t.nav.ariaLang}
      className={`flex items-center gap-0.5 text-xs font-semibold ${className}`}
    >
      <button
        type="button"
        lang="ca"
        aria-label={t.nav.ariaLangCa}
        aria-current={!isEs ? 'true' : undefined}
        onClick={() => router.push(basePath)}
        className={`px-2 py-1 rounded transition-colors duration-150 cursor-pointer ${!isEs ? 'bg-white text-[#1a8bbf]' : 'text-white/70 hover:text-white'}`}
      >
        CA
      </button>
      <span className="text-white/30" aria-hidden="true">|</span>
      <button
        type="button"
        lang="es"
        aria-label={t.nav.ariaLangEs}
        aria-current={isEs ? 'true' : undefined}
        onClick={() => router.push(`/es${basePath === '/' ? '' : basePath}`)}
        className={`px-2 py-1 rounded transition-colors duration-150 cursor-pointer ${isEs ? 'bg-white text-[#1a8bbf]' : 'text-white/70 hover:text-white'}`}
      >
        ES
      </button>
    </div>
  )
}

export default function NavBar({ previewMode = false }: { previewMode?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isEs = pathname.startsWith('/es')
  const prefix = isEs ? '/es' : ''
  const t = useT()

  // `title` dona a Google un anchor text descriptiu sense embrutar el disseny.
  const navLinks = [
    { href: '/el-club',  label: t.nav.elClub,   title: t.nav.ariaElClub,   preview: false },
    { href: '/atletes',  label: t.nav.atletes,  title: t.nav.ariaAtletes,  preview: true  },
    { href: '/blog',     label: t.nav.blog,     title: t.nav.ariaBlog,     preview: false },
    { href: '/tarifes',  label: t.nav.tarifes,  title: t.nav.ariaTarifes,  preview: false },
    { href: '/roba',     label: t.nav.roba,     title: t.nav.ariaRoba,     preview: false },
    { href: '/contacte', label: t.nav.contacte, title: t.nav.ariaContacte, preview: false },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a8bbf]/90 backdrop-blur-md shadow-lg shadow-black/30">
      <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center">

        {/* Logo */}
        <Link href={previewMode ? '/preview/atletes' : (prefix || '/')} className="shrink-0">
          <Image
            src="/images/logo-blanco.png"
            alt="Sedentaris.Cat"
            width={220}
            height={60}
            className="h-10 sm:h-14 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label={t.nav.ariaMenu} className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const blocked = previewMode && !link.preview
            return blocked ? (
              <span
                key={link.href}
                className="px-4 py-2 text-base font-medium whitespace-nowrap text-white/30 cursor-not-allowed flex items-center gap-1.5 select-none"
                title="Secció no disponible en previsualització"
              >
                {link.label}
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="opacity-60">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
            ) : (
              <Link
                key={link.href}
                href={previewMode ? '/preview/atletes' : `${prefix}${link.href}`}
                title={link.title}
                className="px-4 py-2 text-base font-medium whitespace-nowrap text-white/85 hover:text-white hover:scale-110 transition-all duration-200 inline-block"
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: lang switcher + hamburger */}
        <div className="ml-auto flex items-center gap-3">
          {!previewMode && <LangSwitcher className="hidden md:flex" />}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 text-white"
            aria-label="Obrir menú"
          >
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden bg-[#1a8bbf]/90 border-t border-white/20 transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <nav aria-label={t.nav.ariaMenu} className="px-6 py-3 flex flex-col gap-1">
          {navLinks.map((link) => {
            const blocked = previewMode && !link.preview
            return blocked ? (
              <span
                key={link.href}
                className="px-4 py-3 rounded text-white/30 font-medium flex items-center justify-between cursor-not-allowed select-none"
              >
                {link.label}
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="opacity-60">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
            ) : (
              <Link
                key={link.href}
                href={previewMode ? '/preview/atletes' : `${prefix}${link.href}`}
                title={link.title}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded text-white font-medium hover:bg-white/20 transition-all duration-150"
              >
                {link.label}
              </Link>
            )
          })}
          {!previewMode && (
            <div className="px-4 pt-2 pb-1 border-t border-white/20 mt-1">
              <LangSwitcher />
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
