import type { Struktur } from '../../types'
import { SectionContainer, SectionHeading } from './SectionHeading'

interface StrukturSectionProps {
  struktur: Struktur[]
}

export function StrukturSection({ struktur }: StrukturSectionProps) {
  return (
    <SectionContainer id="struktur" className="bg-stone-50">
      <SectionHeading
        index="02"
        title="Tim di Balik DIGFIN"
        description="Orang-orang yang menjalankan roda organisasi setiap hari."
      />

      {struktur.length === 0 ? (
        <p className="mt-12 text-sm text-stone-500">
          Belum ada data struktur organisasi.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {struktur.map((orang) => (
            <div
              key={orang.id}
              className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-base font-semibold text-brand-700">
                  {orang.nama
                    .split(' ')
                    .slice(0, 2)
                    .map((part) => part.charAt(0))
                    .join('')}
                </div>
                <div>
                  <p className="font-semibold text-stone-900">{orang.nama}</p>
                  <p className="text-sm text-brand-700">{orang.jabatan}</p>
                </div>
              </div>

              {orang.divisi.length > 0 && (
                <ul className="mt-5 space-y-4 border-t border-stone-200 pt-5">
                  {orang.divisi.map((divisi) => (
                    <li key={divisi.id} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                      <div>
                        <p className="text-sm font-medium text-stone-800">
                          {divisi.nama_divisi}
                        </p>
                        <p className="mt-0.5 text-sm text-stone-500">
                          {divisi.deskripsi}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  )
}