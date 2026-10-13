export function Hero() {
  return (
    <section
      id="hero"
      className="relative mt-[84px] flex min-h-[calc(100svh-84px)] w-full items-center justify-center overflow-hidden bg-[#101820]"
    >
      {/* Background: satu gambar per breakpoint, tidak pernah berulang */}
      <img
        src="/hero4-mobile.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
      />
      <img
        src="/hero7.png"
        alt=""
        aria-hidden
        className="absolute inset-0 hidden h-full w-full object-cover object-top md:block"
      />

      {/* Overlay agar teks tetap terbaca dan gambar tidak "ramai" */}
      <div aria-hidden className="absolute inset-0 bg-[#101820]/50" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#101820]"
      />

      <div className="relative z-10 flex w-full flex-col items-center px-5 py-16 text-center">
        <p className="mb-3 font-inter text-[30px] font-semibold text-white">
          Selamat Datang Di
        </p>

        <h1 className="animate-fade-in-down font-poppins text-[clamp(1.75rem,5.5vw,4rem)] font-bold uppercase leading-tight text-white">
          Digitalisasi &amp; Fintech
        </h1>

        <p className="mx-auto mt-10 max-w-[750px] font-inter text-[clamp(0.875rem,1.5vw,1.25rem)] leading-[1.55] text-white md:mt-12">
          Digfin merupakan bagian dari DID UKSW yang mendukung transformasi digital melalui 
          teknologi dan inovasi layanan digital.Kami menghadirkan solusi teknologi terintegrasi 
          untuk membangun ekosistem digital UKSW yang inovatif dan adaptif.
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
  )
}