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
  X
} from 'lucide-react'
import useAuth from '../../../hooks/useAuth'

interface SidebarProps {
  activeItem?: string
}

// Subcomponente movido fuera para evitar "Cannot create components during render"
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
  const adminItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin' },
    { label: 'Gestión Usuarios', icon: <Users size={18} />, path: '/admin/usuarios' },
    { label: 'Categorías', icon: <Layers size={18} />, path: '/admin/categorias' },
    { label: 'Auditoría', icon: <Shield size={18} />, path: '/admin/auditoria' },
    { label: 'Copias de Seguridad', icon: <Database size={18} />, path: '/admin/backups' },
    {
      label: 'Configuración del Sistema',
      icon: <Settings size={18} />,
      path: '/admin/configuracion'
    }
  ]

  return (
    <nav className="py-4 flex-1">
      {isAdmin ? (
        adminItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors no-underline ${
              activeItem === item.label
                ? 'bg-primary text-white font-medium'
                : 'text-textMain hover:bg-gray-100'
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
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline ${
              activeItem === 'Dashboard'
                ? 'bg-primary text-white font-medium'
                : 'text-textMain hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            to="/proyectos"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline ${
              activeItem === 'Proyectos'
                ? 'bg-primary text-white font-medium'
                : 'text-textMain hover:bg-gray-100'
            }`}
          >
            <FolderOpen size={18} /> Proyectos
          </Link>
          <Link
            to="/profile/habilidades"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline ${
              activeItem === 'Habilidades'
                ? 'bg-primary text-white font-medium'
                : 'text-textMain hover:bg-gray-100'
            }`}
          >
            <Wrench size={18} /> Habilidades
          </Link>
          <Link
            to="/experiencia"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline ${
              activeItem === 'Experiencia'
                ? 'bg-primary text-white font-medium'
                : 'text-textMain hover:bg-gray-100'
            }`}
          >
            <Briefcase size={18} /> Experiencia
          </Link>
          <Link
            to="/certificaciones"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline ${
              activeItem === 'Certificaciones'
                ? 'bg-primary text-white font-medium'
                : 'text-textMain hover:bg-gray-100'
            }`}
          >
            <CheckCircle size={18} /> Certificaciones
          </Link>

          {/* PERFIL CON DESPLEGABLE */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors border-none bg-transparent cursor-pointer ${
              isProfileOpen ? 'text-primary font-bold' : 'text-textMain hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <User size={18} />
              Perfil
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isProfileOpen && (
            <div className="bg-gray-50 flex flex-col border-l-4 border-primary/20 ml-2 animate-fadeIn">
              <Link
                to="/profile/personal-data"
                onClick={onItemClick}
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline ${
                  activeItem === 'Datos Personales'
                    ? 'text-primary font-bold bg-primary/5'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <IdCard size={14} /> Datos Personales
              </Link>
              <Link
                to="/profile/links"
                onClick={onItemClick}
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline ${
                  activeItem === 'Enlaces'
                    ? 'text-primary font-bold bg-primary/5'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Link2 size={14} /> Enlaces y Privacidad
              </Link>
              <Link
                to="/profile/appearance"
                onClick={onItemClick}
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline ${
                  activeItem === 'Apariencia'
                    ? 'text-primary font-bold bg-primary/5'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Palette size={14} /> Apariencia
              </Link>
              <Link
                to="/profile/notifications"
                onClick={onItemClick}
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline ${
                  activeItem === 'Notificaciones'
                    ? 'text-primary font-bold bg-primary/5'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <BellRing size={14} /> Notificaciones
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
      ['Datos Personales', 'Enlaces', 'Apariencia', 'Notificaciones'].includes(activeItem) ||
      pathname.startsWith('/profile')
  )

  // Estado del menú hamburguesa (solo móvil)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Bloquear scroll del body cuando el menú móvil está abierto
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
      {/* ── BOTÓN HAMBURGUESA (solo móvil) ── */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-3 left-4 z-40 bg-navbar text-white p-2 rounded-md shadow-md border-none cursor-pointer"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* ── OVERLAY oscuro al abrir en móvil ── */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* ── SIDEBAR MÓVIL (drawer desde la izquierda) ── */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col overflow-y-auto shadow-xl transform transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header del drawer móvil */}
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

      {/* ── SIDEBAR DESKTOP (fijo en la izquierda, visible desde md) ── */}
      <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-shrink-0 self-stretch overflow-y-auto">
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
