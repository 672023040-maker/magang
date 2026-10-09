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
        <div className="flex min-h-screen items-center justify-center bg-[#dbba99] px-5">
          <div className="w-full max-w-xl text-center">
            <p className="font-display text-[clamp(4rem,16vw,7rem)] font-bold leading-none text-black">
              Ups
            </p>

            <h1 className="mt-6 font-display text-lg font-bold uppercase tracking-wide text-stone-900 md:text-2xl">
              Terjadi kesalahan pada halaman
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-700">
              Sesuatu tidak berjalan seperti seharusnya. Silakan muat ulang halaman. Jika masalah
              berlanjut, hubungi administrator.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-85"
              >
                Muat Ulang
              </button>
              <a
                href="/"
                className="rounded-full border border-stone-900 px-6 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-900 hover:text-white"
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
