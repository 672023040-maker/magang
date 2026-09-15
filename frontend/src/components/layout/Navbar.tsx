import { useEffect, useState } from 'react'

const links = [
  { href: '#hero', label: 'Beranda' },
  { href: '#profil', label: 'Tentang' },
  { href: '#struktur', label: 'Tim' },
  { href: '#project', label: 'Project' },
  { href: '#kontak', label: 'Kontak' },
]

export function Navbar() {
  const [active, setActive] = useState('#hero')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const current = links
        .filter((link) => {
          const el = document.querySelector(link.href)
          return el instanceof HTMLElement && el.offsetTop - 100 <= window.scrollY
        })
        .map((link) => link.href)
        .pop()

      if (current) setActive(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-[#538932] shadow-sm">
      <nav className="grid h-16 items-center pl-2.5 pr-4 md:grid-cols-[1fr_auto_1fr]">
        <a
          href="#hero"
          className="justify-self-start flex items-center gap-2.5 font-display text-xl font-semibold text-white"
        >
          <img
            src="/uksw.png"
            alt="Logo UKSW"
            className="h-8 w-auto object-contain"
          />
          <img src="/did.png" alt="DIGFIN" className="h-7 w-auto object-contain" />
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm font-medium transition ${
                  active === link.href
                    ? 'text-white'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="justify-self-end md:justify-self-auto">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
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
        <div className="border-t border-white/20 bg-[#538932] px-4 pb-6 pt-2 md:hidden">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active === link.href
                      ? 'bg-white/10 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
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