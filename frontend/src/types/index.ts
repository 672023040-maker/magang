export interface Profil {
  id: number
  tentang_kami: string
  visi: string
  misi: string
  nilai: string
}

export interface Divisi {
  id: number
  struktur_organisasi_id: number
  nama_divisi: string
  deskripsi: string
}

export interface Struktur {
  id: number
  nama: string
  jabatan: string
  instagram: string | null
  email: string | null
  foto_url: string | null
  divisi: Divisi[]
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
}

export interface LoginResponse {
  message: string
  token: string
  admin: Admin
}

export interface ApiResponse<T> {
  message?: string
  data: T
}