import { useEffect, useState } from 'react'

const links = [
  { href: '#hero', label: 'Beranda' },
  { href: '#profil', label: 'Profil' },
  { href: '#struktur', label: 'Struktur' },
  { href: '#informasi', label: 'Informasi' },
  { href: '#project', label: 'Project' },
  { href: '#kontak', label: 'Kontak' },
]

export function Navbar() {
  const [active, setActive] = useState('#hero')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)

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
    <header
      className={`fixed inset-x-0 top-0 z-40 transition ${
        scrolled
          ? 'bg-white/90 shadow-sm backdrop-blur'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#hero" className="text-lg font-bold tracking-tight text-slate-900">
          DIGIFIN<span className="text-brand-600">.</span>
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm font-medium transition ${
                  active === link.href
                    ? 'text-brand-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#kontak"
          className="hidden rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 md:inline-flex"
        >
          Hubungi Kami
        </a>
      </nav>
    </header>
  )
}