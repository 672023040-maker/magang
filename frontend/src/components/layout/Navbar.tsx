import { useEffect, useState } from 'react'

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
      <nav className="flex h-16 items-center pl-2.5 pr-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        <a
          href="#hero"
          className="flex items-center gap-2.5 font-display text-xl font-semibold text-white md:ml-[150px] md:mr-[60px] md:justify-self-start"
        >
          <img
            src="/uksw.png"
            alt="Logo UKSW"
            className="h-[42px] w-auto object-contain"
          />
          <img
            src="/did.png"
            alt="DIGFIN"
            className="h-[38px] w-auto object-contain"
          />
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

        <div className="ml-auto flex items-center gap-2.5 md:ml-0 md:justify-self-auto">
          <div className="hidden items-center gap-2.5 md:ml-[40px] md:flex lg:ml-[320px]">
            <a
              href="https://www.instagram.com/did_uksw"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram DID UKSW"
              className="transition hover:opacity-75"
            >
              <img
                src="/instagram putih.png"
                alt="Instagram"
                className="h-[19px] w-auto object-contain"
              />
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&to=did@uksw.edu"
              target="_blank"
              rel="noreferrer"
              aria-label="Email DID UKSW"
              className="transition hover:opacity-75"
            >
              <img
                src="/email white.png"
                alt="Email"
                className="h-[19px] w-auto object-contain"
              />
            </a>
          </div>

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

          <div className="mt-4 ml-[30px] flex items-center gap-3 border-t border-white/20 pt-4">
            <a
              href="https://www.instagram.com/did_uksw"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram DID UKSW"
              onClick={() => setMenuOpen(false)}
              className="transition hover:opacity-75"
            >
              <img
                src="/instagram putih.png"
                alt="Instagram"
                className="h-[19px] w-auto object-contain"
              />
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&to=did@uksw.edu"
              target="_blank"
              rel="noreferrer"
              aria-label="Email DID UKSW"
              onClick={() => setMenuOpen(false)}
              className="transition hover:opacity-75"
            >
              <img
                src="/email white.png"
                alt="Email"
                className="h-[19px] w-auto object-contain"
              />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}