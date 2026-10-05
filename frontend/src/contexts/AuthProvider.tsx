import { useEffect, useState, type ReactNode } from 'react'
import { auth } from '../api'
import { SESSION_EXPIRED_EVENT } from '../api/client'
import type { Admin } from '../types'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  // Server membalas 401 saat session sudah tidak berlaku. Tanpa ini admin tetap
  // tertahan di halaman yang sedang dibuka dengan tombol yang tidak akan pernah
  // berhasil — kosongkan state supaya AuthGuard mengarahkan ke halaman login.
  useEffect(() => {
    const onExpired = () => setAdmin(null)

    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)

    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
  }, [])

  // Session disimpan backend sebagai cookie HttpOnly. Tidak ada token yang
  // perlu disimpan di localStorage — browser otomatis mengirim cookie session
  // + header X-XSRF-TOKEN (dibaca axios dari cookie XSRF-TOKEN).
  useEffect(() => {
    let mounted = true

    auth
      .me()
      .then((adminData) => {
        if (mounted) setAdmin(adminData)
      })
      .catch(() => {
        // Cookie HttpOnly kosong / session kedaluwarsa — admin tetap null.
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const login = async (username: string, password: string) => {
    const res = await auth.login(username, password)

    setAdmin(res.admin)

    return res.admin
  }

  const refresh = async () => {
    const adminData = await auth.me()

    setAdmin(adminData)

    return adminData
  }

  const logout = async () => {
    try {
      await auth.logout()
    } finally {
      setAdmin(null)
    }
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
