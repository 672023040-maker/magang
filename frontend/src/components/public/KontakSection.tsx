import { useEffect, useRef, useState } from 'react'

export function KontakSection() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

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
      className="relative w-full overflow-hidden py-20 md:py-24"
      style={{
        backgroundImage: "url('/background tim.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/60" />

      <div ref={boxRef} className="relative z-10 mx-auto max-w-xl px-5 text-center">
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-brand-500 md:text-5xl">
          Kontak Kami
        </h2>
        <div aria-hidden className="mx-auto mt-4 h-px w-24 bg-brand-500/50" />

        <p className="mt-5 text-[15px] leading-relaxed text-white/70">
          Ada yang ingin ditanyakan soal DIGFIN? Kirim email ke alamat di bawah
          ini, kami akan membalas sebisanya.
        </p>

        <a
          href="https://mail.google.com/mail/?view=cm&to=did@uksw.edu"
          target="_blank"
          rel="noreferrer"
          className={`mt-8 inline-flex items-center gap-3 rounded-xl border border-brand-500/60 bg-white/[0.08] px-6 py-4 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-brand-500/20 ${
            visible ? 'animate-fade-in-down' : 'opacity-0'
          }`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
          </span>
          did@uksw.edu
        </a>
      </div>
    </section>
  )
}