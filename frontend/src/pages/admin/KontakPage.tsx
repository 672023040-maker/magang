import { useEffect, useState, type FormEvent } from 'react'
import { kontak } from '../../api'
import type { Kontak } from '../../types'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'

interface KontakForm {
  email: string
}

const emptyForm: KontakForm = {
  email: '',
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
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      setSaving(true)

      if (current) {
        await kontak.update(current.id, { email: form.email })
        setSuccess('Kontak berhasil diperbarui.')
      } else {
        await kontak.create({ email: form.email })
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
        <h1 className="font-display text-2xl font-medium text-stone-900">Kontak</h1>
        <p className="mt-1 text-sm text-stone-500">
          Kelola informasi kontak.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-stone-200 bg-white p-6"
      >
        <Input
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ email: e.target.value })}
          required
        />

        <Alert variant="success" message={success} />
        <Alert variant="error" message={error} />

        <Button type="submit" loading={saving}>
          Simpan Kontak
        </Button>
      </form>
    </div>
  )
}