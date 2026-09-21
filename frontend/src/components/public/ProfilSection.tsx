import { useEffect, useRef, useState } from 'react'
import type { Profil } from '../../types'

interface ProfilSectionProps {
  profil: Profil | null
}

interface InfoCardProps {
  label: string
  number: string
  text: string
  animationDelay: string
  visible: boolean
}

const PLACEHOLDER =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pretium tellus duis convallis tempus leo eu aenean.'

function extractPlainLines(value: string | null | undefined): string {
  if (!value) return ''

  return value
    .split(/\r?\n+/)
    .map((line) => line.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter(Boolean)
    .join('\n')
}

function InfoCard({ label, number, text, animationDelay, visible }: InfoCardProps) {
  return (
    <article
      className={`group relative mx-auto w-full max-w-xs ${
        visible ? 'animate-fade-in-down' : 'opacity-0'
      }`}
      style={{ animationDelay }}
    >
      <div className="rounded-2xl border border-brand-500/40 bg-white/25 px-6 py-12 text-center shadow-lg shadow-black/10 backdrop-blur-[3px] transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02] group-hover:border-brand-500/70 group-hover:bg-white/30 group-hover:shadow-[0_14px_30px_rgba(0,0,0,0.25)]">
        <h3 className="font-display text-lg font-bold uppercase tracking-widest text-brand-600 md:text-xl">
          {label}
        </h3>
        <span aria-hidden className="mx-auto mt-2.5 h-px w-8 bg-brand-500/50" />
        <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-stone-700 md:text-sm">
          {text}
        </p>
      </div>

      <div
        aria-hidden
        className="hexagon-badge absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center bg-brand-500 shadow-lg shadow-black/25 md:-right-4 md:-top-4 md:h-11 md:w-11"
      >
        <span className="font-display text-sm font-bold text-white md:text-base">
          {number}
        </span>
      </div>
    </article>
  )
}

export function ProfilSection({ profil }: ProfilSectionProps) {
  const misiText = extractPlainLines(profil?.misi)

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

  const cards: Omit<InfoCardProps, 'visible'>[] = [
    {
      label: 'VISI',
      number: '1.',
      text: profil?.visi?.trim() || PLACEHOLDER,
      animationDelay: '0ms',
    },
    {
      label: 'MISI',
      number: '2.',
      text: misiText || PLACEHOLDER,
      animationDelay: '90ms',
    },
    {
      label: 'TUJUAN',
      number: '3.',
      text: profil?.tujuan?.trim() || PLACEHOLDER,
      animationDelay: '180ms',
    },
  ]

  return (
    <section
      id="profil"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden py-20 md:py-28"
      style={{
        backgroundImage: "url('/profil.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 md:px-10">
        <h2 className="animate-fade-up text-center font-display text-[clamp(2rem,6vw,4rem)] font-bold uppercase leading-none tracking-tight text-brand-500 drop-shadow-[0_2px_10px_rgba(255,255,255,0.7)]">
          PROFIL
        </h2>
        <div aria-hidden className="mt-4 h-px w-24 animate-fade-up bg-brand-500/50" />

        <div
          ref={gridRef}
          className="mt-12 grid w-full grid-cols-1 gap-x-6 gap-y-14 md:mt-16 md:grid-cols-3 md:gap-x-8 md:gap-y-0"
        >
          {cards.map((card) => (
            <InfoCard key={card.label} {...card} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}