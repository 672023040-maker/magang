import { useState, type FormEvent } from 'react'
import { pesanKontak } from '../../api'
import type { Kontak } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Alert } from '../ui/Alert'
import { SectionContainer, SectionHeading } from './SectionHeading'

interface KontakSectionProps {
  kontak: Kontak | null
}

const initialForm = {
  nama_pengirim: '',
  email: '',
  subjek: '',
  pesan: '',
}

export function KontakSection({ kontak }: KontakSectionProps) {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      setSubmitting(true)
      await pesanKontak.kirim(form)
      setSuccess('Pesan Anda berhasil dikirim. Terima kasih!')
      setForm(initialForm)
    } catch {
      setError('Gagal mengirim pesan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SectionContainer id="kontak" className="bg-white">
      <SectionHeading
        eyebrow="Kontak"
        title="Hubungi Kami"
        description="Punya pertanyaan? Kirimkan pesan melalui formulir di bawah ini."
      />

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Informasi Kontak</h3>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-slate-500">Email</dt>
              <dd className="mt-0.5 text-slate-800">{kontak?.email ?? '-'}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Telepon</dt>
              <dd className="mt-0.5 text-slate-800">{kontak?.phone ?? '-'}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Alamat</dt>
              <dd className="mt-0.5 text-slate-800">{kontak?.alamat ?? '-'}</dd>
            </div>
          </dl>

          {kontak && kontak.sosial_media.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-3">
              {kontak.sosial_media.map((sosmed) => (
                <li key={sosmed.id}>
                  <a
                    href={sosmed.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-600"
                  >
                    {sosmed.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="nama"
              label="Nama"
              name="nama_pengirim"
              value={form.nama_pengirim}
              onChange={handleChange}
              required
            />
            <Input
              id="email"
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            id="subjek"
            label="Subjek"
            name="subjek"
            value={form.subjek}
            onChange={handleChange}
            required
          />

          <Textarea
            id="pesan"
            label="Pesan"
            name="pesan"
            rows={5}
            value={form.pesan}
            onChange={handleChange}
            required
          />

          <Alert variant="success" message={success} />
          <Alert variant="error" message={error} />

          <Button type="submit" loading={submitting}>
            Kirim Pesan
          </Button>
        </form>
      </div>
    </SectionContainer>
  )
}