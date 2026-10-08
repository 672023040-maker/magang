import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export function Checkbox({ label, hint, id, className = '', ...rest }: CheckboxProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center gap-2 text-sm text-stone-700"
      >
        <input
          id={id}
          type="checkbox"
          className={`h-4 w-4 rounded border-stone-300 text-brand-600 accent-brand-600 transition focus:ring-2 focus:ring-brand-100 ${className}`}
          {...rest}
        />
        {label && <span>{label}</span>}
      </label>
      {hint && <p className="text-xs text-stone-500">{hint}</p>}
    </div>
  )
}