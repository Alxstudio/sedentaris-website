/**
 * Patrocinadors de les curses, recuperats de la web WordPress anterior.
 *
 * L'ordre i l'agrupació són els de l'original, excepte els patrocinadors del
 * capó, que són els de l'edició 2026 (vegeu CAPO_LATERALS). Falta Forn Pepi
 * (canicross): el seu logo es va pujar al WordPress després
 * de l'últim rastreig d'archive.org i el domini ja no serveix /wp-content,
 * així que no són recuperables. Si algun dia arriben els fitxers, es deixen
 * a public/curses/<cursa>/ i s'afegeix l'entrada aquí.
 */
export interface Sponsor {
  name: string
  logo: string
}

export interface SponsorGroup {
  /** Clau de traducció a `curses.blocs` */
  key: 'organitzacio' | 'collaboradors' | 'patrocinadors' | 'entitats'
  sponsors: Sponsor[]
}

const CAPO_DIR = '/curses/capo'
const CANI_DIR = '/curses/canicross'
const CAPO_PATROCINADORS_DIR = `${CAPO_DIR}/patrocinadors`

export interface SponsorLaterals {
  left: Sponsor[]
  right: Sponsor[]
}

/**
 * Patrocinadors de l'edició 2026 del Capó, que van als laterals de la pàgina.
 * L'ordre és el del PDF que va passar l'organització. Per afegir-ne un de nou
 * es deixa el logo a public/curses/capo/patrocinadors/ i s'afegeix a la columna.
 */
const CAPO_LATERALS: SponsorLaterals = {
  left: [
    { name: 'Can Pérez Restaurant', logo: `${CAPO_PATROCINADORS_DIR}/can-perez.jpg` },
    { name: 'Altarum', logo: `${CAPO_PATROCINADORS_DIR}/altarum.png` },
    { name: 'Carnisseries Soler', logo: `${CAPO_PATROCINADORS_DIR}/carnisseries-soler.png` },
    { name: 'Premium Energy', logo: `${CAPO_PATROCINADORS_DIR}/premium-energy.png` },
    { name: 'Connecta Baix', logo: `${CAPO_PATROCINADORS_DIR}/connecta-baix.jpg` },
    { name: 'SimaGol9', logo: `${CAPO_PATROCINADORS_DIR}/simagol9.png` },
  ],
  right: [
    { name: 'Tecnocasa', logo: `${CAPO_PATROCINADORS_DIR}/tecnocasa.jpg` },
    { name: 'Filsa', logo: `${CAPO_PATROCINADORS_DIR}/filsa.jpg` },
    { name: 'Ametller Origen', logo: `${CAPO_PATROCINADORS_DIR}/ametller-origen.png` },
    { name: 'Espai Bike Castelldefels', logo: `${CAPO_PATROCINADORS_DIR}/espai-bike.jpg` },
    { name: 'Bureau Vallée Castelldefels', logo: `${CAPO_PATROCINADORS_DIR}/bureau-vallee.jpg` },
  ],
}

function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i])
    if (i < b.length) out.push(b[i])
  }
  return out
}

export const CURSA_LATERALS: Partial<Record<'capo' | 'canicross', SponsorLaterals>> = {
  capo: CAPO_LATERALS,
}

/**
 * Ruta de Wikiloc de cada cursa, que es mostra com a mapa interactiu al
 * recorregut. Si canvia el circuit, n'hi ha prou de canviar l'URL: l'id del
 * mapa és el número del final.
 */
export const CURSA_WIKILOC: Partial<Record<'capo' | 'canicross', string>> = {
  capo: 'https://www.wikiloc.com/running-trails/cursa-el-capo-puja-al-castell-241820217',
}

export function wikilocId(url: string): string | undefined {
  return url.match(/(\d+)\/?$/)?.[1]
}

/**
 * Curses amb la propera edició ja publicada: mostren la data i amaguen
 * l'avís que la informació és de l'última edició celebrada.
 */
export const CURSA_EDICIO_PUBLICADA: Record<'capo' | 'canicross', boolean> = {
  capo: true,
  canicross: false,
}

export const CURSA_SPONSORS: Record<'capo' | 'canicross', SponsorGroup[]> = {
  capo: [
    {
      key: 'organitzacio',
      sponsors: [
        { name: 'Club d\'Atletisme Sedentaris.Cat', logo: `${CAPO_DIR}/logo-sedentaris-300x90.png` },
      ],
    },
    {
      key: 'collaboradors',
      sponsors: [
        { name: 'Ajuntament de Castelldefels', logo: `${CAPO_DIR}/ajuntament-castelldefels.jpg` },
        { name: 'Castelldefels Fem Esport', logo: `${CAPO_DIR}/castelldefels-fem-esport-272x90-1.png` },
        { name: 'Outdoor', logo: `${CAPO_DIR}/outdoor.jpg` },
      ],
    },
    {
      key: 'patrocinadors',
      // En pantalles petites no hi ha laterals: es mostren aquí, fila a fila
      // en el mateix ordre que als laterals (esquerra, dreta, esquerra…).
      sponsors: interleave(CAPO_LATERALS.left, CAPO_LATERALS.right),
    },
  ],
  canicross: [
    {
      key: 'organitzacio',
      sponsors: [
        { name: 'Club d\'Atletisme Sedentaris.Cat', logo: `${CANI_DIR}/logo-sedentaris-300x90.png` },
      ],
    },
    {
      key: 'collaboradors',
      sponsors: [
        { name: 'Ajuntament de Castelldefels', logo: `${CANI_DIR}/ajuntament-castelldefels.jpg` },
        { name: 'Castelldefels Fem Esport', logo: `${CANI_DIR}/castelldefels-fem-esport-272x90-1.png` },
      ],
    },
    {
      key: 'patrocinadors',
      sponsors: [
        { name: 'Nexo Castelldefels', logo: `${CANI_DIR}/LogoNexoCastelldefels-300x83.png` },
        { name: 'Bubimex', logo: `${CANI_DIR}/LogoBubimex.png` },
        { name: 'CaniX', logo: `${CANI_DIR}/LogoCaniX.png` },
        { name: 'Condis', logo: `${CANI_DIR}/LogoCondis.png` },
        { name: 'Opticalia', logo: `${CANI_DIR}/LogoOpticalia.png` },
        { name: 'Black Cake', logo: `${CANI_DIR}/LogoBlackCake.png` },
        { name: 'Chiwi', logo: `${CANI_DIR}/LogoChiwi.png` },
        { name: 'Ibercan', logo: `${CANI_DIR}/LogoIbercan-300x168.png` },
        { name: '3Catorce', logo: `${CANI_DIR}/Logo3Catorce.png` },
        { name: 'Vitobest', logo: `${CANI_DIR}/LogoVitobest-300x143.png` },
        { name: 'Stangest', logo: `${CANI_DIR}/LogoStangest-300x65.png` },
        { name: 'VIPs', logo: `${CANI_DIR}/LogoVIPs.png` },
        { name: 'Jardineria Herrera', logo: `${CANI_DIR}/LogoJardineriaHerrera.png` },
        { name: 'Cup Coffe', logo: `${CANI_DIR}/LogoCupCoffe-300x234.png` },
        // A l'original aquests apareixien en una fila afegida al final.
        { name: 'Farmàcia Soledad', logo: `${CANI_DIR}/farmacia-soledad.avif` },
        { name: 'Kemu Box', logo: `${CANI_DIR}/kemu-box.png` },
        { name: 'Dispool', logo: `${CANI_DIR}/dispool.jpg` },
        { name: 'ATope Sports', logo: `${CANI_DIR}/atope-sport.png` },
        { name: 'Dudog', logo: `${CANI_DIR}/dudog.jpg` },
        { name: 'Bureau', logo: `${CANI_DIR}/bureau.jpg` },
        { name: 'Fauna Viva', logo: `${CANI_DIR}/fauna-viva.jpg` },
        { name: 'ECO Car Wash', logo: `${CANI_DIR}/eco-car-wash.jpg` },
      ],
    },
    {
      key: 'entitats',
      sponsors: [
        { name: 'Proanimaplan Protectora', logo: `${CANI_DIR}/ProAnimaPlan-294x300.jpg` },
        { name: 'Fundación Trifolium', logo: `${CANI_DIR}/Trifolium-300x266.png` },
      ],
    },
  ],
}

/**
 * Imatge destacada de cada cursa. Les dues acaben al Castell de Castelldefels
 * —el Capó, de fet, hi puja—, així que comparteixen la mateixa foto i el
 * fitxer viu fora de les carpetes de cada cursa.
 */
export const CURSA_HERO: Record<'capo' | 'canicross', string> = {
  capo: '/curses/castell.png',
  canicross: '/curses/castell.png',
}
