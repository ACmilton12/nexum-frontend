import { useState, useEffect, useCallback } from "react";
import { Eye, FolderOpen, CheckCircle, AlertTriangle, ShieldAlert, ExternalLink, ChevronDown, ChevronUp, X, User, FileText } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Calendar from "../../components/ui/Calendar";
import Toast from "../../components/ui/Toast";
import { Link } from "react-router-dom";
import { getProjects } from "../../services/project.service";
import { getPortfolioSkills } from "../../services/habilidades.service";
import { getExperiences } from "../../services/experience.service";
import { getProfileStats, type ProfileVisitor } from "../../services/profileVisits.service";
import { API_BASE_URL } from "../../utils/constants";

// Helper para obtener iniciales de un nombre
const getInitials = (name: string): string | null => {
  if (name === "Visitante anónimo") return null;
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

// Helper para formatear fecha relativa
const formatRelativeDate = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMins < 1) return "Hace un momento";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hoy, ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
  if (diffDays === 1) return `Ayer, ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};

const DashboardProfessional = () => {
  const [viewsCount, setViewsCount] = useState(0);
  const [recentVisitors, setRecentVisitors] = useState<ProfileVisitor[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [projectsCount, setProjectsCount] = useState<number | null>(null);
  const [skillsCount, setSkillsCount] = useState<number | null>(null);
  const [experienceCount, setExperienceCount] = useState<number | null>(null);
  const [lastProjectName, setLastProjectName] = useState<string | null>(null);
  const [lastProjectDate, setLastProjectDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ mensaje: string; tipo: "success" | "error" | "info" } | null>(null);
  const handleCloseToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token')

      // Portfolio views + ID
      let fetchedPortfolioId: number | null = null;
      try {
        const response = await fetch(`${API_BASE_URL}/portfolio`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            Accept: 'application/json'
          }
        })
        const data = await response.json()
        if (data?.data?.views_count !== undefined) {
          setViewsCount(data.data.views_count)
        }
        if (data?.data?.id) {
          fetchedPortfolioId = data.data.id;
        }
      } catch (error) {
        console.error('Error al obtener portafolio:', error)
        setToast({ mensaje: 'No se pudieron cargar las visitas del perfil.', tipo: 'error' })
      }

      // Profile Stats (visitantes reales)
      if (fetchedPortfolioId) {
        try {
          const statsData = await getProfileStats(fetchedPortfolioId);
          setViewsCount(statsData.visits_count);
          setRecentVisitors(statsData.recent_visitors);
        } catch (error) {
          console.error("Error al obtener estadísticas del perfil:", error);
        }
      }

      // Projects
      try {
        const projects = await getProjects()
        const activeProjects = projects.filter((p) => !p.archived)
        setProjectsCount(activeProjects.length)
        if (activeProjects.length > 0) {
          const sorted = [...activeProjects].sort(
            (a, b) =>
              new Date(b.updated_at || b.created_at).getTime() -
              new Date(a.updated_at || a.created_at).getTime()
          )
          setLastProjectName(sorted[0].title)
          const lastDate = new Date(sorted[0].updated_at || sorted[0].created_at)
          const now = new Date()
          const diffMs = now.getTime() - lastDate.getTime()
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
          if (diffDays === 0) setLastProjectDate('Hoy')
          else if (diffDays === 1) setLastProjectDate('Ayer')
          else if (diffDays < 7) setLastProjectDate(`Hace ${diffDays} días`)
          else
            setLastProjectDate(
              lastDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
            )
        }
      } catch {
        setProjectsCount(0)
        setToast({ mensaje: 'No se pudieron cargar los proyectos.', tipo: 'error' })
      }

      // Skills
      try {
        const skills = await getPortfolioSkills()
        setSkillsCount(skills.filter((s) => s.is_active !== false).length)
      } catch {
        setSkillsCount(0)
        setToast({ mensaje: 'No se pudieron cargar las habilidades.', tipo: 'error' })
      }

      // Experience
      try {
        const experiences = await getExperiences()
        setExperienceCount(experiences.length)
      } catch {
        setExperienceCount(0)
        setToast({ mensaje: 'No se pudo cargar la experiencia laboral.', tipo: 'error' })
      }

      setLoading(false)
      // Solo mostrar éxito si no hubo errores previos
      setToast((prev) =>
        prev === null ? { mensaje: 'Dashboard cargado correctamente.', tipo: 'success' } : prev
      )
    }

    fetchAll();
  }, []);

  // Contenido del panel lateral (reutilizado como JSX variable)
  const rightPanelContent = (
    <div className="sticky top-6">
      <Calendar />

      <div className="mt-8">
        <h3 className="font-bold text-textMain text-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
          <ShieldAlert size={16} className="text-action" />
          Notificaciones
        </h3>
        <div className="space-y-3">
          {viewsCount > 0 && (
            <div className="flex items-start gap-2 text-[11px] text-gray-600 leading-tight">
              <AlertTriangle size={14} className="text-action mt-0.5 shrink-0" />
              <span>Tu perfil ha recibido {viewsCount} visita{viewsCount !== 1 ? "s" : ""}.</span>
            </div>
          )}
          {lastProjectName && (
            <div className="flex items-start gap-2 text-[11px] text-gray-600 leading-tight">
              <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" />
              <span>Último proyecto actualizado: "{lastProjectName}".</span>
            </div>
          )}
          {skillsCount !== null && skillsCount > 0 && (
            <div className="flex items-start gap-2 text-[11px] text-gray-600 leading-tight">
              <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" />
              <span>Tienes {skillsCount} habilidad{skillsCount !== 1 ? "es" : ""} activa{skillsCount !== 1 ? "s" : ""} en tu perfil.</span>
            </div>
          )}
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
    <div className="h-full bg-background flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeItem="Dashboard" />

        {/* Contenedor Principal Adaptativo */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* SECCIÓN IZQUIERDA: Contenido del Dashboard */}
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-6 overflow-y-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-textMain mb-1">
              Dashboard Profesional
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              Bienvenido, aquí está el resumen de tu portafolio
            </p>

            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div
                onClick={() => setShowStats(!showStats)}
                className={`group bg-white rounded-xl p-5 shadow-sm border transition-all cursor-pointer flex flex-col justify-between
                  ${showStats ? 'border-primary ring-1 ring-primary' : 'border-gray-100 hover:border-action/30 hover:shadow-md'}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Visitas al Perfil</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-opacity ${showStats ? 'bg-blue-100 text-primary opacity-100' : 'bg-blue-50 text-action opacity-0 group-hover:opacity-100'}`}>
                      {showStats ? 'Expandido' : 'Clic para expandir'}
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-[#002e6b]">{loading ? "—" : viewsCount}</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <p className={`text-xs transition-colors font-medium ${showStats ? 'text-primary' : 'text-gray-400 group-hover:text-action'}`}>
                    {showStats ? "Ocultar detalles" : "Ver estadísticas completas"}
                  </p>
                  {showStats ? (
                    <ChevronUp size={16} className="text-primary" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400 group-hover:text-action transition-colors" />
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Proyectos Activos</p>
                  <p className="text-4xl font-bold text-[#002e6b]">{loading ? "—" : (projectsCount ?? 0)}</p>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {lastProjectDate ? `Última actualización: ${lastProjectDate}` : "Sin proyectos aún"}
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Habilidades Registradas</p>
                  <p className="text-4xl font-bold text-[#002e6b]">{loading ? "—" : (skillsCount ?? 0)}</p>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {experienceCount !== null && experienceCount > 0
                    ? `${experienceCount} experiencia${experienceCount !== 1 ? 's' : ''} laboral${experienceCount !== 1 ? 'es' : ''}`
                    : 'Sin experiencia registrada'}
                </p>
              </div>
            </div>

            {/* Expanded Stats Section */}
            {showStats && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-primary mb-6 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                <button
                  onClick={() => setShowStats(false)}
                  className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>

                <h3 className="text-xl font-bold text-[#002e6b] mb-8">
                  Estadísticas de visitas
                </h3>

                <div className="flex flex-col sm:flex-row justify-between mb-8 gap-6 sm:gap-0">
                  <div className="flex-1">
                    <p className="text-4xl sm:text-5xl font-bold text-[#002e6b] mb-2">{loading ? "—" : viewsCount}</p>
                    <p className="text-sm text-gray-500">Total — Desde el inicio</p>
                  </div>

                  <div className="hidden sm:block w-px bg-gray-200 mx-6"></div>

                  <div className="flex-1">
                    <p className="text-4xl sm:text-5xl font-bold text-[#002e6b] mb-2">
                      {loading ? "—" : Math.floor(viewsCount * 0.1)}
                    </p>
                    <p className="text-sm text-gray-500">Últimos 7 días — Esta semana</p>
                  </div>

                  <div className="hidden sm:block w-px bg-gray-200 mx-6"></div>

                  <div className="flex-1">
                    <p className="text-4xl sm:text-5xl font-bold text-[#002e6b] mb-2">
                      {loading ? "—" : Math.floor(viewsCount * 0.3)}
                    </p>
                    <p className="text-sm text-gray-500">Último mes — 30 días</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8 mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-[#002e6b] opacity-80 tracking-wider uppercase">
                      Visitantes recientes
                    </h4>
                    <Link to="/visitantes" className="text-[11px] text-primary font-bold hover:underline">
                      Ver todos →
                    </Link>
                  </div>
                  <div className="space-y-0">
                    {recentVisitors.length > 0 ? recentVisitors.map((visitor, idx) => (
                      <div key={idx} className={`flex items-center justify-between py-4 ${idx !== recentVisitors.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <div className="flex items-center gap-4">
                          {visitor.user_id !== null ? (
                            <div className="w-10 h-10 rounded-full bg-[#002e6b] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                              {getInitials(visitor.name)}
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100">
                              <User size={18} />
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <p className={`text-[15px] ${visitor.user_id !== null ? 'font-bold text-[#0a2540]' : 'text-gray-500'}`}>
                              {visitor.name}
                            </p>
                            {visitor.user_id !== null && (
                              <span className="bg-[#eff4fa] text-[#002e6b] text-[11px] font-bold px-2.5 py-1 rounded-md">
                                Usuario Nexum
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-400 font-medium">
                          {formatRelativeDate(visitor.visited_at)}
                        </span>
                      </div>
                    )) : (
                      <div className="py-8 text-center text-gray-400 text-sm">
                        <User size={24} className="mx-auto mb-2 text-gray-300" />
                        <p>Aún no hay visitantes registrados.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="p-3.5 bg-[#eff4fa] border-l-[3px] border-[#002e6b] text-[13px] sm:text-sm text-[#0a2540] rounded-r-lg font-medium">
                    Las visitas propias no se contabilizan. Solo visitantes externos con deduplicación por sesión.
                  </div>
                </div>
              </div>
            )}

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
                <div className="bg-primary/5 text-primary text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-block font-medium border border-primary/20">
                  Acceso permitido a tus rutas.
                </div>
                <br />
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/profesional/proyectos"
                    className="bg-action text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-md flex items-center gap-2 no-underline"
                  >
                    <ExternalLink size={14} /> Ver Online
                  </Link>
                  <Link
                    to="/imprimir"
                    className="bg-white text-gray-700 border border-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 no-underline font-medium"
                  >
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
                <div className="bg-primary/5 text-primary text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-block font-medium border border-primary/20">
                  Perfil activo y visible.
                </div>
                <br />
                <Link
                  to="/profesional/perfil"
                  className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-md inline-block"
                >
                  Editar perfil
                </Link>
              </div>
            </div>

            {/* Secciones disponibles */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="font-semibold text-textMain mb-4">Tus secciones disponibles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-background rounded-xl p-4 border border-gray-50">
                  <h3 className="font-medium text-textMain mb-3 text-sm flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary" />
                    Puedes acceder a:
                  </h3>
                  <div className="space-y-2">
                    {['Dashboard', 'Proyectos', 'Habilidades', 'Experiencia', 'Perfil'].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-[13px] text-gray-600"
                        >
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="bg-background rounded-xl p-4 border border-gray-50">
                  <h3 className="font-medium text-textMain mb-3 text-sm flex items-center gap-2">
                    <AlertTriangle size={14} className="text-action" />
                    Acceso restringido:
                  </h3>
                  <div className="space-y-2">
                    {['Usuarios', 'Auditoría', 'Copias de Seguridad', 'Configuración'].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-[13px] text-gray-600 opacity-60"
                        >
                          <div className="w-1 h-1 bg-action rounded-full"></div>
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ASIDE DERECHO (Responsivo) */}
          <aside className="w-full lg:w-64 p-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 shrink-0 overflow-y-auto">
            {rightPanelContent}
          </aside>
        </main>
      </div>

      {toast && <Toast message={toast.mensaje} type={toast.tipo} onClose={handleCloseToast} />}
    </div>
  )
}

export default DashboardProfessional
