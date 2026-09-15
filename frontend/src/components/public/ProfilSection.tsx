import type { Profil } from '../../types'
import { SectionContainer, SectionHeading } from './SectionHeading'

interface ProfilSectionProps {
  profil: Profil | null
}

export function ProfilSection({ profil }: ProfilSectionProps) {
  return (
    <SectionContainer id="profil" className="bg-white">
      <SectionHeading
        index="01"
        title="Tentang DIGFIN"
        description="Awalan yang singkat tentang siapa kami dan prinsip yang kami pegang."
      />

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <p className="font-display text-lg font-medium italic text-brand-700">
            Tentang Kami
          </p>
          <p className="mt-3 border-l-2 border-accent-400 pl-4 text-[15px] leading-relaxed text-stone-600">
            {profil?.tentang_kami ?? 'Belum ada data profil.'}
          </p>

          <div className="mt-8">
            <p className="font-display text-lg font-medium italic text-brand-700">
              Visi
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              {profil?.visi ?? '-'}
            </p>
          </div>
        </div>

        <div>
          <p className="font-display text-lg font-medium italic text-brand-700">
            Misi
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-stone-600">
            {profil?.misi ?? '-'}
          </p>

          <div className="mt-8 rounded-xl border border-accent-200 bg-accent-50 p-6">
            <p className="font-display text-lg font-medium italic text-accent-700">
              Nilai-nilai Kami
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              {profil?.nilai ?? '-'}
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}