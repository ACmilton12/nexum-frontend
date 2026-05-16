import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  FolderOpen,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
  FileText
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Sidebar from './components/Sidebar'
import Calendar from '../../components/ui/Calendar'
import Toast from '../../components/ui/Toast'
import { getProjects } from '../../services/project.service'
import { getPortfolioSkills } from '../../services/habilidades.service'
import { getExperiences } from '../../services/experience.service'
import { API_BASE_URL } from '../../utils/constants'

// Subcomponente movido fuera para evitar "Cannot create components during render"
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
        <h3 className="font-bold text-textMain text-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
          <ShieldAlert size={16} className="text-action" />
          {t('dashboard.notifications.title')}
        </h3>
        <div className="space-y-3">
          {viewsCount > 0 && (
            <div className="flex items-start gap-2 text-[11px] text-gray-600 leading-tight">
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
            <div className="flex items-start gap-2 text-[11px] text-gray-600 leading-tight">
              <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" />
              <span>{t('dashboard.notifications.last_project', { name: lastProjectName })}</span>
            </div>
          )}
          {skillsCount !== null && skillsCount > 0 && (
            <div className="flex items-start gap-2 text-[11px] text-gray-600 leading-tight">
              <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" />
              <span>{t('dashboard.notifications.skills_active', { count: skillsCount })}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-textMain text-sm mb-4">{t('dashboard.links.title')}</h3>
        <div className="space-y-3 text-xs text-primary">
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>📋 {t('dashboard.links.user_guide')}</span>
            <ExternalLink
              size={12}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </p>
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>⚙️ {t('dashboard.links.tech_support')}</span>
            <ExternalLink
              size={12}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </p>
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>📄 {t('dashboard.links.university_policies')}</span>
            <ExternalLink
              size={12}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </p>
        </div>
      </div>
    </div>
  )
}

const DashboardProfessional = () => {
  const { t, i18n } = useTranslation()
  const [viewsCount, setViewsCount] = useState(0)
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

      // Portfolio views
      try {
        const response = await fetch(`${API_BASE_URL}/portfolio`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            Accept: 'application/json'
          }
        })
        const data = await response.json()
        if (data?.data) {
          if (data.data.views_count !== undefined) {
            setViewsCount(data.data.views_count)
          }
          if (data.data.id) {
            setPortfolioId(data.data.id)
          }
        }
      } catch (error) {
        console.error('Error al obtener portafolio:', error)
        setToast({
          mensaje: t('dashboard.error_views', 'No se pudieron cargar las visitas del perfil.'),
          tipo: 'error'
        })
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
          if (diffDays === 0) setLastProjectDate(t('dashboard.dates.today'))
          else if (diffDays === 1) setLastProjectDate(t('dashboard.dates.yesterday'))
          else if (diffDays < 7)
            setLastProjectDate(t('dashboard.dates.days_ago', { count: diffDays }))
          else
            setLastProjectDate(
              lastDate.toLocaleDateString(
                i18n.language === 'es' ? 'es-ES' : i18n.language === 'pt' ? 'pt-BR' : 'en-US',
                {
                  day: 'numeric',
                  month: 'short'
                }
              )
            )
        }
      } catch {
        setProjectsCount(0)
        setToast({
          mensaje: t('dashboard.error_projects', 'No se pudieron cargar los proyectos.'),
          tipo: 'error'
        })
      }

      // Skills
      try {
        const skills = await getPortfolioSkills()
        setSkillsCount(skills.filter((s) => s.is_active !== false).length)
      } catch {
        setSkillsCount(0)
        setToast({
          mensaje: t('dashboard.error_skills', 'No se pudieron cargar las habilidades.'),
          tipo: 'error'
        })
      }

      // Experience
      try {
        const experiences = await getExperiences()
        setExperienceCount(experiences.length)
      } catch {
        setExperienceCount(0)
        setToast({
          mensaje: t('dashboard.error_experience', 'No se pudo cargar la experiencia laboral.'),
          tipo: 'error'
        })
      }

      setLoading(false)
      // Solo mostrar éxito si no hubo errores previos
      setToast((prev) =>
        prev === null
          ? {
              mensaje: t('dashboard.loaded_success', 'Dashboard cargado correctamente.'),
              tipo: 'success'
            }
          : prev
      )
    }

    fetchAll()
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeItem="Dashboard" />

        {/* Contenedor Principal Adaptativo */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* SECCIÓN IZQUIERDA: Contenido del Dashboard */}
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-6 overflow-y-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-textMain mb-1">
              {t('dashboard.title')}
            </h1>
            <p className="text-sm text-gray-500 mb-5">{t('dashboard.welcome')}</p>

            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-action/20 transition-colors">
                <p className="text-sm text-gray-500 mb-1">{t('dashboard.stats.views')}</p>
                <p className="text-3xl font-bold text-primary">{loading ? '—' : viewsCount}</p>
                <p className="text-xs text-gray-400 mt-1">{t('dashboard.stats.total_views')}</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">{t('dashboard.stats.active_projects')}</p>
                <p className="text-3xl font-bold text-primary">
                  {loading ? '—' : (projectsCount ?? 0)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {lastProjectDate
                    ? t('dashboard.stats.last_update', { date: lastProjectDate })
                    : t('dashboard.stats.no_projects')}
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">{t('dashboard.stats.skills')}</p>
                <p className="text-3xl font-bold text-primary">
                  {loading ? '—' : (skillsCount ?? 0)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {experienceCount !== null && experienceCount > 0
                    ? t('dashboard.stats.experience_count', { count: experienceCount })
                    : t('dashboard.stats.no_experience')}
                </p>
              </div>
            </div>

            {/* Cards de acciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <FolderOpen size={18} className="text-textMain" />
                  <h2 className="font-semibold text-textMain">{t('dashboard.portfolio.title')}</h2>
                </div>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                  {t('dashboard.portfolio.desc')}
                </p>
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
                    className="bg-white text-gray-700 border border-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 no-underline font-medium"
                  >
                    <FileText size={14} className="text-action" />{' '}
                    {t('dashboard.portfolio.export_pdf')}
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={18} className="text-textMain" />
                  <h2 className="font-semibold text-textMain">{t('dashboard.settings.title')}</h2>
                </div>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                  {t('dashboard.settings.desc')}
                </p>
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
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="font-semibold text-textMain mb-4">{t('dashboard.sections.title')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-background rounded-xl p-4 border border-gray-50">
                  <h3 className="font-medium text-textMain mb-3 text-sm flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary" />
                    {t('dashboard.sections.available')}
                  </h3>
                  <div className="space-y-2">
                    {[
                      t('sidebar.dashboard'),
                      t('sidebar.projects'),
                      t('sidebar.skills'),
                      t('sidebar.experience'),
                      t('sidebar.profile')
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[13px] text-gray-600">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-background rounded-xl p-4 border border-gray-50">
                  <h3 className="font-medium text-textMain mb-3 text-sm flex items-center gap-2">
                    <AlertTriangle size={14} className="text-action" />
                    {t('dashboard.sections.restricted')}
                  </h3>
                  <div className="space-y-2">
                    {[
                      t('sidebar.users_mgmt'),
                      t('sidebar.audit'),
                      t('sidebar.backups'),
                      t('sidebar.system_config')
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-[13px] text-gray-600 opacity-60"
                      >
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
          <aside className="w-full lg:w-64 p-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 shrink-0 overflow-y-auto">
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
