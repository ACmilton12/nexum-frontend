import { useState, useEffect } from 'react'
import { Database, Download, Trash2, Plus, Clock, FileArchive, CheckCircle } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Toast from '../../components/ui/Toast'
import { generateBackup } from '../../services/backups.service'
import { getActivityLogs } from '../../services/admin.service'

interface Backup {
  id: string
  name: string
  size: string
  date: string
  type: 'Automático' | 'Manual'
}

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ mensaje: string; tipo: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const logs = await getActivityLogs()
        // Filtrar logs de eventos de backup
        const backupLogs = logs.data
          .filter((log: { event?: string }) => log.event === 'backup.generated')
          .map((log: { id: string | number, timestamp: string, properties?: { filename?: string } }) => ({
            id: log.id.toString(),
            name: log.properties?.filename || 'backup_db.sql',
            size: 'N/A',
            date: log.timestamp,
            type: 'Manual' as const
          }))
        setBackups(backupLogs)
      } catch (error) {
        console.error('Error al cargar historial de backups:', error)
      }
    }
    fetchHistory()
  }, [])

  const handleGenerateBackup = async () => {
    setLoading(true)
    try {
      const result = await generateBackup()

      const newBackup: Backup = {
        id: `bkp-${Date.now()}`,
        name: result.filename,
        size: result.size,
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
      setToast({ mensaje: 'Copia de seguridad generada y descargada con éxito.', tipo: 'success' })
    } catch (error: unknown) {
      setToast({ mensaje: (error as Error).message || 'Error al generar el backup.', tipo: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setBackups(backups.filter((b) => b.id !== id))
    setToast({ mensaje: 'Entrada eliminada del historial local.', tipo: 'success' })
  }

  const handleDownload = () => {
    setToast({ mensaje: 'El archivo ya fue descargado al generarse.', tipo: 'success' })
  }

  return (
    <div className="h-screen max-h-screen bg-background dark:bg-slate-900 flex flex-col transition-colors duration-300 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem="Copias de Seguridad" />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 md:p-8 bg-background dark:bg-slate-900 transition-colors duration-300">
          <div className="max-w-6xl w-full mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-textMain dark:text-white flex items-center gap-2 mb-1">
                  <Database className="text-primary" size={24} />
                  Copias de Seguridad
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Gestiona y genera respaldos de la base de datos del sistema.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {/* Botón de Restaurar (Estático) */}
                <button
                  onClick={() =>
                    setToast({
                      mensaje:
                        'La restauración debe ser realizada manualmente por un administrador de base de datos por seguridad.',
                      tipo: 'error'
                    })
                  }
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm px-5 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center justify-center gap-2 font-semibold w-full sm:w-auto"
                >
                  <Download className="rotate-180" size={18} />
                  Restaurar Backup
                </button>

                {/* Botón de Generar */}
                <button
                  onClick={handleGenerateBackup}
                  disabled={loading}
                  className="bg-action text-white text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 font-semibold disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
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
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <FileArchive className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                    Total Backups
                  </p>
                  <p className="text-2xl font-bold text-textMain dark:text-white">
                    {backups.length}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                    Último Backup
                  </p>
                  <p className="text-sm font-bold text-textMain dark:text-white">
                    {backups[0]?.date || 'Ninguno'}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                    Estado
                  </p>
                  <p className="text-sm font-bold text-textMain dark:text-white">
                    Automatizado activo
                  </p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-900/50">
                <h2 className="font-bold text-textMain dark:text-white text-sm">
                  Historial de Respaldos
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400 min-w-[560px]">
                  <thead className="text-xs text-gray-400 dark:text-gray-500 uppercase bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-gray-700">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Nombre del Archivo</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold">Tipo</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold">Tamaño</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Fecha y Hora</th>
                      <th className="px-4 sm:px-6 py-3 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-gray-500 dark:text-gray-500"
                        >
                          No hay copias de seguridad disponibles.
                        </td>
                      </tr>
                    ) : (
                      backups.map((backup) => (
                        <tr
                          key={backup.id}
                          className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-textMain dark:text-white flex items-center gap-2">
                            <Database size={14} className="text-gray-400 dark:text-gray-500" />
                            {backup.name}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${backup.type === 'Automático'
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
                                onClick={() => handleDownload()}
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
