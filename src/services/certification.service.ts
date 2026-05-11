import { API_BASE_URL } from '../utils/constants'

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

const handleUnauthorized = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
  window.location.href = '/login'
}

export interface Certification {
  id: number
  name: string
  description: string | null
  issuing_entity: string
  issue_date: string
  expiration_date: string | null
  image_url: string | null
}

export const getCertifications = async (): Promise<Certification[]> => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/portfolio/certifications`, {
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
  if (!response.ok) throw new Error(data.message || 'Error al obtener certificaciones.')
  return data.data
}

export const createCertification = async (
  payload: Record<string, unknown>
): Promise<Certification> => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/portfolio/certifications`, {
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
  if (!response.ok) throw data // Devuelve errores de validación
  return data.data
}

export const updateCertificationImage = async (id: number, file: File): Promise<Certification> => {
  const token = getToken()
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${API_BASE_URL}/portfolio/certifications/${id}/image`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: formData
  })

  if (response.status === 401) {
    handleUnauthorized()
    throw new Error('No autorizado')
  }

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Error al subir la imagen.')
  return data.data
}

export const deleteCertification = async (id: number): Promise<void> => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/portfolio/certifications/${id}`, {
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
    throw new Error(data.message || 'Error al eliminar la certificación.')
  }
}
