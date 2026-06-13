'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, supabaseAdmin, Atlete, Post } from '@/lib/supabase'
import ImageCropper from '@/components/ImageCropper'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Tab = 'atletes' | 'posts' | 'contacte'

function AdminNav({ tab, setTab, onLogout }: { tab: Tab; setTab: (t: Tab) => void; onLogout: () => void }) {
  return (
    <header className="bg-[#29ABE2] px-6 h-14 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <span className="font-black text-white text-lg tracking-wide" style={{ fontFamily: "'Anton', sans-serif" }}>
          SEDENTARIS · ADMIN
        </span>
        <nav className="flex gap-1">
          {(['atletes', 'posts', 'contacte'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-all duration-150 ${tab === t ? 'bg-white text-[#29ABE2]' : 'text-white/80 hover:text-white hover:bg-white/20'}`}>
              {t}
            </button>
          ))}
        </nav>
      </div>
      <button onClick={onLogout} className="text-xs font-semibold text-white/70 hover:text-white transition-colors duration-150">Sortir</button>
    </header>
  )
}

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <circle cx="4" cy="3" r="1.2" />
      <circle cx="10" cy="3" r="1.2" />
      <circle cx="4" cy="7" r="1.2" />
      <circle cx="10" cy="7" r="1.2" />
      <circle cx="4" cy="11" r="1.2" />
      <circle cx="10" cy="11" r="1.2" />
    </svg>
  )
}

function SortableAtleteRow({
  atlete,
  onEdit,
  onDelete,
}: {
  atlete: Atlete
  onEdit: (a: Atlete) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: atlete.id })

  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        zIndex: isDragging ? 10 : 'auto',
        position: 'relative',
      }}
      className={`transition-colors duration-100 ${isDragging ? 'bg-[#29ABE2]/5 shadow-lg' : 'hover:bg-gray-50'}`}
    >
      <td className="pl-3 pr-1 py-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-[#29ABE2] p-1 rounded touch-none transition-colors duration-150"
          title="Arrossega per ordenar"
        >
          <GripIcon />
        </button>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{atlete.nom}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {atlete.disciplines.map((d) => (
            <span key={d} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#29ABE2]/10 text-[#29ABE2]">{d}</span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{atlete.instagram ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{atlete.foto_url ? '✓' : '—'}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2 justify-end">
          <button onClick={() => onEdit(atlete)} className="text-xs font-semibold text-[#29ABE2] hover:underline">Editar</button>
          <button onClick={() => onDelete(atlete.id)} className="text-xs font-semibold text-red-500 hover:underline">Eliminar</button>
        </div>
      </td>
    </tr>
  )
}

function AtletesTab() {
  const [atletes, setAtletes] = useState<Atlete[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editAtlete, setEditAtlete] = useState<Atlete | null>(null)
  const [form, setForm] = useState({ nom: '', disciplines: [] as string[], instagram: '', foto_url: '' })
  const [saving, setSaving] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropFileName, setCropFileName] = useState<string>('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const fetchAtletes = async () => {
    let { data, error } = await supabase
      .from('atletes')
      .select('*')
      .order('ordre', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })

    if (error) {
      // ordre column doesn't exist yet — fall back to created_at
      const fallback = await supabase
        .from('atletes')
        .select('*')
        .order('created_at', { ascending: true })
      data = fallback.data
    }

    setAtletes(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchAtletes() }, [])

  const saveOrder = async (ordered: Atlete[]) => {
    setSavingOrder(true)
    await Promise.all(
      ordered.map((a, i) =>
        supabaseAdmin.from('atletes').update({ ordre: i }).eq('id', a.id)
      )
    )
    setSavingOrder(false)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = atletes.findIndex((a) => a.id === active.id)
    const newIndex = atletes.findIndex((a) => a.id === over.id)
    const reordered = arrayMove(atletes, oldIndex, newIndex)
    setAtletes(reordered)
    saveOrder(reordered)
  }

  const openNew = () => {
    setEditAtlete(null)
    setForm({ nom: '', disciplines: [], instagram: '', foto_url: '' })
    setShowForm(true)
  }

  const openEdit = (a: Atlete) => {
    setEditAtlete(a)
    setForm({ nom: a.nom, disciplines: [...a.disciplines], instagram: a.instagram ?? '', foto_url: a.foto_url ?? '' })
    setShowForm(true)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = file.name.split('.').pop() ?? 'jpg'
    setCropFileName(`${Date.now()}.${ext}`)
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (blob: Blob) => {
    setUploading(true)
    setCropSrc(null)
    const { error } = await supabaseAdmin.storage.from('atletes').upload(cropFileName, blob)
    if (!error) {
      const { data } = supabase.storage.from('atletes').getPublicUrl(cropFileName)
      setForm((prev) => ({ ...prev, foto_url: data.publicUrl }))
    }
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      nom: form.nom,
      disciplines: form.disciplines,
      instagram: form.instagram || null,
      foto_url: form.foto_url || null,
    }
    if (editAtlete) {
      await supabaseAdmin.from('atletes').update(payload).eq('id', editAtlete.id)
    } else {
      await supabaseAdmin.from('atletes').insert([payload])
    }
    setSaving(false)
    setShowForm(false)
    fetchAtletes()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Segur que vols eliminar aquest atleta?')) return
    await supabase.from('atletes').delete().eq('id', id)
    fetchAtletes()
  }

  return (
    <>
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropSrc(null)}
        />
      )}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>ATLETES</h2>
            {savingOrder && (
              <span className="text-xs text-[#29ABE2] font-semibold animate-pulse">Guardant ordre...</span>
            )}
          </div>
          <button onClick={openNew} className="px-4 py-2 bg-[#29ABE2] text-white text-xs font-bold tracking-wide uppercase rounded hover:bg-[#1a9fd4] transition-colors duration-150">+ Nou atleta</button>
        </div>
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">{editAtlete ? 'Editar atleta' : 'Nou atleta'}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nom *</label>
                <input value={form.nom} onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))}
                  className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Disciplines *</label>
                <div className="flex flex-wrap gap-2">
                  {(['Trail', 'Asfalt', 'Paraatletisme'] as const).map((d) => {
                    const active = form.disciplines.includes(d)
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setForm((p) => ({
                          ...p,
                          disciplines: active ? p.disciplines.filter((x) => x !== d) : [...p.disciplines, d],
                        }))}
                        className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-150 ${
                          active
                            ? 'bg-[#29ABE2] border-[#29ABE2] text-white'
                            : 'bg-white border-gray-200 text-gray-500 hover:border-[#29ABE2] hover:text-[#29ABE2]'
                        }`}
                      >
                        {d}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Instagram (opcional)</label>
                <input value={form.instagram} onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))}
                  placeholder="usuari sense @"
                  className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Foto</label>
                <input type="file" accept="image/*" onChange={handleUpload}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#29ABE2]/10 file:text-[#29ABE2]" />
                {uploading && <p className="text-xs text-[#29ABE2]">Pujant foto...</p>}
                {form.foto_url && <p className="text-xs text-green-600">✓ Foto pujada</p>}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} disabled={saving || !form.nom}
                className="px-5 py-2.5 bg-[#29ABE2] text-white text-xs font-bold tracking-wide uppercase rounded hover:bg-[#1a9fd4] disabled:opacity-50 transition-colors duration-150">
                {saving ? 'Guardant...' : 'Guardar'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-xs font-bold tracking-wide uppercase rounded hover:border-gray-400 transition-colors duration-150">
                Cancel·lar
              </button>
            </div>
          </div>
        )}
        {loading ? (
          <p className="text-sm text-gray-400">Carregant...</p>
        ) : atletes.length === 0 ? (
          <p className="text-sm text-gray-400">No hi ha atletes. Afegeix-ne un!</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={atletes.map((a) => a.id)} strategy={verticalListSortingStrategy}>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="w-10 pl-3 pr-1 py-3" title="Arrossega per ordenar">
                        <GripIcon />
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Disciplines</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Instagram</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Foto</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {atletes.map((a) => (
                      <SortableAtleteRow
                        key={a.id}
                        atlete={a}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </>
  )
}

function PostsTab() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editPost, setEditPost] = useState<Post | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [langTab, setLangTab] = useState<'ca' | 'es'>('ca')
  const [form, setForm] = useState({
    slug: '', titol: '', resum: '', contingut: '',
    titol_es: '', resum_es: '', contingut_es: '',
    categoria: '', autor: '', imatge_url: '',
    destacat: false, publicat: false,
  })

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  const openNew = () => {
    setEditPost(null)
    setLangTab('ca')
    setForm({ slug: '', titol: '', resum: '', contingut: '', titol_es: '', resum_es: '', contingut_es: '', categoria: '', autor: '', imatge_url: '', destacat: false, publicat: false })
    setShowForm(true)
  }

  const openEdit = (p: Post) => {
    setEditPost(p)
    setLangTab('ca')
    setForm({
      slug: p.slug, titol: p.titol, resum: p.resum, contingut: p.contingut,
      titol_es: p.titol_es ?? '', resum_es: p.resum_es ?? '', contingut_es: p.contingut_es ?? '',
      categoria: p.categoria, autor: p.autor, imatge_url: p.imatge_url ?? '',
      destacat: p.destacat, publicat: p.publicat,
    })
    setShowForm(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabaseAdmin.storage.from('blog').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('blog').getPublicUrl(path)
      setForm((prev) => ({ ...prev, imatge_url: data.publicUrl }))
    }
    setUploading(false)
  }

  const generateSlug = (titol: string) =>
    titol.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      slug: form.slug,
      titol: form.titol, resum: form.resum, contingut: form.contingut,
      titol_es: form.titol_es || null, resum_es: form.resum_es || null, contingut_es: form.contingut_es || null,
      categoria: form.categoria, autor: form.autor,
      imatge_url: form.imatge_url || null,
      destacat: form.destacat, publicat: form.publicat,
    }
    if (editPost) {
      await supabaseAdmin.from('posts').update(payload).eq('id', editPost.id)
    } else {
      await supabaseAdmin.from('posts').insert([payload])
    }
    setSaving(false)
    setShowForm(false)
    fetchPosts()
  }

  const togglePublicat = async (p: Post) => {
    await supabaseAdmin.from('posts').update({ publicat: !p.publicat }).eq('id', p.id)
    fetchPosts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Segur que vols eliminar aquest post?')) return
    await supabaseAdmin.from('posts').delete().eq('id', id)
    fetchPosts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>POSTS</h2>
        <button onClick={openNew} className="px-4 py-2 bg-[#29ABE2] text-white text-xs font-bold tracking-wide uppercase rounded hover:bg-[#1a9fd4] transition-colors duration-150">+ Nou post</button>
      </div>
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">{editPost ? 'Editar post' : 'Nou post'}</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Títol (CA) *</label>
              <input value={form.titol}
                onChange={(e) => setForm((p) => ({ ...p, titol: e.target.value, slug: generateSlug(e.target.value) }))}
                className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Slug *</label>
              <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-500 focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Categoria *</label>
              <input value={form.categoria} onChange={(e) => setForm((p) => ({ ...p, categoria: e.target.value }))}
                placeholder="Resultats, Notícies, Trail, Asfalt..."
                className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Autor *</label>
              <input value={form.autor} onChange={(e) => setForm((p) => ({ ...p, autor: e.target.value }))}
                className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15" />
            </div>
          </div>
          <div className="flex gap-1 mb-4 border-b border-gray-200">
            <button onClick={() => setLangTab('ca')}
              className={`px-4 py-2 text-xs font-bold tracking-wide uppercase transition-all duration-150 border-b-2 -mb-px ${langTab === 'ca' ? 'border-[#29ABE2] text-[#29ABE2]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              🇨🇦 Català
            </button>
            <button onClick={() => setLangTab('es')}
              className={`px-4 py-2 text-xs font-bold tracking-wide uppercase transition-all duration-150 border-b-2 -mb-px ${langTab === 'es' ? 'border-[#29ABE2] text-[#29ABE2]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              🇪🇸 Castellano
            </button>
          </div>
          {langTab === 'ca' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Resum *</label>
                <textarea value={form.resum} onChange={(e) => setForm((p) => ({ ...p, resum: e.target.value }))}
                  rows={2} className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15 resize-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contingut *</label>
                <textarea value={form.contingut} onChange={(e) => setForm((p) => ({ ...p, contingut: e.target.value }))}
                  rows={8} placeholder="Suporta **text en negreta** i paràgrafs separats per línies buides"
                  className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15 resize-none font-mono" />
              </div>
            </div>
          )}
          {langTab === 'es' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Título ES</label>
                <input value={form.titol_es} onChange={(e) => setForm((p) => ({ ...p, titol_es: e.target.value }))}
                  className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Resumen ES</label>
                <textarea value={form.resum_es} onChange={(e) => setForm((p) => ({ ...p, resum_es: e.target.value }))}
                  rows={2} className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15 resize-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contenido ES</label>
                <textarea value={form.contingut_es} onChange={(e) => setForm((p) => ({ ...p, contingut_es: e.target.value }))}
                  rows={8} placeholder="Soporta **texto en negrita** y párrafos separados por líneas vacías"
                  className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#29ABE2] focus:ring-2 focus:ring-[#29ABE2]/15 resize-none font-mono" />
              </div>
            </div>
          )}
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Imatge</label>
              <input type="file" accept="image/*" onChange={handleUpload}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#29ABE2]/10 file:text-[#29ABE2]" />
              {uploading && <p className="text-xs text-[#29ABE2]">Pujant imatge...</p>}
              {form.imatge_url && <p className="text-xs text-green-600">✓ Imatge pujada</p>}
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.destacat} onChange={(e) => setForm((p) => ({ ...p, destacat: e.target.checked }))} className="w-4 h-4 accent-[#29ABE2]" />
                <span className="text-xs font-semibold text-gray-700">Destacat</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.publicat} onChange={(e) => setForm((p) => ({ ...p, publicat: e.target.checked }))} className="w-4 h-4 accent-[#29ABE2]" />
                <span className="text-xs font-semibold text-gray-700">Publicar ara</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving || !form.titol || !form.slug || !form.contingut}
              className="px-5 py-2.5 bg-[#29ABE2] text-white text-xs font-bold tracking-wide uppercase rounded hover:bg-[#1a9fd4] disabled:opacity-50 transition-colors duration-150">
              {saving ? 'Guardant...' : 'Guardar'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-xs font-bold tracking-wide uppercase rounded hover:border-gray-400 transition-colors duration-150">
              Cancel·lar
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <p className="text-sm text-gray-400">Carregant...</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-gray-400">No hi ha posts. Crea'n un!</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Títol</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoria</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Autor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ES</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estat</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-100">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">{p.titol}</p>
                    <p className="text-xs text-gray-400">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.categoria}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.autor}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${p.titol_es ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {p.titol_es ? '✓' : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublicat(p)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wide transition-colors duration-150 ${p.publicat ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {p.publicat ? 'Publicat' : 'Esborrany'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="text-xs font-semibold text-[#29ABE2] hover:underline">Editar</button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs font-semibold text-red-500 hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ContacteTab() {
  const [missatges, setMissatges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMissatges = async () => {
    const { data } = await supabase.from('contacte').select('*').order('created_at', { ascending: false })
    setMissatges(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchMissatges() }, [])

  const toggleLlegit = async (id: string, llegit: boolean) => {
    await supabase.from('contacte').update({ llegit: !llegit }).eq('id', id)
    fetchMissatges()
  }

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>CONTACTE</h2>
      {loading ? (
        <p className="text-sm text-gray-400">Carregant...</p>
      ) : missatges.length === 0 ? (
        <p className="text-sm text-gray-400">No hi ha missatges encara.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {missatges.map((m) => (
            <div key={m.id} className={`bg-white rounded-xl border p-5 ${m.llegit ? 'border-gray-100' : 'border-[#29ABE2]/40 shadow-sm'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-gray-900">{m.nom}</span>
                    <span className="text-xs text-gray-400">{m.email}</span>
                    {!m.llegit && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#29ABE2] text-white uppercase">Nou</span>}
                  </div>
                  <p className="text-xs font-semibold text-[#29ABE2] mb-2">{m.assumpte}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{m.missatge}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(m.created_at).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <a href={`mailto:${m.email}`}
                    className="px-3 py-1.5 bg-[#29ABE2] text-white text-xs font-bold rounded uppercase tracking-wide hover:bg-[#1a9fd4] transition-colors duration-150 text-center">
                    Respondre
                  </a>
                  <button onClick={() => toggleLlegit(m.id, m.llegit)}
                    className="px-3 py-1.5 border border-gray-200 text-gray-500 text-xs font-bold rounded uppercase tracking-wide hover:border-gray-400 transition-colors duration-150">
                    {m.llegit ? 'No llegit' : 'Marcar llegit'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('atletes')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav tab={tab} setTab={setTab} onLogout={handleLogout} />
      <main className="max-w-6xl mx-auto px-6 py-10">
        {tab === 'atletes' && <AtletesTab />}
        {tab === 'posts' && <PostsTab />}
        {tab === 'contacte' && <ContacteTab />}
      </main>
    </div>
  )
}
