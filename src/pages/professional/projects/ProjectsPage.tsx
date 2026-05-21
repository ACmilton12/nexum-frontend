import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from '../../admin/components/Sidebar'
import RightWidgets from '../../../components/ui/RightWidgets'
import CreateProjectModal from './CreateProjectModal'
import ConfirmDeleteModal from '../../../components/ui/ConfirmDeleteModal'
import ConfirmEditModal from '../../../components/ui/ConfirmEditModal'
import Toast from '../../../components/ui/Toast'
import {
  getProjects,
  deleteProject,
  getCategories,
  type Project,
  type ProjectCategory
} from '../../../services/project.service'
import { getPersonalData } from '../../../services/datapersonal.service'
import {
  FolderOpen,
  ChevronDown,
  Search,
  ArrowDownAZ,
  CalendarDays,
  Loader2,
  AlertCircle
} from 'lucide-react'

const ProjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isEditConfirmModalOpen, setIsEditConfirmModalOpen] = useState(false)
  const [projectToConfirmEdit, setProjectToConfirmEdit] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasPortfolio, setHasPortfolio] = useState<boolean | null>(null)
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL')
  const [sortDate, setSortDate] = useState<'NEWEST' | 'OLDEST'>('NEWEST')
  const [sortAlpha, setSortAlpha] = useState<'A-Z' | 'Z-A' | 'NONE'>('NONE')
  const { t, i18n } = useTranslation()

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error al cargar proyectos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getPersonalData()
      .then((data) => setHasPortfolio(!!data))
      .catch(() => setHasPortfolio(false))
    getCategories().then(setCategories).catch(console.error)
    fetchProjects()
  }, [])

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Filtro por categoría
        if (selectedCategory !== 'ALL' && project.category?.id !== selectedCategory) {
          return false
        }

        // Filtro por búsqueda (mínimo 3 caracteres)
        if (searchTerm.trim().length >= 3) {
          const term = searchTerm.toLowerCase()
          const matchTitle = project.title.toLowerCase().includes(term)
          const matchCategory = project.category?.name?.toLowerCase().includes(term) || false
          const matchSkills =
            project.skills?.some((s) => s.name.toLowerCase().includes(term)) || false

          if (!matchTitle && !matchCategory && !matchSkills) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => {
        // Orden alfabético tiene prioridad si está activo
        if (sortAlpha !== 'NONE') {
          const cmp = a.title.localeCompare(b.title)
          return sortAlpha === 'A-Z' ? cmp : -cmp
        }
        // Si no, ordena por fecha
        const dateA = new Date(a.created_at || 0).getTime()
        const dateB = new Date(b.created_at || 0).getTime()
        return sortDate === 'NEWEST' ? dateB - dateA : dateA - dateB
      })
  }, [projects, selectedCategory, searchTerm, sortDate, sortAlpha])

  const handleDelete = (id: number) => {
    const project = projects.find((p) => p.id === id)
    if (project) {
      setProjectToDelete(project)
      setIsDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return

    try {
      setIsDeleting(true)
      await deleteProject(projectToDelete.id)
      setProjects(projects.filter((p) => p.id !== projectToDelete.id))
      setIsDeleteModalOpen(false)
      setProjectToDelete(null)
      setToast({ message: t('projects.toast_delete_success'), type: 'success' })
    } catch (error) {
      console.error('Error al eliminar proyecto:', error)
      setToast({ message: t('projects.toast_delete_error'), type: 'error' })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditClick = (project: Project) => {
    setProjectToConfirmEdit(project)
    setIsEditConfirmModalOpen(true)
  }

  const handleConfirmEdit = () => {
    if (projectToConfirmEdit) {
      setProjectToEdit(projectToConfirmEdit)
      setIsModalOpen(true)
      setIsEditConfirmModalOpen(false)
      setProjectToConfirmEdit(null)
    }
  }

  return (
    <div className="h-full max-h-full bg-background dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300 overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Proyectos" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 bg-[#C9D1D9] dark:bg-slate-900 p-4 sm:p-6 md:p-8 overflow-y-auto transition-colors duration-300">
            <div className="max-w-[1200px] mx-auto space-y-8">
              {/* Header */}
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-[12px] font-medium text-[#5b6472] dark:text-gray-400 mb-1">
                    {t('projects.subtitle')}
                  </p>
                  <h1 className="text-2xl sm:text-[32px] font-bold text-[#1a1a2e] dark:text-white mb-2">
                    {t('projects.title')}
                  </h1>
                  <p className="text-[14px] text-[#5b6472] dark:text-gray-400 max-w-2xl leading-relaxed">
                    {t('projects.desc')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setProjectToEdit(null)
                    setIsModalOpen(true)
                  }}
                  disabled={hasPortfolio === false}
                  className={`${hasPortfolio === false
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#c8102e] hover:brightness-110'
                    } text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all text-[14px]`}
                >
                  {t('projects.new_project')}
                </button>
              </header>

              {/* Toolbar de Filtros */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-5 transition-colors duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-[16px] font-bold text-[#1a1a2e] dark:text-white">
                    {t('projects.filters_title')}
                  </h2>
                  <p className="text-[13px] text-[#5b6472] dark:text-gray-400">
                    {t('projects.filters_desc')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex items-center bg-[#eef3f8] dark:bg-slate-800 text-[#003087] dark:text-blue-400 rounded-xl hover:bg-[#e0eaf5] dark:hover:bg-slate-700 transition-colors">
                    <FolderOpen size={16} className="absolute left-4 pointer-events-none" />
                    <select
                      value={selectedCategory}
                      onChange={(e) =>
                        setSelectedCategory(
                          e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)
                        )
                      }
                      className="appearance-none bg-transparent pl-11 pr-10 py-2 w-full text-[13px] font-bold cursor-pointer focus:outline-none outline-none border-none dark:text-blue-300"
                    >
                      <option value="ALL" className="dark:bg-slate-800">
                        {t('projects.category_all')}
                      </option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id} className="dark:bg-slate-800">
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 pointer-events-none" />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSortDate(sortDate === 'NEWEST' ? 'OLDEST' : 'NEWEST')
                      setSortAlpha('NONE')
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${sortAlpha === 'NONE'
                      ? 'bg-gray-100 dark:bg-slate-800 text-[#003087] dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                      : 'bg-gray-100 dark:bg-slate-800 text-[#5b6472] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                  >
                    <CalendarDays size={15} />
                    {sortDate === 'NEWEST' ? t('projects.recent') : t('projects.oldest')}
                    <span className="text-[11px] opacity-60">
                      {sortDate === 'NEWEST' ? '↓' : '↑'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (sortAlpha === 'NONE') setSortAlpha('A-Z')
                      else if (sortAlpha === 'A-Z') setSortAlpha('Z-A')
                      else setSortAlpha('NONE')
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${sortAlpha !== 'NONE'
                      ? 'bg-[#eef3f8] dark:bg-slate-800 text-[#003087] dark:text-blue-400 hover:bg-[#e0eaf5] dark:hover:bg-slate-700'
                      : 'bg-gray-100 dark:bg-slate-800 text-[#5b6472] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                  >
                    <ArrowDownAZ size={15} />
                    {sortAlpha === 'NONE' ? 'A–Z' : sortAlpha === 'A-Z' ? 'A → Z' : 'Z → A'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <div className="relative w-full sm:w-96">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('projects.search_placeholder')}
                      className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-full text-[13px] dark:text-white focus:outline-none focus:border-[#003087] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#003087] transition-colors"
                    />
                  </div>
                  {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
                    <span className="text-[12px] text-gray-500 italic">
                      {t('projects.search_min_chars')}
                    </span>
                  )}
                </div>
              </div>

              {/* Advertencia de Portafolio Faltante */}
              {hasPortfolio === false && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 animate-fadeIn">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center shrink-0">
                    <AlertCircle className="text-amber-600 dark:text-amber-400" size={24} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-[16px] font-bold text-amber-900 dark:text-amber-200 mb-1">
                      {t('projects.portfolio_required_title')}
                    </h3>
                    <p className="text-[14px] text-amber-700 dark:text-amber-400 leading-relaxed">
                      {t('projects.portfolio_required_desc')}
                    </p>
                  </div>
                  <a
                    href="/profile/personal-data"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all text-[13px] whitespace-nowrap"
                  >
                    {t('projects.complete_profile')}
                  </a>
                </div>
              )}

              {/* Tabla de Proyectos */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[850px]">
                    <thead>
                      <tr className="bg-[#f8f9fa] dark:bg-slate-900 border-b border-gray-100 dark:border-gray-700">
                        <th className="p-4 pl-6 text-[13px] font-bold text-[#1a1a2e] dark:text-white w-[25%]">
                          {t('projects.table_project')}
                        </th>
                        <th className="p-4 text-[13px] font-bold text-[#1a1a2e] dark:text-white w-[15%]">
                          {t('projects.table_category')}
                        </th>
                        <th className="p-4 text-[13px] font-bold text-[#1a1a2e] dark:text-white w-[25%]">
                          {t('projects.table_skills')}
                        </th>
                        <th className="p-4 text-[13px] font-bold text-[#1a1a2e] dark:text-white w-[15%]">
                          {t('projects.table_date')}
                        </th>
                        <th className="p-4 pr-6 text-[13px] font-bold text-[#1a1a2e] dark:text-white text-center w-[20%]">
                          {t('projects.table_actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#5b6472]">
                            <Loader2
                              className="animate-spin mx-auto mb-2 text-[#003087] dark:text-blue-500"
                              size={24}
                            />
                            {t('projects.loading')}
                          </td>
                        </tr>
                      ) : filteredProjects.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-[#5b6472] dark:text-gray-400"
                          >
                            {projects.length === 0
                              ? t('projects.no_projects')
                              : t('projects.no_results')}
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((project) => (
                          <tr
                            key={project.id}
                            className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
                          >
                            <td className="p-4 pl-6 text-[13px] text-[#5b6472] dark:text-gray-300 font-medium">
                              {project.title.length > 30
                                ? project.title.substring(0, 30) + '...'
                                : project.title}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1.5 rounded-md text-[12px] font-bold inline-block ${project.category?.name?.toLowerCase().includes('data')
                                  ? 'bg-[#e2e8f0] dark:bg-slate-700 text-[#475569] dark:text-gray-300'
                                  : 'bg-[#eef3f8] dark:bg-blue-900/30 text-[#003087] dark:text-blue-300'
                                  }`}
                              >
                                {project.category?.name || t('projects.uncategorized')}
                              </span>
                            </td>
                            <td
                              className="p-4 text-[13px] text-[#5b6472] dark:text-gray-400 truncate max-w-[200px]"
                              title={project.skills?.map((s) => s.name).join(', ')}
                            >
                              {project.skills?.map((s) => s.name).join(', ') ||
                                t('projects.unspecified_skills')}
                            </td>
                            <td className="p-4 text-[13px] text-[#5b6472] dark:text-gray-400">
                              {project.updated_at
                                ? new Date(project.updated_at).toLocaleDateString(i18n.language, {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })
                                : project.created_at
                                  ? new Date(project.created_at).toLocaleDateString(i18n.language, {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })
                                  : 'N/A'}
                            </td>
                            <td className="p-4 pr-6">
                              <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEditClick(project)}
                                  className="px-4 py-1.5 text-[13px] font-bold text-[#1a1a2e] dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                  {t('projects.edit')}
                                </button>
                                <button
                                  onClick={() => handleDelete(project.id)}
                                  className="px-4 py-1.5 text-[13px] font-bold text-white bg-[#c8102e] rounded-lg hover:brightness-110 transition-colors shadow-sm"
                                >
                                  {t('projects.delete')}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <RightWidgets type="profile" className="hidden lg:block w-72 shrink-0" />
        </main>
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        projectToEdit={projectToEdit}
        onDelete={handleDelete}
        onClose={() => {
          setIsModalOpen(false)
          setProjectToEdit(null)
          fetchProjects() // Recargar tras cerrar modal por si se creó/editó un proyecto
        }}
        onSuccess={(msg) => setToast({ message: msg, type: 'success' })}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setProjectToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        projectName={projectToDelete?.title}
        loading={isDeleting}
      />

      <ConfirmEditModal
        isOpen={isEditConfirmModalOpen}
        onClose={() => {
          setIsEditConfirmModalOpen(false)
          setProjectToConfirmEdit(null)
        }}
        onConfirm={handleConfirmEdit}
        projectName={projectToConfirmEdit?.title}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default ProjectsPage;
