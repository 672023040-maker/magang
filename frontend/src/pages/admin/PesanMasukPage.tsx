import { useEffect, useState } from 'react'
import { pesanKontak } from '../../api'
import type { PesanKontak } from '../../types'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'

export function PesanMasukPage() {
  const [items, setItems] = useState<PesanKontak[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<PesanKontak | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const load = () => {
    pesanKontak
      .get()
      .then(setItems)
      .catch(() => setError('Gagal memuat pesan.'))
  }

  useEffect(() => {
    pesanKontak
      .get()
      .then(setItems)
      .catch(() => setError('Gagal memuat pesan.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (item: PesanKontak) => {
    if (!window.confirm(`Hapus pesan "${item.subjek}"?`)) return

    try {
      await pesanKontak.remove(item.id)
      setSuccess('Pesan berhasil dihapus.')
      setSelected(null)
      load()
    } catch {
      setError('Gagal menghapus pesan.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pesan Masuk</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pesan dari pengunjung via formulir kontak.
        </p>
      </div>

      <Alert variant="success" message={success} />
      <Alert variant="error" message={error} />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Belum ada pesan masuk.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Pengirim</th>
                <th className="px-4 py-3">Subjek</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">
                      {item.nama_pengirim}
                    </p>
                    <p className="text-xs text-slate-400">{item.email}</p>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-600">
                    {item.subjek}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.tanggal}</td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(item)}
                      className="text-xs font-medium text-brand-600 hover:text-brand-700"
                    >
                      Detail
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={selected !== null}
        title="Detail Pesan"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-slate-500">Pengirim</p>
              <p className="text-slate-800">
                {selected.nama_pengirim} ({selected.email})
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Subjek</p>
              <p className="text-slate-800">{selected.subjek}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Tanggal</p>
              <p className="text-slate-800">{selected.tanggal}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Pesan</p>
              <p className="whitespace-pre-line text-slate-800">{selected.pesan}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelected(null)}
              >
                Tutup
              </Button>
              <Button variant="danger" onClick={() => handleDelete(selected)}>
                Hapus
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}