/**
 * Pas 4 — Importa les notícies de news.json a Supabase (taula posts + bucket blog).
 *
 *   node news-import/04_import.mjs --batch 2023            # dry-run (per defecte)
 *   node news-import/04_import.mjs --batch 2023 --apply    # escriu a producció
 *
 * Replica PostsTab.handleSave del backoffice (app/admin/dashboard/page.tsx):
 * mateix payload, mateix generateSlug i mateix bucket 'blog'. A més fixa
 * created_at amb la data de publicació i omple imatges[] per al carrusel.
 *
 * Idempotent: cada post creat queda a import-state.json i, a més, es comprova
 * el slug a la BD abans d'inserir. Les fotos es pugen amb ruta fixa i upsert.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const DIR = path.dirname(fileURLToPath(import.meta.url))
const WEB = path.resolve(DIR, '..')
const NEWS_DIR = path.join(WEB, 'public', 'news')
const STATE_FILE = path.join(DIR, 'import-state.json')
const TRANSLATIONS_DIR = path.join(DIR, 'translations')

// Lots per data de publicació
const BATCHES = {
  '2023': ['2023-01-01', '2023-12-31'],
  '2024-H1': ['2024-01-01', '2024-06-30'],
  '2024-H2': ['2024-07-01', '2024-12-31'],
  '2025-H1': ['2025-01-01', '2025-06-30'],
  '2025-H2': ['2025-07-01', '2025-12-31'],
}

const args = process.argv.slice(2)
const batch = args.includes('--batch') ? args[args.indexOf('--batch') + 1] : undefined
const APPLY = args.includes('--apply')
if (!BATCHES[batch]) {
  console.error(`Ús: --batch <${Object.keys(BATCHES).join('|')}> [--apply]`)
  process.exit(1)
}

// ── Utilitats ─────────────────────────────────────────────────────────
const readJson = (file, fallback) =>
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback
const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const logFile = path.join(DIR, 'logs', `${APPLY ? 'apply' : 'dry-run'}-${batch}-${stamp}.log`)
fs.mkdirSync(path.dirname(logFile), { recursive: true })
const log = (...parts) => {
  const line = parts.join(' ')
  console.log(line)
  fs.appendFileSync(logFile, line + '\n')
}

// Mateix generateSlug que el backoffice; aquí a més es col·lapsen guions
// (els títols són llistes "CURSA A - CURSA B") i s'hi afegeix la data.
const generateSlug = (titol) =>
  titol.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()

function buildSlug(titol, fecha) {
  let base = generateSlug(titol).replace(/-+/g, '-').replace(/^-|-$/g, '')
  if (base.length > 60) base = base.slice(0, 60).replace(/-[^-]*$/, '')
  return `${base}-${fecha}`
}

function buildResum(text) {
  const first = text.split('\n\n').find((p) => p.length > 40) ?? text
  return first.length <= 180 ? first : first.slice(0, 180).replace(/\s+\S*$/, '') + '…'
}

async function withRetry(fn, tries = 3) {
  for (let i = 1; ; i++) {
    const { data, error } = await fn()
    if (!error) return data
    if (i >= tries) throw new Error(error.message)
    await sleep(1000 * i)
  }
}

function buildPayload({ entry, tr, slug }, urls) {
  // titol_es / contingut_es a la traducció corregeixen l'original quan el Word ve malament
  const contingutEs = tr.contingut_es ?? entry.texto
  return {
    slug,
    titol: tr.titol, resum: buildResum(tr.contingut), contingut: tr.contingut,
    titol_es: tr.titol_es ?? entry.titulo, resum_es: buildResum(contingutEs), contingut_es: contingutEs,
    categoria: 'Notícies', autor: 'Sedentaris',
    imatge_url: urls[0] ?? null,
    imatges: urls,
    destacat: false, publicat: true,
    created_at: `${entry.fecha}T10:00:00Z`,
  }
}

// ── Main ──────────────────────────────────────────────────────────────
process.loadEnvFile(path.join(WEB, '.env.local'))
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

const news = readJson(path.join(DIR, 'news.json'))
const excluded = new Set(readJson(path.join(DIR, 'exclusions.json'), { ids: [] }).ids)
const translations = fs.existsSync(TRANSLATIONS_DIR)
  ? Object.assign({}, ...fs.readdirSync(TRANSLATIONS_DIR).filter((f) => f.endsWith('.json'))
    .map((f) => readJson(path.join(TRANSLATIONS_DIR, f))))
  : {}
const state = readJson(STATE_FILE, {})

const [from, to] = BATCHES[batch]
const entries = news.filter((e) => e.fecha >= from && e.fecha <= to)
log(`# ${APPLY ? 'APPLY' : 'DRY-RUN'} lot ${batch} (${from} → ${to}) · ${entries.length} publicacions`)

// 1. Validació local
const plan = []
const errors = []
const slugs = new Set(Object.values(state).map((s) => s.slug))
for (const entry of entries) {
  if (excluded.has(entry.id)) { log(`- ${entry.id} exclosa (exclusions.json)`); continue }
  if (state[entry.id]) { log(`= ${entry.id} ja importada (${state[entry.id].slug})`); continue }
  const tr = translations[entry.id]
  if (!tr?.titol?.trim() || !tr?.contingut?.trim()) { errors.push(`${entry.id}: falta la traducció CA`); continue }
  const slug = buildSlug(tr.titol, entry.fecha)
  if (slugs.has(slug)) { errors.push(`${entry.id}: slug repetit ${slug}`); continue }
  slugs.add(slug)
  const missing = entry.imagenes.filter((i) => !fs.existsSync(path.join(NEWS_DIR, i.ruta)))
  if (missing.length) { errors.push(`${entry.id}: fotos inexistents ${missing.map((m) => m.ruta).join(', ')}`); continue }
  plan.push({ entry, tr, slug })
}

// 2. Validació contra la BD (només lectura)
const { error: colError } = await sb.from('posts').select('imatges').limit(1)
if (colError) errors.push(`la columna posts.imatges no existeix: executa migration-imatges.sql (${colError.message})`)

if (plan.length) {
  const { data: existing, error } = await sb.from('posts').select('id, slug').in('slug', plan.map((p) => p.slug))
  if (error) errors.push(`consulta de slugs: ${error.message}`)
  for (const row of existing ?? []) {
    const i = plan.findIndex((p) => p.slug === row.slug)
    log(`= ${plan[i].entry.id} ja existeix a la BD (${row.slug})`)
    if (APPLY) {
      state[plan[i].entry.id] = { post_id: row.id, slug: row.slug, imported_at: null }
      writeJson(STATE_FILE, state)
    }
    plan.splice(i, 1)
  }
}

for (const p of plan) {
  const payload = buildPayload(p, p.entry.imagenes.map((i) => i.ruta))
  log(`+ ${p.entry.id} ${p.entry.fecha} /blog/${p.slug}`)
  log(`    titol: ${payload.titol}`)
  log(`    resum: ${payload.resum.slice(0, 110)}`)
  log(`    fotos: ${payload.imatges.length} · paràgrafs CA/ES: ${p.tr.contingut.split('\n\n').length}/${p.entry.texto.split('\n\n').length}`)
}

if (errors.length) {
  log(`\n## ${errors.length} errors`)
  errors.forEach((e) => log(`! ${e}`))
}
log(`\n${plan.length} posts per crear, ${plan.reduce((n, p) => n + p.entry.imagenes.length, 0)} fotos per pujar`)

if (!APPLY) {
  log(`Dry-run: no s'ha escrit res. Log: ${path.relative(WEB, logFile)}`)
  process.exit(errors.length ? 1 : 0)
}
if (errors.length) {
  log('Apply cancel·lat: corregeix els errors abans d\'escriure a producció.')
  process.exit(1)
}

// 3. Backup de la taula posts abans d'escriure
const backup = await withRetry(() => sb.from('posts').select('*'))
const backupFile = path.join(DIR, 'backups', `posts-${stamp}.json`)
writeJson(backupFile, backup)
log(`Backup: ${backup.length} posts -> ${path.relative(WEB, backupFile)}`)

// 4. Importació, notícia a notícia
let ok = 0
let failed = 0
for (const p of plan) {
  try {
    const urls = []
    for (const [n, img] of p.entry.imagenes.entries()) {
      const dest = `news/${p.entry.id}/${String(n + 1).padStart(2, '0')}.jpg`
      const body = fs.readFileSync(path.join(NEWS_DIR, img.ruta))
      await withRetry(() => sb.storage.from('blog').upload(dest, body, { contentType: 'image/jpeg', upsert: true }))
      urls.push(sb.storage.from('blog').getPublicUrl(dest).data.publicUrl)
      await sleep(150)
    }
    const row = await withRetry(() => sb.from('posts').insert([buildPayload(p, urls)]).select('id').single())
    state[p.entry.id] = { post_id: row.id, slug: p.slug, imatges: urls.length, imported_at: new Date().toISOString() }
    writeJson(STATE_FILE, state)
    ok++
    log(`✓ ${p.entry.id} /blog/${p.slug} (${urls.length} fotos)`)
  } catch (err) {
    failed++
    log(`✗ ${p.entry.id}: ${err.message}`)
  }
}

log(`\nFet: ${ok} creats, ${failed} errors. Log: ${path.relative(WEB, logFile)}`)
process.exit(failed ? 1 : 0)
