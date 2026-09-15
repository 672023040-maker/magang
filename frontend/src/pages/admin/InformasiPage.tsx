import { useEffect, useState, type FormEvent } from 'react'
import { informasi } from '../../api'
import type { Informasi, KategoriInformasi } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Spinner } from '../../components/ui/Spinner'
import { Textarea } from '../../components/ui/Textarea'

interface InformasiForm {
  judul: string
  kategori: KategoriInformasi
  isi: string
  gambar: File | null
  tanggal: string
}

const emptyForm: InformasiForm = {
  judul: '',
  kategori: 'berita',
  isi: '',
  gambar: null,
  tanggal: new Date().toISOString().slice(0, 10),
}

const kategoriMeta: Record<KategoriInformasi, 'blue' | 'amber' | 'green'> = {
  berita: 'blue',
  artikel: 'amber',
  pengumuman: 'green',
}

export function InformasiPage() {
  const [items, setItems] = useState<Informasi[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Informasi | null>(null)
  const [form, setForm] = useState<InformasiForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const load = () => {
    informasi
      .get()
      .then(setItems)
      .catch(() => setError('Gagal memuat data informasi.'))
  }

  useEffect(() => {
    informasi
      .get()
      .then(setItems)
      .catch(() => setError('Gagal memuat data informasi.'))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setSuccess(null)
    setModalOpen(true)
  }

  const openEdit = (item: Informasi) => {
    setEditing(item)
    setForm({
      judul: item.judul,
      kategori: item.kategori,
      isi: item.isi,
      gambar: null,
      tanggal: item.tanggal,
    })
    setError(null)
    setSuccess(null)
    setModalOpen(true)
  }

  const handleDelete = async (item: Informasi) => {
    if (!window.confirm(`Hapus "${item.judul}"?`)) return

    try {
      await informasi.remove(item.id)
      setSuccess('Informasi berhasil dihapus.')
      load()
    } catch {
      setError('Gagal menghapus informasi.')
    }
  }

  const updateField = (name: keyof InformasiForm, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const buildFormData = (): FormData => {
    const data = new FormData()

    data.append('judul', form.judul)
    data.append('kategori', form.kategori)
    data.append('isi', form.isi)
    data.append('tanggal', form.tanggal)

    if (form.gambar) {
      data.append('gambar', form.gambar)
    }

    return data
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      setSaving(true)
      const payload = buildFormData()

      if (editing) {
        await informasi.update(editing.id, payload)
        setSuccess('Informasi berhasil diperbarui.')
      } else {
        await informasi.create(payload)
        setSuccess('Informasi berhasil ditambahkan.')
      }

      setModalOpen(false)
      load()
    } catch {
      setError('Gagal menyimpan informasi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Informasi</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola berita, artikel, dan pengumuman.
          </p>
        </div>
        <Button onClick={openCreate}>Tambah</Button>
      </div>

      <Alert variant="success" message={success} />
      <Alert variant="error" message={error} />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Belum ada informasi.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-slate-800">
                    {item.judul}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={kategoriMeta[item.kategori]}>
                      {item.kategori}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.tanggal}</td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="text-xs font-medium text-brand-600 hover:text-brand-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Informasi' : 'Tambah Informasi'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="judul"
            label="Judul"
            value={form.judul}
            onChange={(e) => updateField('judul', e.target.value)}
            required
          />
          <Select
            id="kategori"
            label="Kategori"
            value={form.kategori}
            onChange={(e) =>
              updateField('kategori', e.target.value as KategoriInformasi)
            }
            options={[
              { value: 'berita', label: 'Berita' },
              { value: 'artikel', label: 'Artikel' },
              { value: 'pengumuman', label: 'Pengumuman' },
            ]}
          />
          <Textarea
            id="isi"
            label="Isi"
            rows={5}
            value={form.isi}
            onChange={(e) => updateField('isi', e.target.value)}
            required
          />
          <Input
            id="tanggal"
            label="Tanggal"
            type="date"
            value={form.tanggal}
            onChange={(e) => updateField('tanggal', e.target.value)}
            required
          />
          <Input
            id="gambar"
            label="Gambar"
            type="file"
            accept="image/*"
            onChange={(e) => updateField('gambar', e.target.files?.[0] ?? null)}
          />

          <div className="pt-2">
            <Button type="submit" loading={saving}>
              {editing ? 'Simpan Perubahan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}