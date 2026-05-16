import { API_BASE_URL } from '../utils/constants'

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

export const getLinksPrivacyData = async () => {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}/portfolio`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error('Error al obtener los enlaces y privacidad')
  }

  const result = await response.json()
  return result.data
}

interface LinksPrivacyPayload {
  nombre: string
  apellido: string
  linkedin?: string | null
  github?: string | null
  global_privacy: string
  show_projects?: boolean
  show_skills?: boolean
  show_experience?: boolean
  show_certifications?: boolean
}

export const updateLinksPrivacyData = async (payload: LinksPrivacyPayload) => {
  const token = getToken()

  // Recuperar datos actuales para preservar datos personales
  const currentData = await getLinksPrivacyData()

  // Preparamos el cuerpo fusionando datos actuales con los nuevos
  const body: Record<string, unknown> = {
    first_name: payload.nombre,
    last_name: payload.apellido,
    linkedin_url: payload.linkedin?.trim() || null,
    github_url: payload.github?.trim() || null,
    global_privacy: payload.global_privacy,
    // Se preserva datos personales que ya existen
    profession: currentData?.profession,
    phone: currentData?.phone,
    location: currentData?.location,
    biography: currentData?.biography,
    // Privacidad por sección
    ...(payload.show_projects !== undefined && { show_projects: payload.show_projects }),
    ...(payload.show_skills !== undefined && { show_skills: payload.show_skills }),
    ...(payload.show_experience !== undefined && { show_experience: payload.show_experience }),
    ...(payload.show_certifications !== undefined && { show_certifications: payload.show_certifications }),
  }

  const response = await fetch(`${API_BASE_URL}/portfolio`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const result = await response.json()

  if (!response.ok) {
    // Si hay error de validación (422), mostramos qué campo falló
    const errorMessage = result.errors
      ? Object.values(result.errors).flat().join(' ')
      : result.message
    throw new Error(errorMessage || 'Error al actualizar los datos')
  }

  return result
}
