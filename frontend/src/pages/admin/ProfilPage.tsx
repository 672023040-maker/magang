import { useEffect, useState, type FormEvent } from 'react'
import { profil } from '../../api'
import type { Profil } from '../../types'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { Textarea } from '../../components/ui/Textarea'

const initialForm = {
  tentang_kami: '',
  visi: '',
  misi: '',
  nilai: '',
}

export function ProfilPage() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    profil
      .get()
      .then((data: Profil | null) => {
        if (data) {
          setForm({
            tentang_kami: data.tentang_kami,
            visi: data.visi,
            misi: data.misi,
            nilai: data.nilai,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      setSaving(true)
      await profil.update(form)
      setSuccess('Profil berhasil disimpan.')
    } catch {
      setError('Gagal menyimpan profil.')
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
          Kelola konten Tentang Kami, Visi, Misi, dan Nilai.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-stone-200 bg-white p-6"
      >
        <Textarea
          id="tentang_kami"
          label="Tentang Kami"
          name="tentang_kami"
          rows={4}
          value={form.tentang_kami}
          onChange={handleChange}
          required
        />
        <Textarea
          id="visi"
          label="Visi"
          name="visi"
          rows={3}
          value={form.visi}
          onChange={handleChange}
          required
        />
        <Textarea
          id="misi"
          label="Misi"
          name="misi"
          rows={4}
          value={form.misi}
          onChange={handleChange}
          required
        />
        <Textarea
          id="nilai"
          label="Nilai"
          name="nilai"
          rows={3}
          value={form.nilai}
          onChange={handleChange}
          required
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