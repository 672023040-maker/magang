export function Footer() {
  return (
    <footer className="bg-[#538932] text-white/90">
      <div className="grid items-start gap-10 py-8 pl-5 pr-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="justify-self-start">
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

        <div className="gap-8 md:flex md:gap-12 md:justify-self-center">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <img
                src="/jam.png"
                alt="Jam"
                className="h-5 w-auto object-contain"
              />
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Jam Pelayanan
              </p>
            </div>
            <p className="mt-3 text-sm text-white/80">Senin - Jumat</p>
            <p className="mt-1 text-sm text-white/80">07.30 - 16.00</p>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <img
                src="/lokasi.png"
                alt="Lokasi"
                className="h-5 w-auto object-contain"
              />
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Lokasi
              </p>
            </div>
            <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-white/80">
              Kampus Diponegoro
            </p>
            <p className="max-w-[260px] text-sm leading-relaxed text-white/80">
              Belakang Gedung F
            </p>
            <p className="max-w-[260px] text-sm leading-relaxed text-white/80">
              Jl. Diponegoro No. 52 - 60, Salatiga, Indonesia
            </p>
          </div>
        </div>

        <div className="justify-self-end mr-[250px]">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
            Email
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&to=did@uksw.edu"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-medium text-white underline decoration-white/40 underline-offset-4 transition hover:text-white"
          >
            did@uksw.edu
          </a>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
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

      <div className="border-t border-white/20 py-5 text-center text-xs text-white/70">
        DIGFIN ©2026 UKSW. Seluruh hak cipta.
      </div>
    </footer>
  )
}