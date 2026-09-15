import { Hero } from '../../components/public/Hero'
import { ProfilSection } from '../../components/public/ProfilSection'
import { StrukturSection } from '../../components/public/StrukturSection'
import { InformasiSection } from '../../components/public/InformasiSection'
import { ProjectSection } from '../../components/public/ProjectSection'
import { KontakSection } from '../../components/public/KontakSection'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { Spinner } from '../../components/ui/Spinner'
import { useLandingData } from '../../hooks/useLandingData'

const placeholderText =
  'DIGIFIN adalah platform digital fintech yang menghadirkan layanan keuangan digital yang inovatif, inklusif, dan terpercaya.'

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
        <p className="max-w-md text-sm leading-relaxed text-slate-600">
          Gagal terhubung ke server. Data ditampilkan dari contoh statis untuk
          saat ini.
        </p>
        <span className="text-xs text-slate-400">{placeholderText}</span>
      </div>
    )
  }

  return (
    <PublicLayout kontak={data.kontak}>
      <Hero />
      <ProfilSection profil={data.profil} />
      <StrukturSection struktur={data.struktur} />
      <InformasiSection informasi={data.informasi} />
      <ProjectSection project={data.project} />
      <KontakSection kontak={data.kontak} />
    </PublicLayout>
  )
}