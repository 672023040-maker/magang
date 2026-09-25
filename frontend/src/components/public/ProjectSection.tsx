import { useEffect, useRef, useState } from 'react'
import type { Project } from '../../types'
import { ProjectDetailModal } from './ProjectDetailModal'

interface ProjectSectionProps {
  project: Project[]
}

const statusLabel: Record<Project['status'], string> = {
  publish: 'Publish',
  unpublish: 'Unpublish',
}

function ProjectCard({
  project,
  onView,
}: {
  project: Project
  onView: (project: Project) => void
}) {
  const coverDok = project.dokumentasi.find((d) => d.file_gambar_url)
  const cover = coverDok?.file_gambar_url

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-lg shadow-stone-400/30 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-stone-400 hover:shadow-[0_24px_50px_-16px_rgba(0,0,0,0.25)] focus-within:border-stone-900 lg:min-h-[420px]">
      <div className="relative aspect-video w-full overflow-hidden lg:h-[180px] lg:aspect-auto">
        {cover ? (
          <img
            src={cover}
            alt={coverDok?.keterangan ?? project.nama_project}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-neutral-900/60 to-black">
            <svg
              className="h-10 w-10 text-white/70"
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

        <div className="pointer-events-none absolute inset-0 bg-stone-900/5 transition-colors duration-300 group-hover:bg-stone-900/10" />

        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {statusLabel[project.status]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6 lg:p-5">
        <h3 className="font-display text-lg font-semibold text-stone-900 md:text-xl">
          {project.nama_project}
        </h3>

        <p className="mt-2 line-clamp-3 text-[18px] leading-relaxed text-stone-600">
          {project.deskripsi}
        </p>

        <button
          type="button"
          onClick={() => onView(project)}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-stone-900 bg-transparent px-4 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/70 lg:mt-4"
        >
          LIHAT PROJECT
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </article>
  )
}

function chunkProjects<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items]

  const result: T[][] = []

  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size))
  }

  return result
}

export function ProjectSection({ project }: ProjectSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visibleCount, setVisibleCount] = useState(1)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const slides = chunkProjects(project, visibleCount)
  const effectiveSlide = Math.min(currentSlide, slides.length - 1)

  useEffect(() => {
    const node = gridRef.current

    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const lg = window.matchMedia('(min-width: 1024px)')
    const sm = window.matchMedia('(min-width: 640px)')

    const update = () => {
      if (lg.matches) setVisibleCount(3)
      else if (sm.matches) setVisibleCount(2)
      else setVisibleCount(1)
    }

    update()
    lg.addEventListener('change', update)
    sm.addEventListener('change', update)

    return () => {
      lg.removeEventListener('change', update)
      sm.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    const node = viewportRef.current

    if (!node) return

    const updateWidth = () => setViewportWidth(node.offsetWidth)
    const observer = new ResizeObserver(updateWidth)

    updateWidth()
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="project"
      className="relative flex min-h-screen w-full items-start justify-center overflow-hidden bg-[#F7F3ED] pt-20 pb-20 md:pt-[50px]"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className={`text-center ${visible ? 'animate-fade-in-down' : 'opacity-0'}`}>
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] font-bold uppercase leading-tight tracking-tight text-stone-900">
            Projek DIGFIN
          </h2>

          <div aria-hidden className="mx-auto mt-4 h-px w-24 bg-stone-400" />
        </div>

        {project.length === 0 ? (
          <p className="mt-16 animate-fade-up text-center text-[18px] text-stone-500">
            Belum ada project.
          </p>
        ) : (
          <div
              ref={gridRef}
              className="mt-14 flex items-center gap-3 sm:gap-4 md:mt-[25px] lg:gap-5"
            >
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
                disabled={effectiveSlide === 0}
                aria-label="Project sebelumnya"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white/80 text-stone-900 transition hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <div ref={viewportRef} className="min-w-0 flex-1 overflow-x-clip">
                <div
                  className="flex transition-transform duration-[400ms] ease-in-out"
                  style={{ transform: `translateX(-${effectiveSlide * viewportWidth}px)` }}
                >
                  {slides.map((slideItems, slideIndex) => (
                    <div key={slideIndex} className="w-full shrink-0">
                      <div
                        className="grid gap-6 md:gap-7"
                        style={{
                          gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))`,
                        }}
                      >
                        {slideItems.map((item) => (
                          <div key={item.id} className="min-w-0">
                            <ProjectCard project={item} onView={setSelectedProject} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
                }
                disabled={effectiveSlide >= slides.length - 1}
                aria-label="Project berikutnya"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white/80 text-stone-900 transition hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
        )}
      </div>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}