import type { Struktur } from '../../types'
import { SectionContainer, SectionHeading } from './SectionHeading'

interface StrukturSectionProps {
  struktur: Struktur[]
}

export function StrukturSection({ struktur }: StrukturSectionProps) {
  return (
    <SectionContainer id="struktur" className="bg-slate-50">
      <SectionHeading
        eyebrow="Struktur Organisasi"
        title="Pimpinan & Divisi"
        description="Susunan kepemimpinan dan tim yang menjalankan DIGIFIN setiap hari."
      />

      {struktur.length === 0 ? (
        <p className="mt-12 text-center text-sm text-slate-500">
          Belum ada data struktur organisasi.
        </p>
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {struktur.map((orang) => (
            <div
              key={orang.id}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
                  {orang.nama.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{orang.nama}</p>
                  <p className="text-sm text-brand-600">{orang.jabatan}</p>
                </div>
              </div>

              {orang.divisi.length > 0 && (
                <ul className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                  {orang.divisi.map((divisi) => (
                    <li key={divisi.id}>
                      <p className="text-sm font-medium text-slate-800">
                        {divisi.nama_divisi}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {divisi.deskripsi}
                      </p>
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