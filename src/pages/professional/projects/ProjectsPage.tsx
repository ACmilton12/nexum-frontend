import { useState, useEffect, useMemo } from 'react'
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
      setToast({ message: 'Proyecto eliminado con éxito.', type: 'success' })
    } catch (error) {
      console.error('Error al eliminar proyecto:', error)
      setToast({ message: 'No se pudo eliminar el proyecto.', type: 'error' })
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
    <div className="min-h-screen lg:h-full bg-background flex flex-col font-sans lg:overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Proyectos" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 bg-[#C9D1D9] p-4 pl-14 sm:pl-6 md:p-8 overflow-y-auto">
            <div className="max-w-[1200px] mx-auto space-y-8">
              {/* Header */}
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-[12px] font-medium text-[#5b6472] mb-1">
                    Portafolio profesional UMSS
                  </p>
                  <h1 className="text-2xl sm:text-[32px] font-bold text-[#1a1a2e] mb-2">
                    Mis Proyectos
                  </h1>
                  <p className="text-[14px] text-[#5b6472] max-w-2xl leading-relaxed">
                    La gestión y la clasificación por categorías se resuelven dentro de una sola
                    pantalla, con filtros visibles y acciones por proyecto.
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
                  Nuevo proyecto
                </button>
              </header>

              {/* Toolbar de Filtros */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-[16px] font-bold text-[#1a1a2e]">Filtros y ordenamiento</h2>
                  <p className="text-[13px] text-[#5b6472]">
                    Categoría, búsqueda y orden en un solo bloque.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex items-center bg-[#eef3f8] text-[#003087] rounded-xl hover:bg-[#e0eaf5] transition-colors">
                    <FolderOpen size={16} className="absolute left-4 pointer-events-none" />
                    <select
                      value={selectedCategory}
                      onChange={(e) =>
                        setSelectedCategory(
                          e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)
                        )
                      }
                      className="appearance-none bg-transparent pl-11 pr-10 py-2 w-full text-[13px] font-bold cursor-pointer focus:outline-none outline-none border-none"
                    >
                      <option value="ALL">Categoría: Todas</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 pointer-events-none" />
                  </div>

                  {/* Toggle fecha: botón único que alterna */}
                  <button
                    type="button"
                    onClick={() => {
                      setSortDate(sortDate === 'NEWEST' ? 'OLDEST' : 'NEWEST')
                      setSortAlpha('NONE')
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${sortAlpha === 'NONE'
                        ? 'bg-gray-100 text-[#003087] hover:bg-gray-200'
                        : 'bg-gray-100 text-[#5b6472] hover:bg-gray-200'
                      }`}
                  >
                    <CalendarDays size={15} />
                    {sortDate === 'NEWEST' ? 'Más recientes' : 'Más antiguos'}
                    <span className="text-[11px] opacity-60">
                      {sortDate === 'NEWEST' ? '↓' : '↑'}
                    </span>
                  </button>

                  {/* Toggle alfa: botón único que cicla NONE→A-Z→Z-A→NONE */}
                  <button
                    type="button"
                    onClick={() => {
                      if (sortAlpha === 'NONE') setSortAlpha('A-Z')
                      else if (sortAlpha === 'A-Z') setSortAlpha('Z-A')
                      else setSortAlpha('NONE')
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${sortAlpha !== 'NONE'
                        ? 'bg-[#eef3f8] text-[#003087] hover:bg-[#e0eaf5]'
                        : 'bg-gray-100 text-[#5b6472] hover:bg-gray-200'
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
                      placeholder="Buscar por nombre, categoría o tecnología..."
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-[13px] focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] transition-colors"
                    />
                  </div>
                  {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
                    <span className="text-[12px] text-gray-500 italic">
                      Escribe al menos 3 letras para buscar...
                    </span>
                  )}
                </div>
              </div>

              {/* Advertencia de Portafolio Faltante */}
              {hasPortfolio === false && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 animate-fadeIn">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <AlertCircle className="text-amber-600" size={24} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-[16px] font-bold text-amber-900 mb-1">
                      Información de portafolio requerida
                    </h3>
                    <p className="text-[14px] text-amber-700 leading-relaxed">
                      Para añadir proyectos a tu portafolio, primero debes completar tus{' '}
                      <span className="font-bold">Datos Personales</span>. Esto permitirá que tus
                      proyectos estén vinculados a tu perfil profesional.
                    </p>
                  </div>
                  <a
                    href="/profile/personal-data"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all text-[13px] whitespace-nowrap"
                  >
                    Completar perfil
                  </a>
                </div>
              )}

              {/* Tabla de Proyectos */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[850px]">
                    <thead>
                      <tr className="bg-[#f8f9fa] border-b border-gray-100">
                        <th className="p-4 pl-6 text-[13px] font-bold text-[#1a1a2e] w-[25%]">
                          Proyecto
                        </th>
                        <th className="p-4 text-[13px] font-bold text-[#1a1a2e] w-[15%]">
                          Categoría
                        </th>
                        <th className="p-4 text-[13px] font-bold text-[#1a1a2e] w-[25%]">
                          Tecnologías
                        </th>
                        <th className="p-4 text-[13px] font-bold text-[#1a1a2e] w-[15%]">Fecha</th>
                        <th className="p-4 pr-6 text-[13px] font-bold text-[#1a1a2e] text-center w-[20%]">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#5b6472]">
                            <Loader2
                              className="animate-spin mx-auto mb-2 text-[#003087]"
                              size={24}
                            />
                            Cargando proyectos...
                          </td>
                        </tr>
                      ) : filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#5b6472]">
                            {projects.length === 0
                              ? 'Aún no has registrado ningún proyecto.'
                              : 'No se encontraron proyectos con los filtros aplicados.'}
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="p-4 pl-6 text-[13px] text-[#5b6472] font-medium">
                              {project.title.length > 30
                                ? project.title.substring(0, 30) + '...'
                                : project.title}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1.5 rounded-md text-[12px] font-bold inline-block ${project.category?.name?.toLowerCase().includes('data')
                                    ? 'bg-[#e2e8f0] text-[#475569]'
                                    : 'bg-[#eef3f8] text-[#003087]'
                                  }`}
                              >
                                {project.category?.name || 'Sin Categoría'}
                              </span>
                            </td>
                            <td
                              className="p-4 text-[13px] text-[#5b6472] truncate max-w-[200px]"
                              title={project.skills?.map((s) => s.name).join(', ')}
                            >
                              {project.skills?.map((s) => s.name).join(', ') || 'No especificadas'}
                            </td>
                            <td className="p-4 text-[13px] text-[#5b6472]">
                              {project.updated_at
                                ? new Date(project.updated_at).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })
                                : project.created_at
                                  ? new Date(project.created_at).toLocaleDateString('es-ES', {
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
                                  className="px-4 py-1.5 text-[13px] font-bold text-[#1a1a2e] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDelete(project.id)}
                                  className="px-4 py-1.5 text-[13px] font-bold text-white bg-[#c8102e] rounded-lg hover:brightness-110 transition-colors shadow-sm"
                                >
                                  Eliminar
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
          <RightWidgets type="profile" className="w-full lg:w-72 shrink-0" />
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
