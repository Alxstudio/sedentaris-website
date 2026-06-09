'use client'

import { useRef, useEffect, useState } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

// ── Reveal hook ──────────────────────────────────────────────────────
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(32px)'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (!el) return
            el.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          }, delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return ref
}

// ── Form state ───────────────────────────────────────────────────────
type FormStatus = 'idle' | 'sending' | 'success' | 'error'

// ── Input component ──────────────────────────────────────────────────
function Input({
  label,
  name,
  type = 'text',
  required = false,
  value,
  onChange,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
        {label} {required && <span className="text-[#29ABE2]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15 transition-all duration-150"
      />
    </div>
  )
}

// ── Page banner ──────────────────────────────────────────────────────
function PageBanner() {
  const ref = useReveal()
  return (
    <section className="pt-16 bg-[#29ABE2]">
      <div ref={ref} className="max-w-7xl mx-auto px-8 py-10">
        <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/60 mb-4 block">
          Parla amb nosaltres
        </span>
        <h1
          className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-none"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          CONTACTE
        </h1>
      </div>
    </section>
  )
}

// ── Main ─────────────────────────────────────────────────────────────
export default function ContactePage() {
  const formRef = useReveal(100)
  const infoRef = useReveal(200)

  const [form, setForm] = useState({
    nom: '',
    email: '',
    assumpte: '',
    missatge: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/contacte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Error enviant')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <NavBar />
      <PageBanner />

      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">

          {/* ── Form ── */}
          <div ref={formRef} className="md:col-span-2">
            <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[#29ABE2] block mb-2">
              Formulari
            </span>
            <h2
              className="text-4xl font-black text-gray-900 mb-8"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              ENVIA'NS UN MISSATGE
            </h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#29ABE2]/10 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#29ABE2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>
                  MISSATGE ENVIAT
                </h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Hem rebut el teu missatge. Et respondrem el més aviat possible.
                </p>
                <button
                  onClick={() => { setStatus('idle'); setForm({ nom: '', email: '', assumpte: '', missatge: '' }) }}
                  className="mt-2 text-xs font-semibold text-[#29ABE2] hover:underline"
                >
                  Enviar un altre missatge
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input label="Nom" name="nom" required value={form.nom} onChange={handleChange} />
                  <Input label="Email" name="email" type="email" required value={form.email} onChange={handleChange} />
                </div>

                {/* Assumpte */}
                <Input label="Assumpte" name="assumpte" required value={form.assumpte} onChange={handleChange} />

                {/* Missatge */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="missatge" className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
                    Missatge <span className="text-[#29ABE2]">*</span>
                  </label>
                  <textarea
                    id="missatge"
                    name="missatge"
                    required
                    rows={5}
                    value={form.missatge}
                    onChange={handleChange}
                    placeholder="Escriu el teu missatge aquí..."
                    className="px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15 transition-all duration-150 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="self-start px-8 py-3.5 bg-[#29ABE2] text-white text-sm font-bold tracking-wide uppercase rounded-lg hover:bg-[#1a9fd4] disabled:opacity-60 transition-all duration-150 flex items-center gap-2"
                >
                  {status === 'sending' ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Enviant...
                    </>
                  ) : (
                    'Enviar missatge'
                  )}
                </button>

                {status === 'error' && (
                  <p className="text-sm text-red-500 mt-2">
                    Hi ha hagut un error. Torna-ho a intentar o escriu-nos directament.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* ── Info sidebar ── */}
          <div ref={infoRef} className="flex flex-col">
            {/* Contact items */}
            <div className="flex flex-col gap-2 mt-30">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-[#29ABE2]/10 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" fill="none" stroke="#29ABE2" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">Ubicació</p>
                  <p className="text-base text-gray-500 leading-relaxed">Castelldefels, Barcelona</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-[#29ABE2]/10 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" fill="none" stroke="#29ABE2" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">Email</p>
                  <a href="mailto:info@sedentaris.cat" className="text-base text-[#29ABE2] hover:underline">
                    info@sedentaris.cat
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-[#29ABE2]/10 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" fill="none" stroke="#29ABE2" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4.5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="#29ABE2" stroke="none" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">Instagram</p>
                  <a
                    href="https://instagram.com/sedentaris.cat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-[#29ABE2] hover:underline"
                  >
                    @sedentaris.cat
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
      <Footer />
    </>
  )
}