import type { ReactNode } from 'react'

interface SectionHeadingProps {
  index?: string
  eyebrow?: string
  title: string
  description?: string
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="flex items-center justify-center gap-4">
        {index && (
          <span className="font-display text-2xl font-medium italic leading-none text-brand-600/70">
            {index}
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[13px] font-semibold text-accent-600">{eyebrow}</p>
          )}
          <h2 className="font-display text-3xl font-medium leading-snug tracking-tight text-stone-900 md:text-4xl">
            {title}
          </h2>
        </div>
      </div>
      <div className="mx-auto mt-5 h-px max-w-64 bg-stone-300" />
      {description && (
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-stone-600">
          {description}
        </p>
      )}
    </div>
  )
}

export function SectionContainer({
  id,
  children,
  className = '',
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-4">{children}</div>
    </section>
  )
}