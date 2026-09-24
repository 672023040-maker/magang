export interface Profil {
  id: number
  visi: string
  misi: string
  tujuan: string
}

export interface Struktur {
  id: number
  nama: string
  jabatan: string
  email: string | null
  foto_url: string | null
}

export interface Dokumentasi {
  id: number
  project_id: number
  file_gambar_url: string | null
  keterangan: string | null
}

export type StatusProject = 'berjalan' | 'selesai'

export interface Project {
  id: number
  nama_project: string
  deskripsi: string
  status: StatusProject
  tgl_dibuat: string | null
  dokumentasi: Dokumentasi[]
}

export interface Kontak {
  id: number
  email: string
}

export interface Admin {
  id: number
  username: string
  nama: string
  role: string
  must_change_password: boolean
}

export interface LoginResponse {
  message: string
  admin: Admin
}

export interface AdminSessions {
  id: number
  current: boolean
  ip_address: string | null
  user_agent: string | null
  last_active_at: string | null
  login_at: string | null
  expires_at: string | null
  revoked_at: string | null
}

export interface PasswordChangePayload {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export interface ApiResponse<T> {
  message?: string
  data: T
}