import { useEffect, useState, type FormEvent } from 'react'
import { kontak } from '../../api'
import { getErrorFields, getErrorMessage } from '../../api/client'
import type { Kontak } from '../../types'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'

interface KontakForm {
  email: string
  jam_buka: string
  jam_tutup: string
  hari_operasional: string
  lokasi: string
}

const emptyForm: KontakForm = {
  email: '',
  jam_buka: '',
  jam_tutup: '',
  hari_operasional: '',
  lokasi: '',
}

export function KontakPage() {
  const [current, setCurrent] = useState<Kontak | null>(null)
  const [form, setForm] = useState<KontakForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    kontak
      .get()
      .then((data: Kontak | null) => {
        if (data) {
          setCurrent(data)
          setForm({
            email: data.email,
            jam_buka: data.jam_buka ?? '',
            jam_tutup: data.jam_tutup ?? '',
            hari_operasional: data.hari_operasional ?? '',
            lokasi: data.lokasi ?? '',
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    setSuccess(null)

    try {
      setSaving(true)

      if (current) {
        await kontak.update(current.id, form)
        setSuccess('Kontak berhasil diperbarui.')
      } else {
        await kontak.create(form)
        setSuccess('Kontak berhasil disimpan.')
      }
    } catch (err) {
      setFieldErrors(getErrorFields(err))
      setError(getErrorMessage(err, 'Gagal menyimpan kontak.'))
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
        <h1 className="font-display text-2xl font-medium text-stone-900">Kontak</h1>
        <p className="mt-1 text-sm text-stone-500">
          Kelola informasi kontak.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-stone-300 bg-white p-6"
      >
        <Input
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={fieldErrors.email?.[0]}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="jam_buka"
            label="Jam Buka"
            placeholder="07.30"
            value={form.jam_buka}
            onChange={(e) => setForm({ ...form, jam_buka: e.target.value })}
            error={fieldErrors.jam_buka?.[0]}
          />
          <Input
            id="jam_tutup"
            label="Jam Tutup"
            placeholder="16.00"
            value={form.jam_tutup}
            onChange={(e) => setForm({ ...form, jam_tutup: e.target.value })}
            error={fieldErrors.jam_tutup?.[0]}
          />
        </div>

        <Input
          id="hari_operasional"
          label="Hari Operasional"
          placeholder="Senin - Jumat"
          value={form.hari_operasional}
          onChange={(e) => setForm({ ...form, hari_operasional: e.target.value })}
          error={fieldErrors.hari_operasional?.[0]}
        />

        <div>
          <label
            htmlFor="lokasi"
            className="block text-sm font-medium text-stone-700"
          >
            Lokasi
          </label>
          <textarea
            id="lokasi"
            className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 border-stone-300"
            rows={4}
            value={form.lokasi}
            onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
            placeholder="Kampus Diponegoro&#10;Belakang Gedung F&#10;Jl. Diponegoro No. 52 - 60, Salatiga, Indonesia"
          />
          {fieldErrors.lokasi?.[0] && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.lokasi[0]}</p>
          )}
        </div>

        <Alert variant="success" message={success} />
        <Alert variant="error" message={error} />

        <Button type="submit" loading={saving}>
          Simpan Kontak
        </Button>
      </form>
    </div>
  )
}