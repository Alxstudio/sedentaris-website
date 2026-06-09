import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { nom, email, assumpte, missatge } = await request.json()

  // 1. Guardar a Supabase (font de veritat)
  const { error: dbError } = await supabase
    .from('contacte')
    .insert({ nom, email, assumpte, missatge, llegit: false })

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  // 2. Enviar email al president (best-effort — si falla el missatge ja està guardat)
  try {
    await resend.emails.send({
      from: 'Sedentaris.Cat <no-reply@sedentaris.cat>',
      to: process.env.CONTACT_EMAIL!,
      subject: `[Contacte web] ${assumpte}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h2 style="margin:0 0 24px;font-size:22px;color:#111">Nou missatge de contacte</h2>

          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#444">
            <tr>
              <td style="padding:10px 12px;background:#f5f5f5;font-weight:600;width:110px;border-radius:4px 0 0 4px">Nom</td>
              <td style="padding:10px 12px;background:#fafafa">${nom}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f5f5f5;font-weight:600">Email</td>
              <td style="padding:10px 12px;background:#fafafa">${email}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f5f5f5;font-weight:600">Assumpte</td>
              <td style="padding:10px 12px;background:#fafafa">${assumpte}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f5f5f5;font-weight:600;vertical-align:top">Missatge</td>
              <td style="padding:10px 12px;background:#fafafa;white-space:pre-wrap">${missatge}</td>
            </tr>
          </table>

          <div style="margin-top:28px">
            <a
              href="mailto:${email}?subject=Re: ${encodeURIComponent(assumpte)}"
              style="display:inline-block;padding:12px 24px;background:#29ABE2;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px"
            >
              Respondre
            </a>
          </div>

          <p style="margin-top:32px;font-size:12px;color:#aaa">
            Missatge rebut a través del formulari de contacte de sedentaris.cat
          </p>
        </div>
      `,
    })
  } catch {
    // L'email ha fallat però el missatge ja és a Supabase
  }

  return NextResponse.json({ ok: true })
}
