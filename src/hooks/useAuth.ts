const useAuth = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')

  const user = userStr ? JSON.parse(userStr) : null

  const isAdmin = user?.role === 'admin'
  const isProfessional = user?.role === 'professional'

  return { token, user, isAdmin, isProfessional }
}

export default useAuth
