import { useEffect, useState } from 'react'
import { informasi, kontak, profil, project, struktur } from '../api'
import type { Informasi, Kontak, Profil, Project, Struktur } from '../types'

export interface LandingData {
  profil: Profil | null
  struktur: Struktur[]
  informasi: Informasi[]
  project: Project[]
  kontak: Kontak | null
}

const emptyData: LandingData = {
  profil: null,
  struktur: [],
  informasi: [],
  project: [],
  kontak: null,
}

export function useLandingData() {
  const [data, setData] = useState<LandingData>(emptyData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([
      profil.get(),
      struktur.get(),
      informasi.get(),
      project.get(),
      kontak.get(),
    ])
      .then(([p, s, i, pr, k]) => {
        setData({ profil: p, struktur: s, informasi: i, project: pr, kontak: k })
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}