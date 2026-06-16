import { API_BASE_URL } from '../utils/constants'

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

const handleUnauthorized = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
  window.location.href = '/login'
}

export const getUsers = async () => {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}/admin/users`, {
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

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener usuarios.')
  }

  return data.data.map(
    (u: {
      id: number
      first_name: string
      last_name: string
      email: string
      role: string
      is_active: boolean
      created_at: string
      portfolio?: { global_privacy: string }
    }) => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`,
      email: u.email,
      role: u.role === 'professional' ? 'Profesional' : 'Administrador',
      status: u.is_active ? 'Activo' : 'Inactivo',
      registro: new Date(u.created_at).toLocaleDateString('es-ES'),
      portfolio: u.portfolio?.global_privacy === 'public' ? 'Publicado' : 'Privado'
    })
  )
}

export const toggleUserStatus = async (userId: number): Promise<void> => {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/toggle-status`, {
    method: 'PATCH',
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

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error al cambiar el estado del usuario.')
  }

  return data
}

export const getActivityLogs = async (params: { user_id?: number; per_page?: number } = {}) => {
  const token = getToken()
  const queryParams = new URLSearchParams()
  if (params.user_id) queryParams.append('user_id', params.user_id.toString())
  if (params.per_page) queryParams.append('per_page', params.per_page.toString())

  const response = await fetch(`${API_BASE_URL}/admin/activity-log?${queryParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (response.status === 401) {
    handleUnauthorized()
    return { data: [], meta: { current_page: 1, per_page: 20, total: 0 } }
  }

  const data = await response.json()
  console.log('Activity logs data:', data)

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener el historial de actividad.')
  }

  return {
    data: data.data.map(
      (log: {
        id: number
        event: string
        created_at: string
        log_name: string
        description?: string
        properties?: {
          attributes?: Record<string, unknown>
          old?: Record<string, unknown>
        }
        causer?: {
          first_name?: string
          last_name?: string
          email?: string
        }
        subject?: {
          first_name?: string
          last_name?: string
          email?: string
        }
      }) => {
        const attributes = log.properties?.attributes || {}
        const old = log.properties?.old || {}

        let displayName = 'Sistema'

        if (log.causer) {
          displayName =
            log.causer.first_name || log.causer.last_name
              ? `${log.causer.first_name || ''} ${log.causer.last_name || ''}`.trim()
              : log.causer.email || 'Usuario'
        } else if (attributes.first_name || attributes.last_name) {
          displayName =
            `${String(attributes.first_name || '')} ${String(attributes.last_name || '')}`.trim()
        } else if (old.first_name || old.last_name) {
          displayName = `${String(old.first_name || '')} ${String(old.last_name || '')}`.trim()
        } else if (attributes.email || old.email) {
          displayName = String(attributes.email || old.email)
        }

        let affectedUser = null
        if (log.subject) {
          affectedUser =
            log.subject.first_name || log.subject.last_name
              ? `${log.subject.first_name || ''} ${log.subject.last_name || ''}`.trim()
              : log.subject.email || 'Usuario'
        }

        return {
          id: log.id,
          user_name: displayName,
          affected_user: affectedUser,
          event: log.event,
          timestamp: new Date(log.created_at).toLocaleString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          detail: formatLogDetail(log),
          raw_date: log.created_at,
          log_name: log.log_name,
          properties: log.properties
        }
      }
    ),

    meta: data.meta
  }
}

const formatLogDetail = (log: {
  event: string
  properties?: Record<string, unknown>
  log_name?: string
  description?: string
}) => {
  const props = log.properties || {}
  const attributes = (props.attributes as Record<string, unknown>) || {}
  const old = (props.old as Record<string, unknown>) || {}

  switch (log.event) {
    case 'login':
      return 'Inicio de sesión exitoso.'
    case 'login_failed':
      return 'Intento de sesión fallido por credenciales incorrectas.'
    case 'logout':
      return 'Cierre de sesión del sistema.'
    case 'created': {
      const importantFields = ['first_name', 'last_name', 'email']
      const userFields = Object.keys(attributes)
        .filter((key) => importantFields.includes(key))
        .map((key) => `${translateKey(key)}: ${String(attributes[key])}`)
        .join(', ')

      if (userFields) return `Usuario registrado: ${userFields}`

      const otherFields = Object.keys(attributes)
        .filter((key) => !['created_at', 'updated_at', 'id', 'password'].includes(key))
        .map((key) => `${translateKey(key)}: ${String(attributes[key])}`)
        .join(', ')
      return otherFields ? `Registrado: ${otherFields}` : `Nuevo registro en ${log.log_name}.`
    }

    case 'updated': {
      const logName = (log.log_name || '').toLowerCase()
      const attrs = { ...old, ...attributes }
      const isActiveChange =
        attributes.is_active !== undefined &&
        old.is_active !== undefined &&
        String(attributes.is_active) !== String(old.is_active)

      if (isActiveChange) {
        if (logName.includes('certification') || logName.includes('certific') || attrs.issuing_entity) {
          const name = attrs.name ? String(attrs.name) : 'certificación'
          const visible = attributes.is_active === true || attributes.is_active === 'true' || attributes.is_active === 1
          return visible
            ? `Certificación habilitada en portafolio: ${name}.`
            : `Certificación ocultada en portafolio: ${name}.`
        }

        if (
          logName.includes('work_experience') ||
          logName.includes('work-experience') ||
          logName.includes('experience') ||
          attrs.position ||
          attrs.company
        ) {
          const position = attrs.position ? String(attrs.position) : 'experiencia'
          const company = attrs.company ? String(attrs.company) : ''
          const visible = attributes.is_active === true || attributes.is_active === 'true' || attributes.is_active === 1
          const label = company ? `${position} en ${company}` : position
          return visible
            ? `Experiencia habilitada en portafolio: ${label}.`
            : `Experiencia ocultada en portafolio: ${label}.`
        }
      }

      const changes = Object.keys(attributes)
        .filter((key) => key !== 'updated_at')
        .filter((key) => {
          const oldVal = old[key] !== undefined && old[key] !== null ? String(old[key]) : null
          const newVal =
            attributes[key] !== undefined && attributes[key] !== null
              ? String(attributes[key])
              : null
          return oldVal !== newVal
        })
        .map((key) => {
          const oldVal = old[key] !== undefined && old[key] !== null ? String(old[key]) : 'Ø'
          const newVal =
            attributes[key] !== undefined && attributes[key] !== null
              ? String(attributes[key])
              : 'Ø'
          return `${translateKey(key)}: ${oldVal} → ${newVal}`
        })
        .join(', ')
      return changes ? changes : `Actualización en ${log.log_name}.`
    }

    case 'deleted':
      return `Eliminación de registro en ${log.log_name}.`
    case 'profile_updated':
      return 'Actualización del perfil de usuario.'
    case 'portfolio_edit':
      return 'Cambio en experiencia y habilidades del portafolio.'
    default:
      return log.description || `Evento ${log.event} registrado.`
  }
}

const translateKey = (key: string) => {
  const map: Record<string, string> = {
    first_name: 'Nombre',
    last_name: 'Apellido',
    email: 'Email',
    role: 'Rol',
    is_active: 'Estado',
    password: 'Contraseña',
    biography: 'Biografía',
    phone: 'Teléfono',
    location: 'Ubicación',
    github_url: 'GitHub',
    linkedin_url: 'LinkedIn',
    global_privacy: 'Privacidad'
  }
  return map[key] || key
}

export const getProjectCategories = async (
  params: { search?: string; status?: string; page?: number } = {}
) => {
  const token = getToken()
  const queryParams = new URLSearchParams()
  if (params.search) queryParams.append('search', params.search)
  if (params.status) {
    if (params.status === 'ACTIVO') queryParams.append('status', 'active')
    else if (params.status === 'INACTIVO') queryParams.append('status', 'inactive')
  }
  if (params.page) queryParams.append('page', params.page.toString())

  const response = await fetch(
    `${API_BASE_URL}/admin/project-categories?${queryParams.toString()}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (response.status === 401) {
    handleUnauthorized()
    return { data: [], meta: { current_page: 1, last_page: 1, total: 0 } }
  }

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Error al obtener categorías.')

  // Debug log para verificar que el backend sí envía las descripciones
  console.log('Categories API Response Data:', data.data)

  return {
    data: data.data.map(
      (cat: { id: number | string; name: string; description: string | null; status: string }) => ({
        id: cat.id.toString(),
        name: cat.name,
        description: cat.description || '', // Fallback a string vacío si es null
        status: cat.status === 'active' || cat.status === 'ACTIVO' ? 'ACTIVO' : 'INACTIVO'
      })
    ),
    meta: data.meta
  }
}

export const createProjectCategory = async (payload: { name: string; description: string }) => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/admin/project-categories`, {
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
    return
  }
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Error al crear la categoría.')
  return data
}

export const updateProjectCategory = async (
  id: string,
  payload: { name: string; description: string }
) => {
  const token = getToken()
  // Solamente enviamos name y description
  const response = await fetch(`${API_BASE_URL}/admin/project-categories/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  if (response.status === 401) {
    handleUnauthorized()
    return
  }
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Error al actualizar la categoría.')
  return data
}

export const toggleProjectCategoryStatus = async (id: string) => {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/admin/project-categories/${id}/toggle-status`, {
    method: 'PATCH',
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
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Error al cambiar el estado.')
  return data
}
