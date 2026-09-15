import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import type { Kontak } from '../../types'

interface PublicLayoutProps {
  children: ReactNode
  kontak: Kontak | null
}

export function PublicLayout({ children, kontak }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer kontak={kontak} />
    </div>
  )
}