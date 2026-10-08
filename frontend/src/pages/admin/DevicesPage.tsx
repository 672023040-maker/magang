import { useEffect, useState } from 'react'
import { devices } from '../../api'
import { getErrorMessage } from '../../api/client'
import type { AdminSessions } from '../../types'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'

interface GroupedDevice {
  ip: string
  sessions: AdminSessions[]
  platform: string
  latestLogin: string | null
  lastActive: string | null
  isCurrent: boolean
}

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

function formatRelativeTime(iso: string | null): string {
  if (!iso) return '—'

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays < 7) return `${diffDays} hari lalu`

  return formatWaktu(iso)
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

function DeviceIcon({ current }: { current: boolean }) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {current ? (
        <>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </>
      ) : (
        <>
          <rect x="5" y="4" width="14" height="11" rx="2" />
          <path d="M9 19h6M11 15v4M7 15v4" />
        </>
      )}
    </svg>
  )
}

function groupSessionsByIP(sessions: AdminSessions[]): GroupedDevice[] {
  const groups = new Map<string, AdminSessions[]>()

  for (const session of sessions) {
    const ip = session.ip_address ?? 'unknown'
    if (!groups.has(ip)) {
      groups.set(ip, [])
    }
    groups.get(ip)!.push(session)
  }

  return Array.from(groups.entries()).map(([ip, sessions]) => {
    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(b.login_at ?? 0).getTime() - new Date(a.login_at ?? 0).getTime()
    )

    const latestSession = sortedSessions[0]
    // const currentSession = sessions.find(s => s.current) // reserved for future use
    const lastActiveSession = [...sessions].sort(
      (a, b) => new Date(b.last_active_at ?? 0).getTime() - new Date(a.last_active_at ?? 0).getTime()
    )[0]

    return {
      ip,
      sessions: sortedSessions,
      platform: platformDariUA(latestSession.user_agent),
      latestLogin: latestSession.login_at,
      lastActive: lastActiveSession.last_active_at,
      isCurrent: sessions.some(s => s.current),
    }
  })
}

export function DevicesPage() {
  const [allSessions, setAllSessions] = useState<AdminSessions[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyIp, setBusyIp] = useState<string | null>(null)
  const [expandedIp, setExpandedIp] = useState<string | null>(null)

  const groupedDevices = groupSessionsByIP(allSessions)

  const load = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await devices.list()
      setAllSessions(data)
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat daftar perangkat.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    const fetchInitial = async () => {
      try {
        const data = await devices.list()
        if (!cancelled) setAllSessions(data)
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Gagal memuat daftar perangkat.'))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchInitial()

    return () => {
      cancelled = true
    }
  }, [])

  const handleRevokeIp = async (ip: string, sessionsToRevoke: AdminSessions[]) => {
    const hasCurrent = sessionsToRevoke.some(s => s.current)
    if (hasCurrent) return

    setBusyIp(ip)
    setError(null)

    try {
      for (const session of sessionsToRevoke) {
        await devices.revoke(session.id)
      }
      await load()
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mencabut perangkat.'))
    } finally {
      setBusyIp(null)
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
      setError(getErrorMessage(err, 'Gagal mencabut semua perangkat.'))
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
            Perangkat & Sesi
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Kelola perangkat yang sedang login ke panel. Sesi dengan IP sama
            digabungkan. Cabut sesi yang tidak Anda kenali.
          </p>
        </div>

        {allSessions.some((item) => !item.current) && (
          <Button variant="outline" onClick={handleRevokeAll}>
            Cabut Semua Perangkat Lain
          </Button>
        )}
      </div>

      <Alert variant="error" message={error} />

      {groupedDevices.length === 0 ? (
        <div className="rounded-xl border border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
          Belum ada sesi aktif.
        </div>
      ) : (
        <div className="divide-y divide-stone-300 overflow-hidden rounded-xl border border-stone-300 bg-white">
          {groupedDevices.map((device) => (
            <div key={device.ip} className="border-b border-stone-200 last:border-b-0">
              <button
                type="button"
                onClick={() =>
                  setExpandedIp((prev) => (prev === device.ip ? null : device.ip))
                }
                className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 hover:bg-stone-50 transition text-left"
                aria-expanded={expandedIp === device.ip}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
                    <DeviceIcon current={device.isCurrent} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-stone-900 truncate">
                        {device.platform}
                      </p>
                      {device.isCurrent && (
                        <Badge variant="blue">Perangkat ini</Badge>
                      )}
                      <Badge variant="amber">{device.sessions.length} sesi</Badge>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-stone-500">
                      IP <span className="font-mono">{device.ip}</span>
                      {' · '}Login {formatWaktu(device.latestLogin)}
                      {' · '}Aktif {formatRelativeTime(device.lastActive)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:ml-4">
                  <svg
                    className={`h-5 w-5 text-stone-400 transition-transform ${
                      expandedIp === device.ip ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>

                  {!device.isCurrent && device.sessions.some(s => !s.current) && (
                    <Button
                      variant="outline"
                      className="px-2 py-1 text-xs"
                      loading={busyIp === device.ip}
                      onClick={() => handleRevokeIp(device.ip, device.sessions.filter(s => !s.current))}
                    >
                      Cabut ({device.sessions.filter(s => !s.current).length})
                    </Button>
                  )}

                  {device.isCurrent && device.sessions.length === 1 && (
                    <span className="text-xs text-stone-400">Tidak bisa dicabut</span>
                  )}
                </div>
              </button>

              {expandedIp === device.ip && (
                <div className="bg-stone-50/50 px-4 pb-4 border-t border-stone-200 animate-fade-up">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {device.sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`rounded-lg border p-3 text-xs ${
                          session.current
                            ? 'border-brand-200 bg-brand-50/50'
                            : 'border-stone-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="font-medium text-stone-900">
                            Sesi #{session.id}
                          </span>
                          {session.current && (
<Badge variant="blue">
                            Ini
                          </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-stone-600">
                          <p>
                            <span className="font-medium text-stone-700">Login: </span>
                            {formatWaktu(session.login_at)}
                          </p>
                          <p>
                            <span className="font-medium text-stone-700">Terakhir: </span>
                            {formatRelativeTime(session.last_active_at)}
                          </p>
                          <p>
                            <span className="font-medium text-stone-700">Expires: </span>
                            {formatWaktu(session.expires_at)}
                          </p>
                          {session.ip_address && (
                            <p>
                              <span className="font-medium text-stone-700">IP: </span>
                              <span className="font-mono">{session.ip_address}</span>
                            </p>
                          )}
                        </div>
                        {!session.current && (
                          <Button
                            variant="outline"
                            className="px-2 py-1 text-xs w-full"
                            loading={busyIp === device.ip}
                            onClick={() => handleRevokeIp(device.ip, [session])}
                          >
                            Cabut sesi ini
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}