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
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold text-white">
            DIGFIN<span className="text-brand-500">.</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-400">
            Digital Fintech UKSW — unit yang mengurus pengembangan semua aplikasi
            di lingkungan Universitas Kristen Satya Wacana.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Navigasi
          </p>
          <ul className="mt-3 space-y-2 text-sm">
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

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Email
          </p>
          <a
            href="mailto:did@uksw.edu"
            className="mt-3 inline-block text-sm font-medium text-brand-400 underline decoration-brand-700 underline-offset-4 transition hover:text-brand-300"
          >
            did@uksw.edu
          </a>
        </div>
      </div>

      <div className="border-t border-stone-800 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} DIGFIN. Dibuat dengan kerja keras tim.
      </div>
    </footer>
  )
}