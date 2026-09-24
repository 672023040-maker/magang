import { useEffect, useRef, useState } from 'react'
import type { Struktur } from '../../types'

interface StrukturSectionProps {
  struktur: Struktur[]
}

export function StrukturSection({ struktur }: StrukturSectionProps) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(1)
  const [viewportWidth, setViewportWidth] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)

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
      { threshold: 0.2 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const maxIndex = Math.max(0, struktur.length - visibleCount)
  const slideWidth = viewportWidth > 0 ? viewportWidth / visibleCount : 0
  const effectiveIndex = Math.min(currentIndex, maxIndex)

  useEffect(() => {
    const lg = window.matchMedia('(min-width: 1024px)')
    const sm = window.matchMedia('(min-width: 640px)')

    const update = () => {
      if (lg.matches) setVisibleCount(4)
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
      id="struktur"
      onClick={() => setActiveId(null)}
      className="relative flex min-h-screen w-full overflow-hidden bg-[#dbba99] pt-20 md:pt-[50px]"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 md:px-10 md:pb-20">
        <div className="text-center">
          <h2 className={`font-display text-4xl font-bold uppercase tracking-tight text-stone-900 md:text-6xl ${
            visible ? 'animate-fade-in-down' : 'opacity-0'
          }`}>
            TIM DIGFIN
          </h2>
          <div aria-hidden className="mx-auto mt-4 h-px w-24 bg-stone-400" />
        </div>

        {struktur.length === 0 ? (
          <p className="mt-16 text-center text-[18px] text-stone-500">
            Belum ada data struktur organisasi.
          </p>
        ) : (
          <div ref={gridRef} className="mt-14 flex items-center gap-3 sm:gap-4 lg:gap-5">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={effectiveIndex === 0}
              aria-label="Anggota sebelumnya"
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

            <div
              ref={viewportRef}
              className="min-w-0 flex-1 overflow-x-clip"
            >
              <div
                className="flex items-start transition-transform duration-[400ms] ease-in-out"
                style={{ transform: `translateX(-${effectiveIndex * slideWidth}px)` }}
              >
                {struktur.map((orang, index) => {
                  const isActive = activeId === orang.id

                  return (
                    <div
                      key={orang.id}
                      className="w-full shrink-0 basis-full px-3 sm:basis-1/2 lg:basis-1/4 lg:px-2"
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveId((prev) => (prev === orang.id ? null : orang.id))
                        }}
                        onMouseEnter={() => setActiveId(orang.id)}
                        onMouseLeave={() => setActiveId(null)}
                        style={{ animationDelay: `${index * 90}ms` }}
                        className={`group flex min-w-0 flex-1 flex-col items-center overflow-hidden rounded-2xl border p-6 text-center transition-[border-color,background-color,box-shadow] duration-300 ease-out ${
                          visible ? 'animate-fade-in-down' : 'opacity-0'
                        } ${
                          isActive
                            ? 'border-stone-900 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)]'
                            : 'border-stone-300 bg-white/70 hover:bg-white'
                        }`}
                      >
                        {orang.foto_url ? (
                          <img
                            src={orang.foto_url}
                            alt={orang.nama}
                            className="h-[250px] w-[200px] shrink-0 rounded-none object-cover ring-2 ring-stone-400/70"
                          />
                        ) : (
                          <div className="flex h-[250px] w-[200px] shrink-0 items-center justify-center rounded-none bg-stone-900 text-xl font-semibold text-white">
                            {orang.nama
                              .split(' ')
                              .slice(0, 2)
                              .map((part: string) => part.charAt(0))
                              .join('')}
                          </div>
                        )}
                        <div className="mt-4 min-w-0">
                          <p className="font-semibold text-stone-900">{orang.nama}</p>
                          <p className="mt-0.5 text-[18px] text-stone-600">{orang.jabatan}</p>
                        </div>

                        <div
                          className={`overflow-hidden transition-[max-height,opacity,transform] duration-[350ms] ease-out ${
                            isActive
                              ? 'max-h-[64px] translate-y-0 opacity-100'
                              : 'max-h-0 translate-y-2 opacity-0'
                          }`}
                        >
                          {orang.email && (
                            <div className="flex items-center justify-center pt-5 pb-2">
                              <a
                                href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(orang.email)}`}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Email ${orang.nama}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-stone-900 ring-1 ring-stone-700 transition hover:scale-[1.05] hover:bg-stone-700 hover:ring-stone-500"
                              >
                                <img
                                  src="/email white.png"
                                  alt=""
                                  className="h-[18px] w-auto object-contain"
                                />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))}
              disabled={effectiveIndex >= maxIndex}
              aria-label="Anggota berikutnya"
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
    </section>
  )
}