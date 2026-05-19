import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../../utils/constants'
import type { FeaturedProfile, GlobalStats } from '../types'

interface SearchItem {
  id: number
  user?: {
    first_name: string
    last_name: string
  }
  location?: string | null
  avatar_url?: string | null
  visits_count?: number
}

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
        const [resFeatured, resSearch] = await Promise.all([
          fetch(`${API_BASE_URL}/featured-profiles`),
          fetch(`${API_BASE_URL}/search/professionals?per_page=50`)
        ])
        if (!resFeatured.ok || !resSearch.ok) throw new Error('Error al cargar perfiles')

        const jsonFeatured = await resFeatured.json()
        const jsonSearch = await resSearch.json()

        const searchList: SearchItem[] = Array.isArray(jsonSearch.data) ? jsonSearch.data : []

        const { getProfileStats } = await import('../../../services/profileVisits.service')
        const { getPublicPortfolio } = await import('../../../services/portfolio.service')

        const profilesWithVisits = await Promise.all(
          searchList.map(async (searchItem: SearchItem) => {
            let visitsCount = 0
            try {
              if (searchItem.id) {
                const statsData = await getProfileStats(searchItem.id)
                visitsCount = statsData.visits_count || 0
              }
            } catch {
              // visitsCount queda en 0
            }
            return {
              ...searchItem,
              visits_count: visitsCount
            }
          })
        )

        profilesWithVisits.sort((a, b) => b.visits_count - a.visits_count)
        const topVisited = profilesWithVisits.slice(0, 5)

        const finalProfiles = await Promise.all(
          topVisited.map(async (item: SearchItem & { visits_count: number }) => {
            let projectsCount = 0
            try {
              if (item.id) {
                const fullPortfolio = await getPublicPortfolio(item.id)
                projectsCount = fullPortfolio.projects?.length || 0
              }
            } catch {
              // projectsCount queda en 0
            }

            return {
              id: item.id,
              first_name: item.user?.first_name || '',
              last_name: item.user?.last_name || '',
              location: item.location || null,
              avatar_url: item.avatar_url || null,
              projects_count: projectsCount,
              visits_count: item.visits_count
            }
          })
        )

        setProfiles(finalProfiles)

        const statsSource = jsonFeatured.stats ?? jsonFeatured
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