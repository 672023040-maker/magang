import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

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

/**
 * Disiarkan ke window saat server membalas 401 pada request yang bukan login.
 * AuthProvider mendengarkan event ini lalu mengosongkan state admin, sehingga
 * AuthGuard langsung mengarahkan ke halaman login.
 *
 * Dipakai event (bukan import AuthProvider) supaya tidak terjadi circular
 * import: contexts/AuthProvider sudah mengimpor api/ yang mengimpor client/.
 */
export const SESSION_EXPIRED_EVENT = 'digfin:session-expired'

type RetriableConfig = InternalAxiosRequestConfig & { __csrfRetried?: boolean }

function requestOf(error: unknown): RetriableConfig | undefined {
  return (error as AxiosError<unknown>)?.config as RetriableConfig | undefined
}

function statusOf(error: unknown): number | undefined {
  return (error as AxiosError<unknown>)?.response?.status
}

function isLoginRequest(config: RetriableConfig | undefined): boolean {
  const url = config?.url ?? ''

  return url.includes('/login')
}

// 419 = TokenMismatchException. Cookie XSRF-TOKEN bisa saja basi, mis. session
// di-regenerate di server sementara browser masih memegang token lama.
// Ambil cookie baru lalu ulangi request YANG SAMA persis satu kali.
client.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const config = requestOf(error)

    if (statusOf(error) === 419 && config && !config.__csrfRetried) {
      config.__csrfRetried = true

      try {
        await csrfClient.get('/sanctum/csrf-cookie')

        return client(config)
      } catch {
        // Cookie baru gagal diambil — biarkan error 419 asli yang.reject.
      }
    }

    // 401 pada request terautentikasi = session sudah tidak berlaku (kedaluwarsa
    // atau dicabut dari halaman Perangkat). Tanpa ini, user hanya melihat Alert
    // generik di halaman yang sedang dibuka dan tetap terkunci di sini.
    if (statusOf(error) === 401 && config && !isLoginRequest(config)) {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
    }

    return Promise.reject(error)
  },
)

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

/**
 * Pesan yang bisa ditindaklanjuti untuk status yang sebelumnya "bisu":
 * 419 diam-diam gagal, 429 tidak menjelaskan kenapa, dan 401 membuat user
 * mengira aksinya tidak berefek. Payload dari server tetap dipakai sebagai
 * prioritas utama selama tidak bertentangan dengan status di bawah.
 */
function describeStatus(err: unknown): string | null {
  const status = statusOf(err)
  const config = requestOf(err)

  if (status === 419) {
    return 'Token keamanan sudah kedaluwarsa. Muat ulang halaman lalu coba lagi.'
  }

  if (status === 429) {
    const retryAfter = (err as AxiosError<unknown>)?.response?.headers?.['retry-after']
    const seconds = Number(retryAfter)

    return Number.isFinite(seconds) && seconds > 0
      ? `Terlalu banyak permintaan. Coba lagi dalam ${Math.ceil(seconds)} detik.`
      : 'Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.'
  }

  // Jangan timpa pesan login yang memang sudah informatif.
  if (status === 401 && config && !isLoginRequest(config)) {
    return 'Sesi Anda sudah berakhir. Silakan login kembali.'
  }

  return null
}

export function getErrorMessage(err: unknown, fallback: string): string {
  const statusMessage = describeStatus(err)

  if (statusMessage) return statusMessage

  const payload = readPayload(err)

  if (payload?.message) return payload.message

  const fields = getErrorFields(err)
  const first = Object.values(fields)[0]?.[0]

  return first ?? fallback
}

export default client
