import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({
  label,
  id,
  error,
  className = '',
  ...rest
}: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${error ? 'border-red-400' : 'border-stone-300'} ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}