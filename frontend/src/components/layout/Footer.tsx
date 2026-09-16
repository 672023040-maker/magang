const quickLinks = [
  { href: '#hero', label: 'Beranda' },
  { href: '#profil', label: 'Tentang' },
  { href: '#struktur', label: 'Tim' },
  { href: '#project', label: 'Project' },
  { href: '#kontak', label: 'Kontak' },
]

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="grid items-start gap-10 py-8 pl-5 pr-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="justify-self-start self-center">
          <div className="flex items-center gap-3">
            <img
              src="/uksw.png"
              alt="Logo UKSW"
              className="w-20 h-auto object-contain"
            />
            <img
              src="/did.png"
              alt="DIGFIN"
              className="w-52 h-auto object-contain"
            />
          </div>
        </div>

        <div className="text-center md:justify-self-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Navigasi
          </p>
          <ul className="mt-3 grid grid-cols-3 justify-items-center gap-x-8 gap-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-stone-400 transition hover:text-brand-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="justify-self-end mr-[250px]">
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Email
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&to=did@uksw.edu"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-medium text-brand-400 underline decoration-brand-700 underline-offset-4 transition hover:text-brand-300"
          >
            did@uksw.edu
          </a>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Sosial Media
            </p>
            <a
              href="https://www.instagram.com/did_uksw"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram DID UKSW"
              className="mt-3 inline-block opacity-80 transition hover:opacity-100"
            >
              <img
                src="/instagram.png"
                alt="Instagram"
                className="h-6 w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800 py-5 text-center text-xs text-stone-500">
        DIGFIN ©2026 UKSW. Seluruh hak cipta.
      </div>
    </footer>
  )
}