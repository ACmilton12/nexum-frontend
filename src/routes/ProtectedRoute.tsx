import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRole?: 'admin' | 'professional'
  allowedRoles?: ('admin' | 'professional')[]
}

const ProtectedRoute = ({ children, allowedRole, allowedRoles }: ProtectedRouteProps) => {
  const { token, user } = useAuth()

  // Si no hay token redirige al login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  const userRole = user?.role as 'admin' | 'professional' | undefined

  // Si se especifica allowedRoles (arreglo)
  if (allowedRoles) {
    if (!userRole || !allowedRoles.includes(userRole)) {
      if (userRole === 'admin') {
        return <Navigate to="/admin" replace />
      } else {
        return <Navigate to="/portfolio" replace />
      }
    }
  }
  // Si se especifica allowedRole (string único)
  else if (allowedRole && userRole !== allowedRole) {
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to="/portfolio" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
