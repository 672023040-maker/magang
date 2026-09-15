import { useEffect, useState } from 'react'
import { kontak, profil, project, struktur } from '../api'
import type { Kontak, Profil, Project, Struktur } from '../types'

export interface LandingData {
  profil: Profil | null
  struktur: Struktur[]
  project: Project[]
  kontak: Kontak | null
}

const emptyData: LandingData = {
  profil: null,
  struktur: [],
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
      project.get(),
      kontak.get(),
    ])
      .then(([p, s, pr, k]) => {
        setData({ profil: p, struktur: s, project: pr, kontak: k })
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}