import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from '../../admin/components/Sidebar'
import Calendar from '../../../components/ui/Calendar'
import {
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react'
import {
  createCertification,
  updateCertificationImage
} from '../../../services/certification.service'


function Certifications() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [entidad, setEntidad] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [actionLoading, setActionLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const { t, i18n } = useTranslation()

  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
      setTitulo(val)
    }
  }

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescripcion(e.target.value)
  }

  const handleEntidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntidad(e.target.value)
  }

  const formatToLongDate = (val: string) => {
    if (!val) return ''
    const [y, m] = val.split('-')
    const date = new Date(parseInt(y), parseInt(m) - 1)
    return new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(date)
  }

  const handleFechaDesdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaDesde(e.target.value)
  }

  const handleFechaHastaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaHasta(e.target.value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setGlobalError(t('certifications.error_image_type'))
        setSelectedFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        setGlobalError(t('certifications.error_image_size'))
        setSelectedFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      setSelectedFile(file)
      setGlobalError(null)
    }
  }

  const handleSave = async () => {
    setGlobalError(null)
    setSuccess(null)
    const errors: { [key: string]: string } = {}

    if (!titulo.trim()) errors.titulo = t('certifications.error_required')
    if (!entidad.trim()) {
      errors.entidad = t('certifications.error_required')
    } else if (!/^https?:\/\/.+/.test(entidad)) {
      errors.entidad = t('certifications.error_invalid_url')
    }
    if (!fechaDesde) errors.fechaDesde = t('certifications.error_required')
    if (!fechaHasta) errors.fechaHasta = t('certifications.error_required')

    if (fechaDesde && fechaHasta && fechaHasta < fechaDesde) {
      errors.fechaHasta = t('certifications.error_date_range')
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
    setShowConfirmModal(true)
  }

  const confirmSave = async () => {
    setShowConfirmModal(false)
    setGlobalError(null)
    setSuccess(null)

    const formatToBackend = (val: string) => {
      if (!val) return null
      const [y, m] = val.split('-')
      return `${m}/${y}`
    }

    try {
      setActionLoading(true)

      const payload = {
        name: titulo,
        description: descripcion || null,
        issuing_entity: entidad,
        issue_date: formatToBackend(fechaDesde),
        expiration_date: formatToBackend(fechaHasta)
      }

      const newCert = await createCertification(payload)

      if (selectedFile) {
        await updateCertificationImage(newCert.id, selectedFile)
      }

      setSuccess(t('certifications.toast_success'))
      setTitulo('')
      setDescripcion('')
      setEntidad('')
      setFechaDesde('')
      setFechaHasta('')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setValidationErrors({})
    } catch (err: unknown) {
      const error = err as { errors?: Record<string, string[]>; message?: string }
      if (error.errors) {
        const firstErr = Object.values(error.errors)[0] as string[]
        setGlobalError(firstErr[0])
      } else {
        setGlobalError(error.message || t('certifications.toast_error'))
      }
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="h-full max-h-full bg-background dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300 overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Certificaciones" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#cbd5e1] dark:bg-slate-900 transition-colors duration-300">
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto pt-2">
              <header className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-textMain dark:text-white">
                  {t('certifications.title')}
                </h1>
              </header>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8 mb-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-base font-bold text-textMain dark:text-white mb-6">
                  {t('certifications.add_certification')}
                </h2>

                {globalError && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm flex items-center gap-3 animate-slideIn">
                    <AlertCircle size={18} />
                    {globalError}
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 text-sm flex items-center gap-3 animate-slideIn">
                    <CheckCircle2 size={18} />
                    {success}
                  </div>
                )}

                <div className="space-y-6 text-gray-700 dark:text-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold mt-2 dark:text-gray-300">
                      {t('certifications.cert_title_label')}:{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col w-full">
                      <input
                        type="text"
                        placeholder={t('certifications.cert_title_placeholder')}
                        value={titulo}
                        onChange={(e) => {
                          handleTituloChange(e)
                          if (validationErrors.titulo)
                            setValidationErrors({ ...validationErrors, titulo: '' })
                        }}
                        disabled={actionLoading}
                        className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 ${validationErrors.titulo ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
                      />
                      {validationErrors.titulo && (
                        <span className="text-red-500 text-[11px] mt-1">
                          {validationErrors.titulo}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold mt-2 dark:text-gray-300">
                      {t('certifications.description_label')}:
                    </label>
                    <div className="flex flex-col w-full">
                      <input
                        type="text"
                        placeholder={t('certifications.description_placeholder')}
                        value={descripcion}
                        onChange={(e) => {
                          handleDescripcionChange(e)
                        }}
                        disabled={actionLoading}
                        className="w-full p-2.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold mt-2 dark:text-gray-300">
                      {t('certifications.entity_url_label')}:{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col w-full">
                      <input
                        type="text"
                        placeholder={t('certifications.entity_url_placeholder')}
                        value={entidad}
                        onChange={(e) => {
                          handleEntidadChange(e)
                          if (validationErrors.entidad)
                            setValidationErrors({ ...validationErrors, entidad: '' })
                        }}
                        disabled={actionLoading}
                        className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm ${validationErrors.entidad ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
                      />
                      {validationErrors.entidad && (
                        <span className="text-red-500 text-[11px] mt-1">
                          {validationErrors.entidad}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold mt-2 dark:text-gray-300">
                      {t('certifications.date_label')}: <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col sm:flex-row items-start gap-3 w-full">
                        {/* Fecha Inicio */}
                        <div className="relative w-full sm:flex-1 min-w-0 group">
                          <input
                            type="month"
                            value={fechaDesde}
                            onChange={(e) => {
                              handleFechaDesdeChange(e)
                              if (validationErrors.fechaDesde)
                                setValidationErrors({ ...validationErrors, fechaDesde: '' })
                            }}
                            disabled={actionLoading}
                            className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 ${actionLoading ? 'pointer-events-none' : ''}`}
                          />
                          <div
                            className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 flex items-center justify-between text-sm transition-all ${validationErrors.fechaDesde ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700 group-hover:border-action'}`}
                          >
                            <span
                              className={
                                fechaDesde ? 'text-textMain dark:text-white' : 'text-gray-400'
                              }
                            >
                              {fechaDesde
                                ? formatToLongDate(fechaDesde)
                                : t('certifications.date_placeholder')}
                            </span>
                            <CalendarIcon size={14} className="text-gray-400" />
                          </div>
                          {validationErrors.fechaDesde && (
                            <span className="text-red-500 text-[11px] mt-1 block text-center w-full">
                              {validationErrors.fechaDesde}
                            </span>
                          )}
                        </div>

                        <span className="text-gray-400 hidden sm:block mt-3">-</span>

                        {/* Fecha Fin */}
                        <div className="relative w-full sm:flex-1 min-w-0 group">
                          <input
                            type="month"
                            value={fechaHasta}
                            onChange={(e) => {
                              handleFechaHastaChange(e)
                              if (validationErrors.fechaHasta)
                                setValidationErrors({ ...validationErrors, fechaHasta: '' })
                            }}
                            disabled={actionLoading}
                            className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 ${actionLoading ? 'pointer-events-none' : ''}`}
                          />
                          <div
                            className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 flex items-center justify-between text-sm transition-all ${validationErrors.fechaHasta ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700 group-hover:border-action'}`}
                          >
                            <span
                              className={
                                fechaHasta ? 'text-textMain dark:text-white' : 'text-gray-400'
                              }
                            >
                              {fechaHasta
                                ? formatToLongDate(fechaHasta)
                                : t('certifications.date_placeholder')}
                            </span>
                            <CalendarIcon size={14} className="text-gray-400" />
                          </div>
                          {validationErrors.fechaHasta && (
                            <span className="text-red-500 text-[11px] mt-1 block text-center w-full">
                              {validationErrors.fechaHasta}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className="text-[13px] font-bold mb-3 block dark:text-white">
                      {t('certifications.image_label')}:
                    </label>
                    <div className="w-full bg-[#f0f4f8] dark:bg-slate-900 border border-dashed border-[#d1dce5] dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors">
                      {selectedFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded shadow-md border-2 border-white dark:border-slate-800"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {selectedFile.name}
                          </p>
                          <button
                            onClick={() => setSelectedFile(null)}
                            className="text-red-500 text-[10px] hover:underline"
                          >
                            {t('certifications.remove')}
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={actionLoading}
                            className="bg-white dark:bg-slate-800 border text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 font-medium text-sm py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-all disabled:opacity-50"
                          >
                            <Upload size={16} /> {t('certifications.select_image')}
                          </button>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">
                            {t('certifications.image_format_info')}
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-8 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setTitulo('')
                      setDescripcion('')
                      setEntidad('')
                      setFechaDesde('')
                      setFechaHasta('')
                      setSelectedFile(null)
                      setValidationErrors({})
                    }}
                    disabled={actionLoading}
                    className="px-6 py-2 rounded border border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm bg-white dark:bg-transparent"
                  >
                    {t('certifications.clear')}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={actionLoading}
                    className="px-6 py-2 rounded font-medium text-sm text-white bg-action hover:brightness-110 shadow-md shadow-red-100 dark:shadow-none transition-all flex items-center gap-2 min-w-[150px] justify-center"
                  >
                    {actionLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      t('certifications.save')
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="w-[292px] w-full lg:w-72 shrink-0 bg-white dark:bg-slate-900 p-6 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 overflow-y-auto transition-colors duration-300">
            <div className="flex flex-col gap-3">
              <Calendar />
            </div>
          </aside>
        </main>

        {/* Confirm Save Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowConfirmModal(false)}
            />
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-[340px] mx-4 flex flex-col items-center gap-4 text-center border border-gray-100 dark:border-gray-800 transition-colors">
              <h3 className="text-[16px] font-bold text-[#1a1a2e] dark:text-white mb-1">
                {t('experience.confirm_title', 'Confirmar Acción')}
              </h3>
              <p className="text-[13px] text-[#5b6472] dark:text-gray-400 leading-relaxed">
                {t('certifications.confirm_desc', '¿Desea guardar la certificación?')}
              </p>
              <div className="flex justify-center gap-3 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={actionLoading}
                  className="flex-1 h-10 px-4 text-[13px] font-bold text-[#1a1a2e] dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  onClick={confirmSave}
                  disabled={actionLoading}
                  className="flex-1 h-10 px-4 text-[13px] font-bold text-white bg-action rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:bg-action/60"
                >
                  {actionLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    t('certifications.confirm_btn', 'Confirmar')
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Certifications
