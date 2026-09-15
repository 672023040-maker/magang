import type { Informasi } from '../../types'
import { Badge } from '../ui/Badge'
import { SectionContainer, SectionHeading } from './SectionHeading'

interface InformasiSectionProps {
  informasi: Informasi[]
}

const kategoriLabel: Record<string, { label: string; variant: 'blue' | 'amber' | 'green' }> = {
  berita: { label: 'Berita', variant: 'blue' },
  artikel: { label: 'Artikel', variant: 'amber' },
  pengumuman: { label: 'Pengumuman', variant: 'green' },
}

export function InformasiSection({ informasi }: InformasiSectionProps) {
  return (
    <SectionContainer id="informasi" className="bg-white">
      <SectionHeading
        eyebrow="Informasi"
        title="Berita & Artikel Terbaru"
        description="Kabar terbaru, artikel, dan pengumuman resmi dari DIGIFIN."
      />

      {informasi.length === 0 ? (
        <p className="mt-12 text-center text-sm text-slate-500">
          Belum ada informasi.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {informasi.map((item) => {
            const meta = kategoriLabel[item.kategori] ?? kategoriLabel.pengumuman

            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {item.gambar_url && (
                  <img
                    src={item.gambar_url}
                    alt={item.judul}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                    <time className="text-xs text-slate-400">{item.tanggal}</time>
                  </div>
                  <h3 className="mt-3 font-semibold leading-snug text-slate-900">
                    {item.judul}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                    {item.isi}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </SectionContainer>
  )
}