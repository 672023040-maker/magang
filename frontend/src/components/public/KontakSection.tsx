import { useEffect, useRef, useState } from 'react'
import { mailtoHref, resolveContactEmail } from '../../constants/contact'
import type { Kontak } from '../../types'

interface KontakSectionProps {
  kontak: Kontak | null
}

export function KontakSection({ kontak }: KontakSectionProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  const email = resolveContactEmail(kontak)

  useEffect(() => {
    const node = boxRef.current

    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="kontak"
      className="relative w-full overflow-hidden border-t border-[#101820]/10 bg-white py-20 md:py-24"
    >
      <div ref={boxRef} className="relative z-10 mx-auto max-w-xl px-5 text-center">
        <h2 className={`font-display text-4xl font-bold uppercase tracking-tight text-[#101820] md:text-5xl ${
            visible ? 'animate-fade-in-down' : 'opacity-0'
          }`}>
          Kontak Kami
        </h2>
        <div aria-hidden className="mx-auto mt-4 h-px w-24 bg-[#168c8c]" />

        <p className="mt-5 text-[18px] leading-relaxed text-stone-600">
          Ada yang ingin ditanyakan soal DIGFIN? Kirim email ke alamat di bawah
          ini.
        </p>

        <a
          href={mailtoHref(email)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 rounded-xl border border-[#168c8c]/40 bg-white px-6 py-4 text-sm font-medium text-[#101820] shadow-lg shadow-stone-400/30 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:border-[#168c8c] hover:bg-[#e8f5f5] hover:shadow-[0_14px_30px_rgba(0,0,0,0.15)]"
        >
          <svg
            className="h-[19px] w-[19px] text-[#127373]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            <path d="M22 6l-10 7L2 6" />
          </svg>
          {email}
        </a>
      </div>
    </section>
  )
}