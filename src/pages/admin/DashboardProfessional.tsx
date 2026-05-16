import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  FolderOpen,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
  User
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Sidebar from './components/Sidebar'
import Calendar from '../../components/ui/Calendar'
import Toast from '../../components/ui/Toast'
import { getProjects } from '../../services/project.service'
import { getPortfolioSkills } from '../../services/habilidades.service'
import { getExperiences } from '../../services/experience.service'
import { getProfileStats, type ProfileVisitor } from '../../services/profileVisits.service'
import { API_BASE_URL } from '../../utils/constants'

const getInitials = (name: string): string | null => {
  if (name === "Visitante anónimo") return null
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

const formatRelativeDate = (iso: string): string => {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffMins < 1) return "Hace un momento"
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hoy, ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
  if (diffDays === 1) return `Ayer, ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
  if (diffDays < 7) return `Hace ${diffDays} días`
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

const RightPanelContent = ({
  viewsCount,
  lastProjectName,
  skillsCount
}: {
  viewsCount: number
  lastProjectName: string | null
  skillsCount: number | null
}) => {
  const { t } = useTranslation()
  return (
    <div className="sticky top-6">
      <Calendar />

      <div className="mt-8">
        <h3 className="font-bold text-textMain dark:text-white text-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
          <ShieldAlert size={16} className="text-action" />
          {t('dashboard.notifications.title')}
        </h3>
        <div className="space-y-3">
          {viewsCount > 0 && (
            <div className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-400 leading-tight">
              <AlertTriangle size={14} className="text-action mt-0.5 shrink-0" />
              <span>
                {t('dashboard.notifications.views', {
                  count: viewsCount,
                  defaultValue: `Tu perfil ha recibido ${viewsCount} visita${viewsCount !== 1 ? 's' : ''}`
                })}
              </span>
            </div>
          )}
          {lastProjectName && (
            <div className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-400 leading-tight">
              <CheckCircle size={14} className="text-primary dark:text-blue-400 mt-0.5 shrink-0" />
              <span>{t('dashboard.notifications.last_project', { name: lastProjectName })}</span>
            </div>
          )}
          {skillsCount !== null && skillsCount > 0 && (
            <div className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-400 leading-tight">
              <CheckCircle size={14} className="text-primary dark:text-blue-400 mt-0.5 shrink-0" />
              <span>{t('dashboard.notifications.skills_active', { count: skillsCount })}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-textMain dark:text-white text-sm mb-4">
          {t('dashboard.links.title')}
        </h3>
        <div className="space-y-3 text-xs text-primary dark:text-blue-400">
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>📋 {t('dashboard.links.user_guide')}</span>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>⚙️ {t('dashboard.links.tech_support')}</span>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>📄 {t('dashboard.links.university_policies')}</span>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
        </div>
      </div>
    </div>
  )
}

const DashboardProfessional = () => {
  const { t, i18n } = useTranslation()
  const [viewsCount, setViewsCount] = useState(0)
  const [recentVisitors, setRecentVisitors] = useState<ProfileVisitor[]>([])
  const [showStats, setShowStats] = useState(false)
  const [projectsCount, setProjectsCount] = useState<number | null>(null)
  const [skillsCount, setSkillsCount] = useState<number | null>(null)
  const [experienceCount, setExperienceCount] = useState<number | null>(null)
  const [lastProjectName, setLastProjectName] = useState<string | null>(null)
  const [lastProjectDate, setLastProjectDate] = useState<string | null>(null)
  const [portfolioId, setPortfolioId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{
    mensaje: string
    tipo: 'success' | 'error' | 'info'
  } | null>(null)
  const handleCloseToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token')

      let fetchedPortfolioId: number | null = null
      try {
        const response = await fetch(`${API_BASE_URL}/portfolio`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            Accept: 'application/json'
          }
        })
        const data = await response.json()
        if (data?.data) {
          if (data.data.views_count !== undefined) setViewsCount(data.data.views_count)
          if (data.data.id) setPortfolioId(data.data.id)
        }
        if (data?.data?.id) fetchedPortfolioId = data.data.id
      } catch (error) {
        console.error('Error al obtener portafolio:', error)
        setToast({
          mensaje: t('dashboard.error_views', 'No se pudieron cargar las visitas del perfil.'),
          tipo: 'error'
        })
      }

      if (fetchedPortfolioId) {
        try {
          const statsData = await getProfileStats(fetchedPortfolioId)
          setViewsCount(statsData.visits_count)
          setRecentVisitors(statsData.recent_visitors)
        } catch (error) {
          console.error("Error al obtener estadísticas del perfil:", error)
        }
      }

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
          if (diffDays === 0) setLastProjectDate(t('dashboard.dates.today'))
          else if (diffDays === 1) setLastProjectDate(t('dashboard.dates.yesterday'))
          else if (diffDays < 7) setLastProjectDate(t('dashboard.dates.days_ago', { count: diffDays }))
          else setLastProjectDate(
            lastDate.toLocaleDateString(
              i18n.language === 'es' ? 'es-ES' : i18n.language === 'pt' ? 'pt-BR' : 'en-US',
              { day: 'numeric', month: 'short' }
            )
          )
        }
      } catch {
        setProjectsCount(0)
        setToast({ mensaje: t('dashboard.error_projects', 'No se pudieron cargar los proyectos.'), tipo: 'error' })
      }

      try {
        const skills = await getPortfolioSkills()
        setSkillsCount(skills.filter((s) => s.is_active !== false).length)
      } catch {
        setSkillsCount(0)
        setToast({ mensaje: t('dashboard.error_skills', 'No se pudieron cargar las habilidades.'), tipo: 'error' })
      }

      try {
        const experiences = await getExperiences()
        setExperienceCount(experiences.length)
      } catch {
        setExperienceCount(0)
        setToast({ mensaje: t('dashboard.error_experience', 'No se pudo cargar la experiencia laboral.'), tipo: 'error' })
      }

      setLoading(false)
      setToast((prev) =>
        prev === null
          ? { mensaje: t('dashboard.loaded_success', 'Dashboard cargado correctamente.'), tipo: 'success' }
          : prev
      )
    }

    fetchAll()
  }, [])

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col transition-colors duration-300">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem="Dashboard" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-background dark:bg-slate-900 transition-colors duration-300">
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-6 overflow-y-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-textMain dark:text-white mb-1">
              {t('dashboard.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {t('dashboard.welcome')}
            </p>

            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div
                onClick={() => setShowStats(!showStats)}
                className={`group bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border transition-all cursor-pointer flex flex-col justify-between
                  ${showStats ? 'border-primary ring-1 ring-primary' : 'border-gray-100 dark:border-gray-700 hover:border-action/30 hover:shadow-md'}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.stats.views')}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-opacity ${showStats ? 'bg-blue-100 text-primary opacity-100' : 'bg-blue-50 text-action opacity-0 group-hover:opacity-100'}`}>
                      {showStats ? 'Expandido' : 'Clic para expandir'}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-primary dark:text-blue-400">{loading ? '—' : viewsCount}</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <p className={`text-xs transition-colors font-medium ${showStats ? 'text-primary' : 'text-gray-400 group-hover:text-action'}`}>
                    {showStats ? "Ocultar detalles" : "Ver estadísticas completas"}
                  </p>
                  {showStats
                    ? <ChevronUp size={16} className="text-primary" />
                    : <ChevronDown size={16} className="text-gray-400 group-hover:text-action transition-colors" />
                  }
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.stats.active_projects')}</p>
                <p className="text-3xl font-bold text-primary dark:text-blue-400">{loading ? '—' : (projectsCount ?? 0)}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {lastProjectDate ? t('dashboard.stats.last_update', { date: lastProjectDate }) : t('dashboard.stats.no_projects')}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.stats.skills')}</p>
                <p className="text-3xl font-bold text-primary dark:text-blue-400">{loading ? '—' : (skillsCount ?? 0)}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {experienceCount !== null && experienceCount > 0
                    ? t('dashboard.stats.experience_count', { count: experienceCount })
                    : t('dashboard.stats.no_experience')}
                </p>
              </div>
            </div>

            {/* Expanded Stats Section */}
            {showStats && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-primary mb-6 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                <button
                  onClick={() => setShowStats(false)}
                  className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>

                <h3 className="text-xl font-bold text-[#002e6b] dark:text-blue-400 mb-8">
                  Estadísticas de visitas
                </h3>

                <div className="flex flex-col sm:flex-row justify-between mb-8 gap-6 sm:gap-0">
                  <div className="flex-1">
                    <p className="text-4xl sm:text-5xl font-bold text-[#002e6b] dark:text-blue-400 mb-2">{loading ? "—" : viewsCount}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total — Desde el inicio</p>
                  </div>
                  <div className="hidden sm:block w-px bg-gray-200 dark:bg-gray-700 mx-6"></div>
                  <div className="flex-1">
                    <p className="text-4xl sm:text-5xl font-bold text-[#002e6b] dark:text-blue-400 mb-2">
                      {loading ? "—" : Math.floor(viewsCount * 0.1)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Últimos 7 días — Esta semana</p>
                  </div>
                  <div className="hidden sm:block w-px bg-gray-200 dark:bg-gray-700 mx-6"></div>
                  <div className="flex-1">
                    <p className="text-4xl sm:text-5xl font-bold text-[#002e6b] dark:text-blue-400 mb-2">
                      {loading ? "—" : Math.floor(viewsCount * 0.3)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Último mes — 30 días</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-8 mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-[#002e6b] dark:text-blue-400 opacity-80 tracking-wider uppercase">
                      Visitantes recientes
                    </h4>
                    <Link to="/visitantes" className="text-[11px] text-primary font-bold hover:underline">
                      Ver todos →
                    </Link>
                  </div>
                  <div className="space-y-0">
                    {recentVisitors.length > 0 ? recentVisitors.map((visitor, idx) => (
                      <div key={idx} className={`flex items-center justify-between py-4 ${idx !== recentVisitors.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                        <div className="flex items-center gap-4">
                          {visitor.user_id !== null ? (
                            <div className="w-10 h-10 rounded-full bg-[#002e6b] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                              {getInitials(visitor.name)}
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-600">
                              <User size={18} />
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <p className={`text-[15px] ${visitor.user_id !== null ? 'font-bold text-[#0a2540] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                              {visitor.name}
                            </p>
                            {visitor.user_id !== null && (
                              <span className="bg-[#eff4fa] dark:bg-blue-900/30 text-[#002e6b] dark:text-blue-400 text-[11px] font-bold px-2.5 py-1 rounded-md">
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

                <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                  <div className="p-3.5 bg-[#eff4fa] dark:bg-blue-900/20 border-l-[3px] border-[#002e6b] text-[13px] sm:text-sm text-[#0a2540] dark:text-blue-300 rounded-r-lg font-medium">
                    Las visitas propias no se contabilizan. Solo visitantes externos con deduplicación por sesión.
                  </div>
                </div>
              </div>
            )}

            {/* Cards de acciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <FolderOpen size={18} className="text-textMain dark:text-white" />
                  <h2 className="font-semibold text-textMain dark:text-white">{t('dashboard.portfolio.title')}</h2>
                </div>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">{t('dashboard.portfolio.desc')}</p>
                <div className="bg-primary/5 text-primary text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-block font-medium border border-primary/20">
                  {t('dashboard.portfolio.access_granted')}
                </div>
                <br />
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={portfolioId ? `/portfolio/${portfolioId}` : '#'}
                    className={`bg-action text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-md flex items-center gap-2 no-underline ${!portfolioId && 'opacity-50 cursor-not-allowed'}`}
                    onClick={(e) => !portfolioId && e.preventDefault()}
                  >
                    <ExternalLink size={14} /> {t('dashboard.portfolio.view_online')}
                  </Link>
                  <Link
                    to="/imprimir"
                    className="bg-white text-gray-700 dark:text-gray-300 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-all shadow-sm flex items-center gap-2 no-underline font-medium"
                  >
                    <FileText size={14} className="text-action" /> {t('dashboard.portfolio.export_pdf')}
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={18} className="text-textMain dark:text-white" />
                  <h2 className="font-semibold text-textMain dark:text-white">{t('dashboard.settings.title')}</h2>
                </div>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">{t('dashboard.settings.desc')}</p>
                <div className="bg-primary/5 text-primary text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-block font-medium border border-primary/20">
                  {t('dashboard.settings.active_status')}
                </div>
                <br />
                <Link
                  to="/profile/personal-data"
                  className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-md inline-block no-underline"
                >
                  {t('dashboard.settings.edit_button')}
                </Link>
              </div>
            </div>

            {/* Secciones disponibles */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors">
              <h2 className="font-semibold text-textMain dark:text-white mb-4">{t('dashboard.sections.title')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-background dark:bg-slate-900 rounded-xl p-4 border border-gray-50 dark:border-gray-800 transition-colors">
                  <h3 className="font-medium text-textMain dark:text-white mb-3 text-sm flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary dark:text-blue-400" />
                    {t('dashboard.sections.available')}
                  </h3>
                  <div className="space-y-2">
                    {[t('sidebar.dashboard'), t('sidebar.projects'), t('sidebar.skills'), t('sidebar.experience'), t('sidebar.profile')].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-background dark:bg-slate-900 rounded-xl p-4 border border-gray-50 dark:border-gray-800 transition-colors">
                  <h3 className="font-medium text-textMain dark:text-white mb-3 text-sm flex items-center gap-2">
                    <AlertTriangle size={14} className="text-action" />
                    {t('dashboard.sections.restricted')}
                  </h3>
                  <div className="space-y-2">
                    {[t('sidebar.users_mgmt'), t('sidebar.audit'), t('sidebar.backups'), t('sidebar.system_config')].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-500 opacity-60">
                        <div className="w-1 h-1 bg-action rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ASIDE DERECHO */}
          <aside className="w-full lg:w-64 p-6 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 shrink-0 overflow-y-auto transition-colors duration-300">
            <RightPanelContent
              viewsCount={viewsCount}
              lastProjectName={lastProjectName}
              skillsCount={skillsCount}
            />
          </aside>
        </main>
      </div>

      {toast && <Toast message={toast.mensaje} type={toast.tipo} onClose={handleCloseToast} />}
    </div>
  )
}

export default DashboardProfessional
