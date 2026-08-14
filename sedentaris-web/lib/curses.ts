/**
 * Patrocinadors de les curses, recuperats de la web WordPress anterior.
 *
 * L'ordre i l'agrupació són els de l'original. Falten DK90 i Analoga (capó)
 * i Forn Pepi (canicross): els seus logos es van pujar al WordPress després
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
      sponsors: [
        // Reaprofitem els logos que ja té el club al footer.
        // A l'original el fitxer es deia "self.jpg", però el patrocinador és Seif.
        { name: 'Seif', logo: '/patrocinadores/seif.webp' },
        { name: 'Filsa', logo: '/patrocinadores/filsa.webp' },
        { name: 'Anec Blau', logo: '/patrocinadores/anecblau.webp' },
        { name: 'Dispool', logo: `${CAPO_DIR}/dispool.jpg` },
        { name: 'Carnisseries Soler', logo: `${CAPO_DIR}/carnisseries-soler.png` },
        { name: 'GMRI', logo: `${CAPO_DIR}/gmri.png` },
        { name: 'Premium Energy', logo: `${CAPO_DIR}/premium-energy.png` },
        { name: 'ATope Sports', logo: `${CAPO_DIR}/atope-sport.png` },
        { name: 'Bureau', logo: `${CAPO_DIR}/bureau.jpg` },
        { name: 'Eurofitness', logo: `${CAPO_DIR}/eurofitness.png` },
        { name: 'Ferreteria Mella', logo: `${CAPO_DIR}/ferreteria-mella.jpg` },
        { name: 'Soria Natural', logo: `${CAPO_DIR}/soria-natural.png` },
        { name: 'Santiveri', logo: `${CAPO_DIR}/santiveri.jpg` },
        { name: 'Ametller', logo: `${CAPO_DIR}/ametller.png` },
        { name: 'Espai Bike', logo: `${CAPO_DIR}/espaibike.jpg` },
        { name: 'Connecta Baix', logo: `${CAPO_DIR}/connecta-baix.jpg` },
        { name: 'Beet It Sport', logo: `${CAPO_DIR}/beet-it-sport.webp` },
        { name: 'Simagol9', logo: '/patrocinadores/simagol9.webp' },
      ],
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
