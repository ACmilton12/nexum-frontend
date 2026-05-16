import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../../utils/constants'
import type { FeaturedProfile, GlobalStats } from '../types'

export function useFeaturedProfiles() {
  const [profiles, setProfiles] = useState<FeaturedProfile[]>([])
  const [stats, setStats] = useState<GlobalStats>({
    total_users: 0,
    total_projects: 0,
    total_views: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/featured-profiles`)
        if (!res.ok) throw new Error('Error al cargar perfiles')
        const json = await res.json()

        // Perfiles destacados
        if (Array.isArray(json.data)) setProfiles(json.data)

        // Estadísticas globales
        const statsSource = json.stats ?? json
        setStats({
          total_users: statsSource.total_users ?? 0,
          total_projects: statsSource.total_projects ?? 0,
          total_views: statsSource.total_views ?? 0
        })
      } catch (err) {
        console.error('Error cargando featured profiles:', err)
        setProfiles([])
        setStats({ total_users: 0, total_projects: 0, total_views: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { profiles, stats, loading }
}
