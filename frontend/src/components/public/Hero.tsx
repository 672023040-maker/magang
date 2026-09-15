export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-slate-50"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-24 pt-32 text-center md:pb-32 md:pt-40">
        <div className="animate-fade-up">
          <p className="inline-flex rounded-full border border-brand-200 bg-white px-4 py-1 text-sm font-medium text-brand-700">
            Platform Digital Fintech #1
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Masa Depan Keuangan Digital{' '}
            <span className="text-brand-600">Untuk Semua</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            DIGIFIN menghadirkan layanan keuangan digital yang mudah diakses,
            aman, dan terpercaya untuk mendukung pertumbuhan ekonomi masyarakat
            Indonesia.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#profil"
              className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
            >
              Jelajahi Layanan
            </a>
            <a
              href="#kontak"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}