import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { FloatingSocial } from '../public/FloatingSocial'

interface PublicLayoutProps {
  children: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingSocial />
    </div>
  )
}