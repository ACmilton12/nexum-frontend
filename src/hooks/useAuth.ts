import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const useAuth = () => {
  const { i18n } = useTranslation()
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  useEffect(() => {
    if (user?.locale && i18n.language !== user.locale) {
      i18n.changeLanguage(user.locale)
    }
  }, [user?.locale, i18n])

  const isAdmin = user?.role === 'admin'
  const isProfessional = user?.role === 'professional'

  return { token, user, isAdmin, isProfessional }
}

export default useAuth
