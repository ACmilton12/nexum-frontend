import { API_BASE_URL } from '../utils/constants'

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

export interface Project {
  id: number
  title: string
  description: string
  role: string
  project_url?: string
  archived: boolean
  category?: {
    id: number
    name: string
  }
  skills?: {
    id: number
    name: string
  }[]
  created_at: string
  updated_at?: string
}

export const getProjects = async (): Promise<Project[]> => {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    if (response.status === 404) {
      return []
    }
    throw new Error('Error al obtener los proyectos')
  }

  const result = await response.json()
  return result.data || result || []
}

export const createProject = async (data: {
  title: string
  description?: string
  project_url?: string
  category_id?: number | null
  skill_ids?: number[]
}): Promise<Project> => {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || 'Error al crear el proyecto')
  }

  const result = await response.json()
  return result.data || result
}

export const updateProject = async (
  id: number,
  data: {
    title: string
    description?: string
    project_url?: string
    category_id?: number | null
    skill_ids?: number[]
  }
): Promise<Project> => {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || 'Error al actualizar el proyecto')
  }

  const result = await response.json()
  return result.data || result
}

export const deleteProject = async (id: number): Promise<void> => {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.message || 'Error al eliminar el proyecto')
  }
}

export interface ProjectCategory {
  id: number
  name: string
}

export interface Skill {
  id: number
  name: string
  type: string
  category: string
}

export const getCategories = async (): Promise<ProjectCategory[]> => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/project-categories`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!response.ok) return []
  const result = await response.json()
  return result.data || result || []
}

export const getSkillsCatalog = async (): Promise<Skill[]> => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/projects/skills`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!response.ok) return []
  const result = await response.json()
  const data = result.data || result || {}

  // Aplanar el diccionario agrupado a un solo array
  const skills: Skill[] = []
  Object.values(data).forEach((group: unknown) => {
    if (Array.isArray(group)) {
      skills.push(...(group as Skill[]))
    }
  })
  return skills.sort((a, b) => a.name.localeCompare(b.name))
}

export const suggestCategory = async (
  projectId: number,
  data: { name: string; justification: string }
): Promise<void> => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/category-suggestions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || 'Error al enviar la sugerencia de categoría')
  }
}
