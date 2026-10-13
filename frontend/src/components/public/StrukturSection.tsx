import { useEffect, useRef, useState } from 'react'
import { Avatar } from '../ui/Avatar'
import type { Struktur } from '../../types'

interface StrukturSectionProps {
  struktur: Struktur[]
}

export function StrukturSection({ struktur }: StrukturSectionProps) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [inView, setInView] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(1)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [hoverPaused, setHoverPaused] = useState(false)
  const [animate, setAnimate] = useState(true)
  const viewportRef = useRef<HTMLDivElement>(null)

  const total = struktur.length
  const maxIndex = Math.max(0, total - visibleCount)
  const loopable = maxIndex > 0
  const slideWidth = viewportWidth > 0 ? viewportWidth / visibleCount : 0
  const effectiveIndex = isDesktop ? Math.min(currentIndex, maxIndex) : currentIndex

  useEffect(() => {
    const node = gridRef.current

    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const lg = window.matchMedia('(min-width: 1024px)')
    const sm = window.matchMedia('(min-width: 640px)')

    const update = () => {
      setIsDesktop(lg.matches)
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
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mq.matches)

    update()
    mq.addEventListener('change', update)

    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden)

    update()
    document.addEventListener('visibilitychange', update)

    return () => document.removeEventListener('visibilitychange', update)
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

  // Auto-slide kartu — hanya mobile & tablet, pause pada beberapa kondisi
  useEffect(() => {
    if (
      isDesktop ||
      reduceMotion ||
      !inView ||
      !pageVisible ||
      hoverPaused ||
      activeId !== null ||
      !loopable
    ) {
      return
    }

    const id = window.setTimeout(() => {
      if (currentIndex >= total) {
        setAnimate(false)
        setCurrentIndex(0)
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    }, 3000)

    return () => window.clearTimeout(id)
  }, [
    isDesktop,
    reduceMotion,
    inView,
    pageVisible,
    hoverPaused,
    activeId,
    loopable,
    currentIndex,
    total,
  ])

  // Setelah sampai di klon, snap tanpa transisi kembali ke kartu pertama (loop mulus)
  useEffect(() => {
    if (animate) return

    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [animate])

  const items = loopable ? [...struktur, ...struktur.slice(0, visibleCount)] : struktur

  return (
    <section
      id="struktur"
      onClick={() => setActiveId(null)}
      className="relative flex min-h-screen w-full overflow-hidden bg-white pt-20 md:pt-[50px]"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 md:px-10 md:pb-20">
        <div className="text-center">
          <h2 className={`font-display text-4xl font-bold uppercase tracking-tight text-[#101820] md:text-6xl ${
            visible ? 'animate-fade-in-down' : 'opacity-0'
          }`}>
            TIM DIGFIN
          </h2>
          <div aria-hidden className="mx-auto mt-4 h-px w-24 bg-[#168c8c]" />
        </div>

        {struktur.length === 0 ? (
          <p className="mt-16 text-center text-[18px] text-stone-600">
            Belum ada data struktur organisasi.
          </p>
        ) : (
          <div
            ref={gridRef}
            onMouseEnter={() => setHoverPaused(true)}
            onMouseLeave={() => setHoverPaused(false)}
            className="mt-14 flex items-center gap-3 sm:gap-4 lg:gap-5"
          >
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
                className={`flex items-start ${
                  animate ? 'transition-transform duration-[400ms] ease-in-out' : 'transition-none'
                }`}
                style={{ transform: `translateX(-${effectiveIndex * slideWidth}px)` }}
                onTransitionEnd={(e) => {
                  if (e.target !== e.currentTarget || e.propertyName !== 'transform') return

                  if (!isDesktop && total > 0 && currentIndex >= total) {
                    setAnimate(false)
                    setCurrentIndex(0)
                  }
                }}
              >
{items.map((orang, i) => {
                    const isClone = i >= total
                    const isActive = !isClone && activeId === orang.id

                    return (
                      <div
                        key={isClone ? `clone-${orang.id}` : orang.id}
                        aria-hidden={isClone ? true : undefined}
                        className={`w-full shrink-0 basis-full px-3 sm:basis-1/2 lg:basis-1/4 lg:px-2 ${
                          isClone ? 'pointer-events-none' : ''
                        } ${visible ? 'animate-fade-in-down' : 'opacity-0'}`}
                        style={{ animationDelay: `${(isClone ? 0 : i) * 150}ms` }}
                      >
                      <div
                        onClick={
                          isClone
                            ? undefined
                            : (e) => {
                                e.stopPropagation()
                                setActiveId((prev) => (prev === orang.id ? null : orang.id))
                              }
                        }
                        onMouseEnter={isClone ? undefined : () => setActiveId(orang.id)}
                        onMouseLeave={isClone ? undefined : () => setActiveId(null)}
                        className={`group flex min-w-0 flex-1 flex-col items-center overflow-hidden rounded-2xl border p-6 text-center transition-[border-color,background-color,box-shadow] duration-300 ease-out ${
                          isActive
                            ? 'border-[#168c8c] bg-white shadow-[0_20px_50px_-12px_rgba(22,140,140,0.35)]'
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
                          <div className="h-[250px] w-[200px] shrink-0 overflow-hidden rounded-none bg-stone-900 ring-2 ring-stone-400/70">
                            <Avatar
                              name={orang.nama}
                              variant="silhouette"
                              className="h-full w-full"
                            />
                          </div>
                        )}
                        <div className="mt-4 min-w-0">
                          <p className="font-semibold text-stone-900">{orang.nama}</p>
                          <p className="mt-0.5 text-[18px] text-stone-600">{orang.jabatan}</p>
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
