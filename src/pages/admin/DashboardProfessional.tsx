import { useState, useEffect } from "react";
import { Eye, FolderOpen, CheckCircle, AlertTriangle } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Calendar from "../../components/ui/Calendar";

const DashboardProfessional = () => {
  // const { user } = useAuth(); // 'user' is not used in this component
  const [viewsCount, setViewsCount] = useState(0);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/v1/portfolio", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        if (data?.data?.views_count !== undefined) {
          setViewsCount(data.data.views_count);
        }
      } catch (error) {
        console.error("Error al obtener portafolio:", error);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      

      {/* Breadcrumb */}
      

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeItem="Dashboard" />

        {/* Contenido principal */}
        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold text-textMain mb-1">
            Dashboard Profesional
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Bienvenido, aquí está el resumen de tu portafolio
          </p>

          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Visitas al Perfil</p>
              <p className="text-3xl font-bold text-action">{viewsCount}</p>
              <p className="text-xs text-gray-400 mt-1">Total de visitas</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Proyectos Activos</p>
              <p className="text-3xl font-bold text-action">8</p>
              <p className="text-xs text-gray-400 mt-1">Última actualización: Ayer</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Apariciones en Búsqueda</p>
              <p className="text-3xl font-bold text-action">342</p>
              <p className="text-xs text-gray-400 mt-1">+5% este mes</p>
            </div>
          </div>

          {/* Cards de acciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen size={18} className="text-textMain" />
                <h2 className="font-semibold text-textMain">Mi Portafolio</h2>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Gestiona tus proyectos, habilidades y experiencia laboral.
              </p>
              <div className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded mb-3 inline-block">
                Acceso permitido a tus rutas.
              </div>
              <br />
              <button className="bg-action text-white text-sm px-4 py-2 rounded hover:opacity-90 transition-opacity">
                Ver mi portafolio
              </button>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={18} className="text-textMain" />
                <h2 className="font-semibold text-textMain">Configuración de Perfil</h2>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Actualiza tu información personal, foto y datos de contacto.
              </p>
              <div className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded mb-3 inline-block">
                Perfil activo y visible.
              </div>
              <br />
              <button className="bg-primary text-white text-sm px-4 py-2 rounded hover:opacity-90 transition-opacity">
                Editar perfil
              </button>
            </div>
          </div>

          {/* Secciones disponibles */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-textMain mb-4">
              Tus secciones disponibles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-4">
                <h3 className="font-medium text-textMain mb-3">
                  Puedes acceder a:
                </h3>
                {["Dashboard", "Proyectos", "Habilidades", "Experiencia", "Perfil"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <CheckCircle size={14} className="text-green-500" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="bg-background rounded-lg p-4">
                <h3 className="font-medium text-textMain mb-3">
                  Acceso restringido:
                </h3>
                {["Usuarios", "Auditoría", "Copias de Seguridad", "Configuración"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <AlertTriangle size={14} className="text-action" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="hidden lg:block w-56 p-4 bg-white border-l border-gray-200 overflow-y-auto">
          {/* Calendario */}
          <Calendar />

          {/* Notificaciones */}
          <h3 className="font-semibold text-textMain mt-5 mb-2">NOTIFICACIONES</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <AlertTriangle size={12} className="text-action mt-0.5 shrink-0" />
              Tu perfil fue visitado 3 veces hoy.
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <CheckCircle size={12} className="text-green-500 mt-0.5 shrink-0" />
              Proyecto 'App Móvil' publicado correctamente.
            </div>
          </div>

          {/* Enlaces rápidos */}
          <h3 className="font-semibold text-textMain mt-5 mb-2">Enlaces rápidos</h3>
          <div className="space-y-2 text-xs text-primary">
            <p className="cursor-pointer hover:underline">📋 Guía de Usuario</p>
            <p className="cursor-pointer hover:underline">⚙️ Soporte Técnico</p>
            <p className="cursor-pointer hover:underline">📄 Políticas UMSS</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      
    </div>
  );
};

export default DashboardProfessional;