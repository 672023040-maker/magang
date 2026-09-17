import { useEffect, useState, type FormEvent } from 'react'
import { struktur } from '../../api'
import type { Struktur } from '../../types'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { Textarea } from '../../components/ui/Textarea'

interface DivisiForm {
  nama_divisi: string
  deskripsi: string
}

interface StrukturForm {
  nama: string
  jabatan: string
  instagram: string
  email: string
  foto: File | null
  divisi: DivisiForm[]
}

const emptyDivisi: DivisiForm = { nama_divisi: '', deskripsi: '' }

const emptyForm: StrukturForm = {
  nama: '',
  jabatan: '',
  instagram: '',
  email: '',
  foto: null,
  divisi: [],
}

export function StrukturPage() {
  const [items, setItems] = useState<Struktur[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Struktur | null>(null)
  const [form, setForm] = useState<StrukturForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const load = () => {
    struktur
      .get()
      .then(setItems)
      .catch(() => setError('Gagal memuat data struktur.'))
  }

  useEffect(() => {
    struktur
      .get()
      .then(setItems)
      .catch(() => setError('Gagal memuat data struktur.'))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setSuccess(null)
    setModalOpen(true)
  }

  const openEdit = (item: Struktur) => {
    setEditing(item)
    setForm({
      nama: item.nama,
      jabatan: item.jabatan,
      instagram: item.instagram ?? '',
      email: item.email ?? '',
      foto: null,
      divisi: item.divisi.map((d) => ({
        nama_divisi: d.nama_divisi,
        deskripsi: d.deskripsi,
      })),
    })
    setError(null)
    setSuccess(null)
    setModalOpen(true)
  }

  const handleDelete = async (item: Struktur) => {
    if (!window.confirm(`Hapus "${item.nama}"?`)) return

    try {
      await struktur.remove(item.id)
      setSuccess('Data struktur berhasil dihapus.')
      load()
    } catch {
      setError('Gagal menghapus data struktur.')
    }
  }

  const updateField = (name: keyof Omit<StrukturForm, 'divisi'>, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const updateDivisi = (index: number, field: keyof DivisiForm, value: string) => {
    setForm((prev) => {
      const divisi = [...prev.divisi]
      divisi[index] = { ...divisi[index], [field]: value }
      return { ...prev, divisi }
    })
  }

  const addDivisi = () => {
    setForm((prev) => ({ ...prev, divisi: [...prev.divisi, { ...emptyDivisi }] }))
  }

  const removeDivisi = (index: number) => {
    setForm((prev) => ({
      ...prev,
      divisi: prev.divisi.filter((_, i) => i !== index),
    }))
  }

  const buildFormData = (): FormData => {
    const data = new FormData()

    data.append('nama', form.nama)
    data.append('jabatan', form.jabatan)
    data.append('instagram', form.instagram)
    data.append('email', form.email)

    if (form.foto) {
      data.append('foto', form.foto)
    }

    form.divisi.forEach((d, index) => {
      data.append(`divisi[${index}][nama_divisi]`, d.nama_divisi)
      data.append(`divisi[${index}][deskripsi]`, d.deskripsi)
    })

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
        await struktur.update(editing.id, payload)
        setSuccess('Data struktur berhasil diperbarui.')
      } else {
        await struktur.create(payload)
        setSuccess('Data struktur berhasil ditambahkan.')
      }

      setModalOpen(false)
      load()
    } catch {
      setError('Gagal menyimpan data struktur.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-stone-900">Struktur Organisasi</h1>
          <p className="mt-1 text-sm text-stone-500">
            Kelola pimpinan dan divisi organisasi.
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
<p className="py-10 text-center text-sm text-stone-500">
            Belum ada data struktur.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Jabatan</th>
                  <th className="px-4 py-3">Divisi</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-stone-800">
                      {item.nama}
                    </td>
                    <td className="px-4 py-3 text-stone-600">{item.jabatan}</td>
                    <td className="px-4 py-3 text-stone-600">
                      {item.divisi.length} divisi
                    </td>
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
        title={editing ? 'Edit Struktur' : 'Tambah Struktur'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="nama"
            label="Nama"
            value={form.nama}
            onChange={(e) => updateField('nama', e.target.value)}
            required
          />
          <Input
            id="jabatan"
            label="Jabatan"
            value={form.jabatan}
            onChange={(e) => updateField('jabatan', e.target.value)}
            required
          />
          <Input
            id="instagram"
            label="Instagram URL"
            placeholder="https://www.instagram.com/username"
            value={form.instagram}
            onChange={(e) => updateField('instagram', e.target.value)}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="nama@uksw.edu"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
          <Input
            id="foto"
            label="Foto"
            type="file"
            accept="image/*"
            onChange={(e) => updateField('foto', e.target.files?.[0] ?? null)}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-stone-700">Divisi</p>
              <button
                type="button"
                onClick={addDivisi}
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                + Tambah Divisi
              </button>
            </div>

            {form.divisi.map((divisi, index) => (
              <div key={index} className="rounded-lg border border-stone-200 p-3">
                <Input
                  id={`divisi-nama-${index}`}
                  label="Nama Divisi"
                  value={divisi.nama_divisi}
                  onChange={(e) => updateDivisi(index, 'nama_divisi', e.target.value)}
                  required
                />
                <div className="mt-2">
                  <Textarea
                    id={`divisi-desk-${index}`}
                    label="Deskripsi"
                    rows={2}
                    value={divisi.deskripsi}
                    onChange={(e) => updateDivisi(index, 'deskripsi', e.target.value)}
                    required
                  />
                </div>
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeDivisi(index)}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Hapus Divisi
                  </button>
                </div>
              </div>
            ))}
          </div>

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