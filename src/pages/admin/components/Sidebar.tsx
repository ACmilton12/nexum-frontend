import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Eye,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";

interface SidebarProps {
  activeItem?: string;
}

const Sidebar = ({ activeItem = "Dashboard" }: SidebarProps) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  navigate
  const { pathname } = useLocation();
  

  const [isProfileOpen, setIsProfileOpen] = useState(
    activeItem.includes("Perfil") ||
      ["Datos Personales", "Enlaces", "Apariencia", "Notificaciones"].includes(activeItem) ||
      pathname.startsWith("/profile")
  );

  // Estado del menú hamburguesa (solo móvil)
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Cerrar el sidebar móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const adminItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin" },
    { label: "Gestión Usuarios", icon: <Users size={18} />, path: "/admin/usuarios" },
    { label: "Categorías", icon: <Layers size={18} />, path: "/admin/categorias" },
    { label: "Auditoría", icon: <Shield size={18} />, path: "/admin/auditoria" },
    { label: "Copias de Seguridad", icon: <Database size={18} />, path: "/admin/backups" },
    { label: "Configuración del Sistema", icon: <Settings size={18} />, path: "/admin/configuracion" },
  ];

  // Contenido interno del sidebar (reutilizado en móvil y desktop)
  const SidebarContent = () => (
    <nav className="py-4 flex-1">
      {isAdmin ? (
        adminItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
              activeItem === item.label
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))
      ) : (
        <div className="flex flex-col">
          <Link
            to="/directorio"
            className={`flex items-center gap-3 px-4 py-3 text-sm ${
              activeItem === "Home"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
            }`}
          >
            <User size={18} /> Home
          </Link>
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 text-sm ${
              activeItem === "Dashboard"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            to="/proyectos"
            className={`flex items-center gap-3 px-4 py-3 text-sm ${
              activeItem === "Proyectos"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
            }`}
          >
            <FolderOpen size={18} /> Proyectos
          </Link>
          <Link
            to="/profile/habilidades"
            className={`flex items-center gap-3 px-4 py-3 text-sm ${
              activeItem === "Habilidades"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
            }`}
          >
            <Wrench size={18} /> Habilidades
          </Link>
          <Link
            to="/experiencia"
            className={`flex items-center gap-3 px-4 py-3 text-sm ${
              activeItem === "Experiencia"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
            }`}
          >
            <Briefcase size={18} /> Experiencia
          </Link>
          <Link
            to="/certificaciones"
            className={`flex items-center gap-3 px-4 py-3 text-sm ${
              activeItem === "Certificaciones"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
            }`}
          >
            <CheckCircle size={18} /> Certificaciones
          </Link>

          <Link
            to="/portfolio"
            className={`flex items-center gap-3 px-4 py-3 text-sm ${
              activeItem === "Vista Portafolio"
                ? "bg-primary text-white font-medium"
                : "text-textMain hover:bg-gray-100"
            }`}
          >
            <Eye size={18} /> Vista Portafolio
          </Link>

          {/* PERFIL CON DESPLEGABLE */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors ${
              isProfileOpen ? "text-primary font-bold" : "text-textMain hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <User size={18} />
              Perfil
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isProfileOpen && (
            <div className="bg-gray-50 flex flex-col border-l-4 border-primary/20 ml-2 animate-fadeIn">
              <Link
                to="/profile/personal-data"
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs ${
                  activeItem === "Datos Personales"
                    ? "text-primary font-bold bg-primary/5"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <IdCard size={14} /> Datos Personales
              </Link>
              <Link
                to="/profile/links"
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs ${
                  activeItem === "Enlaces"
                    ? "text-primary font-bold bg-primary/5"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Link2 size={14} /> Enlaces y Privacidad
              </Link>
              <Link
                to="/profile/appearance"
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs ${
                  activeItem === "Apariencia"
                    ? "text-primary font-bold bg-primary/5"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Palette size={14} /> Apariencia
              </Link>
              <Link
                to="/profile/notifications"
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs ${
                  activeItem === "Notificaciones"
                    ? "text-primary font-bold bg-primary/5"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <BellRing size={14} /> Notificaciones
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );

  return (
    <>
      {/* ── BOTÓN HAMBURGUESA (solo móvil) ── */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-3 left-4 z-40 bg-navbar text-white p-2 rounded-md shadow-md"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* ── OVERLAY oscuro al abrir en móvil ── */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR MÓVIL (drawer desde la izquierda) ── */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col overflow-y-auto shadow-xl transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header del drawer móvil */}
        <div className="flex items-center justify-between px-4 py-3 bg-navbar text-white">
          <span className="font-bold text-base tracking-wide">NEXUM</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            aria-label="Cerrar menú"
            className="hover:opacity-80 transition-opacity"
          >
            <X size={20} />
          </button>
        </div>

        <SidebarContent />
      </div>

      {/* ── SIDEBAR DESKTOP (fijo en la izquierda, visible desde md) ── */}
      <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col flex-shrink-0 self-stretch overflow-y-auto">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;