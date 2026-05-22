import { Link } from 'react-router-dom'
import logoUmss from '../../assets/logoUmss.png' // Asegúrate de que la ruta sea correcta
import { User, Menu } from 'lucide-react' // Iconos necesarios
import { useState, useEffect } from 'react'
import UserMenuModal from './UserMenuModal' // Importa el componente del modal
import useAuth from '../../hooks/useAuth' // Hook para obtener el usuario logueado
import LanguageSelector from './LanguageSelector'
import { useTranslation } from 'react-i18next'
import { API_BASE_URL } from '../../utils/constants'

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user, isAdmin } = useAuth()
  const { t } = useTranslation()
  const [fetchedAvatar, setFetchedAvatar] = useState<string>('')

  const isAuthenticated = !!user
  const userName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Usuario'
    : 'Invitado'
  const userProfession =
    user?.role === 'professional'
      ? t('navbar.user_menu.role_professional', 'Profesional')
      : user?.role === 'admin'
        ? t('navbar.user_menu.role_admin', 'Administrador')
        : t('navbar.user_menu.role_user', 'Usuario')
  const userEmail = user?.email || 'Sin correo'

  // Cargar avatar desde el portafolio del usuario
  useEffect(() => {
    if (!isAuthenticated) return
    // Si ya está en el objeto user del storage, no hacer nada
    if (user?.avatar_url) {
      return
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) return

    fetch(`${API_BASE_URL}/portfolio`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((result) => {
        const url = result?.data?.avatar_url
        if (url) {
          setFetchedAvatar(url)
          // Guardar en storage para que no se tenga que volver a cargar
          const updateStorage = (storage: Storage) => {
            const userStr = storage.getItem('user')
            if (userStr) {
              try {
                const parsed = JSON.parse(userStr)
                parsed.avatar_url = url
                storage.setItem('user', JSON.stringify(parsed))
              } catch { /* ignore */ }
            }
          }
          updateStorage(localStorage)
          updateStorage(sessionStorage)
        }
      })
      .catch(() => { /* silenciar errores de red */ })
  }, [isAuthenticated, user?.avatar_url])

  const userPhoto = user?.avatar_url || fetchedAvatar || ''

  return (
    <nav className="w-full bg-[#001A5E] px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between z-50 relative">
      {' '}
      {/* Azul marino profundo */}
      {/* Hamburger + Logo */}
      <div className="flex-1 flex items-center gap-2">
        {/* Botón hamburguesa visible solo en móvil */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors border-none bg-transparent cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="flex items-center gap-2 cursor-pointer no-underline">
          <div className="flex items-center gap-2">
            <img
              src={logoUmss}
              alt="Logo UMSS"
              className="w-8 h-8 object-contain rounded-full"
            />
            <span className="text-white font-bold text-lg tracking-wide">NEXUM</span>
          </div>
        </Link>
      </div>

      {/* Links — centro */}
      <div className="hidden md:flex flex-1 items-center justify-center gap-10">
        <Link
          to="/"
          onClick={() => {
            if (window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="text-white text-xs font-bold tracking-widest hover:text-gray-300 transition-colors duration-200 no-underline"
        >
          {t('navbar.home').toUpperCase()}
        </Link>
        <Link
          to={user ? '/directorio' : '/Home'}
          className="text-white text-xs font-bold tracking-widest hover:text-gray-300 transition-colors duration-200 no-underline"
        >
          {t('navbar.search').toUpperCase()}
        </Link>
      </div>

      {/* Lógica de Usuario */}
      <div className="flex-1 flex items-center justify-end gap-3 sm:gap-5">
        <LanguageSelector />

        {/* Separator */}
        <div className="h-8 w-px bg-white/20 hidden md:block"></div>

        {isAuthenticated && ( // Renderiza el icono de usuario y modal si está autenticado
          <div className="relative" onMouseLeave={() => setIsModalOpen(false)}>
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-700 cursor-pointer hover:bg-gray-400 transition-colors overflow-hidden border-2 border-white/20 shadow-inner"
              aria-label="Alternar menú de usuario"
            >
              {userPhoto ? (
                <img src={userPhoto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={24} />
              )}
            </button>
            <UserMenuModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              userName={userName}
              userProfession={userProfession}
              userPhoto={userPhoto}
              userEmail={userEmail}
              isAdmin={isAdmin}
            />
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
