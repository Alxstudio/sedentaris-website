'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useT } from '@/lib/i18n'

function LangSwitcher({ className = '' }: { className?: string }) {
  const pathname = usePathname()
  const isEs = pathname.startsWith('/es')
  const basePath = isEs ? pathname.slice(3) || '/' : pathname

  return (
    <div className={`flex items-center gap-0.5 text-xs font-semibold ${className}`}>
      <Link
        href={basePath}
        className={`px-2 py-1 rounded transition-colors duration-150 ${!isEs ? 'bg-white text-[#1a8bbf]' : 'text-white/70 hover:text-white'}`}
      >
        CA
      </Link>
      <span className="text-white/30">|</span>
      <Link
        href={`/es${basePath === '/' ? '' : basePath}`}
        className={`px-2 py-1 rounded transition-colors duration-150 ${isEs ? 'bg-white text-[#1a8bbf]' : 'text-white/70 hover:text-white'}`}
      >
        ES
      </Link>
    </div>
  )
}

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isEs = pathname.startsWith('/es')
  const prefix = isEs ? '/es' : ''
  const t = useT()

  const navLinks = [
    { href: '/el-club',  label: t.nav.elClub },
    { href: '/atletes',  label: t.nav.atletes },
    { href: '/blog',     label: t.nav.blog },
    { href: '/tarifes',  label: t.nav.tarifes },
    { href: '/roba',     label: t.nav.roba },
    { href: '/contacte', label: t.nav.contacte },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a8bbf]/90 backdrop-blur-md shadow-lg shadow-black/30">
      <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center">

        {/* Logo */}
        <Link href={prefix || '/'} className="shrink-0">
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
        <nav className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`${prefix}${link.href}`}
              className="px-4 py-2 text-base font-medium whitespace-nowrap text-white/85 hover:text-white hover:scale-110 transition-all duration-200 inline-block"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: lang switcher + hamburger */}
        <div className="ml-auto flex items-center gap-3">
          <LangSwitcher className="hidden md:flex" />
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
        <nav className="px-6 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`${prefix}${link.href}`}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded text-white font-medium hover:bg-white/20 transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
          <div className="px-4 pt-2 pb-1 border-t border-white/20 mt-1">
            <LangSwitcher />
          </div>
        </nav>
      </div>
    </header>
  )
}
