import { SectionContainer } from './SectionHeading'

export function KontakSection() {
  return (
    <SectionContainer id="kontak" className="bg-white">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-sm font-medium italic text-accent-600">
          05 — Kontak
        </p>
        <h2 className="mt-3 font-display text-3xl font-medium leading-snug tracking-tight text-stone-900 md:text-4xl">
          Bicara dengan kami
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-stone-600">
          Ada yang ingin ditanyakan soal DIGFIN? Kirim email ke alamat di bawah
          ini, kami akan membalas sebisanya.
        </p>

        <a
          href="mailto:did@uksw.edu"
          className="mt-8 inline-flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-6 py-4 text-sm font-medium text-stone-800 transition hover:border-brand-300 hover:bg-brand-50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
          </span>
          did@uksw.edu
        </a>
      </div>
    </SectionContainer>
  )
}