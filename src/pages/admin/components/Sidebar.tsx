import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
<<<<<<< HEAD
  Eye
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useAuth from '../../../hooks/useAuth'
=======
  Eye,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
>>>>>>> feature/hu1-tercersprint

interface SidebarProps {
  activeItem?: string;
}

<<<<<<< HEAD
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
=======
const Sidebar = ({ activeItem = "Dashboard" }: SidebarProps) => {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
>>>>>>> feature/hu1-tercersprint

  const [isProfileOpen, setIsProfileOpen] = useState(
    activeItem.includes("Perfil") ||
    ["Datos Personales", "Enlaces", "Privacidad", "Apariencia", "Notificaciones"].includes(activeItem) ||
    pathname.startsWith("/profile")
  );

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const closeMobileMenu = () => setIsMobileOpen(false);

  // Used to close the mobile menu when a nav item is clicked
  const onItemClick = () => setIsMobileOpen(false);

  const adminItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin" },
    { label: "Gestión Usuarios", icon: <Users size={18} />, path: "/admin/usuarios" },
    { label: "Categorías", icon: <Layers size={18} />, path: "/admin/categorias" },
    { label: "Auditoría", icon: <Shield size={18} />, path: "/admin/auditoria" },
    { label: "Copias de Seguridad", icon: <Database size={18} />, path: "/admin/backups" },
    { label: "Configuración del Sistema", icon: <Settings size={18} />, path: "/admin/configuracion" },
  ];

  const sidebarContent = (
    <nav className="py-4 flex-1">
      {isAdmin ? (
        adminItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            onClick={onItemClick}
<<<<<<< HEAD
            className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors no-underline ${
              activeItem === item.id
                ? 'bg-primary text-white font-medium'
                : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
=======
            className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors no-underline ${activeItem === item.label
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
              }`}
>>>>>>> feature/hu1-tercersprint
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
<<<<<<< HEAD
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors ${
              activeItem === 'Dashboard'
                ? 'bg-primary text-white font-medium'
                : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
=======
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline ${activeItem === "Dashboard"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
              }`}
>>>>>>> feature/hu1-tercersprint
          >
            <LayoutDashboard size={18} /> {t('sidebar.dashboard')}
          </Link>
          <Link
            to="/proyectos"
            onClick={onItemClick}
<<<<<<< HEAD
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors ${
              activeItem === 'Proyectos'
                ? 'bg-primary text-white font-medium'
                : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
=======
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline ${activeItem === "Proyectos"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
              }`}
>>>>>>> feature/hu1-tercersprint
          >
            <FolderOpen size={18} /> {t('sidebar.projects')}
          </Link>
          <Link
            to="/profile/habilidades"
            onClick={onItemClick}
<<<<<<< HEAD
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors ${
              activeItem === 'Habilidades'
                ? 'bg-primary text-white font-medium'
                : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
=======
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline ${activeItem === "Habilidades"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
              }`}
>>>>>>> feature/hu1-tercersprint
          >
            <Wrench size={18} /> {t('sidebar.skills')}
          </Link>
          <Link
            to="/experiencia"
            onClick={onItemClick}
<<<<<<< HEAD
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors ${
              activeItem === 'Experiencia'
                ? 'bg-primary text-white font-medium'
                : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
=======
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline ${activeItem === "Experiencia"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
              }`}
>>>>>>> feature/hu1-tercersprint
          >
            <Briefcase size={18} /> {t('sidebar.experience')}
          </Link>
          <Link
            to="/certificaciones"
            onClick={onItemClick}
<<<<<<< HEAD
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors ${
              activeItem === 'Certificaciones'
                ? 'bg-primary text-white font-medium'
                : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
=======
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline ${activeItem === "Certificaciones"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
              }`}
>>>>>>> feature/hu1-tercersprint
          >
            <CheckCircle size={18} /> {t('sidebar.certifications')}
          </Link>
          <Link
            to="/portfolio"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline transition-colors ${
              activeItem === 'Vista Portafolio'
                ? 'bg-primary text-white font-medium'
                : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Eye size={18} /> Vista Portafolio
          </Link>
          <Link
            to="/visitantes"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 text-sm no-underline ${activeItem === "Visitantes"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
              }`}
          >
            <Eye size={18} /> Visitantes
          </Link>

          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
<<<<<<< HEAD
            className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors border-none bg-transparent cursor-pointer ${
              isProfileOpen
                ? 'text-primary font-bold'
                : 'text-textMain dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
=======
            className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors border-none bg-transparent cursor-pointer ${isProfileOpen ? "text-primary font-bold" : "text-textMain hover:bg-gray-100"
              }`}
>>>>>>> feature/hu1-tercersprint
          >
            <div className="flex items-center gap-3">
              <User size={18} />
              {t('sidebar.profile')}
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isProfileOpen && (
            <div className="bg-gray-50 dark:bg-gray-800 flex flex-col border-l-4 border-primary/20 ml-2 animate-fadeIn">
              <Link
                to="/profile/personal-data"
                onClick={onItemClick}
<<<<<<< HEAD
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline transition-colors ${
                  activeItem === 'Datos Personales'
                    ? 'text-primary font-bold bg-primary/5 dark:bg-primary/10'
                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
=======
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline ${activeItem === "Datos Personales"
                    ? "text-primary font-bold bg-primary/5"
                    : "text-gray-500 hover:bg-gray-100"
                  }`}
>>>>>>> feature/hu1-tercersprint
              >
                <IdCard size={14} /> {t('sidebar.personal_data')}
              </Link>
              <Link
                to="/profile/links"
                onClick={onItemClick}
<<<<<<< HEAD
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline transition-colors ${
                  activeItem === 'Enlaces'
                    ? 'text-primary font-bold bg-primary/5 dark:bg-primary/10'
                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Link2 size={14} /> {t('sidebar.links_privacy')}
=======
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline ${activeItem === "Enlaces"
                    ? "text-primary font-bold bg-primary/5"
                    : "text-gray-500 hover:bg-gray-100"
                  }`}
              >
                <Link2 size={14} /> Enlaces
              </Link>
              <Link
                to="/profile/privacy"
                onClick={onItemClick}
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline ${activeItem === "Privacidad"
                    ? "text-primary font-bold bg-primary/5"
                    : "text-gray-500 hover:bg-gray-100"
                  }`}
              >
                <Shield size={14} /> Privacidad
>>>>>>> feature/hu1-tercersprint
              </Link>
              <Link
                to="/profile/appearance"
                onClick={onItemClick}
<<<<<<< HEAD
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline transition-colors ${
                  activeItem === 'Apariencia'
                    ? 'text-primary font-bold bg-primary/5 dark:bg-primary/10'
                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
=======
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline ${activeItem === "Apariencia"
                    ? "text-primary font-bold bg-primary/5"
                    : "text-gray-500 hover:bg-gray-100"
                  }`}
>>>>>>> feature/hu1-tercersprint
              >
                <Palette size={14} /> {t('sidebar.appearance')}
              </Link>
              <Link
                to="/profile/notifications"
                onClick={onItemClick}
<<<<<<< HEAD
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline transition-colors ${
                  activeItem === 'Notificaciones'
                    ? 'text-primary font-bold bg-primary/5 dark:bg-primary/10'
                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
=======
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs no-underline ${activeItem === "Notificaciones"
                    ? "text-primary font-bold bg-primary/5"
                    : "text-gray-500 hover:bg-gray-100"
                  }`}
>>>>>>> feature/hu1-tercersprint
              >
                <BellRing size={14} /> {t('sidebar.notifications')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
<<<<<<< HEAD
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
=======
  );

  return (
    <>
      {/* ── HAMBURGER BUTTON (mobile only) ── */}
>>>>>>> feature/hu1-tercersprint
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-3 left-4 z-40 bg-navbar text-white p-2 rounded-md shadow-md border-none cursor-pointer"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

<<<<<<< HEAD
=======
      {/* ── DARK OVERLAY (mobile) ── */}
>>>>>>> feature/hu1-tercersprint
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

<<<<<<< HEAD
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-y-auto shadow-xl transform transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
=======
      {/* ── MOBILE SIDEBAR (left drawer) ── */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col overflow-y-auto shadow-xl transform transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
>>>>>>> feature/hu1-tercersprint
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
        {sidebarContent}
      </div>

<<<<<<< HEAD
      <div className="hidden md:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 self-stretch overflow-y-auto transition-colors">
        <SidebarContent
          isAdmin={isAdmin}
          activeItem={activeItem}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
        />
=======
      {/* ── DESKTOP SIDEBAR (fixed left, visible from md) ── */}
      <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col flex-shrink-0 self-stretch overflow-y-auto">
        {sidebarContent}
>>>>>>> feature/hu1-tercersprint
      </div>
    </>
  );
};

export default Sidebar;
