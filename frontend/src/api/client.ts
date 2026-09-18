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

export default client
