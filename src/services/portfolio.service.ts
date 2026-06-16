import { API_BASE_URL } from '../utils/constants'

export interface PortfolioUser {
  id: number
  first_name: string
  last_name: string
  email: string
}

export interface ProjectFile {
  id: number
  file_path: string
  file_type: 'image' | 'pdf'
  original_name: string
  url: string
}

export interface ProjectSkill {
  id: number
  name: string
}

export interface PortfolioProject {
  id: number
  title: string
  description: string
  category?: { id: number; name: string }
  skills?: ProjectSkill[]
  files?: ProjectFile[]
  project_url?: string
  created_at: string
}

export interface PortfolioSkill {
  id: number
  name: string
  category: string
  level: string
  type?: string
}

export interface PortfolioCertification {
  id: number
  name: string
  description?: string
  issuing_organization: string
  issue_date: string
  expiration_date?: string
  credential_id?: string
  credential_url?: string
  image_url?: string
}

export interface WorkExperience {
  id: number
  company: string
  position: string
  description?: string
  start_date: string
  end_date?: string
  is_current: boolean
  location?: string
  employment_type?: 'remote' | 'on_site' | 'hybrid'
  skills?: { name: string }[]
}

export interface AdditionalLink {
  id: number
  url: string
  platform: string
}

export interface FullPortfolio {
  id: number
  user: PortfolioUser
  profession: string
  biography: string | null
  phone: string | null
  location: string | null
  avatar_url: string | null
  linkedin_url: string | null
  github_url: string | null
  design_pattern: string
  global_privacy: 'public' | 'private'
  views_count: number

  created_at: string
  updated_at: string
  show_projects?: boolean
  show_skills?: boolean
  show_experience?: boolean
  show_certifications?: boolean
  projects?: PortfolioProject[]
  skills?: PortfolioSkill[]
  certifications?: PortfolioCertification[]
  work_experiences?: WorkExperience[]
  additional_links?: AdditionalLink[]
}


const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

export const getPublicPortfolio = async (id: string | number): Promise<FullPortfolio> => {
  const token = getToken()
  const headers: HeadersInit = {
    Accept: 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/portfolios/${id}`, {
    method: 'GET',
    headers
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Portafolio no encontrado o es privado.')
    }
    throw new Error('Error al obtener el portafolio')
  }

  return await response.json()
}

export const getPublicPortfolioLinks = async (id: string | number): Promise<AdditionalLink[]> => {
  const token = getToken()
  const headers: HeadersInit = { Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const response = await fetch(`${API_BASE_URL}/portfolios/${id}/links`, { method: 'GET', headers })
    if (!response.ok) return []
    const json = await response.json()
    return json.data || json || []
  } catch {
    return []
  }
}
