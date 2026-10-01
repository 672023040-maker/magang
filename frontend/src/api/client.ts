import axios from 'axios'

// Semua request memakai HttpOnly cookie session (di-handle browser) + header
// X-XSRF-TOKEN yang otomatis dibaca axios dari cookie XSRF-TOKEN. JANGAN pernah
// menyimpan token di localStorage — taruh di cookie HttpOnly oleh backend.
const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

// Instance khusus bootstrapping CSRF. Route Sanctum berada di root `/sanctum/...`
// (BUKAN di bawah `/api`), jadi instance ini TIDAK boleh memakai baseURL '/api' —
// kalau dipakai, request jadi `/api/sanctum/csrf-cookie` → 404.
export const csrfClient = axios.create({
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

interface ApiErrorPayload {
  message?: string
  errors?: Record<string, string[] | string>
}

function readPayload(err: unknown): ApiErrorPayload | undefined {
  const data = (err as { response?: { data?: unknown } })?.response?.data

  if (!data || typeof data !== 'object') return undefined

  return data as ApiErrorPayload
}

export function getErrorFields(err: unknown): Record<string, string[]> {
  const errors = readPayload(err)?.errors

  if (!errors || typeof errors !== 'object') return {}

  const result: Record<string, string[]> = {}

  for (const [field, value] of Object.entries(errors)) {
    const messages = Array.isArray(value) ? value : [value]
    result[field] = messages.filter((item): item is string => typeof item === 'string')
  }

  return result
}

export function getErrorMessage(err: unknown, fallback: string): string {
  const payload = readPayload(err)

  if (payload?.message) return payload.message

  const fields = getErrorFields(err)
  const first = Object.values(fields)[0]?.[0]

  return first ?? fallback
}

export default client
