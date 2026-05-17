import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Shield,
  Database,
  Settings,
  FolderOpen,
  Layers,
  Wrench,
  Briefcase,
  CheckCircle,
  User,
  ChevronDown,
  IdCard,
  Link2,
  Palette,
  BellRing,
  Menu,
  X,
  Eye
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useAuth from '../../../hooks/useAuth'

interface SidebarProps {
  activeItem?: string
}

const SidebarContent = ({
  isAdmin,
  activeItem,
  isProfileOpen,
  setIsProfileOpen,
  onItemClick
}: {
  isAdmin: boolean
  activeItem: string
  isProfileOpen: boolean
  setIsProfileOpen: (open: boolean) => void
  onItemClick?: () => void
}) => {
  const { t } = useTranslation()
  const adminItems = [
    {
      label: t('sidebar.dashboard'),
      icon: <LayoutDashboard size={18} />,
      path: '/admin',
      id: 'Dashboard'
    },
    {
      label: t('sidebar.users_mgmt'),
      icon: <Users size={18} />,
      path: '/admin/usuarios',
      id: 'Gestión Usuarios'
    },
    {
      label: t('sidebar.categories'),
      icon: <Layers size={18} />,
      path: '/admin/categorias',
      id: 'Categorías'
    },
    {
      label: t('sidebar.audit'),
      icon: <Shield size={18} />,
      path: '/admin/auditoria',
      id: 'Auditoría'
    },
    {
      label: t('sidebar.backups'),
      icon: <Database size={18} />,
      path: '/admin/backups',
      id: 'Copias de Seguridad'
    },
    {
      label: t('sidebar.system_config'),
      icon: <Settings size={18} />,
      path: '/admin/configuracion',
      id: 'Configuración del Sistema'
    }
  ]

  return (
    <nav className="py-4 flex-1">
      {isAdmin ? (
        adminItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors no-underline ${activeItem === item.id
              ? 'bg-primary text-white font-medium'
              : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))
      ) : (
        <div className="flex flex-col">
          <Link
            to="/dashboard"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors ${activeItem === 'Dashboard'
              ? 'bg-primary text-white font-medium'
              : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <LayoutDashboard size={18} /> {t('sidebar.dashboard')}
          </Link>
          <Link
            to="/proyectos"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors ${activeItem === 'Proyectos'
              ? 'bg-primary text-white font-medium'
              : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <FolderOpen size={18} /> {t('sidebar.projects')}
          </Link>
          <Link
            to="/profile/habilidades"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors ${activeItem === 'Habilidades'
              ? 'bg-primary text-white font-medium'
              : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <Wrench size={18} /> {t('sidebar.skills')}
          </Link>
          <Link
            to="/experiencia"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors ${activeItem === 'Experiencia'
              ? 'bg-primary text-white font-medium'
              : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <Briefcase size={18} /> {t('sidebar.experience')}
          </Link>
          <Link
            to="/certificaciones"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors ${activeItem === 'Certificaciones'
              ? 'bg-primary text-white font-medium'
              : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <CheckCircle size={18} /> {t('sidebar.certifications')}
          </Link>
          <Link
            to="/portfolio"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors ${activeItem === 'Vista Portafolio'
              ? 'bg-primary text-white font-medium'
              : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <Eye size={18} /> Vista Portafolio
          </Link>

          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors border-none bg-transparent cursor-pointer ${isProfileOpen
              ? 'text-primary font-bold'
              : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <div className="flex items-center gap-3">
              <User size={18} />
              {t('sidebar.profile')}
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isProfileOpen && (
            <div className="bg-gray-50 dark:bg-gray-800 flex flex-col border-l-4 border-primary/20 ml-2 animate-fadeIn">
              <Link
                to="/profile/personal-data"
                onClick={onItemClick}
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline transition-colors ${activeItem === 'Datos Personales'
                  ? 'text-primary font-bold bg-primary/5 dark:bg-primary/10'
                  : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <IdCard size={14} /> {t('sidebar.personal_data')}
              </Link>
              <Link
                to="/profile/links"
                onClick={onItemClick}
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline transition-colors ${activeItem === 'Enlaces'
                  ? 'text-primary font-bold bg-primary/5 dark:bg-primary/10'
                  : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Link2 size={14} /> Enlaces
              </Link>
              <Link
                to="/profile/privacy"
                onClick={onItemClick}
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline transition-colors ${activeItem === 'Privacidad'
                  ? 'text-primary font-bold bg-primary/5 dark:bg-primary/10'
                  : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Shield size={14} /> Privacidad
              </Link>

              <Link
                to="/profile/notifications"
                onClick={onItemClick}
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline transition-colors ${activeItem === 'Notificaciones'
                  ? 'text-primary font-bold bg-primary/5 dark:bg-primary/10'
                  : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <BellRing size={14} /> {t('sidebar.notifications')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

const Sidebar = ({ activeItem = 'Dashboard' }: SidebarProps) => {
  const { isAdmin } = useAuth()
  const { pathname } = useLocation()

  const [isProfileOpen, setIsProfileOpen] = useState(
    activeItem.includes('Perfil') ||
    ['Datos Personales', 'Enlaces', 'Privacidad', 'Notificaciones'].includes(activeItem) ||
    pathname.startsWith('/profile')
  )

  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const closeMobileMenu = () => {
    setIsMobileOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-3 left-4 z-40 bg-navbar text-white p-2 rounded-md shadow-md border-none cursor-pointer"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-y-auto shadow-xl transform transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-navbar text-white">
          <span className="font-bold text-base tracking-wide">NEXUM</span>
          <button
            onClick={closeMobileMenu}
            aria-label="Cerrar menú"
            className="hover:opacity-80 transition-opacity border-none bg-transparent text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <SidebarContent
          isAdmin={isAdmin}
          activeItem={activeItem}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          onItemClick={closeMobileMenu}
        />
      </div>

      <div className="hidden md:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 self-stretch overflow-y-auto transition-colors">
        <SidebarContent
          isAdmin={isAdmin}
          activeItem={activeItem}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
        />
      </div>
    </>
  )
}

export default Sidebar