'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useT } from '@/lib/i18n'

const sponsors = [
  { name: "Anec Blau",  src: "/patrocinadores/anecblau.webp",  padding: "p-2" },
  { name: "Filsa",      src: "/patrocinadores/filsa.webp",      padding: "p-2" },
  { name: "Motor",      src: "/patrocinadores/motor.webp",      padding: "p-2" },
  { name: "Seif",       src: "/patrocinadores/seif.webp",       padding: "p-2" },
  { name: "Simagol9",   src: "/patrocinadores/simagol9.webp",   padding: "p-0.5" },
  { name: "Anguila",    src: "/patrocinadores/anguila.webp",    padding: "p-2" },
  { name: "Estate",     src: "/patrocinadores/estate.webp",     padding: "p-2" },
  { name: "La Sansi",   src: "/patrocinadores/lasansi.png",     padding: "p-2" },
  { name: "Xip Groc",   src: "/patrocinadores/xipgroc.png",     padding: "p-2" },
  { name: "FCA",        src: "/patrocinadores/fca.png",         padding: "p-2" },
  { name: "RFEA",       src: "/patrocinadores/rfea.png",        padding: "p-0", size: "h-32 w-80", className: "-ml-17" },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const t = useT()
  const pathname = usePathname()
  const prefix = pathname.startsWith('/es') ? '/es' : ''

  // Enllaços amb anchor text descriptiu: reforcen les pàgines que volem que
  // Google esculli com a sitelinks (El Club, Fes-te soci, Blog).
  const footerLinks = [
    { href: '/el-club',  label: t.footer.navElClub },
    { href: '/tarifes',  label: t.footer.navTarifes },
    { href: '/blog',     label: t.footer.navBlog },
    { href: '/atletes',  label: t.footer.navAtletes },
    { href: '/roba',     label: t.footer.navRoba },
    { href: '/contacte', label: t.footer.navContacte },
  ]

  // Les curses que organitza el club: només al footer, per no saturar el navbar.
  const cursaLinks = [
    { href: '/el-capo-puja-al-castell', label: t.footer.navCapo },
    { href: '/canicross',               label: t.footer.navCanicross },
  ]

  return (
    <footer className="bg-white border-t border-gray-200">

      {/* Navegació */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        <p className="text-[10px] font-semibold tracking-[3px] uppercase text-gray-400 mb-5">
          {t.footer.navTitle}
        </p>
        <nav aria-label={t.footer.ariaNav}>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={`${prefix}${link.href}`}
                  className="text-sm text-gray-600 hover:text-[#29ABE2] transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Curses del club */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <p className="text-[10px] font-semibold tracking-[3px] uppercase text-gray-400 mb-5">
          {t.footer.cursesTitle}
        </p>
        <nav aria-label={t.footer.ariaCursesNav}>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {cursaLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={`${prefix}${link.href}`}
                  className="text-sm text-gray-600 hover:text-[#29ABE2] transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Sponsors */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <p className="text-[10px] font-semibold tracking-[3px] uppercase text-gray-400 mb-5">
          {t.footer.collaboradors}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {sponsors.map((sponsor) => (
            <div key={sponsor.name} className={`relative overflow-hidden flex items-center justify-center ${sponsor.size ?? "h-14 w-36"} ${sponsor.className ?? ""}`}>
              <Image
                src={sponsor.src}
                alt={sponsor.name}
                fill
                className={`object-contain ${sponsor.padding}`}
                sizes="144px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p className="w-full sm:w-auto text-center sm:text-left">
            © {year} {t.footer.clubName} — {t.footer.rights}
          </p>
          <div className="w-full sm:w-auto flex flex-wrap justify-center sm:justify-end items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" fill="none" stroke="#29ABE2" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Castelldefels, Barcelona
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" fill="none" stroke="#29ABE2" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              info@sedentaris.cat
            </div>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/sedentaris.cat/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#29ABE2] hover:scale-110 transition-transform duration-200">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://www.strava.com/clubs/1780176" target="_blank" rel="noopener noreferrer" aria-label="Strava" className="text-[#29ABE2] hover:scale-110 transition-transform duration-200">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0 3 13.828h4.17" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}
