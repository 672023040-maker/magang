import { useEffect, useState } from 'react'
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
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // Di halaman selain beranda, tautan section kembali ke beranda (mis. "/#profil").
  const to = (hash: string) => (isHome ? hash : `/${hash}`)

  // Hanya sorot menu aktif saat berada di beranda (section-nya memang ada di sana).
  const current = isHome ? active : ''

  useEffect(() => {
    if (!isHome) return

    const onScroll = () => {
      const next = links
        .filter((link) => {
          const el = document.querySelector(link.href)
          return el instanceof HTMLElement && el.offsetTop - 100 <= window.scrollY
        })
        .map((link) => link.href)
        .pop()

      if (next) setActive(next)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

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

        <ul className="hidden items-center gap-[40px] md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={to(link.href)}
                className={`text-sm font-medium transition ${
                  current === link.href
                    ? 'text-[#168c8c]'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
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
