import { useEffect, useState, type FormEvent } from 'react'
import { project, struktur } from '../../api'
import { getErrorFields, getErrorMessage } from '../../api/client'
import type { Project, StatusProject, Struktur } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Spinner } from '../../components/ui/Spinner'
import { Textarea } from '../../components/ui/Textarea'

interface ProjectForm {
  nama_project: string
  author_id: string
  deskripsi: string
  status: StatusProject
  tgl_dibuat: string
  file_gambar: File | null
}

const emptyForm: ProjectForm = {
  nama_project: '',
  author_id: '',
  deskripsi: '',
  status: 'unpublish',
  tgl_dibuat: '',
  file_gambar: null,
}

export function ProjectPage() {
  const [items, setItems] = useState<Project[]>([])
  const [members, setMembers] = useState<Struktur[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState<ProjectForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [success, setSuccess] = useState<string | null>(null)
  const [existingCover, setExistingCover] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const resetMessages = () => {
    setError(null)
    setFieldErrors({})
    setSuccess(null)
  }

  const load = () => {
    project
      .get()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err, 'Gagal memuat data project.')))
  }

  useEffect(() => {
    // Daftar anggota dimuat bersamaan karena form author butuh pilihan.
    Promise.all([project.get(), struktur.get()])
      .then(([data, memberData]) => {
        setItems(data)
        setMembers(memberData)
      })
      .catch((err) => setError(getErrorMessage(err, 'Gagal memuat data project.')))
      .finally(() => setLoading(false))
  }, [])

  const resetCover = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setExistingCover(null)
  }

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    resetCover()
    resetMessages()
    setModalOpen(true)
  }

  const openEdit = (item: Project) => {
    setEditing(item)
    setForm({
      nama_project: item.nama_project,
      author_id: item.author ? String(item.author.id) : '',
      deskripsi: item.deskripsi,
      status: item.status,
      tgl_dibuat: item.tgl_dibuat ?? '',
      file_gambar: null,
    })
    resetCover()
    setExistingCover(item.dokumentasi[0]?.file_gambar_url ?? null)
    resetMessages()
    setModalOpen(true)
  }

  const handleDelete = async (item: Project) => {
    if (!window.confirm(`Hapus project "${item.nama_project}"?`)) return

    try {
      await project.remove(item.id)
      setSuccess('Project berhasil dihapus.')
      setError(null)
      load()
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus project.'))
    }
  }

  const updateField = (name: keyof ProjectForm, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCoverChange = (file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
    setForm((prev) => ({ ...prev, file_gambar: file }))
  }

  const buildFormData = (): FormData => {
    const data = new FormData()

    data.append('nama_project', form.nama_project)
    data.append('deskripsi', form.deskripsi)
    data.append('status', form.status)

    if (form.author_id) data.append('author_id', form.author_id)

    if (form.tgl_dibuat) data.append('tgl_dibuat', form.tgl_dibuat)

    if (form.file_gambar) {
      data.append('dokumentasi[0][file_gambar]', form.file_gambar)
    }

    return data
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    resetMessages()

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
      resetCover()
      load()
    } catch (err) {
      setFieldErrors(getErrorFields(err))
      setError(getErrorMessage(err, 'Gagal menyimpan project.'))
    } finally {
      setSaving(false)
    }
  }

  const coverSrc = previewUrl ?? existingCover

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-stone-900">Project</h1>
          <p className="mt-1 text-sm text-stone-500">
            Kelola project beserta sampul dan detailnya.
          </p>
        </div>
        <Button onClick={openCreate}>Tambah</Button>
      </div>

      <Alert variant="success" message={success} />
      {!modalOpen && <Alert variant="error" message={error} />}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500">
          Belum ada project.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-4 py-3">Sampul</th>
                <th className="px-4 py-3">Nama Project</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    {item.dokumentasi[0]?.file_gambar_url ? (
                      <img
                        src={item.dokumentasi[0].file_gambar_url}
                        alt=""
                        className="h-10 w-14 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded bg-stone-100 text-[10px] text-stone-400">
                        -
                      </div>
                    )}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-stone-800">
                    {item.nama_project}
                  </td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-stone-600">
                    {item.author?.nama ?? '-'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={item.status === 'publish' ? 'green' : 'amber'}>
                      {item.status === 'publish' ? 'Publish' : 'Unpublish'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {item.tgl_dibuat ?? '-'}
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
        onClose={() => {
          resetCover()
          setModalOpen(false)
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert variant="error" message={error} />
          <Input
            id="nama_project"
            label="Nama Project"
            value={form.nama_project}
            onChange={(e) => updateField('nama_project', e.target.value)}
            error={fieldErrors.nama_project?.[0]}
            required
          />
          <Select
            id="author_id"
            label="Author"
            value={form.author_id}
            onChange={(e) => updateField('author_id', e.target.value)}
            error={fieldErrors.author_id?.[0]}
            options={[
              { value: '', label: '— Tanpa author —' },
              ...members.map((member) => ({
                value: String(member.id),
                label: `${member.nama} (${member.jabatan})`,
              })),
            ]}
          />
          <Textarea
            id="deskripsi"
            label="Deskripsi"
            rows={4}
            value={form.deskripsi}
            onChange={(e) => updateField('deskripsi', e.target.value)}
            error={fieldErrors.deskripsi?.[0]}
            required
          />
          <Select
            id="status"
            label="Status"
            value={form.status}
            onChange={(e) => updateField('status', e.target.value as StatusProject)}
            error={fieldErrors.status?.[0]}
            options={[
              { value: 'publish', label: 'Publish' },
              { value: 'unpublish', label: 'Unpublish' },
            ]}
          />
          <Input
            id="tgl_dibuat"
            label="Tanggal Dibuat"
            type="date"
            value={form.tgl_dibuat}
            onChange={(e) => updateField('tgl_dibuat', e.target.value)}
            error={fieldErrors.tgl_dibuat?.[0]}
          />

          <Input
            id="file_gambar"
            label="Gambar Sampul"
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => handleCoverChange(e.target.files?.[0] ?? null)}
            error={fieldErrors['dokumentasi.0.file_gambar']?.[0]}
          />

          {coverSrc && (
            <div className="rounded-lg border border-stone-200 p-2">
              <img
                src={coverSrc}
                alt={editing ? 'Sampul project saat ini' : 'Pratinjau sampul'}
                className="h-28 w-full rounded object-cover"
              />
              {!previewUrl && existingCover && (
                <p className="mt-1 text-xs text-stone-500">
                  Sampul saat ini. Pilih file baru untuk menggantinya.
                </p>
              )}
            </div>
          )}

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