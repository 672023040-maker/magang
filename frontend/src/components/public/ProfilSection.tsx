import type { Profil } from '../../types'
import { SectionContainer, SectionHeading } from './SectionHeading'

interface ProfilSectionProps {
  profil: Profil | null
}

export function ProfilSection({ profil }: ProfilSectionProps) {
  return (
    <SectionContainer id="profil" className="bg-white">
      <SectionHeading
        eyebrow="Profil"
        title="Tentang Kami"
        description="Mengenal lebih dekat perusahaan, visi, misi, dan nilai yang kami junjung."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <h3 className="text-lg font-semibold text-slate-900">Tentang Kami</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {profil?.tentang_kami ?? 'Belum ada data profil.'}
          </p>
        </div>

        <div className="grid gap-6">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Visi</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {profil?.visi ?? '-'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Misi</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {profil?.misi ?? '-'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900">Nilai-nilai Kami</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {profil?.nilai ?? '-'}
          </p>
        </div>
      </div>
    </SectionContainer>
  )
}