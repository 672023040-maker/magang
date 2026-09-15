import type { Kontak } from '../../types'

interface FooterProps {
  kontak: Kontak | null
}

const quickLinks = [
  { href: '#hero', label: 'Beranda' },
  { href: '#profil', label: 'Profil' },
  { href: '#struktur', label: 'Struktur' },
  { href: '#informasi', label: 'Informasi' },
  { href: '#project', label: 'Project' },
  { href: '#kontak', label: 'Kontak' },
]

export function Footer({ kontak }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">
            DIGIFIN<span className="text-brand-500">.</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Platform digital fintech yang menghadirkan layanan keuangan digital
            yang inovatif, inklusif, dan terpercaya.
          </p>
        </div>

        <div>
          <p className="font-semibold text-white">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition hover:text-brand-400">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">Hubungi Kami</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{kontak?.email ?? '-'}</li>
            <li>{kontak?.phone ?? '-'}</li>
            <li>{kontak?.alamat ?? '-'}</li>
          </ul>

          {kontak && kontak.sosial_media.length > 0 && (
            <ul className="mt-4 flex gap-4">
              {kontak.sosial_media.map((sosmed) => (
                <li key={sosmed.id}>
                  <a
                    href={sosmed.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-brand-400 transition hover:text-brand-300"
                  >
                    {sosmed.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} DIGIFIN. Hak cipta dilindungi.
      </div>
    </footer>
  )
}