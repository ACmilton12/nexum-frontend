import { Link } from 'react-router-dom'
import logoUmss from '../../assets/logoUmss.png' // Asegúrate de que la ruta sea correcta
import { User } from 'lucide-react' // Iconos necesarios
import { useState } from 'react'
import UserMenuModal from './UserMenuModal' // Importa el componente del modal
import useAuth from '../../hooks/useAuth' // Hook para obtener el usuario logueado
import LanguageSelector from './LanguageSelector'

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()

  const isAuthenticated = !!user
  const userName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Usuario'
    : 'Invitado'
  const userProfession =
    user?.role === 'professional'
      ? 'Profesional'
      : user?.role === 'admin'
        ? 'Administrador'
        : 'Usuario'
  const userEmail = user?.email || 'Sin correo'
  const userPhoto = user?.avatar_url || '' // Avatar desde la BD o vacío

  return (
    <nav className="w-full bg-[#001A5E] px-6 py-3 flex items-center justify-between z-50 relative">
      {' '}
      {/* Azul marino profundo */}
      {/* Logo y nombre de Nexum */}
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <div className="flex items-center gap-2">
          <img
            src={logoUmss}
            alt="Logo UMSS"
            className="w-8 h-8 object-contain rounded-full" // Añadido rounded-full para intentar hacerlo circular
          />
          <span className="text-white font-bold text-lg tracking-wide">NEXUM</span>
        </div>
      </Link>
      {/* Lógica de Usuario */}
      <div className="flex items-center gap-5">
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
            />
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
