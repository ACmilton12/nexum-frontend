import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  Database,
  Settings,
  LogOut,
  FolderOpen,
  Wrench,
  Briefcase,
  User,
  ChevronDown,
  IdCard,
  Link2,
  Palette,
  BellRing,
  X,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { useSidebar } from "../../../contexts/SidebarContext";

interface SidebarProps {
  activeItem?: string;
}

const Sidebar = ({ activeItem = "Dashboard" }: SidebarProps) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isMobileOpen, closeMobile } = useSidebar();

  const [isProfileOpen, setIsProfileOpen] = useState(
    activeItem.includes("Perfil") ||
      ["Datos Personales", "Enlaces", "Apariencia", "Notificaciones"].includes(activeItem) ||
      pathname.startsWith("/profile")
  );

  const adminItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin" },
    { label: "Gestión Usuarios", icon: <Users size={18} />, path: "/admin/usuarios" },
    { label: "Auditoría", icon: <Shield size={18} />, path: "/admin/auditoria" },
    { label: "Copias de Seguridad", icon: <Database size={18} />, path: "/admin/backups" },
    { label: "Configuración del Sistema", icon: <Settings size={18} />, path: "/admin/configuracion" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay oscuro en mobile cuando el sidebar está abierto */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobile}
        />
      )}

      {/* Panel del sidebar */}
      <div
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto transition-transform duration-300",
          "lg:static lg:z-auto lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Botón de cerrar — solo visible en mobile */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="font-bold text-textMain text-sm">Menú</span>
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="py-4 flex-1">
          {isAdmin ? (
            // RENDER PARA ADMIN
            adminItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={closeMobile}
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
            // RENDER PARA PROFESIONAL
            <div className="flex flex-col">
              <Link
                to="/admin"
                onClick={closeMobile}
                className={`flex items-center gap-3 px-4 py-3 text-sm ${activeItem === "Dashboard" ? "bg-primary text-white font-medium" : "text-textMain hover:bg-gray-100"}`}
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link
                to="/proyectos"
                onClick={closeMobile}
                className={`flex items-center gap-3 px-4 py-3 text-sm ${activeItem === "Proyectos" ? "bg-primary text-white font-medium" : "text-textMain hover:bg-gray-100"}`}
              >
                <FolderOpen size={18} /> Proyectos
              </Link>
              <Link
                to="/habilidades"
                onClick={closeMobile}
                className={`flex items-center gap-3 px-4 py-3 text-sm ${activeItem === "Habilidades" ? "bg-primary text-white font-medium" : "text-textMain hover:bg-gray-100"}`}
              >
                <Wrench size={18} /> Habilidades
              </Link>
              <Link
                to="/experiencia"
                onClick={closeMobile}
                className={`flex items-center gap-3 px-4 py-3 text-sm ${activeItem === "Experiencia" ? "bg-primary text-white font-medium" : "text-textMain hover:bg-gray-100"}`}
              >
                <Briefcase size={18} /> Experiencia
              </Link>

              {/* OPCIÓN PERFIL CON DESPLEGABLE */}
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

              {/* SUBMENÚ DE PERFIL */}
              {isProfileOpen && (
                <div className="bg-gray-50 flex flex-col border-l-4 border-primary/20 ml-2 animate-fadeIn">
                  <Link
                    to="/profile/personal-data"
                    onClick={closeMobile}
                    className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs ${activeItem === "Datos Personales" ? "text-primary font-bold bg-primary/5" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <IdCard size={14} /> Datos Personales
                  </Link>
                  <Link
                    to="/profile/links"
                    onClick={closeMobile}
                    className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs ${activeItem === "Enlaces" ? "text-primary font-bold bg-primary/5" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <Link2 size={14} /> Enlaces y Privacidad
                  </Link>
                  <Link
                    to="/profile/appearance"
                    onClick={closeMobile}
                    className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs ${activeItem === "Apariencia" ? "text-primary font-bold bg-primary/5" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <Palette size={14} /> Apariencia
                  </Link>
                  <Link
                    to="/profile/notifications"
                    onClick={closeMobile}
                    className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs ${activeItem === "Notificaciones" ? "text-primary font-bold bg-primary/5" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <BellRing size={14} /> Notificaciones
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-4 text-sm text-textMain hover:bg-gray-100 transition-colors border-t border-gray-200 mt-auto"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};

export default Sidebar;
