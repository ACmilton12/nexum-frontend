import { API_BASE_URL } from '../utils/constants'

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

const handleUnauthorized = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
  window.location.href = '/login'
}

export interface WorkExperience {
  id: number
  position: string
  company: string
  location: string | null
  employment_type: string
  start_date: string
  end_date: string | null
  description: string | null
  verification_url: string | null
  skills?: { id: number; name: string }[]
}

export const getExperiences = async (): Promise<WorkExperience[]> => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/work-experiences`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (response.status === 401) {
    handleUnauthorized()
    return []
  }

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Error al obtener experiencias.')
  return data.data || data // Dependiendo de si viene envuelto en 'data' por el recurso de Laravel
}

export const createExperience = async (
  payload: Record<string, unknown>
): Promise<WorkExperience> => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/work-experiences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  if (response.status === 401) {
    handleUnauthorized()
    throw new Error('No autorizado')
  }

  const data = await response.json()
  if (!response.ok) throw data
  return data.data || data
}

export const updateExperience = async (
  id: number,
  payload: Record<string, unknown>
): Promise<WorkExperience> => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/work-experiences/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  if (response.status === 401) {
    handleUnauthorized()
    throw new Error('No autorizado')
  }

  const data = await response.json()
  if (!response.ok) throw data
  return data.data || data
}

export const deleteExperience = async (id: number): Promise<void> => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/work-experiences/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (response.status === 401) {
    handleUnauthorized()
    return
  }

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || 'Error al eliminar la experiencia.')
  }
}
