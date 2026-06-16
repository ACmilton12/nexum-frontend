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
  is_active: boolean
}

export const getExperiences = async (): Promise<WorkExperience[]> => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  }

  const [activeRes, inactiveRes] = await Promise.all([
    fetch(`${API_BASE_URL}/work-experiences`, { headers }),
    fetch(`${API_BASE_URL}/work-experiences?status=inactive`, { headers })
  ])

  if (activeRes.status === 401 || inactiveRes.status === 401) {
    handleUnauthorized()
    return []
  }

  const activeData = await activeRes.json()
  const inactiveData = await inactiveRes.json()

  if (!activeRes.ok) throw new Error(activeData.message || 'Error al obtener experiencias activas.')
  if (!inactiveRes.ok) throw new Error(inactiveData.message || 'Error al obtener experiencias inactivas.')

  const active = activeData.data || activeData || []
  const inactive = inactiveData.data || inactiveData || []

  const combined = [...active, ...inactive].sort((a: WorkExperience, b: WorkExperience) => {
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  })

  return combined
}

export const toggleExperienceVisibility = async (id: number): Promise<boolean> => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/work-experiences/${id}/toggle`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (response.status === 401) {
    handleUnauthorized()
    throw new Error('No autorizado')
  }

  const data = await response.json()
  if (!response.ok) throw data
  return data.data?.is_active ?? true
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
