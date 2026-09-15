import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pesanKontak, project, struktur } from '../../api'
import type { PesanKontak, Project, Struktur } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'

export function DashboardPage() {
  const [stats, setStats] = useState({
    struktur: 0,
    project: 0,
    pesanBaru: 0,
  })

  const [projectTerbaru, setProjectTerbaru] = useState<Project[]>([])
  const [pesanTerbaru, setPesanTerbaru] = useState<PesanKontak[]>([])
  const [strukturLoading, setStrukturLoading] = useState(true)
  const [pesanLoading, setPesanLoading] = useState(true)

  useEffect(() => {
    struktur
      .get()
      .then((data: Struktur[]) =>
        setStats((prev) => ({ ...prev, struktur: data.length })),
      )
      .finally(() => setStrukturLoading(false))

    project.get().then((data: Project[]) => {
      setProjectTerbaru(data.slice(0, 3))
      setStats((prev) => ({ ...prev, project: data.length }))
    })

    pesanKontak
      .get()
      .then((data: PesanKontak[]) => {
        setStats((prev) => ({ ...prev, pesanBaru: data.length }))
        setPesanTerbaru(data.slice(0, 3))
      })
      .finally(() => setPesanLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan konten website DIGIFIN.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Struktur Organisasi</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {stats.struktur}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Project</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{stats.project}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Pesan Masuk</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {stats.pesanBaru}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Project Terbaru</h2>
          {strukturLoading ? (
            <div className="mt-4 flex justify-center">
              <Spinner />
            </div>
          ) : projectTerbaru.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Belum ada project.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {projectTerbaru.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {item.nama_project}
                  </span>
                  <Badge
                    variant={item.status === 'selesai' ? 'green' : 'amber'}
                  >
                    {item.status === 'selesai' ? 'Selesai' : 'Berjalan'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Pesan Terbaru</h2>
            <Link
              to="/admin/pesan"
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Lihat Semua
            </Link>
          </div>

          {pesanLoading ? (
            <div className="mt-4 flex justify-center">
              <Spinner />
            </div>
          ) : pesanTerbaru.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Belum ada pesan.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pesanTerbaru.map((pesan) => (
                <li key={pesan.id}>
                  <p className="text-sm font-medium text-slate-800">
                    {pesan.subjek}
                  </p>
                  <p className="text-xs text-slate-500">
                    {pesan.nama_pengirim} — {pesan.tanggal}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}