import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Profil } from '../../types'

interface ProfilSectionProps {
  profil: Profil | null
}

const FALLBACK_VISI =
  'Menjadi penggerak transformasi digital UKSW melalui pengembangan teknologi dan layanan digital yang inovatif, terintegrasi, efektif, dan berkelanjutan.'

const FALLBACK_MISI = [
  'Mengembangkan dan mengelola layanan digital yang mendukung kebutuhan akademik, administrasi, dan operasional UKSW.',
  'Mendorong inovasi teknologi dan digitalisasi untuk meningkatkan kualitas dan efisiensi layanan universitas.',
  'Mengintegrasikan sistem dan layanan digital agar dapat memberikan pengalaman pengguna yang mudah, cepat, dan optimal.',
]

const FALLBACK_TUJUAN = [
  'Meningkatkan efektivitas dan efisiensi layanan melalui pemanfaatan teknologi digital.',
  'Mewujudkan layanan digital yang terintegrasi dan mudah diakses oleh seluruh sivitas akademika.',
  'Mendukung terciptanya inovasi digital yang sesuai dengan kebutuhan perkembangan UKSW.',
]

// Pisahkan teks dari backend menjadi poin-poin, sekaligus membuang penomoran/bullet
// bawaan (mis. "1. Meningkatkan") agar nomor digambar oleh CSS counter.
function toListItems(value: string | null | undefined): string[] {
  if (!value) return []

  return value
    .split(/\r?\n+/)
    .map((line) => line.replace(/^\s*(?:[-•*–]\s+)?(?:\d+[.)]\s*)?/, '').trim())
    .filter(Boolean)
}

interface ProfilCardProps {
  number: string
  title: string
  children: ReactNode
  className?: string
}

function ProfilCard({ number, title, children, className = '' }: ProfilCardProps) {
  return (
    <article
      className={`relative rounded-[14px] border-t-[3px] border-t-[#C9922B] bg-white px-[26px] pb-[26px] pt-[30px] shadow-[0_2px_10px_rgba(80,60,30,0.10)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(80,60,30,0.18)] ${className}`}
    >
      <div
        aria-hidden
        className="hexagon-badge absolute -top-[17px] left-1/2 flex h-[34px] w-[36px] -translate-x-1/2 items-center justify-center bg-[#1E1A17] font-medium text-[#F2C14E]"
      >
        <span className="text-sm">{number}</span>
      </div>

      <h3 className="text-center font-display text-lg font-bold uppercase tracking-[0.2em] text-[#1E1A17]">
        {title}
      </h3>
      <span aria-hidden className="mx-auto mt-2 block h-[2px] w-[36px] bg-[#C9922B]" />

      {children}
    </article>
  )
}

export function ProfilSection({ profil }: ProfilSectionProps) {
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
      { threshold: 0.3 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const visiText = profil?.visi?.trim() || FALLBACK_VISI

  const misiFromApi = toListItems(profil?.misi)
  const misiItems = misiFromApi.length > 0 ? misiFromApi : FALLBACK_MISI

  const tujuanFromApi = toListItems(profil?.tujuan)
  const tujuanItems = tujuanFromApi.length > 0 ? tujuanFromApi : FALLBACK_TUJUAN

  return (
    <section
      id="profil"
      className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#F7F2EA] pt-[30px] pb-20 md:pb-28"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 md:px-10">
        <h2 className={`text-center font-display text-[clamp(2rem,6vw,4rem)] font-bold uppercase leading-none tracking-tight text-stone-900 ${
            visible ? 'animate-fade-in-down' : 'opacity-0'
          }`}>
          PROFIL
        </h2>
        <div aria-hidden className="mt-4 h-px w-24 animate-fade-up bg-stone-400/60" />

        <div ref={gridRef} className="profil-grid mt-12 w-full md:mt-16">
          <ProfilCard number="1" title="Visi" className="profil-card-visi">
            <p className="mx-auto mt-5 max-w-[520px] text-center text-[18px] leading-[1.7] text-[#4A423B]">
              {visiText}
            </p>
          </ProfilCard>

          <ProfilCard number="2" title="Misi">
            <ol className="profil-numbered mt-5 text-left text-[18px] text-[#4A423B]">
              {misiItems.map((item, index) => (
                <li key={`misi-${index}`}>{item}</li>
              ))}
            </ol>
          </ProfilCard>

          <ProfilCard number="3" title="Tujuan">
            <ol className="profil-numbered mt-5 text-left text-[18px] text-[#4A423B]">
              {tujuanItems.map((item, index) => (
                <li key={`tujuan-${index}`}>{item}</li>
              ))}
            </ol>
          </ProfilCard>
        </div>
      </div>
    </section>
  )
}
