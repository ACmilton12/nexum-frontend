import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase } from 'lucide-react';
import Sidebar from '../admin/components/Sidebar';

// Tipos para los datos estáticos
interface UserProfile {
  id: number;
  name: string;
  profession: string;
  location: string;
  photoUrl: string;
  skills: string[];
}

// Datos simulados (Mocks)
const MOCK_USERS: UserProfile[] = [
  {
    id: 1,
    name: 'Carlos Mendoza',
    profession: 'Desarrollador Full Stack',
    location: 'Cochabamba, Bolivia',
    photoUrl: '', // Sin foto, usará predeterminada
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 2,
    name: 'Carlos López',
    profession: 'Ingeniero de Software',
    location: 'La Paz, Bolivia',
    photoUrl: '', // Sin foto, usará predeterminada
    skills: ['Node.js', 'Express', 'MongoDB', 'Docker'],
  },
  {
    id: 3,
    name: 'María Fernández',
    profession: 'Diseñadora UX/UI',
    location: 'Santa Cruz, Bolivia',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', // Foto real
    skills: ['Figma', 'Adobe XD', 'Prototipado', 'Investigación'],
  },
  {
    id: 4,
    name: 'David Silva',
    profession: 'Desarrollador Backend',
    location: 'Cochabamba, Bolivia',
    photoUrl: '', // Sin foto
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS'],
  },
  {
    id: 5,
    name: 'Laura Méndez',
    profession: 'Analista de Datos',
    location: 'La Paz, Bolivia',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop', // Foto real
    skills: ['Python', 'SQL', 'Tableau', 'Machine Learning'],
  },
  {
    id: 6,
    name: 'Andrés Rojas',
    profession: 'DevOps Engineer',
    location: 'Santa Cruz, Bolivia',
    photoUrl: '', // Sin foto
    skills: ['Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
  },
];

const HomeDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filtrado de usuarios basado en la búsqueda (nombre o habilidades)
  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return MOCK_USERS;

    return MOCK_USERS.filter((user) => {
      const matchName = user.name.toLowerCase().includes(query);
      const matchProfession = user.profession.toLowerCase().includes(query);
      const matchSkills = user.skills.some((skill) =>
        skill.toLowerCase().includes(query)
      );
      return matchName || matchProfession || matchSkills;
    });
  }, [searchQuery]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar activeItem="Home" />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Cabecera y Barra de Búsqueda */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
                Perfiles
              </h1>
              <p className="text-[#64748b]">
                Encuentra talento conectando con otros profesionales de la comunidad.
              </p>
            </div>

            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#94a3b8]" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, profesión o habilidad..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent shadow-sm transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Grid de Usuarios (3 columnas) */}
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="p-6">
                    {/* Encabezado de la tarjeta (Avatar y Datos) */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#f1f5f9] group-hover:border-[#003087] transition-colors shrink-0 bg-gray-100">
                        <img
                          src={user.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=003087&color=fff&size=150`}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback in case the image url is broken
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=003087&color=fff&size=150`;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-[#1e293b] truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm font-medium text-[#003087] truncate mb-1">
                          {user.profession}
                        </p>
                        <div className="flex items-center text-xs text-[#64748b] gap-1">
                          <MapPin size={14} />
                          <span className="truncate">{user.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Habilidades (Píldoras) */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Briefcase size={14} className="text-[#64748b]" />
                        <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                          Habilidades
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 text-xs font-medium bg-[#f1f5f9] text-[#334155] rounded-md border border-[#e2e8f0]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Botón de acción */}
                  <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#e2e8f0]">
                    <button 
                      onClick={() => navigate(`/directorio/perfil/${user.id}`)}
                      className="w-full py-2 px-4 bg-white border border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white font-medium rounded-lg transition-colors text-sm"
                    >
                      Ver Perfil Completo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Estado Vacío */
            <div className="text-center py-20 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm">
              <div className="mx-auto w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-[#94a3b8]" />
              </div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">
                No se encontraron profesionales
              </h3>
              <p className="text-[#64748b] max-w-md mx-auto">
                No pudimos encontrar a nadie que coincida con "{searchQuery}". Intenta buscar con otros términos o habilidades.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 text-[#003087] hover:underline font-medium"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomeDirectory;
