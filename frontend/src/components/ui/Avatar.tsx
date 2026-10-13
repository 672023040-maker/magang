import type { ImgHTMLAttributes } from 'react'

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'initials' | 'persona' | 'portrait' | 'silhouette'
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
  { skin: '#F3F4F6', hair: '#111827', shirt: '#374151' },
  { skin: '#E5E7EB', hair: '#1F2937', shirt: '#4B5563' },
  { skin: '#F3F4F6', hair: '#374151', shirt: '#6B7280' },
  { skin: '#E5E7EB', hair: '#111827', shirt: '#9CA3AF' },
  { skin: '#D1D5DB', hair: '#1F2937', shirt: '#4B5563' },
  { skin: '#E5E7EB', hair: '#111827', shirt: '#6B7280' },
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

function PortraitAvatar({ name, className = '' }: { name: string; className?: string }) {
  const colors = getPersonaColors(name)
  const hash = getHash(name)

  // viewBox 200x250 (rasio kotak foto 200x250): kepala di atas, torso di bawah.
  const cX = 100
  const cY = 95
  const headSize = 96
  const half = headSize / 2
  const eyeOffset = Math.round(headSize * 0.16)
  const eyeY = Math.round(cY - headSize * 0.05)
  const mouthY = Math.round(cY + headSize * 0.28)

  const eyeType = hash % 3
  const hasSmile = hash % 2 === 0
  const strokeWidth = 2.5

  return (
    <svg
      viewBox="0 0 200 250"
      preserveAspectRatio="xMidYMid meet"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={name}
    >
      <defs>
        <clipPath id={`portrait-head-clip-${hash}`}>
          <circle cx={cX} cy={cY} r={half} />
        </clipPath>
      </defs>

      {/* Torso / Baju */}
      <path
        d="M26 250 L26 195 Q26 145 62 132 L70 138 Q100 154 130 138 L138 132 Q174 145 174 195 L174 250 Z"
        fill={colors.shirt}
      />

      {/* Leher */}
      <rect
        x={cX - 14}
        y={Math.round(cY + half * 0.45)}
        width={28}
        height={Math.round(half * 0.9)}
        rx={6}
        fill={colors.skin}
      />

      {/* Rambut (di belakang kepala) */}
      <path
        d={`M${cX - half} ${cY - half} Q${cX} ${Math.round(cY - headSize * 0.75)} ${cX + half} ${cY - half} Q${Math.round(cX + headSize * 0.5)} ${cY} ${cX} ${cY + half} Q${Math.round(cX - headSize * 0.5)} ${cY} ${cX - half} ${cY - half}`}
        fill={colors.hair}
      />

      {/* Kepala */}
      <circle cx={cX} cy={cY} r={half} fill={colors.skin} />

      {/* Wajah */}
      <g clipPath={`url(#portrait-head-clip-${hash})`}>
        {eyeType === 0 && (
          <>
            <circle cx={cX - eyeOffset} cy={eyeY} r={4.5} fill="#2D2D2D" />
            <circle cx={cX + eyeOffset} cy={eyeY} r={4.5} fill="#2D2D2D" />
          </>
        )}
        {eyeType === 1 && (
          <>
            <ellipse
              cx={cX - eyeOffset}
              cy={eyeY}
              rx={5.5}
              ry={4}
              fill="#2D2D2D"
              transform={`rotate(-10 ${cX - eyeOffset} ${eyeY})`}
            />
            <ellipse
              cx={cX + eyeOffset}
              cy={eyeY}
              rx={5.5}
              ry={4}
              fill="#2D2D2D"
              transform={`rotate(10 ${cX + eyeOffset} ${eyeY})`}
            />
          </>
        )}
        {eyeType === 2 && (
          <>
            <circle cx={cX - eyeOffset} cy={eyeY} r={5.5} fill="#2D2D2D" />
            <circle cx={cX + eyeOffset} cy={eyeY} r={5.5} fill="#2D2D2D" />
            <circle cx={cX - eyeOffset} cy={eyeY} r={2} fill="white" />
            <circle cx={cX + eyeOffset} cy={eyeY} r={2} fill="white" />
          </>
        )}

        {hasSmile ? (
          <path
            d={`M${cX - eyeOffset} ${mouthY} Q${cX} ${mouthY + 5} ${cX + eyeOffset} ${mouthY}`}
            stroke="#2D2D2D"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <line
            x1={Math.round(cX - eyeOffset * 0.7)}
            y1={mouthY}
            x2={Math.round(cX + eyeOffset * 0.7)}
            y2={mouthY}
            stroke="#2D2D2D"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
      </g>
    </svg>
  )
}

function SilhouetteAvatar({ name, className = '' }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 250"
      preserveAspectRatio="xMidYMid meet"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={name}
    >
      {/* Kepala */}
      <circle cx="100" cy="88" r="42" fill="#F3F4F6" />
      {/* Badan/bahu */}
      <path
        d="M36 250 L40 190 Q40 140 100 128 Q160 140 160 190 L164 250 Z"
        fill="#F3F4F6"
      />
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

  if (variant === 'portrait') {
    return <PortraitAvatar name={name} className={className} />
  }

  if (variant === 'silhouette') {
    return <SilhouetteAvatar name={name} className={className} />
  }

  return <PersonaAvatar name={name} size={size} className={className} />
}