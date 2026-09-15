type AlertVariant = 'success' | 'error'

interface AlertProps {
  variant: AlertVariant
  message?: string | null
}

const variantClasses: Record<AlertVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  error: 'bg-red-50 text-red-700 border-red-200',
}

export function Alert({ variant, message }: AlertProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 text-sm ${variantClasses[variant]}`}
    >
      {message}
    </div>
  )
}