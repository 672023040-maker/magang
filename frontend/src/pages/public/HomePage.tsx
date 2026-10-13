import { Hero } from '../../components/public/Hero'
import { ProfilSection } from '../../components/public/ProfilSection'
import { StrukturSection } from '../../components/public/StrukturSection'
import { ProjectSection } from '../../components/public/ProjectSection'
import { KontakSection } from '../../components/public/KontakSection'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { Spinner } from '../../components/ui/Spinner'
import { useLandingData } from '../../hooks/useLandingData'

export function HomePage() {
  const { data, loading, hasError } = useLandingData()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <PublicLayout kontak={data.kontak}>
      {hasError && (
        <div
          role="alert"
          className="bg-red-100/80 px-4 py-2 text-center text-xs text-red-700"
        >
          Sebagian data gagal dimuat. Bagian yang tersedia tetap ditampilkan —
          muat ulang halaman untuk mencoba kembali.
        </div>
      )}
      <Hero />
      <div className="h-[0.5px] bg-white/15 shadow-none" />
      <ProfilSection />
      <div className="h-px bg-white/15 shadow-none" />
      <StrukturSection struktur={data.struktur} />
      <div className="h-[0.5px] bg-white/15 shadow-none" />
      <ProjectSection project={data.project} />
      <div className="h-px bg-white/15 shadow-none" />
      <KontakSection kontak={data.kontak} />
    </PublicLayout>
  )
}