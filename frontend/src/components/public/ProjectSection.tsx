import type { Project } from '../../types'
import { SectionContainer, SectionHeading } from './SectionHeading'

interface ProjectSectionProps {
  project: Project[]
}

const statusStyle: Record<string, { label: string; badge: string }> = {
  berjalan: {
    label: 'Berjalan',
    badge: 'bg-amber-100 text-amber-800',
  },
  selesai: {
    label: 'Selesai',
    badge: 'bg-emerald-100 text-emerald-800',
  },
}

export function ProjectSection({ project }: ProjectSectionProps) {
  return (
    <SectionContainer id="project" className="bg-stone-50">
      <SectionHeading
        index="04"
        title="Project dan Dokumentasinya"
        description="Project yang pernah dan sedang dikerjakan sepanjang perjalanan DIGFIN."
      />

      {project.length === 0 ? (
        <p className="mt-12 text-sm text-stone-500">Belum ada project.</p>
      ) : (
        <div className="mt-12 space-y-6">
          {project.map((item) => {
            const status = statusStyle[item.status] ?? statusStyle.selesai

            return (
              <article
                key={item.id}
                className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h3 className="font-display text-xl font-medium text-stone-900">
                    {item.nama_project}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${status.badge}`}
                  >
                    {status.label}
                  </span>
                </div>

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-600">
                  {item.deskripsi}
                </p>

                <p className="mt-4 text-xs text-stone-400">
                  Periode: {item.tgl_mulai ?? '-'} — {item.tgl_selesai ?? 'saat ini'}
                </p>

                {item.dokumentasi.length > 0 && (
                  <div className="mt-5 border-t border-stone-200 pt-5">
                    {item.dokumentasi.length === 1 ? (
                      (() => {
                        const dok = item.dokumentasi[0]
                        return (
                          <figure className="max-w-sm">
                            {dok.file_gambar_url && (
                              <img
                                src={dok.file_gambar_url}
                                alt={dok.keterangan ?? item.nama_project}
                                className="w-full rounded-lg object-cover"
                              />
                            )}
                            {dok.keterangan && (
                              <figcaption className="mt-2 text-xs text-stone-500">
                                {dok.keterangan}
                              </figcaption>
                            )}
                          </figure>
                        )
                      })()
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                        {item.dokumentasi.map((dok) => (
                          <figure key={dok.id}>
                            {dok.file_gambar_url && (
                              <img
                                src={dok.file_gambar_url}
                                alt={dok.keterangan ?? item.nama_project}
                                className="h-20 w-full rounded-lg object-cover"
                              />
                            )}
                            {dok.keterangan && (
                              <figcaption className="mt-1 line-clamp-2 text-[11px] text-stone-400">
                                {dok.keterangan}
                              </figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </SectionContainer>
  )
}