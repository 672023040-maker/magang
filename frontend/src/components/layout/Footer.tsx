export function Footer() {
  return (
    <footer className="bg-[#538932] text-white/90">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-5 py-8 md:grid-cols-3 md:gap-8 lg:px-8">
        <div className="flex justify-center md:justify-start">
          <div className="flex items-center gap-3">
            <img
              src="/uksw.png"
              alt="Logo UKSW"
              className="h-auto w-[100px] object-contain"
            />
            <img
              src="/did.png"
              alt="DIGFIN"
              className="h-auto w-[180px] object-contain sm:w-[228px]"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-center md:gap-12 md:text-left">
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

          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <img
                src="/lokasi.png"
                alt="Lokasi"
                className="h-5 w-auto object-contain"
              />
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Lokasi
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Kampus Diponegoro
            </p>
            <p className="text-sm leading-relaxed text-white/80">
              Belakang Gedung F
            </p>
            <p className="text-sm leading-relaxed text-white/80">
              Jl. Diponegoro No. 52 - 60, Salatiga, Indonesia
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start">
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
                src="/instagram putih.png"
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