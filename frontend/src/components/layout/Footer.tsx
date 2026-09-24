export function Footer() {
  return (
    <footer className="bg-[#F3EAE1] text-stone-700">
      <div className="grid items-start gap-10 py-8 px-5 lg:grid-cols-[auto_auto_auto] lg:justify-center">
        <div>
          <div className="-mt-2.5 -ml-5 flex items-center gap-3">
            <img
              src="/digfin logo.png"
              alt="DIGFIN"
              className="h-[175px] w-auto object-contain"
            />
          </div>
        </div>

        <div className="gap-8 lg:flex lg:gap-12">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-stone-900"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                Jam Pelayanan
              </p>
            </div>
            <p className="mt-3 text-sm text-stone-600">Senin - Jumat</p>
            <p className="mt-1 text-sm text-stone-600">07.30 - 16.00</p>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-stone-900"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                Lokasi
              </p>
            </div>
            <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-stone-600">
              Kampus Diponegoro
            </p>
            <p className="max-w-[260px] text-sm leading-relaxed text-stone-600">
              Belakang Gedung F
            </p>
            <p className="max-w-[260px] text-sm leading-relaxed text-stone-600">
              Jl. Diponegoro No. 52 - 60, Salatiga, Indonesia
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Email
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&to=did@uksw.edu"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-medium text-stone-900 underline decoration-stone-400 underline-offset-4 transition hover:text-stone-900"
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
              <svg
                className="h-6 w-6 text-stone-900"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10 py-5 text-center text-xs text-stone-500">
        DIGFIN ©2026 UKSW. Seluruh hak cipta.
      </div>
    </footer>
  )
}