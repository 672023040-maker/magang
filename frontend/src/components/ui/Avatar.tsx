import type { ImgHTMLAttributes } from 'react'

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'initials' | 'persona'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const INITIALS_SIZE_CLASSES = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const COLORS = [
  'bg-brand-500',
  'bg-brand-600',
  'bg-accent-500',
  'bg-accent-600',
  'bg-stone-600',
  'bg-stone-700',
]

const PERSONA_COLORS = [
  { skin: '#FDD6B5', hair: '#8B5E3C', shirt: '#4A6FA5' },
  { skin: '#E8B8A0', hair: '#5D4037', shirt: '#2E7D32' },
  { skin: '#D4A574', hair: '#3E2723', shirt: '#C62828' },
  { skin: '#F5C6A5', hair: '#4E342E', shirt: '#5C6BC0' },
  { skin: '#E0AC8C', hair: '#263238', shirt: '#00897B' },
  { skin: '#F8D4B8', hair: '#1B1B1B', shirt: '#6A1B9A' },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join('')
    .slice(0, 2)
}

function getHash(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

function getColor(name: string): string {
  return COLORS[getHash(name) % COLORS.length]
}

function getPersonaColors(name: string) {
  return PERSONA_COLORS[getHash(name) % PERSONA_COLORS.length]
}

function InitialsAvatar({ name, size = 'md', className = '' }: { name: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const initials = getInitials(name)
  const bgColor = getColor(name)
  const sizeClass = SIZE_CLASSES[size]
  const textSizeClass = INITIALS_SIZE_CLASSES[size]

  return (
    <div
      className={`flex items-center justify-center rounded-full ${bgColor} text-white font-medium ${sizeClass} ${textSizeClass} ${className}`}
      aria-label={name}
    >
      {initials}
    </div>
  )
}

function PersonaAvatar({ name, size = 'md', className = '' }: { name: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const colors = getPersonaColors(name)
  const hash = getHash(name)
  const sizePx = size === 'sm' ? 32 : size === 'md' ? 40 : 48
  const headSize = Math.round(sizePx * 0.55)
  const eyeSize = Math.round(headSize * 0.12)
  const eyeOffset = Math.round(headSize * 0.18)
  const mouthY = Math.round(headSize * 0.65)
  const bodyWidth = Math.round(sizePx * 0.85)
  const bodyHeight = Math.round(sizePx * 0.45)
  const shirtColor = colors.shirt
  const skinColor = colors.skin
  const hairColor = colors.hair

  // Vary simple features based on hash
  const eyeType = hash % 3 // 0: simple dots, 1: slight angle, 2: round
  const hasSmile = hash % 2 === 0

  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox={`0 0 ${sizePx} ${sizePx}`}
      className={`rounded-full ${className}`}
      aria-label={name}
      role="img"
    >
      <defs>
        <clipPath id={`head-clip-${hash}`}>
          <circle cx={sizePx / 2} cy={sizePx / 2} r={headSize / 2} />
        </clipPath>
      </defs>

      {/* Body / Shirt */}
      <ellipse
        cx={sizePx / 2}
        cy={sizePx - bodyHeight / 2}
        rx={bodyWidth / 2}
        ry={bodyHeight / 2}
        fill={shirtColor}
      />

      {/* Hair (behind head) */}
      <path
        d={`M${sizePx / 2 - headSize / 2} ${sizePx / 2 - headSize / 2} 
           Q${sizePx / 2} ${sizePx / 2 - headSize * 0.75} ${sizePx / 2 + headSize / 2} ${sizePx / 2 - headSize / 2}
           Q${sizePx / 2 + headSize * 0.5} ${sizePx / 2} ${sizePx / 2} ${sizePx / 2 + headSize * 0.5}
           Q${sizePx / 2 - headSize * 0.5} ${sizePx / 2} ${sizePx / 2 - headSize / 2} ${sizePx / 2 - headSize / 2}`}
        fill={hairColor}
      />

      {/* Head */}
      <circle
        cx={sizePx / 2}
        cy={sizePx / 2}
        r={headSize / 2}
        fill={skinColor}
      />

      {/* Face features */}
      <g clip-path={`url(#head-clip-${hash})`}>
        {/* Eyes */}
        {eyeType === 0 && (
          <>
            <circle cx={sizePx / 2 - eyeOffset} cy={sizePx / 2 - headSize * 0.05} r={eyeSize} fill="#2D2D2D" />
            <circle cx={sizePx / 2 + eyeOffset} cy={sizePx / 2 - headSize * 0.05} r={eyeSize} fill="#2D2D2D" />
          </>
        )}
        {eyeType === 1 && (
          <>
            <ellipse cx={sizePx / 2 - eyeOffset} cy={sizePx / 2 - headSize * 0.05} rx={eyeSize} ry={eyeSize * 0.7} fill="#2D2D2D" transform={`rotate(-10 ${sizePx / 2 - eyeOffset} ${sizePx / 2 - headSize * 0.05})`} />
            <ellipse cx={sizePx / 2 + eyeOffset} cy={sizePx / 2 - headSize * 0.05} rx={eyeSize} ry={eyeSize * 0.7} fill="#2D2D2D" transform={`rotate(10 ${sizePx / 2 + eyeOffset} ${sizePx / 2 - headSize * 0.05})`} />
          </>
        )}
        {eyeType === 2 && (
          <>
            <circle cx={sizePx / 2 - eyeOffset} cy={sizePx / 2 - headSize * 0.05} r={eyeSize * 1.2} fill="#2D2D2D" />
            <circle cx={sizePx / 2 + eyeOffset} cy={sizePx / 2 - headSize * 0.05} r={eyeSize * 1.2} fill="#2D2D2D" />
            <circle cx={sizePx / 2 - eyeOffset} cy={sizePx / 2 - headSize * 0.05} r={eyeSize * 0.5} fill="white" />
            <circle cx={sizePx / 2 + eyeOffset} cy={sizePx / 2 - headSize * 0.05} r={eyeSize * 0.5} fill="white" />
          </>
        )}

        {/* Mouth */}
        {hasSmile ? (
          <path
            d={`M${sizePx / 2 - eyeOffset} ${mouthY} Q${sizePx / 2} ${mouthY + 4} ${sizePx / 2 + eyeOffset} ${mouthY}`}
            stroke="#2D2D2D"
            strokeWidth={Math.max(1.5, sizePx * 0.03)}
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <line
            x1={sizePx / 2 - eyeOffset * 0.7}
            y1={mouthY}
            x2={sizePx / 2 + eyeOffset * 0.7}
            y2={mouthY}
            stroke="#2D2D2D"
            strokeWidth={Math.max(1.5, sizePx * 0.03)}
            strokeLinecap="round"
          />
        )}
      </g>
    </svg>
  )
}

export function Avatar({ src, name, size = 'md', variant = 'persona', className = '', alt, ...rest }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? name}
        className={`rounded-full object-cover ${SIZE_CLASSES[size]} ${className}`}
        {...rest}
      />
    )
  }

  if (variant === 'initials') {
    return <InitialsAvatar name={name} size={size} className={className} />
  }

  return <PersonaAvatar name={name} size={size} className={className} />
}