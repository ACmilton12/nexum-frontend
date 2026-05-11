import { useState } from 'react'
import { Database, Download, Trash2, Plus, Clock, FileArchive, CheckCircle } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Toast from '../../components/ui/Toast'

interface Backup {
  id: string
  name: string
  size: string
  date: string
  type: 'Automático' | 'Manual'
}

const mockBackups: Backup[] = [
  {
    id: 'bkp-001',
    name: 'backup_nexum_db_2026-04-26.sql',
    size: '45.2 MB',
    date: '26 abr 2026, 03:00',
    type: 'Automático'
  },
  {
    id: 'bkp-002',
    name: 'backup_nexum_db_2026-04-25.sql',
    size: '44.8 MB',
    date: '25 abr 2026, 03:00',
    type: 'Automático'
  },
  {
    id: 'bkp-003',
    name: 'backup_manual_pre_update.sql',
    size: '44.5 MB',
    date: '24 abr 2026, 15:45',
    type: 'Manual'
  }
]

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>(mockBackups)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ mensaje: string; tipo: 'success' | 'error' } | null>(null)

  const handleGenerateBackup = () => {
    setLoading(true)
    // Simulación de creación de backup (hasta que el backend esté listo)
    setTimeout(() => {
      const newBackup: Backup = {
        id: `bkp-${Date.now()}`,
        name: `backup_manual_nexum_${new Date().toISOString().split('T')[0]}.sql`,
        size: '45.3 MB',
        date: new Date().toLocaleString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'Manual'
      }
      setBackups([newBackup, ...backups])
      setLoading(false)
      setToast({ mensaje: 'Copia de seguridad generada con éxito.', tipo: 'success' })
    }, 2000)
  }

  const handleDelete = (id: string) => {
    if (
      confirm('¿Estás seguro de que deseas eliminar este backup? Esta acción no se puede deshacer.')
    ) {
      setBackups(backups.filter((b) => b.id !== id))
      setToast({ mensaje: 'Copia de seguridad eliminada.', tipo: 'success' })
    }
  }

  const handleDownload = (name: string) => {
    setToast({ mensaje: `Descargando ${name}...`, tipo: 'success' })
    // Aquí iría la lógica real de descarga (window.open(url) o crear blob)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem="Copias de Seguridad" />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 md:p-8 pl-16 md:pl-8">
          <div className="max-w-6xl w-full mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-textMain flex items-center gap-2 mb-1">
                  <Database className="text-primary" size={24} />
                  Copias de Seguridad
                </h1>
                <p className="text-sm text-gray-500">
                  Gestiona y genera respaldos de la base de datos del sistema.
                </p>
              </div>

              <button
                onClick={handleGenerateBackup}
                disabled={loading}
                className="bg-action text-white text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md flex items-center gap-2 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Generar Backup Manual
                  </>
                )}
              </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <FileArchive className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">
                    Total Backups
                  </p>
                  <p className="text-2xl font-bold text-textMain">{backups.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">
                    Último Backup
                  </p>
                  <p className="text-sm font-bold text-textMain">{backups[0]?.date || 'Ninguno'}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">
                    Estado
                  </p>
                  <p className="text-sm font-bold text-textMain">Automatizado activo</p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-bold text-textMain text-sm">Historial de Respaldos</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Nombre del Archivo</th>
                      <th className="px-6 py-3 font-semibold">Tipo</th>
                      <th className="px-6 py-3 font-semibold">Tamaño</th>
                      <th className="px-6 py-3 font-semibold">Fecha y Hora</th>
                      <th className="px-6 py-3 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No hay copias de seguridad disponibles.
                        </td>
                      </tr>
                    ) : (
                      backups.map((backup) => (
                        <tr
                          key={backup.id}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-textMain flex items-center gap-2">
                            <Database size={14} className="text-gray-400" />
                            {backup.name}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                                backup.type === 'Automático'
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-navbar/10 text-navbar'
                              }`}
                            >
                              {backup.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">{backup.size}</td>
                          <td className="px-6 py-4">{backup.date}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDownload(backup.name)}
                                className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                title="Descargar"
                              >
                                <Download size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(backup.id)}
                                className="p-1.5 text-gray-400 hover:text-action hover:bg-action/10 rounded transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 size={18} />
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
        </main>
      </div>
      {toast && <Toast message={toast.mensaje} type={toast.tipo} onClose={() => setToast(null)} />}
    </div>
  )
}
