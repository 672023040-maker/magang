import type { CSSProperties } from 'react'

export function Hero() {
  return (
    <>
      <section
        id="hero"
        className="relative min-h-[600px] overflow-visible bg-[#111111] md:min-h-[660px]"
        style={{ '--hero-background': 'none' } as CSSProperties}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundColor: '#111111',
            backgroundImage: 'var(--hero-background, none)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 px-5 pb-20 pt-24 text-center md:pt-28">
          <h1 className="font-display text-[clamp(1.75rem,5.5vw,4rem)] font-bold uppercase leading-tight text-[#70B52A]">
            Digitalisasi dan Fintech
          </h1>

          <p className="mx-auto mt-10 max-w-[1100px] text-[clamp(0.875rem,1.5vw,1.25rem)] leading-[1.55] text-white md:mt-12">
            DIGITALISASI DAN FINTECH MERUPAKAN BAGIAN DARI DIREKTORAT
            INFRASTRUKTUR DAN DIGITALISASI (DID) UNIVERSITAS KRISTEN SATYA
            WACANA YANG BERPERAN DALAM MENDUKUNG TRANSFORMASI DIGITAL MELALUI
            PENGEMBANGAN DAN PEMANFAATAN TEKNOLOGI INFORMASI SERTA INOVASI
            LAYANAN DIGITAL. KAMI BERKOMITMEN MENGHADIRKAN SOLUSI TEKNOLOGI
            YANG EFEKTIF, TERINTEGRASI, DAN BERKELANJUTAN UNTUK MENDUKUNG
            KEBUTUHAN AKADEMIK MAUPUN NONAKADEMIK SERTA MENCIPTAKAN EKOSISTEM
            DIGITAL UKSW YANG INOVATIF DAN ADAPTIF.
          </p>

          <div className="mt-10 flex flex-col items-center gap-5 md:flex-row md:justify-center md:gap-x-28">
            <a
              href="#profil"
              className="flex h-[58px] w-full max-w-[320px] items-center justify-center rounded-[18px] border-2 border-[#70B52A] text-sm font-bold uppercase tracking-wide text-white transition duration-300 hover:-translate-y-1 hover:bg-[#70B52A] hover:shadow-[0_10px_24px_rgba(112,181,42,0.45)] md:w-[300px]"
            >
              Kenali Kami
            </a>
            <a
              href="#kontak"
              className="flex h-[58px] w-full max-w-[320px] items-center justify-center rounded-[18px] border-2 border-[#70B52A] text-sm font-bold uppercase tracking-wide text-white transition duration-300 hover:-translate-y-1 hover:bg-[#70B52A] hover:shadow-[0_10px_24px_rgba(112,181,42,0.45)] md:w-[300px]"
            >
              Hubungi Kami
            </a>
          </div>
        </div>

        <div className="absolute bottom-[-20px] left-1/2 z-10 grid h-[45px] w-[calc(100%-40px)] max-w-[430px] -translate-x-1/2 grid-cols-[auto_1fr_auto] items-center rounded-[9px] bg-white px-4 shadow-md shadow-black/15">
          <svg
            className="h-4 w-4 text-stone-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span className="text-center text-sm font-medium text-stone-500 transition hover:text-brand-600">
            <a
              href="https://www.uksw.edu/direktorat/direktorat-infrastruktur-dan-digitalisasi/"
              target="_blank"
              rel="noreferrer"
            >
              did.uksw.edu
            </a>
          </span>
          <svg
            className="h-4 w-4 text-stone-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </div>
      </section>

      <div className="h-[60px] bg-[#4D8000] md:h-[70px]" />
    </>
  )
}