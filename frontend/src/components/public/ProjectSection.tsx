import type { Project } from '../../types'
import { Badge } from '../ui/Badge'
import { SectionContainer, SectionHeading } from './SectionHeading'

interface ProjectSectionProps {
  project: Project[]
}

const statusMeta: Record<string, { label: string; variant: 'amber' | 'green' }> = {
  berjalan: { label: 'Berjalan', variant: 'amber' },
  selesai: { label: 'Selesai', variant: 'green' },
}

export function ProjectSection({ project }: ProjectSectionProps) {
  return (
    <SectionContainer id="project" className="bg-slate-50">
      <SectionHeading
        eyebrow="Project"
        title="Project Kami"
        description="Kumpulan project yang sedang berjalan maupun telah diselesaikan."
      />

      {project.length === 0 ? (
        <p className="mt-12 text-center text-sm text-slate-500">
          Belum ada project.
        </p>
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {project.map((item) => {
            const status = statusMeta[item.status] ?? statusMeta.selesai

            return (
              <article
                key={item.id}
                className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-slate-900">{item.nama_project}</h3>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                  {item.deskripsi}
                </p>

                <p className="mt-4 text-xs text-slate-400">
                  {item.tgl_mulai ?? '-'} — {item.tgl_selesai ?? 'Saat ini'}
                </p>

                {item.dokumentasi.length > 0 && (
                  <div className="mt-5 grid grid-cols-5 gap-3 border-t border-slate-100 pt-5">
                    {item.dokumentasi.map((dok) => (
                      <figure key={dok.id} className="text-center">
                        {dok.file_gambar_url && (
                          <img
                            src={dok.file_gambar_url}
                            alt={dok.keterangan ?? item.nama_project}
                            className="h-16 w-full rounded-lg object-cover"
                          />
                        )}
                        {dok.keterangan && (
                          <figcaption className="mt-1 line-clamp-2 text-[10px] text-slate-400">
                            {dok.keterangan}
                          </figcaption>
                        )}
                      </figure>
                    ))}
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