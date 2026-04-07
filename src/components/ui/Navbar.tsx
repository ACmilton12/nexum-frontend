import { Link } from "react-router-dom";
import logoUmss from "../../assets/logoUmss.png";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import UserMenuModal from "./UserMenuModal";
import useAuth from "../../hooks/useAuth";
import { getPersonalData } from "../../services/datapersonal.service";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfession, setUserProfession] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const { token, user } = useAuth();

  const isAuthenticated = !!token;
  const userName = user ? `${user.first_name} ${user.last_name}` : "";
  const userEmail = user?.email ?? "";

  useEffect(() => {
    if (!token) return;
    getPersonalData()
      .then((data) => {
        if (data) {
          setUserProfession(data.profession ?? "");
          setUserPhoto(data.avatar_url ?? "");
        }
      })
      .catch(() => {});
  }, [token]);

  return (
    <nav className="w-full bg-[#001A5E] px-6 py-3 flex items-center justify-between"> {/* Azul marino profundo */}
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
      <div className="flex items-center gap-3"> {/* Contenedor para ambos elementos */}
        {isAuthenticated && (
          <div className="relative">
            {isModalOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsModalOpen(false)}
              />
            )}
            <button
              onClick={() => setIsModalOpen((prev) => !prev)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-700 cursor-pointer hover:bg-gray-400 transition-colors overflow-hidden relative z-50"
              aria-label="Abrir menú de usuario"
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

        {/* Botones de Iniciar Sesión y Registrarse (siempre visibles por ahora) */}
        {/*<Link to="/login" className="text-white border border-white px-4 py-1.5 rounded text-sm hover:bg-white hover:text-[#001A5E] transition-colors">
          Iniciar Sesión
        </Link>
        <Link to="/register" className="bg-[#C8102E] text-white px-4 py-1.5 rounded text-sm hover:opacity-90 transition-opacity">
          Registrarse
        </Link>*/}
      </div>
    </nav>
  );
};

export default Navbar;