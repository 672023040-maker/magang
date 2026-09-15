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
  foto_url: string | null
  divisi: Divisi[]
}

export type KategoriInformasi = 'berita' | 'artikel' | 'pengumuman'

export interface Informasi {
  id: number
  judul: string
  kategori: KategoriInformasi
  isi: string
  gambar_url: string | null
  tanggal: string
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
  tgl_mulai: string | null
  tgl_selesai: string | null
  dokumentasi: Dokumentasi[]
}

export interface SosialMedia {
  id: number
  kontak_id: number
  platform: string
  url: string
}

export interface Kontak {
  id: number
  email: string
  phone: string
  alamat: string
  sosial_media: SosialMedia[]
}

export interface PesanKontak {
  id: number
  nama_pengirim: string
  email: string
  subjek: string
  pesan: string
  tanggal: string
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