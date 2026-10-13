import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught UI error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#101820] px-5">
          <div className="w-full max-w-xl text-center">
            <p className="font-display text-[clamp(4rem,16vw,7rem)] font-bold leading-none text-[#168c8c]">
              Ups
            </p>

            <h1 className="mt-6 font-display text-lg font-bold uppercase tracking-wide text-white md:text-2xl">
              Terjadi kesalahan pada halaman
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-300">
              Sesuatu tidak berjalan seperti seharusnya. Silakan muat ulang halaman. Jika masalah
              berlanjut, hubungi administrator.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full bg-[#168c8c] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#127373]"
              >
                Muat Ulang
              </button>
              <a
                href="/"
                className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#101820]"
              >
                Ke Beranda
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
