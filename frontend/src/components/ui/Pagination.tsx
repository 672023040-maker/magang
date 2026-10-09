import type { PaginationMeta } from '../../types'
import { Button } from './Button'

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  disabled?: boolean
}

export function Pagination({ meta, onPageChange, disabled = false }: PaginationProps) {
  const { current_page, last_page, from, to, total } = meta

  if (last_page <= 1) return null

  const canPrev = current_page > 1 && !disabled
  const canNext = current_page < last_page && !disabled

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs text-stone-500">
        Menampilkan {from ?? 0}–{to ?? 0} dari {total} data
      </p>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={!canPrev}
          onClick={() => onPageChange(current_page - 1)}
        >
          Sebelumnya
        </Button>
        <span className="text-xs text-stone-600">
          Halaman {current_page} dari {last_page}
        </span>
        <Button
          type="button"
          variant="outline"
          disabled={!canNext}
          onClick={() => onPageChange(current_page + 1)}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  )
}
