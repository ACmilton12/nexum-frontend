import { useNavigate } from "react-router-dom";
import { UserCog, LogOut, Mail, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  if (!isOpen) return null;

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
      <div className="w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 text-[#1a1a2e] dark:text-gray-100">
        {/* Cabecera: Info del usuario */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#003087] dark:border-blue-500 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
            {userPhoto ? (
              <img src={userPhoto} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserCog size={32} />
            )}
          </div>
          <div className="text-center">
            <p className="font-bold text-sm dark:text-white">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{userProfession}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-1">
              <Mail size={12} /> {userEmail}
            </p>
          </div>
        </div>

        {/* Opciones */}
        <div className="p-2">
          <button
            onClick={handleGoToProfile}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors text-left dark:text-gray-200"
          >
            <UserCog size={18} className="text-[#003087] dark:text-blue-400" />
            <span>Configuración de Perfil</span>
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon size={18} className="text-yellow-400" />
              ) : (
                <Sun size={18} className="text-orange-500" />
              )}
              <span className="dark:text-gray-200">Modo Oscuro</span>
            </div>

            {/* Interruptor */}
            <div
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${isDarkMode ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"}`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isDarkMode ? "translate-x-5" : ""}`}
              />
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-4 text-sm text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-t border-gray-200 dark:border-gray-800 mt-auto"
          >
            <LogOut size={18} className="text-red-500" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserMenuModal