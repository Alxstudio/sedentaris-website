import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HtmlLang from '@/components/HtmlLang'
import { LOCALES, PAGE_SEO, SITE_NAME, isLocale, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...pageMetadata('/', 'es'),
  // Cal redeclarar la plantilla: un títol en format string consumiria la de
  // l'arrel i les pàgines /es es quedarien sense la marca.
  title: {
    default: PAGE_SEO['/'].es.title,
    template: `%s | ${SITE_NAME}`,
  },
}

/** Pre-genera /es i deixa constància que 'es' és l'únic locale vàlid. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

/**
 * Sense aquesta validació, [locale] captura qualsevol primer segment i
 * /qualsevol-cosa retornava un 200 amb la home. Google podia indexar URLs
 * inventades i escollir-les com a sitelinks.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <>
      <HtmlLang lang={locale} />
      {children}
    </>
  )
}
