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
        // Fallback con datos de ejemplo si el backend no responde
        setProfiles([
          {
            first_name: 'Carlos',
            last_name: 'Mendoza',
            location: null,
            avatar_url: null,
            projects_count: 12
          },
          {
            first_name: 'Lucía',
            last_name: 'Martínez',
            location: null,
            avatar_url: null,
            projects_count: 8
          },
          {
            first_name: 'Marcelo',
            last_name: 'Vargas',
            location: null,
            avatar_url: null,
            projects_count: 15
          }
        ])
        setStats({ total_users: 1200, total_projects: 3500, total_views: 15000 })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { profiles, stats, loading }
}
