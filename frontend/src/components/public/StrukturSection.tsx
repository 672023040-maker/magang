import { useState } from 'react'
import type { Struktur } from '../../types'

interface StrukturSectionProps {
  struktur: Struktur[]
}

const instagramUrl = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `https://www.instagram.com/${value}`

export function StrukturSection({ struktur }: StrukturSectionProps) {
  const [activeId, setActiveId] = useState<number | null>(null)

  return (
    <section
      id="struktur"
      onClick={() => setActiveId(null)}
      className="relative flex min-h-screen w-full overflow-hidden pt-20 md:pt-28"
      style={{
        backgroundImage: "url('/background tim.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 md:px-10 md:pb-20">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-brand-500 md:text-6xl">
            TIM DIGFIN
          </h2>
        </div>

        {struktur.length === 0 ? (
          <p className="mt-16 text-center text-sm text-white/60">
            Belum ada data struktur organisasi.
          </p>
        ) : (
          <div className="mt-14 flex flex-col gap-6 md:flex-row md:gap-4">
            {struktur.map((orang) => {
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
                  className={`group flex min-w-0 flex-1 flex-col items-center overflow-hidden rounded-2xl border p-6 text-center transition-all duration-500 ease-in-out ${
                    isActive
                      ? 'flex-[2.2] border-brand-500/70 bg-white/[0.14] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)]'
                      : 'border-white/20 bg-white/[0.08] hover:bg-white/[0.12]'
                  }`}
                >
                  {orang.foto_url ? (
                    <img
                      src={orang.foto_url}
                      alt={orang.nama}
                      className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-brand-500/60"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xl font-semibold text-white">
                      {orang.nama
                        .split(' ')
                        .slice(0, 2)
                        .map((part: string) => part.charAt(0))
                        .join('')}
                    </div>
                  )}
                  <div className="mt-4 min-w-0">
                    <p className="font-semibold text-white">{orang.nama}</p>
                    <p className="mt-0.5 text-sm text-brand-500/80">{orang.jabatan}</p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isActive
                        ? 'mt-5 max-h-[560px] translate-x-0 opacity-100'
                        : 'max-h-0 -translate-x-3 opacity-0'
                    }`}
                  >
                    {(orang.instagram || orang.email) && (
                      <div className="flex items-center justify-center gap-4 pb-5">
                        {orang.instagram && (
                          <a
                            href={instagramUrl(orang.instagram)}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Instagram ${orang.nama}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition hover:bg-white/20 hover:ring-brand-500/70"
                          >
                            <img
                              src="/instagram.png"
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
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition hover:bg-white/20 hover:ring-brand-500/70"
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

                    <div className="border-t border-white/20 pt-5">
                      {orang.divisi.length > 0 ? (
                        <ul className="space-y-4 text-left">
                          {orang.divisi.map((divisi) => (
                            <li key={divisi.id} className="flex gap-3">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {divisi.nama_divisi}
                                </p>
                                <p className="mt-0.5 text-sm text-white/70">
                                  {divisi.deskripsi}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-white/50">Belum ada divisi.</p>
                      )}
                    </div>
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
