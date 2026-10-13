import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const links = [
  { href: '#hero', label: 'BERANDA' },
  { href: '#profil', label: 'TENTANG' },
  { href: '#struktur', label: 'TIM' },
  { href: '#project', label: 'PROJEK' },
  { href: '#kontak', label: 'KONTAK' },
]

export function Navbar() {
  const [active, setActive] = useState('#hero')
  const [menuOpen, setMenuOpen] = useState(false)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false })
  const listRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // Di halaman selain beranda, tautan section kembali ke beranda (mis. "/#profil").
  const to = (hash: string) => (isHome ? hash : `/${hash}`)

  // Hanya sorot menu aktif saat berada di beranda (section-nya memang ada di sana).
  const current = isHome ? active : ''

  // Deteksi section aktif memakai IntersectionObserver (pita tipis di tengah viewport).
  useEffect(() => {
    if (!isHome) return

    const sections = links
      .map((link) => document.querySelector<HTMLElement>(link.href))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const visible = new Set<string>()

    const sync = () => {
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2

      // Di dasar halaman, section terakhir (KONTAK) selalu dianggap aktif.
      if (atBottom) {
        setActive(links[links.length - 1].href)
        return
      }

      const next = [...links].reverse().find((link) => visible.has(link.href))
      if (next) setActive(next.href)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = `#${(entry.target as HTMLElement).id}`
          if (entry.isIntersecting) visible.add(id)
          else visible.delete(id)
        })
        sync()
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))

    const onScroll = () => sync()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [isHome])

  // Hitung posisi garis indikator mengikuti tautan aktif (desktop).
  useLayoutEffect(() => {
    const update = () => {
      const anchor = current ? itemRefs.current[current] : null

      if (!anchor || anchor.offsetWidth === 0) {
        setIndicator((prev) => ({ ...prev, visible: false }))
        return
      }

      setIndicator({ left: anchor.offsetLeft, width: anchor.offsetWidth, visible: true })
    }

    update()
    window.addEventListener('resize', update)

    if (document.fonts) {
      void document.fonts.ready.then(update)
    }

    return () => window.removeEventListener('resize', update)
  }, [current])

  return (
    <header className="fixed inset-x-0 top-0 z-40 border border-white/10 bg-[#101820]">
      <nav className="flex h-[84px] items-center pl-2.5 pr-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        <a
          href={to('#hero')}
          className="flex items-center gap-2.5 font-display text-xl font-semibold text-stone-100 md:ml-[150px] md:mr-[60px] md:justify-self-start"
        >
          <img
            src="/digfin logo.png"
            alt="DIGFIN"
            className="h-[84px] w-auto object-contain"
          />
        </a>

        <ul ref={listRef} className="relative hidden items-center gap-[40px] md:flex">
          {links.map((link) => {
            const isActive = current === link.href

            return (
              <li key={link.href}>
                <a
                  ref={(node) => {
                    itemRefs.current[link.href] = node
                  }}
                  href={to(link.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-[#168c8c]/60 after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:scale-x-100 motion-reduce:after:transition-none ${
                    isActive ? 'text-[#168c8c]' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            )
          })}

          {/* Indikator meluncur — hanya aktif di desktop */}
          <span
            aria-hidden
            className={`pointer-events-none absolute -bottom-1.5 left-0 h-[2px] rounded-full bg-[#168c8c] shadow-[0_0_10px_rgba(22,140,140,0.7)] transition-[transform,width,opacity] duration-300 ease-out motion-reduce:transition-none ${
              indicator.visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
          />
        </ul>

        <div className="ml-auto flex items-center gap-2.5 md:ml-0 md:justify-self-auto">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-stone-100 transition hover:bg-white/10 md:hidden"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#101820] px-4 pb-6 pt-2 md:hidden">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={to(link.href)}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    current === link.href
                      ? 'bg-white/10 text-[#168c8c]'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
