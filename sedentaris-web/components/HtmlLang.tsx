'use client'

import { useEffect } from 'react'

/**
 * Sincronitza <html lang> amb l'idioma de la ruta.
 *
 * El layout arrel és compartit per /  i /es, i un layout fill no pot tocar
 * l'element <html>. Llegir headers() a l'arrel per saber el path faria que
 * tot el site es rendritzés de forma dinàmica, així que ho ajustem al client.
 */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return null
}
