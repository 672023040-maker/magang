export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#dbba99] px-5">
      <div className="w-full max-w-xl text-center">
        <p className="font-display text-[clamp(5rem,20vw,9rem)] font-bold leading-none text-[#000000]">
          404
        </p>

        <h1 className="mt-6 font-display text-lg font-bold uppercase tracking-wide text-stone-900 md:text-2xl">
          Halaman yang Anda cari tidak ditemukan
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-700">
          Alamat halaman mungkin salah, sudah dipindah, atau tidak lagi tersedia.
          Silakan kembali ke beranda atau ke halaman sebelumnya untuk melanjutkan.
        </p>
      </div>
    </div>
  )
}