import { useState, useEffect, useRef } from 'react'
import {
  Search,
  Calendar as CalendarIcon,
  Download,
  ShieldCheck,
  Eye,
  X,
  ArrowRight
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import Calendar from '../../components/ui/Calendar'
import { getActivityLogs } from '../../services/admin.service'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface AuditLog {
  id: number
  user_name: string
  event: string
  timestamp: string
  detail: string
  raw_date: string
  properties?: {
    attributes?: Record<string, unknown>
    old?: Record<string, unknown>
  }
}

const RightPanelContent = ({ onExportPDF }: { onExportPDF: () => void }) => (
  <div className="sticky top-6 space-y-8">
    <div>
      <h3 className="font-bold text-textMain mb-4 flex items-center gap-2">
        <CalendarIcon size={18} className="text-primary" />
        Calendario
      </h3>
      <Calendar />
    </div>

    <div>
      <h3 className="font-bold text-textMain mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
        <ShieldCheck size={16} className="text-primary" />
        Seguridad
      </h3>
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
        <p className="text-[11px] text-blue-700 leading-relaxed">
          Supervisión activa del sistema. Se registran todos los cambios de roles y accesos
          fallidos.
        </p>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-textMain mb-4 text-xs uppercase tracking-wider">Reportes</h3>
      <button
        onClick={onExportPDF}
        className="w-full flex items-center justify-center gap-3 p-3 bg-white text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all border border-gray-200 group shadow-sm hover:shadow-md"
      >
        <Download size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
        <span className="font-medium">Exportar PDF</span>
      </button>
    </div>
  </div>
)

const AuditPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  // Referencias para disparar los inputs de fecha ocultos
  const dateFromRef = useRef<HTMLInputElement>(null)
  const dateToRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const result = await getActivityLogs({ per_page: 100 })
      setLogs(result.data)
    } catch (err: unknown) {
      setError((err as Error).message || 'Error al cargar el historial de auditoría.')
    } finally {
      setLoading(false)
    }
  }

  // Función para abrir el calendario nativo al hacer clic en el diseño personalizado
  const handleOpenCalendar = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          ref.current.showPicker()
        } catch {
          ref.current.focus()
        }
      } else {
        ref.current.focus()
      }
    }
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Historial de Auditoría - NEXUM', 14, 22)
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 30)

    const tableColumn = ['Usuario', 'Evento', 'Fecha/Hora', 'Detalle']
    const tableRows = filteredLogs.map((log) => [
      log.user_name,
      log.event.toUpperCase(),
      log.timestamp,
      log.detail
    ])

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [0, 48, 135] },
      styles: { fontSize: 8 }
    })

    doc.save(`historial_auditoria_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toString().includes(searchTerm)

    let matchesDate = true
    if (dateFrom || dateTo) {
      const logDate = new Date(log.raw_date)
      if (dateFrom) {
        const [y, m, d] = dateFrom.split('-').map(Number)
        const from = new Date(y, m - 1, d, 0, 0, 0, 0)
        if (logDate < from) matchesDate = false
      }
      if (dateTo) {
        const [y, m, d] = dateTo.split('-').map(Number)
        const to = new Date(y, m - 1, d, 23, 59, 59, 999)
        if (logDate > to) matchesDate = false
      }
    }
    return matchesSearch && matchesDate
  })

  const getEventBadgeClass = (event: string) => {
    switch (event.toLowerCase()) {
      case 'update_role':
      case 'updated':
        return 'bg-blue-100 text-blue-700'
      case 'login_failed':
        return 'bg-red-100 text-red-700'
      case 'profile_updated':
        return 'bg-green-100 text-green-700'
      case 'portfolio_edit':
        return 'bg-indigo-100 text-indigo-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const translateEventName = (event: string) => {
    switch (event.toLowerCase()) {
      case 'created':
        return 'Creado'
      case 'updated':
        return 'Actualizado'
      case 'deleted':
        return 'Eliminado'
      case 'update_role':
        return 'Rol Actualizado'
      case 'login_failed':
        return 'Acceso Fallido'
      case 'login':
        return 'Login Exitoso'
      case 'logout':
        return 'Cierre Sesión'
      case 'profile_updated':
        return 'Perfil Modificado'
      case 'portfolio_edit':
        return 'Portafolio Editado'
      default:
        return event.replace(/_/g, ' ')
    }
  }

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'DD/MM/AA'
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y.slice(-2)}`
  }

  const translateKey = (key: string) => {
    const map: Record<string, string> = {
      first_name: 'Nombre',
      last_name: 'Apellido',
      email: 'Email',
      role: 'Rol',
      is_active: 'Estado',
      password: 'Contraseña',
      biography: 'Biografía',
      phone: 'Teléfono',
      location: 'Ubicación',
      github_url: 'GitHub',
      linkedin_url: 'LinkedIn',
      global_privacy: 'Privacidad',
      name: 'Nombre del Proyecto',
      description: 'Descripción'
    }
    return map[key] || key
  }

  const renderChangesTable = (log: AuditLog) => {
    const props = log.properties
    if (!props || (!props.attributes && !props.old)) {
      return (
        <div className="p-8 text-center text-gray-500 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          No hay detalles adicionales estructurados para este evento.
        </div>
      )
    }

    const attributes = props.attributes || {}
    const old = props.old || {}

    const isUpdate =
      log.event === 'updated' ||
      log.event === 'profile_updated' ||
      log.event === 'portfolio_edit' ||
      Object.keys(old).length > 0

    if (isUpdate) {
      const keys = Array.from(new Set([...Object.keys(attributes), ...Object.keys(old)])).filter(
        (k) => k !== 'updated_at' && k !== 'created_at' && k !== 'id'
      )

      if (keys.length === 0)
        return (
          <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl">
            Sin cambios detectables.
          </p>
        )

      return (
        <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-4 font-bold w-1/3">Campo Modificado</th>
                <th className="px-5 py-4 font-bold text-red-600 bg-red-50/50 w-1/3">
                  Valor Anterior
                </th>
                <th className="px-5 py-4 font-bold text-green-600 bg-green-50/50 w-1/3">
                  Nuevo Valor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {keys.map((key) => {
                const oldVal = old[key] !== undefined && old[key] !== null ? String(old[key]) : 'Ø'
                const newVal =
                  attributes[key] !== undefined && attributes[key] !== null
                    ? String(attributes[key])
                    : 'Ø'
                const isChanged = oldVal !== newVal
                return (
                  <tr
                    key={key}
                    className={`transition-colors hover:bg-gray-50 ${isChanged ? 'bg-white' : 'opacity-60 bg-gray-50'}`}
                  >
                    <td className="px-5 py-4 font-medium text-gray-900 border-r border-gray-100/50">
                      {translateKey(key)}
                    </td>
                    <td
                      className="px-5 py-4 text-red-900 bg-red-50/20 font-mono text-xs break-all 
                                   line-through decoration-red-300/80 opacity-80"
                    >
                      {oldVal}
                    </td>
                    <td className="px-5 py-4 text-green-900 bg-green-50/20 font-mono text-xs break-all font-medium flex items-center gap-2">
                      {isChanged && (
                        <span className="text-green-500">
                          <ArrowRight size={14} />
                        </span>
                      )}
                      {newVal}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }

    const keys = Object.keys(attributes).filter(
      (k) => k !== 'created_at' && k !== 'updated_at' && k !== 'id'
    )
    if (keys.length === 0) return null

    return (
      <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-50/50 border-b border-blue-100 text-xs uppercase tracking-wider text-blue-700">
            <tr>
              <th className="px-5 py-4 font-bold w-1/3">Dato Registrado</th>
              <th className="px-5 py-4 font-bold">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {keys.map((key) => (
              <tr key={key} className="bg-white hover:bg-blue-50/30 transition-colors">
                <td className="px-5 py-4 font-medium text-gray-900 border-r border-gray-50 bg-gray-50/10">
                  {translateKey(key)}
                </td>
                <td className="px-5 py-4 text-blue-900 font-mono text-xs break-all bg-blue-50/10">
                  {String(attributes[key])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar activeItem="Auditoría" />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-6 overflow-y-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-textMain mb-6">
            Historial de Auditoría
          </h1>

          {/* FILTROS RESPONSIVOS */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
            {/* Buscador */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar por usuario o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
            </div>

            {/* Selector de Fechas (Solución Definitiva con showPicker) */}
            <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-2 flex-1 md:flex-none justify-between">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-tighter w-full">
                {/* Botón Desde */}
                <div
                  className="relative flex-1 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors"
                  onClick={() => handleOpenCalendar(dateFromRef)}
                >
                  <span className="text-gray-400 block mb-0.5">Desde</span>
                  <span className="text-textMain block text-[13px] font-medium">
                    {formatDateDisplay(dateFrom)}
                  </span>
                  <input
                    ref={dateFromRef}
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="absolute inset-0 opacity-0 pointer-events-none"
                  />
                </div>

                <div className="h-8 w-px bg-gray-100 shrink-0"></div>

                {/* Botón Hasta */}
                <div
                  className="relative flex-1 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors"
                  onClick={() => handleOpenCalendar(dateToRef)}
                >
                  <span className="text-gray-400 block mb-0.5">Hasta</span>
                  <span className="text-textMain block text-[13px] font-medium">
                    {formatDateDisplay(dateTo)}
                  </span>
                  <input
                    ref={dateToRef}
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="absolute inset-0 opacity-0 pointer-events-none"
                  />
                </div>

                <CalendarIcon size={18} className="text-gray-300 shrink-0 ml-1" />
              </div>
            </div>
          </div>

          {/* TABLA DE AUDITORÍA */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[850px]">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 uppercase text-[11px] tracking-wider">
                    <th className="text-left px-6 py-4 font-bold">Usuario</th>
                    <th className="text-center px-6 py-4 font-bold">Evento</th>
                    <th className="text-left px-6 py-4 font-bold">Fecha/Hora</th>
                    <th className="text-left px-6 py-4 font-bold text-center">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-16 text-center text-gray-400 animate-pulse">
                        Consultando base de datos...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="p-16 text-center text-action font-medium">
                        {error}
                      </td>
                    </tr>
                  ) : filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-6 py-4 text-textMain font-normal ">{log.user_name}</td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getEventBadgeClass(log.event)}`}
                          >
                            {translateEventName(log.event)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                          {log.timestamp}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => setSelectedLog(log)}
                              className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm flex shrink-0 items-center justify-center border border-blue-100 hover:border-blue-600 group tooltip-trigger relative"
                              title="Ver detalles profundos"
                            >
                              <Eye
                                size={18}
                                className="group-hover:scale-110 transition-transform"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-16 text-center text-gray-400 italic">
                        No se encontraron registros de auditoría.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ASIDE DERECHO */}
        <aside className="w-full lg:w-72 p-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 shrink-0 overflow-y-auto">
          <RightPanelContent onExportPDF={handleExportPDF} />
        </aside>
      </main>

      {/* MODAL DETALLES DE ACTIVIDAD */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 sm:px-8 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  Detalles de Actividad
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded-md">
                    ID: {selectedLog.id}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <CalendarIcon size={12} />
                    {selectedLog.timestamp}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2.5 text-gray-400 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-gray-50/30">
              <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div
                  className={`p-4 rounded-xl shrink-0 shadow-inner ${getEventBadgeClass(selectedLog.event)}`}
                >
                  <ShieldCheck size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                    Usuario Responsable
                  </p>
                  <p className="font-bold text-gray-900 text-lg">{selectedLog.user_name}</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-auto sm:text-right shrink-0">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getEventBadgeClass(selectedLog.event)} border-current/20`}
                  >
                    {translateEventName(selectedLog.event)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  Datos y Estados
                </h4>
                {renderChangesTable(selectedLog)}
              </div>
            </div>

            <div className="px-6 py-5 sm:px-8 border-t border-gray-100 bg-white flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-8 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg focus:ring-4 focus:ring-gray-200"
              >
                Cerrar Detalles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuditPage
