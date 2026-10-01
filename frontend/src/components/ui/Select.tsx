import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

export function Select({
  label,
  id,
  error,
  options,
  className = '',
  ...rest
}: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${error ? 'border-red-400' : 'border-stone-300'} ${className}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}