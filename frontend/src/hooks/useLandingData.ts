import { useEffect, useState } from 'react'
import { kontak, profil, project, struktur } from '../api'
import type { Kontak, Profil, Project, Struktur } from '../types'

export interface LandingData {
  profil: Profil | null
  struktur: Struktur[]
  project: Project[]
  kontak: Kontak | null
}

export interface LandingErrors {
  profil: boolean
  struktur: boolean
  project: boolean
  kontak: boolean
}

const emptyData: LandingData = {
  profil: null,
  struktur: [],
  project: [],
  kontak: null,
}

const emptyErrors: LandingErrors = {
  profil: false,
  struktur: false,
  project: false,
  kontak: false,
}

export function useLandingData() {
  const [data, setData] = useState<LandingData>(emptyData)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<LandingErrors>(emptyErrors)

  useEffect(() => {
    let mounted = true

    // allSettled: kalau satu endpoint gagal, bagian lain tetap tampil
    // (graceful degradation), bukan menjatuhkan seluruh landing page.
    Promise.allSettled([
      profil.get(),
      struktur.get(),
      project.get(),
      kontak.get(),
    ]).then((results) => {
      if (!mounted) return

      const next: LandingData = { ...emptyData }
      const nextErrors = { ...emptyErrors }

      const [p, s, pr, k] = results

      if (p.status === 'fulfilled') next.profil = p.value
      else nextErrors.profil = true

      if (s.status === 'fulfilled') next.struktur = s.value
      else nextErrors.struktur = true

      if (pr.status === 'fulfilled') next.project = pr.value
      else nextErrors.project = true

      if (k.status === 'fulfilled') next.kontak = k.value
      else nextErrors.kontak = true

      setData(next)
      setErrors(nextErrors)
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  const hasError = errors.profil || errors.struktur || errors.project || errors.kontak

  return { data, loading, errors, hasError }
}