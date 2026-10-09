import { useEffect, useRef, useState } from 'react'
import type { Profil } from '../../types'

interface ProfilSectionProps {
  profil: Profil | null
}

const VISI_TEXT =
  'Menjadi penggerak transformasi digital UKSW melalui pengembangan teknologi dan layanan digital yang inovatif, terintegrasi, efektif, dan berkelanjutan.'

const MISI_ITEMS = [
  'Mengembangkan dan mengelola layanan digital yang mendukung kebutuhan akademik, administrasi, dan operasional UKSW.',
  'Mendorong inovasi teknologi dan digitalisasi untuk meningkatkan kualitas dan efisiensi layanan universitas.',
  'Mengintegrasikan sistem dan layanan digital agar dapat memberikan pengalaman pengguna yang mudah, cepat, dan optimal.',
]

const TUJUAN_ITEMS = [
  'Meningkatkan efektivitas dan efisiensi layanan melalui pemanfaatan teknologi digital.',
  'Mewujudkan layanan digital yang terintegrasi dan mudah diakses oleh seluruh sivitas akademika.',
  'Mendukung terciptanya inovasi digital yang sesuai dengan kebutuhan perkembangan UKSW.',
]

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-lg md:text-xl font-bold uppercase tracking-[0.2em] text-[#1E1A17] text-center mb-4 relative pb-3">
      {children}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-9 h-0.5 bg-[#C9922B]" aria-hidden />
    </h3>
  )
}

function HexagonBadge({ number }: { number: string }) {
  return (
    <div
      aria-hidden
      className="hexagon-badge absolute left-1/2 -translate-x-1/2 -top-[17px] z-10 flex h-[34px] w-[36px] items-center justify-center bg-[#1E1A17] text-[#F2C14E] font-display font-medium text-sm"
      style={{
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
      }}
    >
      {number}
    </div>
  )
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="list-none p-0 m-0 space-y-[11px] text-[#4A423B] leading-[1.6] text-sm md:text-base" style={{ counterReset: 'item' }}>
      {items.map((item, index) => (
        <li
          key={index}
          className="relative pl-[34px]"
          style={{ counterIncrement: 'item' }}
        >
          <span
            className="absolute left-0 top-[2px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#F5E6C4] text-[#7A5410] font-medium"
            style={{ fontSize: '11px' }}
          >
            {index + 1}
          </span>
          {item}
        </li>
      ))}
    </ol>
  )
}

interface CardProps {
  className?: string
}

function VisiCard({ className = '' }: CardProps) {
  return (
    <article className={`group relative rounded-[14px] border-t-3 border-[#C9922B] bg-white p-[30px_26px_26px] shadow-[0_2px_10px_rgba(80,60,30,.10)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(80,60,30,.15)] ${className}`}>
      <HexagonBadge number="1" />
      <CardTitle>VISI</CardTitle>
      <p className="max-w-[520px] mx-auto text-center text-[#4A423B] leading-[1.7] text-base md:text-lg [text-wrap:pretty]">
        {VISI_TEXT}
      </p>
    </article>
  )
}

function MisiCard({ className = '' }: CardProps) {
  return (
    <article className={`group relative rounded-[14px] border-t-3 border-[#C9922B] bg-white p-[30px_26px_26px] shadow-[0_2px_10px_rgba(80,60,30,.10)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(80,60,30,.15)] h-full ${className}`}>
      <HexagonBadge number="2" />
      <CardTitle>MISI</CardTitle>
      <NumberedList items={MISI_ITEMS} />
    </article>
  )
}

function TujuanCard({ className = '' }: CardProps) {
  return (
    <article className={`group relative rounded-[14px] border-t-3 border-[#C9922B] bg-white p-[30px_26px_26px] shadow-[0_2px_10px_rgba(80,60,30,.10)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(80,60,30,.15)] h-full ${className}`}>
      <HexagonBadge number="3" />
      <CardTitle>TUJUAN</CardTitle>
      <NumberedList items={TUJUAN_ITEMS} />
    </article>
  )
}

export function ProfilSection({ profil: _profil }: ProfilSectionProps) {
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

        <div
          ref={gridRef}
          className="mt-12 w-full grid grid-cols-1 gap-[26px] md:mt-16 md:grid-cols-[1fr_1fr]"
        >
          <VisiCard className="md:col-span-2" />
          <MisiCard />
          <TujuanCard />
        </div>
      </div>
    </section>
  )
}