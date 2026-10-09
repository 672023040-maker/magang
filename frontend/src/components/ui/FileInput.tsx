import type { InputHTMLAttributes } from 'react'
import { useState } from 'react'

interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  error?: string
  accept?: string
  maxSizeMB?: number
  allowedTypes?: string[]
  onFileChange?: (file: File | null) => void
  preview?: boolean
}

const DEFAULT_MAX_SIZE_MB = 5
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png']

export function FileInput({
  label,
  id,
  error,
  className = '',
  accept = 'image/jpeg,image/png',
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  onFileChange,
  preview = true,
  ...rest
}: FileInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Format file tidak didukung. Hanya JPG dan PNG yang diperbolehkan.'
    }

    const maxBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      return `Ukuran file melebihi batas maksimal ${maxSizeMB} MB.`
    }

    return null
  }

  const checkDimensions = (file: File): Promise<{ width: number; height: number } | null> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(null)
      }
      img.src = url
    })
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setFileError(null)
    setDimensions(null)

    if (!file) {
      onFileChange?.(null)
      return
    }

    const validationError = validateFile(file)
    if (validationError) {
      setFileError(validationError)
      onFileChange?.(null)
      return
    }

    if (preview) {
      const dims = await checkDimensions(file)
      if (dims) {
        setDimensions(dims)
        const MAX_DIMENSION = 6000
        if (dims.width > MAX_DIMENSION || dims.height > MAX_DIMENSION) {
          setFileError(`Dimensi gambar terlalu besar (maksimal ${MAX_DIMENSION}x${MAX_DIMENSION}px).`)
          onFileChange?.(null)
          return
        }
      }
      setPreviewUrl(URL.createObjectURL(file))
    }

    onFileChange?.(file)
  }

  const displayError = error ?? fileError

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type="file"
        accept={accept}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${
          displayError ? 'border-red-400' : 'border-stone-300'
        } ${className}`}
        onChange={handleChange}
        {...rest}
      />
      {displayError && <p className="text-xs text-red-600">{displayError}</p>}
      {preview && previewUrl && (
        <div className="rounded-lg border border-stone-300 p-2">
          <img
            src={previewUrl}
            alt="Pratinjau gambar"
            className="mx-auto h-28 w-full rounded object-cover"
          />
          {dimensions && (
            <p className="mt-1 text-xs text-stone-500">
              Dimensi: {dimensions.width} x {dimensions.height} px
            </p>
          )}
        </div>
      )}
    </div>
  )
}