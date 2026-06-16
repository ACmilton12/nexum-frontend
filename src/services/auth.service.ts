import { API_BASE_URL } from '../utils/constants'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    role: 'admin' | 'professional'
  }
}

export const loginService = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(credentials)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Credenciales inválidas.')
  }

  return data
}

export const logoutService = async (token: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

interface RegisterCredentials {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
}

interface RegisterResponse {
  message: string
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
}

export const registerService = async (
  credentials: RegisterCredentials
): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(credentials)
  })

  const data = await response.json()

  if (!response.ok) {
    if (response.status === 422) {
      throw { status: 422, errors: data.errors, message: data.message }
    }
    throw new Error(data.message || 'Error al registrar la cuenta.')
  }

  return data
}

interface ForgotPasswordCredentials {
  email: string
}

export const forgotPasswordService = async (
  credentials: ForgotPasswordCredentials
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(credentials)
  })

  const data = await response.json()

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Demasiados intentos. Por favor, intenta más tarde.')
    }
    throw new Error(data.message || 'Error al enviar el enlace de recuperación.')
  }

  return data
}

interface ResetPasswordCredentials {
  email: string
  token: string
  password: string
  password_confirmation: string
}

export const resetPasswordService = async (
  credentials: ResetPasswordCredentials
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(credentials)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Error al restablecer la contraseña.')
  }

  return data
}

export const updateLocaleService = async (locale: string): Promise<void> => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (!token) return

  // Actualizar el objeto user localmente para que useAuth no lo revierta
  const updateLocalUser = (storage: Storage) => {
    const userStr = storage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      user.locale = locale
      storage.setItem('user', JSON.stringify(user))
    }
  }

  updateLocalUser(localStorage)
  updateLocalUser(sessionStorage)

  await fetch(`${API_BASE_URL}/auth/update-locale`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ locale })
  })
}
