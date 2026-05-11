import { useNavigate } from 'react-router-dom'
import { UserCog, LogOut, Mail } from 'lucide-react'

interface UserMenuModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  userProfession: string
  userPhoto: string
  userEmail: string
}

const UserMenuModal = ({
  isOpen,
  onClose,
  userName,
  userProfession,
  userPhoto,
  userEmail
}: UserMenuModalProps) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleGoToProfile = () => {
    onClose()
    navigate('/profile')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="absolute top-full right-0 pt-3 z-50 animate-in fade-in zoom-in duration-200">
      <div className="w-72 bg-white rounded-xl shadow-2xl border border-gray-200 text-[#1a1a2e]">
        {/* Cabecera: Info del usuario */}
        <div className="p-5 border-b border-gray-100 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#003087] flex items-center justify-center bg-gray-100 text-gray-400">
            {userPhoto ? (
              <img src={userPhoto} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserCog size={32} />
            )}
          </div>
          <div className="text-center">
            <p className="font-bold text-sm">{userName}</p>
            <p className="text-xs text-gray-500">{userProfession}</p>
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1">
              <Mail size={12} /> {userEmail}
            </p>
          </div>
        </div>

        {/* Opciones */}
        <div className="p-2">
          <button
            onClick={handleGoToProfile}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-lg transition-colors text-left"
          >
            <UserCog size={18} className="text-[#003087]" />
            <span>Configuración de Perfil</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-4 text-sm text-textMain hover:bg-gray-100 transition-colors border-t border-gray-200 mt-auto"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserMenuModal
