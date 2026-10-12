import type { ImgHTMLAttributes } from 'react'

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

const COLORS = [
  'bg-brand-500',
  'bg-brand-600',
  'bg-accent-500',
  'bg-accent-600',
  'bg-stone-600',
  'bg-stone-700',
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join('')
    .slice(0, 2)
}

function getColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

export function Avatar({ src, name, size = 'md', className = '', alt, ...rest }: AvatarProps) {
  const initials = getInitials(name)
  const bgColor = getColor(name)
  const sizeClass = SIZE_CLASSES[size]

  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? name}
        className={`rounded-full object-cover ${sizeClass} ${className}`}
        {...rest}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full ${bgColor} text-white font-medium ${sizeClass} ${className}`}
      aria-label={name}
      {...rest}
    >
      {initials}
    </div>
  )
}