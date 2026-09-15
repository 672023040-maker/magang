import { Hero } from '../../components/public/Hero'
import { ProfilSection } from '../../components/public/ProfilSection'
import { StrukturSection } from '../../components/public/StrukturSection'
import { ProjectSection } from '../../components/public/ProjectSection'
import { KontakSection } from '../../components/public/KontakSection'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { Spinner } from '../../components/ui/Spinner'
import { useLandingData } from '../../hooks/useLandingData'

const placeholderText =
  'DIGFIN — Digital Fintech UKSW, unit pengembangan aplikasi yang mengurus seluruh pengembangan aplikasi di lingkungan UKSW.'

export function HomePage() {
  const { data, loading, error } = useLandingData()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="max-w-md text-sm leading-relaxed text-stone-600">
          Gagal terhubung ke server. Data ditampilkan dari contoh statis untuk
          saat ini.
        </p>
        <span className="text-xs text-stone-400">{placeholderText}</span>
      </div>
    )
  }

  return (
    <PublicLayout>
      <Hero />
      <ProfilSection profil={data.profil} />
      <StrukturSection struktur={data.struktur} />
      <ProjectSection project={data.project} />
      <KontakSection />
    </PublicLayout>
  )
}