import { Link } from "react-router-dom";
import logoUmss from "../../assets/logoUmss.png";
import { User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import UserMenuModal from "./UserMenuModal";
import useAuth from "../../hooks/useAuth";
import { getPersonalData } from "../../services/datapersonal.service";
import { useSidebar } from "../../contexts/SidebarContext";

const Navbar = () => {
  const { openMobile } = useSidebar();
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
    <nav className="w-full bg-[#001A5E] px-4 py-3 flex items-center justify-between">
      {/* Lado izquierdo: hamburguesa (mobile) + logo */}
      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <button
            className="lg:hidden p-1.5 text-white rounded hover:bg-white/10 transition-colors"
            onClick={openMobile}
            aria-label="Abrir menú de navegación"
          >
            <Menu size={22} />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src={logoUmss}
            alt="Logo UMSS"
            className="w-8 h-8 object-contain rounded-full"
          />
          <span className="text-white font-bold text-lg tracking-wide">
            NEXUM
          </span>
        </Link>
      </div>

      {/* Lado derecho: menú de usuario */}
      <div className="flex items-center gap-3">
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
      </div>
    </nav>
  );
};

export default Navbar;
