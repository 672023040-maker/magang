import { useEffect, useState } from 'react'

const INSTAGRAM_URL = 'https://www.instagram.com/did_uksw'

export function FloatingSocial() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const footer = document.querySelector('footer')

    if (!footer) return

    // Sembunyikan tombol saat footer mulai terlihat (sampai di bagian bawah halaman)
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0 },
    )

    observer.observe(footer)

    return () => observer.disconnect()
  }, [])

  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Instagram DID UKSW"
      aria-hidden={hidden ? true : undefined}
      tabIndex={hidden ? -1 : undefined}
      className={`fixed right-4 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-900 shadow-lg shadow-black/25 ring-1 ring-black/10 transition-all duration-300 ease-out lg:hidden ${
        hidden ? 'pointer-events-none translate-x-20 opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    </a>
  )
}
