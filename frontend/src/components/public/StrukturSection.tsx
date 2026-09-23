import { useEffect, useRef, useState } from 'react'
import type { Struktur } from '../../types'

interface StrukturSectionProps {
  struktur: Struktur[]
}

const instagramUrl = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `https://www.instagram.com/${value}`

export function StrukturSection({ struktur }: StrukturSectionProps) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

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

  return (
    <section
      id="struktur"
      onClick={() => setActiveId(null)}
      className="relative flex min-h-screen w-full overflow-hidden bg-[#dbba99] pt-20 md:pt-28"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 md:px-10 md:pb-20">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-stone-900 md:text-6xl">
            TIM DIGFIN
          </h2>
        </div>

        {struktur.length === 0 ? (
          <p className="mt-16 text-center text-[18px] text-stone-500">
            Belum ada data struktur organisasi.
          </p>
        ) : (
          <div ref={gridRef} className="mt-14 flex flex-col gap-6 lg:flex-row lg:gap-4">
            {struktur.map((orang, index) => {
              const isActive = activeId === orang.id

              return (
                <div
                  key={orang.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveId((prev) => (prev === orang.id ? null : orang.id))
                  }}
                  onMouseEnter={() => setActiveId(orang.id)}
                  onMouseLeave={() => setActiveId(null)}
                  style={{ animationDelay: `${index * 90}ms` }}
                  className={`group flex min-w-0 flex-1 flex-col items-center overflow-hidden rounded-2xl border p-6 text-center transition-all duration-500 ease-in-out ${
                    visible ? 'animate-fade-in-down' : 'opacity-0'
                  } ${
                    isActive
                      ? 'border-stone-900 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] lg:flex-[2.2]'
                      : 'border-stone-300 bg-white/70 hover:bg-white'
                  }`}
                >
                  {orang.foto_url ? (
                    <img
                      src={orang.foto_url}
                      alt={orang.nama}
                      className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-stone-400/70"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xl font-semibold text-white">
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
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isActive
                        ? 'mt-5 max-h-[560px] translate-x-0 opacity-100'
                        : 'max-h-0 -translate-x-3 opacity-0'
                    }`}
                  >
                    {(orang.instagram || orang.email) && (
                      <div className="flex items-center justify-center gap-4 pb-2">
                        {orang.instagram && (
                          <a
                            href={instagramUrl(orang.instagram)}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Instagram ${orang.nama}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 ring-1 ring-stone-700 transition hover:bg-stone-700 hover:ring-stone-500"
                          >
                            <img
                              src="/instagram putih.png"
                              alt=""
                              className="h-4 w-auto object-contain"
                            />
                          </a>
                        )}
                        {orang.email && (
                          <a
                            href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(orang.email)}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Email ${orang.nama}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 ring-1 ring-stone-700 transition hover:bg-stone-700 hover:ring-stone-500"
                          >
                            <img
                              src="/email white.png"
                              alt=""
                              className="h-4 w-auto object-contain"
                            />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
