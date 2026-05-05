import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, FolderOpen, CheckCircle, AlertTriangle, ShieldAlert, ExternalLink, FileText } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Calendar from "../../components/ui/Calendar";

const DashboardProfessional = () => {
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

  // Subcomponente para evitar duplicar el contenido del panel lateral
  const RightPanelContent = () => (
    <div className="sticky top-6">
      <Calendar />

      <div className="mt-8">
        <h3 className="font-bold text-textMain text-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
          <ShieldAlert size={16} className="text-action" />
          Notificaciones
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-[11px] text-gray-600 leading-tight">
            <AlertTriangle size={14} className="text-action mt-0.5 shrink-0" />
            <span>Tu perfil fue visitado 3 veces hoy.</span>
          </div>
          <div className="flex items-start gap-2 text-[11px] text-gray-600 leading-tight">
            <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
            <span>Proyecto 'App Móvil' publicado correctamente.</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-textMain text-sm mb-4">Enlaces rápidos</h3>
        <div className="space-y-3 text-xs text-primary">
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>📋 Guía de Usuario</span>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>⚙️ Soporte Técnico</span>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>📄 Políticas UMSS</span>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeItem="Dashboard" />

        {/* Contenedor Principal Adaptativo */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
          
          {/* SECCIÓN IZQUIERDA: Contenido del Dashboard */}
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-textMain mb-1">
              Dashboard Profesional
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              Bienvenido, aquí está el resumen de tu portafolio
            </p>

            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-action/20 transition-colors">
                <p className="text-sm text-gray-500 mb-1">Visitas al Perfil</p>
                <p className="text-3xl font-bold text-action">{viewsCount}</p>
                <p className="text-xs text-gray-400 mt-1">Total de visitas</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Proyectos Activos</p>
                <p className="text-3xl font-bold text-action">8</p>
                <p className="text-xs text-gray-400 mt-1">Última actualización: Ayer</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Apariciones en Búsqueda</p>
                <p className="text-3xl font-bold text-action">342</p>
                <p className="text-xs text-gray-400 mt-1">+5% este mes</p>
              </div>
            </div>

            {/* Cards de acciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <FolderOpen size={18} className="text-textMain" />
                  <h2 className="font-semibold text-textMain">Mi Portafolio</h2>
                </div>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                  Gestiona tus proyectos, habilidades y experiencia laboral.
                </p>
                <div className="bg-green-50 text-green-700 text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-block font-medium border border-green-100">
                  
                </div>
                <br />
                <div className="flex flex-wrap gap-3">
                  <button className="bg-action text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-md flex items-center gap-2">
                    <ExternalLink size={14} /> Ver Online
                  </button>
                  <Link to="/imprimir" className="bg-white text-gray-700 border border-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 no-underline font-medium">
                    <FileText size={14} className="text-action" /> Exportar PDF
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={18} className="text-textMain" />
                  <h2 className="font-semibold text-textMain">Configuración de Perfil</h2>
                </div>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                  Actualiza tu información personal, foto y datos de contacto.
                </p>
                <div className="bg-blue-50 text-blue-700 text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-block font-medium border border-blue-100">
                  Perfil activo y visible.
                </div>
                <br />
                <button className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-md">
                  Editar perfil
                </button>
              </div>
            </div>

            {/* Secciones disponibles */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="font-semibold text-textMain mb-4">
                Tus secciones disponibles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-background rounded-xl p-4 border border-gray-50">
                  <h3 className="font-medium text-textMain mb-3 text-sm flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    Puedes acceder a:
                  </h3>
                  <div className="space-y-2">
                    {["Dashboard", "Proyectos", "Habilidades", "Experiencia", "Perfil"].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[13px] text-gray-600">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-background rounded-xl p-4 border border-gray-50">
                  <h3 className="font-medium text-textMain mb-3 text-sm flex items-center gap-2">
                    <AlertTriangle size={14} className="text-action" />
                    Acceso restringido:
                  </h3>
                  <div className="space-y-2">
                    {["Usuarios", "Auditoría", "Copias de Seguridad", "Configuración"].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[13px] text-gray-600 opacity-60">
                        <div className="w-1 h-1 bg-action rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ASIDE DERECHO (Responsivo) */}
          <aside className="w-full lg:w-64 p-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 shrink-0">
            <RightPanelContent />
          </aside>

        </main>
      </div>
    </div>
  );
};

export default DashboardProfessional;