const keyPoints = [
  {
    title: 'Sesuai kebutuhan UKSW',
    text: 'Aplikasi dikembangkan berdasarkan kebutuhan nyata kampus.',
  },
  {
    title: 'Dikerjakan tim internal',
    text: 'Pengembangan ditangani langsung oleh tim DIGFIN UKSW.',
  },
  {
    title: 'Terus dikembangkan',
    text: 'Seluruh aplikasi dipelihara dan diperbarui secara berkala.',
  },
]

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-brand-50/60 to-stone-50"
    >
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-32 text-center md:pb-24 md:pt-40">
        <p className="text-sm font-semibold text-accent-600">
          Unit pengembangan aplikasi UKSW
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-medium leading-tight tracking-tight text-stone-900 md:text-5xl">
          Digital Finance & Fintech
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
          DIGFIN adalah unit pengembangan aplikasi digital di lingkungan
          Universitas Kristen Satya Wacana. Semua aplikasi yang dibutuhkan kampus
          dikembangkan dan dikelola di sini.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#profil"
            className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700"
          >
            Kenali Kami
          </a>
          <a
            href="#kontak"
            className="rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
          >
            Hubungi Kami
          </a>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-4 text-left sm:grid-cols-3">
          {keyPoints.map((point, i) => (
            <div
              key={point.title}
              className="flex items-start gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="font-display text-xl font-medium italic text-brand-600/70">
                0{i + 1}
              </span>
              <div>
                <p className="font-semibold text-stone-900">{point.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-stone-600">
                  {point.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}