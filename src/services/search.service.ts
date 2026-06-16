import { API_BASE_URL } from '../utils/constants'

export interface SearchFilters {
  q?: string
  skills?: string[]
  area?: string
  per_page?: number
  page?: number
}

export interface PortfolioUser {
  id: number
  first_name: string
  last_name: string
  email: string
}

export interface SearchResult {
  id: number
  user: PortfolioUser
  profession: string
  biography: string | null
  location: string | null
  avatar_url: string | null
  linkedin_url: string | null
  github_url: string | null
  skills?: string[] // Note: Original backend doesn't provide this in Resource, but we keep it just in case
  views_count: number
  updated_at: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface SearchResponse {
  data: SearchResult[]
  meta: PaginationMeta
}

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

export const searchProfessionals = async (filters: SearchFilters): Promise<SearchResponse> => {
  const token = getToken()
  const params = new URLSearchParams()

  if (filters.q) params.append('q', filters.q)
  if (filters.area) params.append('area', filters.area)
  if (filters.page) params.append('page', filters.page.toString())
  if (filters.per_page) params.append('per_page', filters.per_page.toString())

  if (filters.skills && filters.skills.length > 0) {
    filters.skills.forEach((skill) => params.append('skills[]', skill))
  }

  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/search/professionals?${params.toString()}`, {
    method: 'GET',
    headers
  })

  if (!response.ok) {
    throw new Error('Error al buscar profesionales')
  }

  return await response.json()
}
