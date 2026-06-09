import Image from "next/image"

const sponsors = [
  { name: "Anec Blau", src: "/patrocinadores/anecblau.webp", padding: "p-2" },
  { name: "Filsa", src: "/patrocinadores/filsa.webp", padding: "p-2" },
  { name: "Motor", src: "/patrocinadores/motor.webp", padding: "p-2" },
  { name: "Seif", src: "/patrocinadores/seif.webp", padding: "p-2" },
  { name: "Simagol9", src: "/patrocinadores/simagol9.webp", padding: "p-0.5" },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">

      {/* Sponsors */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        <p className="text-[10px] font-semibold tracking-[3px] uppercase text-gray-400 mb-5">
          Col·laboradors i Patrocinadors
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="relative h-14 w-36 overflow-hidden flex items-center justify-center"
            >
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
        <div className="max-w-7xl mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {year} Club d'Atletisme Sedentaris.Cat — Tots els drets reservats</p>
          <div className="flex items-center gap-5">
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
            <div className="flex items-center gap-3 ml-2">
              <a href="https://instagram.com/sedentaris.cat" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#29ABE2] hover:scale-110 transition-transform duration-200">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://strava.com/clubs/sedentaris" target="_blank" rel="noopener noreferrer" aria-label="Strava" className="text-[#29ABE2] hover:scale-110 transition-transform duration-200">
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
