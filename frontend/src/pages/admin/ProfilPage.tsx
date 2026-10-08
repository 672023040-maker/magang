import { useEffect, useState, type FormEvent } from 'react'
import { profil } from '../../api'
import { getErrorFields, getErrorMessage } from '../../api/client'
import type { Profil } from '../../types'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Checkbox } from '../../components/ui/Checkbox'
import { Spinner } from '../../components/ui/Spinner'
import { Textarea } from '../../components/ui/Textarea'

const initialForm = {
  visi: '',
  misi: '',
  tujuan: '',
  visi_bulat: false,
  misi_bulat: false,
  tujuan_bulat: false,
}

export function ProfilPage() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    profil
      .get()
      .then((data: Profil | null) => {
        if (data) {
          setForm({
            visi: data.visi,
            misi: data.misi,
            tujuan: data.tujuan,
            visi_bulat: data.visi_bulat,
            misi_bulat: data.misi_bulat,
            tujuan_bulat: data.tujuan_bulat,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name } = event.target
    const isCheckbox = event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
    const value = isCheckbox
      ? (event.target as HTMLInputElement).checked
      : event.target.value
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    setSuccess(null)

    try {
      setSaving(true)
      await profil.update(form)
      setSuccess('Profil berhasil disimpan.')
    } catch (err) {
      setFieldErrors(getErrorFields(err))
      setError(getErrorMessage(err, 'Gagal menyimpan profil.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-stone-900">Halaman Profil</h1>
        <p className="mt-1 text-sm text-stone-500">
          Kelola konten Visi, Misi, dan Tujuan.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-stone-300 bg-white p-6"
      >
        <Textarea
          id="visi"
          label="Visi"
          name="visi"
          rows={3}
          value={form.visi}
          onChange={handleChange}
          error={fieldErrors.visi?.[0]}
          required
        />
        <Checkbox
          id="visi_bulat"
          name="visi_bulat"
          checked={form.visi_bulat}
          onChange={handleChange}
          label="Tampilkan Visi sebagai poin/daftar"
          hint="Aktif: tulis satu poin per baris."
        />
        <Textarea
          id="misi"
          label="Misi"
          name="misi"
          rows={4}
          value={form.misi}
          onChange={handleChange}
          error={fieldErrors.misi?.[0]}
          required
        />
        <Checkbox
          id="misi_bulat"
          name="misi_bulat"
          checked={form.misi_bulat}
          onChange={handleChange}
          label="Tampilkan Misi sebagai poin/daftar"
          hint="Aktif: tulis satu poin per baris."
        />
        <Textarea
          id="tujuan"
          label="Tujuan"
          name="tujuan"
          rows={3}
          value={form.tujuan}
          onChange={handleChange}
          error={fieldErrors.tujuan?.[0]}
          required
        />
        <Checkbox
          id="tujuan_bulat"
          name="tujuan_bulat"
          checked={form.tujuan_bulat}
          onChange={handleChange}
          label="Tampilkan Tujuan sebagai poin/daftar"
          hint="Aktif: tulis satu poin per baris."
        />

        <Alert variant="success" message={success} />
        <Alert variant="error" message={error} />

        <Button type="submit" loading={saving}>
          Simpan Profil
        </Button>
      </form>
    </div>
  )
}