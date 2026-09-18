import { createContext } from 'react'
import type { Admin } from '../types'

/**
 * AuthContext tidak pernah menyentuh localStorage. Session admin hidup di
 * cookie HttpOnly session (di-set backend saat login). me() dipanggil sekali
 * saat app dimuat untuk me-restore session tanpa token apa pun di client.
 */
export interface AuthContextValue {
  admin: Admin | null
  loading: boolean
  login: (username: string, password: string) => Promise<Admin>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
