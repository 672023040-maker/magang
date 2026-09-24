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
      className="relative w-full overflow-hidden bg-[#dbba99] py-20 md:py-24"
    >
      <div ref={boxRef} className="relative z-10 mx-auto max-w-xl px-5 text-center">
        <h2 className={`font-display text-4xl font-bold uppercase tracking-tight text-stone-900 md:text-5xl ${
            visible ? 'animate-fade-in-down' : 'opacity-0'
          }`}>
          Kontak Kami
        </h2>
        <div aria-hidden className="mx-auto mt-4 h-px w-24 bg-stone-400/60" />

        <p className="mt-5 text-[18px] leading-relaxed text-stone-600">
          Ada yang ingin ditanyakan soal DIGFIN? Kirim email ke alamat di bawah
          ini.
        </p>

        <a
          href="https://mail.google.com/mail/?view=cm&to=did@uksw.edu"
          target="_blank"
          rel="noreferrer"
          className={`mt-8 inline-flex items-center gap-3 rounded-xl border border-stone-400 bg-white px-6 py-4 text-sm font-medium text-stone-900 transition hover:bg-stone-100 ${
            visible ? 'animate-fade-in-down' : 'opacity-0'
          }`}
        >
          <svg
            className="h-[19px] w-[19px] text-stone-900"
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
          did@uksw.edu
        </a>
      </div>
    </section>
  )
}