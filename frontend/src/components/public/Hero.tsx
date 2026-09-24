import type { CSSProperties } from 'react'

export function Hero() {
  return (
    <>
      <section
        id="hero"
        className="relative min-h-[600px] overflow-visible bg-white md:min-h-[740px]"
        style={{ '--hero-background': 'url(/hero4.jpg)' } as CSSProperties}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: 'var(--hero-background, none)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        <div className="relative z-10 px-5 pb-20 pt-[165px] text-center">
          <p className="mb-3 font-inter text-[30px] font-semibold text-white">
            Selamat Datang Di
          </p>

          <h1 className="animate-fade-in-down font-poppins text-[clamp(1.75rem,5.5vw,4rem)] font-bold uppercase leading-tight text-white">
            Digitalisasi dan Fintech
          </h1>

          <p className="mx-auto mt-10 max-w-[850px] font-inter text-[clamp(0.875rem,1.5vw,1.25rem)] leading-[1.55] text-white md:mt-12">
            Digitalisasi dan Fintech merupakan bagian dari Direktorat
            Infrastruktur dan Digitalisasi (DID) Universitas Kristen Satya
            Wacana yang berperan dalam mendukung transformasi digital melalui
            pengembangan dan pemanfaatan teknologi informasi serta inovasi
            layanan digital. Kami berkomitmen menghadirkan solusi teknologi
            yang efektif, terintegrasi, dan berkelanjutan untuk mendukung
            kebutuhan akademik maupun nonakademik serta menciptakan ekosistem
            digital UKSW yang inovatif dan adaptif.
          </p>

          <div className="mt-10 flex flex-col items-center gap-5 md:flex-row md:justify-center md:gap-x-28">

            <a
              href="#kontak"
              className="flex h-[58px] w-full max-w-[320px] items-center justify-center rounded-[18px] border-2 border-white font-inter text-sm font-bold uppercase tracking-wide text-white transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-black hover:shadow-[0_10px_24px_rgba(0,0,0,0.35)] md:w-[300px]"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>
    </>
  )
}