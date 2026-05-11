import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import Calendar from '../../components/ui/Calendar'
import { Plus, Edit2, Flag, BellRing, Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import {
  getProjectCategories,
  createProjectCategory,
  updateProjectCategory,
  toggleProjectCategoryStatus
} from '../../services/admin.service'

interface Category {
  id: string
  name: string
  description: string
  status: 'ACTIVO' | 'INACTIVO'
}

// Subcomponente movido fuera para evitar "Cannot create components during render"
const RightPanelContent = () => (
  <div className="sticky top-6 space-y-8">
    {/* Calendario */}
    <div>
      <h3 className="font-bold text-[#1f2937] mb-4 flex items-center gap-2">
        <CalendarIcon size={18} className="text-[#00388c]" />
        Calendario
      </h3>
      <Calendar />
    </div>

    {/* Notificaciones */}
    <div>
      <h3 className="font-bold text-[#1f2937] mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
        <BellRing size={16} className="text-[#00388c]" />
        Notificaciones
      </h3>
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <Flag size={16} className="text-blue-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Se ha creado una nueva categoría "Blockchain".
            </p>
            <p className="text-[10px] text-blue-500/80 mt-1">Hace 2 horas</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <BellRing size={16} className="text-blue-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Categoría "Marketing Digital" marcada como inactiva.
            </p>
            <p className="text-[10px] text-blue-500/80 mt-1">Ayer, 14:30</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Category | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, last_page: 1 })

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await getProjectCategories({
        search: searchTerm,
        status: statusFilter,
        page: currentPage
      })
      setCategories(res.data)
      setPagination({ total: res.meta.total || 0, last_page: res.meta.last_page || 1 })
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, statusFilter, currentPage])

  useEffect(() => {
    // Reset to page 1 when search or filter changes
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories()
    }, 400)
    return () => clearTimeout(timer)
  }, [fetchCategories])

  const handleEditClick = (category: Category) => {
    setEditingId(category.id)
    setEditFormData({ ...category })
  }

  const handleCancelEdit = () => {
    if (editingId?.startsWith('new-')) {
      setCategories(categories.filter((c) => c.id !== editingId))
    }
    setEditingId(null)
    setEditFormData(null)
  }

  const handleSaveEdit = async () => {
    if (editFormData && editingId) {
      setActionLoading(true)
      try {
        if (editingId.startsWith('new-')) {
          await createProjectCategory({
            name: editFormData.name,
            description: editFormData.description
          })
        } else {
          const originalCategory = categories.find((c) => c.id === editingId)
          if (
            originalCategory?.name !== editFormData.name ||
            originalCategory?.description !== editFormData.description
          ) {
            await updateProjectCategory(editingId, {
              name: editFormData.name,
              description: editFormData.description
            })
          }
          if (originalCategory?.status !== editFormData.status) {
            await toggleProjectCategoryStatus(editingId)
          }
        }
        await fetchCategories()
        setEditingId(null)
        setEditFormData(null)
      } catch (err: unknown) {
        const error = err as { message?: string }
        alert(error.message || 'Hubo un error al guardar.')
      } finally {
        setActionLoading(false)
      }
    }
  }

  const handleCreateNew = () => {
    if (editingId) return // Only one edit at a time
    const newCat: Category = {
      id: `new-${Date.now()}`,
      name: '',
      description: '',
      status: 'ACTIVO'
    }
    setCategories([newCat, ...categories])
    setEditingId(newCat.id)
    setEditFormData(newCat)
  }

  return (
    <div className="min-h-screen bg-[#eef3f8] flex flex-col font-sans">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Categorías" />

        <main
          className="flex-1 flex flex-col lg:flex-row overflow-hidden"
          style={{ backgroundColor: '#ced6e0' }}
        >
          {/* MAIN CONTENT AREA */}
          <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-[#1f2937]">Gestión de Categorias</h1>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 w-full">
              {/* Tab */}
              <div className="mb-8 border-b-0">
                <button className="bg-[#00388c] text-white px-5 py-2 rounded-md text-sm font-medium shadow-sm border-none cursor-pointer">
                  Categorías
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex flex-1 gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:max-w-xs">
                    <input
                      type="text"
                      placeholder="Buscar por nombre"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-[200px] md:w-[240px] px-4 py-2 border border-gray-200 rounded text-sm outline-none focus:border-[#00388c]"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded px-4 py-2 text-sm outline-none bg-white min-w-[180px] cursor-pointer"
                  >
                    <option value="">Todos los estados</option>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
                </div>
                <button
                  onClick={handleCreateNew}
                  disabled={editingId !== null}
                  className="flex items-center gap-2 bg-[#00388c] hover:brightness-110 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm md:w-auto justify-center border-none cursor-pointer"
                >
                  <Plus size={16} /> Crear Categoria
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100">
                  {error}
                </div>
              )}

              {/* Data Table */}
              <div className="border border-gray-100 rounded overflow-x-auto overflow-y-visible relative">
                {/* Overlay loading state */}
                {loading && (
                  <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#00388c]" size={32} />
                  </div>
                )}

                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 text-[13px] text-gray-800 font-bold">
                      <th className="py-4 px-6 w-[25%]">Nombre</th>
                      <th className="py-4 px-6 w-[40%]">Descripción</th>
                      <th className="py-4 px-6 w-[15%]">Estado</th>
                      <th className="py-4 px-6 w-[20%] text-right pr-6">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {categories.length === 0 && !loading && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-500 italic">
                          No se encontraron categorías.
                        </td>
                      </tr>
                    )}

                    {categories.map((cat, index) => {
                      const isEditing = editingId === cat.id
                      const isLast = index === categories.length - 1

                      if (isEditing && editFormData) {
                        return (
                          <tr
                            key={cat.id}
                            className={`bg-blue-50/20 ${!isLast ? 'border-b border-gray-100' : ''}`}
                          >
                            <td className="py-3 px-6">
                              <input
                                type="text"
                                value={editFormData.name}
                                onChange={(e) => {
                                  const val = e.target.value
                                  if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                                    setEditFormData({ ...editFormData, name: val })
                                  }
                                }}
                                placeholder="Nombre de categoría"
                                className="w-full p-2 border border-gray-300 rounded outline-none text-sm bg-white focus:border-[#00388c]"
                                disabled={actionLoading}
                              />
                            </td>
                            <td className="py-3 px-6">
                              <input
                                type="text"
                                value={editFormData.description || ''}
                                onChange={(e) => {
                                  const val = e.target.value
                                  if (/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                                    setEditFormData({ ...editFormData, description: val })
                                  }
                                }}
                                placeholder="Breve descripción..."
                                className="w-full p-2 border border-gray-200 rounded outline-none text-sm bg-white focus:border-[#00388c]"
                                disabled={actionLoading}
                              />
                            </td>
                            <td className="py-3 px-6">
                              {editingId.startsWith('new-') ? (
                                <span className="text-gray-400 text-xs italic">
                                  Generado Activo
                                </span>
                              ) : (
                                <select
                                  value={editFormData.status}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      status: e.target.value as 'ACTIVO' | 'INACTIVO'
                                    })
                                  }
                                  className="p-2 border border-gray-300 rounded outline-none text-sm bg-white text-gray-800 min-w-[100px] focus:border-[#00388c] cursor-pointer"
                                  disabled={actionLoading}
                                >
                                  <option value="ACTIVO">ACTIVO</option>
                                  <option value="INACTIVO">INACTIVO</option>
                                </select>
                              )}
                            </td>
                            <td className="py-3 px-6">
                              <div className="flex items-center justify-end gap-2 text-xs">
                                <button
                                  onClick={() => setShowConfirmModal(true)}
                                  disabled={
                                    actionLoading ||
                                    !editFormData.name.trim() ||
                                    !editFormData.description.trim()
                                  }
                                  className="bg-[#00388c] text-white px-3 py-1.5 rounded disabled:bg-[#00388c]/60 font-medium hover:brightness-110 transition-all flex items-center justify-center gap-1 min-w-[70px] border-none cursor-pointer"
                                >
                                  {actionLoading ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    'Guardar'
                                  )}
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  disabled={actionLoading}
                                  className="bg-white border text-gray-700 border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors border-none cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      }

                      return (
                        <tr
                          key={cat.id}
                          className={`bg-white hover:bg-gray-50/50 transition-colors ${!isLast ? 'border-b border-gray-100' : ''}`}
                        >
                          <td className="py-5 px-6 font-semibold text-gray-800">{cat.name}</td>
                          <td
                            className="py-5 px-6 text-gray-500 max-w-[200px] truncate"
                            title={cat.description || ''}
                          >
                            {cat.description || (
                              <span className="italic text-gray-300 text-xs text-center block">
                                — sin descripción —
                              </span>
                            )}
                          </td>
                          <td className="py-5 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest ${
                                cat.status === 'ACTIVO'
                                  ? 'bg-[#e6f4ea] text-[#137333]'
                                  : 'bg-[#feefe6] text-[#b0602f]'
                              }`}
                            >
                              {cat.status}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-right pr-6">
                            <div className="flex justify-end w-full">
                              <button
                                onClick={() => handleEditClick(cat)}
                                disabled={editingId !== null}
                                className="p-1.5 border border-gray-200 text-gray-400 hover:text-[#00388c] hover:border-blue-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors bg-white cursor-pointer"
                                title="Editar"
                              >
                                <Edit2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6 pt-4 text-sm text-gray-500">
                <span>
                  {pagination.total > 0
                    ? `Mostrando ${categories.length} de ${pagination.total} Categorías`
                    : '0 Categorías encontradas'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-white transition-colors cursor-pointer"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(pagination.last_page, p + 1))}
                    disabled={currentPage === pagination.last_page || loading}
                    className="px-4 py-2 border border-gray-200 rounded text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-white font-medium transition-colors cursor-pointer"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ASIDE DERECHO */}
          <aside className="w-full lg:w-72 p-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 shrink-0 overflow-y-auto">
            <RightPanelContent />
          </aside>
        </main>

        {/* Modal de confirmación para guardar */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => !actionLoading && setShowConfirmModal(false)}
            />
            <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-[340px] mx-4 flex flex-col items-center gap-4 text-center">
              <h3 className="text-[16px] font-bold text-[#1a1a2e] mb-1">Confirmar Acción</h3>
              <p className="text-[13px] text-[#5b6472] leading-relaxed">
                ¿Desea guardar la categoría?
              </p>
              <div className="flex justify-center gap-3 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={actionLoading}
                  className="flex-1 h-10 px-4 text-[13px] font-bold text-[#1a1a2e] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleSaveEdit()
                    setShowConfirmModal(false)
                  }}
                  disabled={actionLoading}
                  className="flex-1 h-10 px-4 text-[13px] font-bold text-white bg-[#00388c] rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:bg-[#00388c]/60 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  {actionLoading ? <Loader2 size={14} className="animate-spin" /> : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoriesPage
