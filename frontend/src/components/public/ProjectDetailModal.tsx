import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Project } from '../../types'
import { Badge } from '../ui/Badge'

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
}

const statusLabel: Record<Project['status'], string> = {
  publish: 'Publish',
  unpublish: 'Unpublish',
}

const statusVariant: Record<Project['status'], 'green' | 'amber'> = {
  publish: 'green',
  unpublish: 'amber',
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

function DocumentIcon(): ReactNode {
  return (
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
  )
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [shown, setShown] = useState(false)
  const [closing, setClosing] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const coverDok = project.dokumentasi.find((d) => d.file_gambar_url)
  const cover = coverDok?.file_gambar_url
  const dibuat = formatDate(project.tgl_dibuat)

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setShown(true))
    closeButtonRef.current?.focus()
    document.body.style.overflow = 'hidden'

    return () => {
      window.cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setClosing(true)
        window.setTimeout(onClose, 300)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const requestClose = () => {
    if (closing) return

    setClosing(true)
    window.setTimeout(onClose, 300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={requestClose}
        aria-hidden
        className={`absolute inset-0 transition-all duration-300 ${
          shown && !closing ? 'opacity-100 backdrop-blur-[6px]' : 'opacity-0'
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detail project ${project.nama_project}`}
        className={`relative z-10 flex max-h-[90vh] w-[min(90vw,700px)] transform flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out ${
          shown && !closing ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        <div className="overflow-y-auto">
          <div className="relative aspect-video w-full md:aspect-auto md:h-72">
            {cover ? (
              <img
                src={cover}
                alt={coverDok?.keterangan ?? project.nama_project}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-neutral-900/60 to-black">
                <DocumentIcon />
                <p className="px-4 text-center text-sm font-semibold text-white/80">
                  {project.nama_project}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 md:p-7">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={statusVariant[project.status]}>
                {statusLabel[project.status]}
              </Badge>
            </div>

            <h3 className="mt-3 font-display text-xl font-semibold text-stone-900 md:text-2xl">
              {project.nama_project}
            </h3>

            <div className="mt-5 border-t border-stone-200 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Tanggal Dibuat
              </p>
              <p className="mt-1 text-[18px] text-stone-800">
                {dibuat ?? 'Tidak diketahui'}
              </p>
            </div>

            <div className="mt-5 border-t border-stone-200 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Tentang Project
              </p>
              <p className="mt-1 whitespace-pre-line text-[18px] leading-relaxed text-stone-600">
                {project.deskripsi}
              </p>
            </div>
          </div>
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={requestClose}
          aria-label="Tutup detail project"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}