import { useState } from 'react'
import type { Project } from '../../types'

interface ProjectSectionProps {
  project: Project[]
}

const statusLabel: Record<Project['status'], string> = {
  berjalan: 'Berjalan',
  selesai: 'Selesai',
}

function formatDate(value: string | null): string | null {
  if (!value) return null

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)

  const coverDok = project.dokumentasi.find((d) => d.file_gambar_url)
  const cover = coverDok?.file_gambar_url
  const dibuat = formatDate(project.tgl_dibuat)

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-500/40 bg-black/60 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-500 ${
        open
          ? '-translate-y-1 border-brand-500/70 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] lg:h-auto'
          : 'hover:-translate-y-2 hover:border-brand-500/60 hover:shadow-[0_24px_50px_-16px_rgba(0,0,0,0.65)] lg:h-[420px]'
      } focus-within:border-brand-500/70`}
    >
      <div className="relative aspect-video w-full overflow-hidden lg:h-[180px] lg:aspect-auto">
        {cover ? (
          <img
            src={cover}
            alt={coverDok?.keterangan ?? project.nama_project}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-900/50 to-black">
            <svg
              className="h-10 w-10 text-brand-500/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M8 13h8M8 17h5" />
            </svg>
            <p className="px-4 text-center text-sm font-semibold text-white/80">
              {project.nama_project}
            </p>
          </div>
        )}

        <div
          className={`pointer-events-none absolute inset-0 transition-colors duration-500 ${
            open ? 'bg-black/40' : 'bg-black/10 group-hover:bg-black/30'
          }`}
        />

        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-brand-400 backdrop-blur">
          {statusLabel[project.status]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6 lg:p-5">
        <h3 className="font-display text-lg font-semibold text-white md:text-xl">
          {project.nama_project}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/70">
          {project.deskripsi}
        </p>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={`project-detail-${project.id}`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-500/60 bg-transparent px-4 py-2.5 text-sm font-semibold text-brand-500 transition hover:bg-brand-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/70 lg:mt-4"
        >
          {open ? 'TUTUP PROJECT' : 'LIHAT PROJECT'}
          <svg
            className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <div
          id={`project-detail-${project.id}`}
          className={`grid transition-all duration-500 ease-in-out ${
            open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                Dibuat
              </p>
              <p className="mt-1 text-sm text-white/90">
                {dibuat ?? 'Tidak diketahui'}
              </p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-500">
                Tentang Project
              </p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-white/80">
                {project.deskripsi}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProjectSection({ project }: ProjectSectionProps) {
  return (
    <section
      id="project"
      className="relative flex min-h-screen w-full items-start justify-center overflow-hidden pt-20 pb-20 md:pt-28"
      style={{
        backgroundImage: "url('/Project.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="animate-fade-up text-center">
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] font-bold uppercase leading-tight tracking-tight text-brand-500">
            Projek DIGFIN
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-center text-[15px] leading-relaxed text-white/70 md:text-base">
            Jelajahi berbagai proyek dan inovasi digital yang dikembangkan oleh
            DIGFIN.
          </p>
        </div>

        {project.length === 0 ? (
          <p className="mt-16 animate-fade-up text-center text-sm text-white/60">
            Belum ada project.
          </p>
        ) : (
          <div className="mt-14 flex snap-x gap-6 overflow-x-auto pb-5 md:mt-16 md:gap-7">
            {project.map((item, index) => (
              <div
                key={item.id}
                className="w-[300px] min-w-[280px] shrink-0 snap-start animate-fade-up md:w-[340px] lg:w-[380px]"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <ProjectCard project={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}