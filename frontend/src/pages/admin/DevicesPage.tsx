import { useEffect, useState } from 'react'
import { devices } from '../../api'
import type { AdminSessions } from '../../types'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'

function formatWaktu(iso: string | null): string {
  if (!iso) return '—'

  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function platformDariUA(userAgent: string | null): string {
  if (!userAgent) return 'Perangkat tidak dikenal'

  let platform = 'Perangkat'

  if (/Windows/i.test(userAgent)) platform = 'Windows'
  else if (/Macintosh|Mac OS X/i.test(userAgent)) platform = 'macOS'
  else if (/Android/i.test(userAgent)) platform = 'Android'
  else if (/iPhone|iPad/i.test(userAgent)) platform = 'iOS'
  else if (/Linux/i.test(userAgent)) platform = 'Linux'

  if (/Mobile/i.test(userAgent)) {
    platform = platform === 'Perangkat' ? 'Perangkat mobile' : `${platform} (mobile)`
  }

  if (/(Chrome|Edg|Firefox|Safari|Opera)/i.test(userAgent)) {
    const browser = /Edg/i.test(userAgent)
      ? 'Edge'
      : /Firefox/i.test(userAgent)
        ? 'Firefox'
        : /Opera|OPR/i.test(userAgent)
          ? 'Opera'
          : /Safari/i.test(userAgent)
            ? 'Safari'
            : 'Chrome'
    platform = `${platform} • ${browser}`
  }

  return platform
}

export function DevicesPage() {
  const [sessions, setSessions] = useState<AdminSessions[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await devices.list()
      setSessions(data)
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? 'Gagal memuat daftar perangkat.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const handleRevoke = async (id: number) => {
    const session = sessions.find((item) => item.id === id)

    if (session?.current) return

    setBusyId(id)
    setError(null)

    try {
      await devices.revoke(id)
      await load()
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? 'Gagal mencabut perangkat.'
      setError(message)
    } finally {
      setBusyId(null)
    }
  }

  const handleRevokeAll = async () => {
    const confirmed = window.confirm(
      'Cabut semua perangkat lain? Semua sesi selain perangkat ini akan di-logout.',
    )

    if (!confirmed) return

    setError(null)

    try {
      await devices.revokeAll()
      await load()
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? 'Gagal mencabut semua perangkat.'
      setError(message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-stone-900">
            Perangkat &amp; Sesi
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Kelola perangkat yang sedang login ke panel. Cabut sesi yang tidak
            Anda kenali.
          </p>
        </div>

        {sessions.some((item) => !item.current) && (
          <Button variant="outline" onClick={handleRevokeAll}>
            Cabut Semua Perangkat Lain
          </Button>
        )}
      </div>

      <Alert variant="error" message={error} />

      {sessions.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
          Belum ada sesi aktif.
        </div>
      ) : (
        <ul className="divide-y divide-stone-200 overflow-hidden rounded-xl border border-stone-200 bg-white">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-lg text-stone-500">
                  {session.current ? '🖥️' : '💻'}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-stone-900">
                      {platformDariUA(session.user_agent)}
                    </p>
                    {session.current && <Badge variant="blue">Perangkat ini</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
                    IP <span className="font-mono">{session.ip_address ?? '—'}</span>
                    {' · '}Login {formatWaktu(session.login_at)}
                  </p>
                </div>
              </div>

              {!session.current && (
                <Button
                  variant="outline"
                  loading={busyId === session.id}
                  onClick={() => handleRevoke(session.id)}
                >
                  Cabut
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
