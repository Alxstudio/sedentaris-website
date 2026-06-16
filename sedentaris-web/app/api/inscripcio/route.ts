import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

const PLANS: Record<string, { nom: string; preu: string; color: string }> = {
  '1': { nom: 'Bàsica',              preu: '20€/mes', color: '#6b7280' },
  '2': { nom: 'Bàsica + Camiseta',   preu: '45€/mes', color: '#29ABE2' },
  '3': { nom: 'Completa',            preu: '70€/mes', color: '#0e7490' },
}

export async function POST(request: Request) {
  const { nom, email, missatge, tarifa } = await request.json()

  const pla = PLANS[tarifa] ?? { nom: `Pla ${tarifa}`, preu: '—', color: '#29ABE2' }
  const assumpte = `Inscripció - Pla ${pla.nom}`

  // 1. Guardar a Supabase
  const { error: dbError } = await supabase
    .from('contacte')
    .insert({ nom, email, assumpte, missatge: missatge || '(sense missatge addicional)', llegit: false })

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  // 2. Enviar email al president
  try {
    await resend.emails.send({
      from: 'Sedentaris.Cat <no-reply@sedentaris.cat>',
      to: process.env.CONTACT_EMAIL!,
      subject: `🏃 Nova inscripció — Pla ${pla.nom}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#ffffff">

          <!-- Header -->
          <div style="background:${pla.color};border-radius:10px;padding:28px 32px;margin-bottom:28px">
            <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.7)">
              Nova sol·licitud d'inscripció
            </p>
            <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;line-height:1">
              Pla ${pla.nom}
            </h1>
            <p style="margin:8px 0 0;font-size:20px;font-weight:700;color:rgba(255,255,255,0.9)">
              ${pla.preu}
            </p>
          </div>

          <!-- Dades del sol·licitant -->
          <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#374151">
            Dades de contacte
          </h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#444;margin-bottom:28px">
            <tr>
              <td style="padding:10px 14px;background:#f3f4f6;font-weight:600;width:100px;border-radius:6px 0 0 0">Nom</td>
              <td style="padding:10px 14px;background:#f9fafb;border-radius:0 6px 0 0">${nom}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;background:#f3f4f6;font-weight:600">Email</td>
              <td style="padding:10px 14px;background:#f9fafb">
                <a href="mailto:${email}" style="color:${pla.color};text-decoration:none">${email}</a>
              </td>
            </tr>
            ${missatge ? `
            <tr>
              <td style="padding:10px 14px;background:#f3f4f6;font-weight:600;vertical-align:top;border-radius:0 0 0 6px">Missatge</td>
              <td style="padding:10px 14px;background:#f9fafb;white-space:pre-wrap;border-radius:0 0 6px 0">${missatge}</td>
            </tr>
            ` : ''}
          </table>

          <!-- CTA -->
          <a
            href="mailto:${email}?subject=Re: Inscripció al Club Sedentaris.Cat - Pla ${encodeURIComponent(pla.nom)}"
            style="display:inline-block;padding:14px 28px;background:${pla.color};color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;letter-spacing:0.5px"
          >
            Respondre a ${nom}
          </a>

          <!-- Footer -->
          <p style="margin-top:36px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af">
            Sol·licitud rebuda a través del formulari d'inscripció de
            <a href="https://sedentaris.cat/tarifes" style="color:${pla.color};text-decoration:none">sedentaris.cat/tarifes</a>
          </p>
        </div>
      `,
    })
  } catch {
    // Email ha fallat però el registre ja és a Supabase
  }

  return NextResponse.json({ ok: true })
}
