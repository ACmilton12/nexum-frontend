import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRole: 'admin' | 'professional'
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { token, user } = useAuth()

  // Si no hay token redirige al login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Si el rol no coincide redirige a su dashboard
  if (user?.role !== allowedRole) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to="/profolio" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
