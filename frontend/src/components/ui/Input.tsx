import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, id, error, className = '', ...rest }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${error ? 'border-red-400' : 'border-stone-300'} ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}