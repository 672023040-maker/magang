import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { FloatingSocial } from '../public/FloatingSocial'
import type { Kontak } from '../../types'

interface PublicLayoutProps {
  children: ReactNode
  kontak: Kontak | null
}

export function PublicLayout({ children, kontak }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar kontak={kontak} />
      <main className="flex-1">{children}</main>
      <Footer kontak={kontak} />
      <FloatingSocial kontak={kontak} />
    </div>
  )
}
