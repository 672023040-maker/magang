import { useEffect, useState, type FormEvent } from 'react'
import { project } from '../../api'
import type { Project, StatusProject } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Spinner } from '../../components/ui/Spinner'
import { Textarea } from '../../components/ui/Textarea'

interface DokumentasiForm {
  file_gambar: File | null
  keterangan: string
}

interface ProjectForm {
  nama_project: string
  deskripsi: string
  status: StatusProject
  tgl_mulai: string
  tgl_selesai: string
  dokumentasi: DokumentasiForm[]
}

const emptyDokumentasi: DokumentasiForm = { file_gambar: null, keterangan: '' }

const emptyForm: ProjectForm = {
  nama_project: '',
  deskripsi: '',
  status: 'berjalan',
  tgl_mulai: '',
  tgl_selesai: '',
  dokumentasi: [],
}

export function ProjectPage() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState<ProjectForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const load = () => {
    project
      .get()
      .then(setItems)
      .catch(() => setError('Gagal memuat data project.'))
  }

  useEffect(() => {
    project
      .get()
      .then(setItems)
      .catch(() => setError('Gagal memuat data project.'))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setSuccess(null)
    setModalOpen(true)
  }

  const openEdit = (item: Project) => {
    setEditing(item)
    setForm({
      nama_project: item.nama_project,
      deskripsi: item.deskripsi,
      status: item.status,
      tgl_mulai: item.tgl_mulai ?? '',
      tgl_selesai: item.tgl_selesai ?? '',
      dokumentasi: item.dokumentasi.map(() => ({ ...emptyDokumentasi })),
    })
    setError(null)
    setSuccess(null)
    setModalOpen(true)
  }

  const handleDelete = async (item: Project) => {
    if (!window.confirm(`Hapus project "${item.nama_project}"?`)) return

    try {
      await project.remove(item.id)
      setSuccess('Project berhasil dihapus.')
      load()
    } catch {
      setError('Gagal menghapus project.')
    }
  }

  const updateField = (
    name: keyof Omit<ProjectForm, 'dokumentasi'>,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const updateDokumentasi = (
    index: number,
    field: keyof DokumentasiForm,
    value: File | string | null,
  ) => {
    setForm((prev) => {
      const dokumentasi = [...prev.dokumentasi]
      dokumentasi[index] = { ...dokumentasi[index], [field]: value }
      return { ...prev, dokumentasi }
    })
  }

  const addDokumentasi = () => {
    setForm((prev) => ({
      ...prev,
      dokumentasi: [...prev.dokumentasi, { ...emptyDokumentasi }],
    }))
  }

  const removeDokumentasi = (index: number) => {
    setForm((prev) => ({
      ...prev,
      dokumentasi: prev.dokumentasi.filter((_, i) => i !== index),
    }))
  }

  const buildFormData = (): FormData => {
    const data = new FormData()

    data.append('nama_project', form.nama_project)
    data.append('deskripsi', form.deskripsi)
    data.append('status', form.status)

    if (form.tgl_mulai) data.append('tgl_mulai', form.tgl_mulai)
    if (form.tgl_selesai) data.append('tgl_selesai', form.tgl_selesai)

    form.dokumentasi.forEach((dok, index) => {
      if (dok.file_gambar) {
        data.append(`dokumentasi[${index}][file_gambar]`, dok.file_gambar)
      }
      data.append(`dokumentasi[${index}][keterangan]`, dok.keterangan)
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
        await project.update(editing.id, payload)
        setSuccess('Project berhasil diperbarui.')
      } else {
        await project.create(payload)
        setSuccess('Project berhasil ditambahkan.')
      }

      setModalOpen(false)
      load()
    } catch {
      setError('Gagal menyimpan project.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola project beserta dokumentasinya.
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
          Belum ada project.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nama Project</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Periode</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-slate-800">
                    {item.nama_project}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={item.status === 'selesai' ? 'green' : 'amber'}>
                      {item.status === 'selesai' ? 'Selesai' : 'Berjalan'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.tgl_mulai ?? '-'} — {item.tgl_selesai ?? 'Saat ini'}
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
        title={editing ? 'Edit Project' : 'Tambah Project'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="nama_project"
            label="Nama Project"
            value={form.nama_project}
            onChange={(e) => updateField('nama_project', e.target.value)}
            required
          />
          <Textarea
            id="deskripsi"
            label="Deskripsi"
            rows={4}
            value={form.deskripsi}
            onChange={(e) => updateField('deskripsi', e.target.value)}
            required
          />
          <Select
            id="status"
            label="Status"
            value={form.status}
            onChange={(e) => updateField('status', e.target.value as StatusProject)}
            options={[
              { value: 'berjalan', label: 'Berjalan' },
              { value: 'selesai', label: 'Selesai' },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="tgl_mulai"
              label="Tanggal Mulai"
              type="date"
              value={form.tgl_mulai}
              onChange={(e) => updateField('tgl_mulai', e.target.value)}
            />
            <Input
              id="tgl_selesai"
              label="Tanggal Selesai"
              type="date"
              value={form.tgl_selesai}
              onChange={(e) => updateField('tgl_selesai', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Dokumentasi</p>
              <button
                type="button"
                onClick={addDokumentasi}
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                + Tambah Dokumentasi
              </button>
            </div>

            {form.dokumentasi.map((dok, index) => (
              <div key={index} className="rounded-lg border border-slate-200 p-3">
                <Input
                  id={`dok-gambar-${index}`}
                  label="File Gambar"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateDokumentasi(index, 'file_gambar', e.target.files?.[0] ?? null)
                  }
                  required
                />
                <div className="mt-2">
                  <Input
                    id={`dok-ket-${index}`}
                    label="Keterangan"
                    value={dok.keterangan}
                    onChange={(e) =>
                      updateDokumentasi(index, 'keterangan', e.target.value)
                    }
                  />
                </div>
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeDokumentasi(index)}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Hapus Dokumentasi
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