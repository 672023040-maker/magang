import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { password } from '../../api'
import { useAuth } from '../../hooks/useAuth'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

/**
 * Wajib tampil setelah admin login dengan must_change_password = true.
 * Backend juga memblokir pemakaian password yang pernah dipakai (history 5)
 * dan mewajibkan konfirmasi password lama.
 */
export function ChangePasswordPage() {
  const { refresh } = useAuth()
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (newPassword !== confirm) {
      setError('Konfirmasi password baru tidak sama.')
      return
    }

    try {
      setSubmitting(true)
      await password.change({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirm,
      })
      setSuccess('Password berhasil diganti. Gunakan password baru pada sesi berikutnya.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirm('')

      await refresh()
      navigate('/admin', { replace: true })
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? 'Gagal mengganti password. Silakan coba lagi.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-stone-900">
          Ganti Password
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Minimal 12 karakter dengan huruf besar, huruf kecil, angka, dan
          simbol. Password lama tidak boleh digunakan kembali.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-stone-200 bg-white p-6"
      >
        <Input
          id="current_password"
          label="Password Lama"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <Input
          id="new_password"
          label="Password Baru"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <Input
          id="confirm_password"
          label="Konfirmasi Password Baru"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
        />

        <Alert variant="error" message={error} />
        <Alert variant="success" message={success} />

        <Button type="submit" loading={submitting}>
          Simpan Password Baru
        </Button>
      </form>
    </div>
  )
}
