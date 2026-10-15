import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { ProjectDetailModal } from '../../components/public/ProjectDetailModal'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'
import { useLandingData } from '../../hooks/useLandingData'
import { safeExternalUrl } from '../../lib/safeUrl'
import type { Project } from '../../types'

const statusLabel: Record<Project['status'], string> = {
  publish: 'Publish',
  unpublish: 'Unpublish',
}

function AllProjectCard({
  project,
  onView,
}: {
  project: Project
  onView: (project: Project) => void
}) {
  const coverDok = project.dokumentasi.find((d) => d.file_gambar_url)
  const cover = coverDok?.file_gambar_url
  const link = safeExternalUrl(project.link_project)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-lg shadow-stone-400/30 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-stone-400 hover:shadow-[0_24px_50px_-16px_rgba(0,0,0,0.25)] focus-within:border-stone-900">
      <div className="relative aspect-video w-full overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={project.nama_project}
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

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-display text-lg font-semibold text-stone-900 md:text-xl">
          {project.nama_project}
        </h3>

        {project.author && (
          <p className="mt-1.5 text-sm text-stone-500">By {project.author.nama}</p>
        )}

        <p className="mt-2 line-clamp-3 text-[18px] leading-relaxed text-stone-600">
          {project.deskripsi}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-5">
          <button
            type="button"
            onClick={() => onView(project)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-stone-900 bg-transparent px-4 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/70"
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

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#168c8c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#127373] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168c8c]/70"
            >
              KUNJUNGI WEBSITE
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
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function AllProjectsPage() {
  const { data, loading, hasError } = useLandingData()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Project | null>(null)
  const navigate = useNavigate()

  const goBack = () => {
    // react-router menyimpan index riwayat di history state; idx > 0 berarti
    // ada halaman sebelumnya. Jika tidak (mis. dibuka langsung/refresh),
    // kembali ke beranda.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0

    if (idx > 0) navigate(-1)
    else navigate('/')
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    if (!q) return data.project

    // Pencarian di sisi klien karena endpoint publik sudah mengirim semua data.
    return data.project.filter(
      (item) =>
        item.nama_project.toLowerCase().includes(q) ||
        item.deskripsi.toLowerCase().includes(q) ||
        (item.author?.nama.toLowerCase().includes(q) ?? false),
    )
  }, [data.project, search])

  return (
    <PublicLayout kontak={data.kontak}>
      <section className="min-h-screen w-full bg-[#F3F4F6] px-5 pb-20 pt-[110px] md:px-10 md:pt-[130px]">
        <div className="mx-auto w-full max-w-7xl">
          <button
            type="button"
            onClick={goBack}
            aria-label="Kembali"
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-[#168c8c] hover:text-[#168c8c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168c8c]/70"
          >
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
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            KEMBALI
          </button>

          <div className="text-center">
            <h1 className="font-display text-[clamp(2rem,6vw,4rem)] font-bold uppercase leading-tight tracking-tight text-[#101820]">
              Semua Project
            </h1>

            <div aria-hidden className="mx-auto mt-4 h-px w-24 bg-[#168c8c]" />

            <p className="mx-auto mt-5 max-w-2xl text-[18px] leading-relaxed text-stone-600">
              Telusuri seluruh inovasi DIGFIN. Gunakan pencarian untuk menemukan
              project tertentu.
            </p>
          </div>

          <div className="mx-auto mt-10 w-full max-w-xl">
            <Input
              id="search-all-project"
              placeholder="Cari nama project, deskripsi, author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari project"
              trailingIcon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <Spinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="mt-16 text-center text-[18px] text-stone-600">
              {data.project.length === 0
                ? 'Belum ada project.'
                : 'Project tidak ditemukan.'}
            </p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <AllProjectCard
                  key={item.id}
                  project={item}
                  onView={setSelected}
                />
              ))}
            </div>
          )}

          {hasError && !loading && (
            <p className="mt-10 text-center text-sm text-red-600">
              Sebagian data gagal dimuat. Muat ulang halaman untuk mencoba kembali.
            </p>
          )}
        </div>
      </section>

      {selected && (
        <ProjectDetailModal
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </PublicLayout>
  )
}
