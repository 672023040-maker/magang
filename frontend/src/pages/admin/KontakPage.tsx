import { useEffect, useState, type FormEvent } from 'react'
import { kontak } from '../../api'
import type { Kontak } from '../../types'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'
import { Textarea } from '../../components/ui/Textarea'

interface SosmedForm {
  platform: string
  url: string
}

interface KontakForm {
  email: string
  phone: string
  alamat: string
  sosial_media: SosmedForm[]
}

const emptySosmed: SosmedForm = { platform: '', url: '' }

const emptyForm: KontakForm = {
  email: '',
  phone: '',
  alamat: '',
  sosial_media: [],
}

export function KontakPage() {
  const [current, setCurrent] = useState<Kontak | null>(null)
  const [form, setForm] = useState<KontakForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    kontak
      .get()
      .then((data: Kontak | null) => {
        if (data) {
          setCurrent(data)
          setForm({
            email: data.email,
            phone: data.phone,
            alamat: data.alamat,
            sosial_media: data.sosial_media.map((s) => ({
              platform: s.platform,
              url: s.url,
            })),
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const updateField = (name: keyof Omit<KontakForm, 'sosial_media'>, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const updateSosmed = (index: number, field: keyof SosmedForm, value: string) => {
    setForm((prev) => {
      const sosial_media = [...prev.sosial_media]
      sosial_media[index] = { ...sosial_media[index], [field]: value }
      return { ...prev, sosial_media }
    })
  }

  const addSosmed = () => {
    setForm((prev) => ({
      ...prev,
      sosial_media: [...prev.sosial_media, { ...emptySosmed }],
    }))
  }

  const removeSosmed = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sosial_media: prev.sosial_media.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const payload = {
      email: form.email,
      phone: form.phone,
      alamat: form.alamat,
      sosial_media: form.sosial_media,
    }

    try {
      setSaving(true)

      if (current) {
        await kontak.update(current.id, payload)
        setSuccess('Kontak berhasil diperbarui.')
      } else {
        await kontak.create(payload)
        setSuccess('Kontak berhasil disimpan.')
      }
    } catch {
      setError('Gagal menyimpan kontak.')
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
        <h1 className="text-2xl font-bold text-slate-900">Kontak</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola informasi kontak dan sosial media.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            required
          />
          <Input
            id="phone"
            label="Telepon"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            required
          />
        </div>

        <Textarea
          id="alamat"
          label="Alamat"
          rows={3}
          value={form.alamat}
          onChange={(e) => updateField('alamat', e.target.value)}
          required
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Sosial Media</p>
            <button
              type="button"
              onClick={addSosmed}
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              + Tambah Sosial Media
            </button>
          </div>

          {form.sosial_media.map((sosmed, index) => (
            <div key={index} className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[1fr_2fr_auto]">
              <Input
                id={`sosmed-platform-${index}`}
                label="Platform"
                value={sosmed.platform}
                onChange={(e) => updateSosmed(index, 'platform', e.target.value)}
                required
              />
              <Input
                id={`sosmed-url-${index}`}
                label="URL"
                type="url"
                value={sosmed.url}
                onChange={(e) => updateSosmed(index, 'url', e.target.value)}
                required
              />
              <div className="flex items-end justify-end pb-1">
                <button
                  type="button"
                  onClick={() => removeSosmed(index)}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
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