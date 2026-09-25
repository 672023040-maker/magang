import { useEffect, useState } from 'react'
import { project, struktur } from '../../api'
import type { Project, Struktur } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'

export function DashboardPage() {
  const [stats, setStats] = useState({
    struktur: 0,
    project: 0,
  })

  const [projectTerbaru, setProjectTerbaru] = useState<Project[]>([])
  const [strukturLoading, setStrukturLoading] = useState(true)

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
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-stone-900">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">
          Ringkasan konten website DIGFIN yang sudah masuk.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-200 border-t-4 border-t-brand-500 bg-white p-5">
          <p className="text-sm font-medium text-stone-500">Struktur Organisasi</p>
          <p className="mt-1 text-3xl font-bold text-stone-900">
            {stats.struktur}
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 border-t-4 border-t-accent-500 bg-white p-5">
          <p className="text-sm font-medium text-stone-500">Project</p>
          <p className="mt-1 text-3xl font-bold text-stone-900">{stats.project}</p>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-display text-lg font-medium text-stone-900">
          Project Terbaru
        </h2>
        {strukturLoading ? (
          <div className="mt-4 flex justify-center">
            <Spinner />
          </div>
        ) : projectTerbaru.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">Belum ada project.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {projectTerbaru.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700">
                  {item.nama_project}
                </span>
                <Badge
                  variant={item.status === 'publish' ? 'green' : 'amber'}
                >
                  {item.status === 'publish' ? 'Publish' : 'Unpublish'}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}