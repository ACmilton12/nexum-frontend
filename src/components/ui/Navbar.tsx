import { Link } from "react-router-dom";
import logoUmss from "../../assets/logoUmss.png"; // Asegúrate de que la ruta sea correcta
import { User, Globe, ChevronDown, CheckCircle } from "lucide-react"; // Iconos necesarios
import { useState } from "react";
import UserMenuModal from "./UserMenuModal"; // Importa el componente del modal
import useAuth from "../../hooks/useAuth"; // Hook para obtener el usuario logueado

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const isAuthenticated = !!user;
  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Usuario" : "Invitado";
  const userProfession = user?.role === "professional" ? "Profesional" : user?.role === "admin" ? "Administrador" : "Usuario";
  const userEmail = user?.email || "Sin correo";
  const userPhoto = user?.avatar_url || ""; // Avatar desde la BD o vacío

  return (
    <nav className="w-full bg-[#001A5E] px-6 py-3 flex items-center justify-between z-50 relative"> {/* Azul marino profundo */}
      {/* Logo y nombre de Nexum */}
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <div className="flex items-center gap-2">
          <img
                src={logoUmss} 
                alt="Logo UMSS"
                 className="w-8 h-8 object-contain rounded-full" // Añadido rounded-full para intentar hacerlo circular
               />
          <span className="text-white font-bold text-lg tracking-wide">
            NEXUM
          </span>
        </div>
      </Link>

      {/* Lógica de Usuario */}
      <div className="flex items-center gap-5"> 
        {/* Language Selector (Mock) */}
        <div className="relative group flex items-center">
          <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <Globe size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">EN</span>
            <ChevronDown size={14} className="opacity-60" />
          </button>
          
          {/* Dropdown Menu (Hidden by default, shown on hover/click - Mocking hover) */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 hidden group-hover:block animate-fadeIn z-[60]">
            <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
              Seleccionar Idioma
            </div>
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <span>Español (ES)</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-[#C8102E] font-bold bg-blue-50/50 transition-colors">
              <span>English (EN)</span>
              <CheckCircle size={16} className="text-[#C8102E]" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <span>Português (PT)</span>
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-white/20 hidden md:block"></div>

        {isAuthenticated && ( // Renderiza el icono de usuario y modal si está autenticado
          <div 
            className="relative"
            onMouseLeave={() => setIsModalOpen(false)}
          >
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
  );
};

export default Navbar;