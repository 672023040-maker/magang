import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  trailingIcon?: ReactNode
}

export function Input({ label, id, error, className = '', trailingIcon, ...rest }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${error ? 'border-red-400' : 'border-stone-300'} ${trailingIcon ? 'pr-10' : ''} ${className}`}
          {...rest}
        />
        {trailingIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone-400">
            {trailingIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}