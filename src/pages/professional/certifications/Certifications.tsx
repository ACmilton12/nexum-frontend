import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from '../../admin/components/Sidebar'
import Calendar from '../../../components/ui/Calendar'
import {
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Award,
  Edit2,
  Eye,
  EyeOff,
  X
} from 'lucide-react'
import {
  createCertification,
  updateCertification,
  updateCertificationImage,
  getCertifications,
  toggleCertificationVisibility,
  type Certification
} from '../../../services/certification.service'

function Certifications() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCertificationId, setEditingCertificationId] = useState<number | null>(null)
  const [showVisibilityModal, setShowVisibilityModal] = useState(false)
  const [certificationToToggle, setCertificationToToggle] = useState<Certification | null>(null)
  const [imagePreviewCert, setImagePreviewCert] = useState<Certification | null>(null)

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [entidad, setEntidad] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)

  const [actionLoading, setActionLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const { t } = useTranslation()

  const fetchCertifications = async () => {
    try {
      setLoading(true)
      const data = await getCertifications()
      setCertifications(data)
    } catch (error) {
      console.error('Error al obtener certificaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertifications()
  }, [])

  const handleToggleVisibilityClick = (cert: Certification) => {
    setCertificationToToggle(cert)
    setShowVisibilityModal(true)
  }

  const confirmToggleVisibility = async () => {
    if (!certificationToToggle) return
    try {
      setActionLoading(true)
      await toggleCertificationVisibility(certificationToToggle.id)
      await fetchCertifications()
      setShowVisibilityModal(false)
      setCertificationToToggle(null)
    } catch (error) {
      console.error('Error al alternar visibilidad:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditClick = (cert: Certification) => {
    // Backend returns dates as m/Y (e.g. "01/2026"), input type="date" needs YYYY-MM-DD
    const toDateInput = (val: string | null) => {
      if (!val) return ''
      // If already YYYY-MM-DD, return as-is
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
      // If m/Y format (e.g. 01/2026 or 1/2026)
      const match = val.match(/^(\d{1,2})\/(\d{4})$/)
      if (match) {
        const month = match[1].padStart(2, '0')
        return `${match[2]}-${month}-01`
      }
      return val
    }
    setEditingCertificationId(cert.id)
    setTitulo(cert.name)
    setDescripcion(cert.description || '')
    setEntidad(cert.issuing_entity)
    setFechaDesde(toDateInput(cert.issue_date))
    setFechaHasta(toDateInput(cert.expiration_date || null))
    setSelectedFile(null)
    setExistingImageUrl(cert.image_url || null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setShowForm(true)
  }

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
      if (validationErrors.image) {
        setValidationErrors({ ...validationErrors, image: '' })
      }
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

    if (!editingCertificationId && !selectedFile) {
      errors.image = t('certifications.error_required')
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
      const parts = val.split('-')
      if (parts.length >= 3) {
        const [y, m] = parts
        return `${m}/${y}`
      }
      const [y, m] = parts
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

      if (editingCertificationId) {
        await updateCertification(editingCertificationId, payload)
        setSuccess(t('certifications.toast_update_success', 'Certificación actualizada con éxito'))
      } else {
        const newCert = await createCertification(payload)
        await updateCertificationImage(newCert.id, selectedFile!)
        setSuccess(t('certifications.toast_success'))
      }

      setEditingCertificationId(null)
      setTitulo('')
      setDescripcion('')
      setEntidad('')
      setFechaDesde('')
      setFechaHasta('')
      setSelectedFile(null)
      setExistingImageUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setValidationErrors({})
      await fetchCertifications()
      setShowForm(false)
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
          <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto pt-2">
              <header className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-textMain dark:text-white">
                  {t('certifications.title')}
                </h1>
              </header>

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

              {!showForm ? (
                <div className="space-y-6">
                  {!loading && certifications.length > 0 && (
                    <div className="flex justify-end items-center mb-4">
                      <button
                        onClick={() => {
                          setSuccess(null)
                          setGlobalError(null)
                          setEditingCertificationId(null)
                          setTitulo('')
                          setDescripcion('')
                          setEntidad('')
                          setFechaDesde('')
                          setFechaHasta('')
                          setSelectedFile(null)
                          setExistingImageUrl(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                          setValidationErrors({})
                          setShowForm(true)
                        }}
                        className="bg-action hover:brightness-110 text-white font-bold px-4 py-2 rounded-lg shadow-sm transition-all text-xs flex items-center gap-1.5"
                      >
                        <Plus size={14} />
                        {t('certifications.add_certification')}
                      </button>
                    </div>
                  )}

                  {loading ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center text-gray-500 border border-gray-100 dark:border-gray-700">
                      <Loader2 className="animate-spin mx-auto mb-2 text-[#003087] dark:text-blue-500" size={24} />
                      {t('common.loading')}
                    </div>
                  ) : certifications.length === 0 ? (
                    <div className="py-12 px-6 text-center bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                      <Award size={40} className="text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="text-gray-600 dark:text-gray-300 font-bold text-sm mb-4">
                        {t('certifications.no_registered_certifications', 'no hay certificaciones registradas')}
                      </p>
                      <button
                        onClick={() => {
                          setSuccess(null)
                          setGlobalError(null)
                          setEditingCertificationId(null)
                          setTitulo('')
                          setDescripcion('')
                          setEntidad('')
                          setFechaDesde('')
                          setFechaHasta('')
                          setSelectedFile(null)
                          setExistingImageUrl(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                          setValidationErrors({})
                          setShowForm(true)
                        }}
                        className="bg-action hover:brightness-110 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all text-sm flex items-center gap-2"
                      >
                        <Plus size={16} />
                        {t('certifications.add_certification')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {certifications.map((cert) => (
                        <div
                          key={cert.id}
                          className={`bg-white dark:bg-slate-800 rounded-xl border-l-4 p-6 shadow-sm border flex justify-between items-start transition-all duration-300 hover:shadow-md ${!cert.is_active ? 'opacity-60 border-gray-400 dark:border-gray-600 grayscale-[0.5]' : 'border-[#003087] dark:border-cyan-400 border-gray-100 dark:border-gray-700'}`}
                        >
                          <div className="flex-grow min-w-0 pr-4">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                                {cert.issue_date} - {cert.expiration_date || t('portfolio_view.present', 'Presente')}
                              </span>
                            </div>
                            <h3 className="font-bold text-textMain dark:text-white text-base mb-1">
                              {cert.name}
                            </h3>
                            <p className="text-primary dark:text-blue-400 text-sm font-semibold mb-3">
                              <a
                                href={cert.issuing_entity}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {cert.issuing_entity}
                              </a>
                            </p>
                            {cert.description && (
                              <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-4 whitespace-pre-line">
                                {cert.description}
                              </p>
                            )}
                            {cert.image_url && (
                              <button
                                type="button"
                                onClick={() => setImagePreviewCert(cert)}
                                className="mt-3 group flex items-center gap-3 p-2 -ml-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border-none bg-transparent text-left"
                                title={t('certifications.view_image', 'Ver imagen del certificado')}
                              >
                                <img
                                  src={cert.image_url}
                                  alt={cert.name}
                                  className="w-16 h-16 object-cover rounded shadow-sm border border-gray-200 dark:border-gray-700 group-hover:ring-2 group-hover:ring-[#003087] dark:group-hover:ring-cyan-400 transition-all"
                                />
                                <span className="text-[11px] font-semibold text-[#003087] dark:text-cyan-400 group-hover:underline">
                                  {t('certifications.view_image', 'Ver imagen')}
                                </span>
                              </button>
                            )}
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(cert)}
                              disabled={actionLoading || !cert.is_active}
                              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                                !cert.is_active
                                  ? 'bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-600 cursor-not-allowed'
                                  : 'bg-[#eff5ff] text-[#003087] dark:bg-blue-900/30 dark:text-cyan-400 hover:brightness-95'
                              }`}
                              title={!cert.is_active ? t('certifications.activate_to_edit', 'Activa la certificación para poder editarla') : t('common.edit', 'Editar')}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleVisibilityClick(cert)}
                              disabled={actionLoading}
                              className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-colors ${!cert.is_active ? 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-slate-700' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-slate-700'}`}
                              title={cert.is_active ? t('experience.hide', 'Ocultar') : t('experience.show', 'Mostrar')}
                            >
                              {cert.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8 mb-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                  <h2 className="text-base font-bold text-textMain dark:text-white mb-6">
                    {editingCertificationId ? t('certifications.edit_certification', 'Editar Certificación') : t('certifications.add_certification')}
                  </h2>

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
                          <div className="w-full sm:flex-1 min-w-0">
                            <input
                              type="date"
                              value={fechaDesde}
                              onChange={(e) => {
                                handleFechaDesdeChange(e)
                                if (validationErrors.fechaDesde)
                                  setValidationErrors({ ...validationErrors, fechaDesde: '' })
                              }}
                              disabled={actionLoading}
                              className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm ${validationErrors.fechaDesde ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
                            />
                            {validationErrors.fechaDesde && (
                              <span className="text-red-500 text-[11px] mt-1 block text-center w-full">
                                {validationErrors.fechaDesde}
                              </span>
                            )}
                          </div>

                          <span className="text-gray-400 hidden sm:block mt-3">-</span>

                          {/* Fecha Fin */}
                          <div className="w-full sm:flex-1 min-w-0">
                            <input
                              type="date"
                              value={fechaHasta}
                              onChange={(e) => {
                                handleFechaHastaChange(e)
                                if (validationErrors.fechaHasta)
                                  setValidationErrors({ ...validationErrors, fechaHasta: '' })
                              }}
                              disabled={actionLoading}
                              className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm ${validationErrors.fechaHasta ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
                            />
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
                        {!editingCertificationId && <span className="text-red-500"> *</span>}
                      </label>
                      <div className={`w-full bg-[#f0f4f8] dark:bg-slate-900 border border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors ${validationErrors.image ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#d1dce5] dark:border-gray-700'}`}>
                        {editingCertificationId && existingImageUrl ? (
                          <div className="flex flex-col items-center gap-2">
                            <img
                              src={existingImageUrl}
                              alt={titulo}
                              className="w-20 h-20 object-cover rounded shadow-md border-2 border-white dark:border-slate-800"
                            />
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold text-center">
                              {t('certifications.image_not_editable', 'La imagen del certificado no puede modificarse')}
                            </p>
                          </div>
                        ) : selectedFile ? (
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
                        {!editingCertificationId && (
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                        )}
                      </div>
                      {validationErrors.image && (
                        <span className="text-red-500 text-[11px] mt-1 block">
                          {validationErrors.image}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-8 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingCertificationId(null)
                        setTitulo('')
                        setDescripcion('')
                        setEntidad('')
                        setFechaDesde('')
                        setFechaHasta('')
                        setSelectedFile(null)
                        setExistingImageUrl(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                        setValidationErrors({})
                      }}
                      disabled={actionLoading}
                      className="px-6 py-2 rounded border border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm bg-white dark:bg-transparent"
                    >
                      {t('common.cancel', 'Cancelar')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCertificationId(null)
                        setTitulo('')
                        setDescripcion('')
                        setEntidad('')
                        setFechaDesde('')
                        setFechaHasta('')
                        setSelectedFile(null)
                        setExistingImageUrl(null)
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
              )}
            </div>
          </div>

          <aside className="hidden lg:flex w-72 shrink-0 bg-white dark:bg-slate-900 p-6 flex-col gap-6 lg:border-l border-gray-200 dark:border-gray-800 overflow-y-auto transition-colors duration-300">
            <div className="flex flex-col gap-3">
              <Calendar />
            </div>
          </aside>
        </main>

        {/* Image Preview Modal */}
        {imagePreviewCert?.image_url && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setImagePreviewCert(null)}
            />
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="min-w-0 pr-4">
                  <h3 className="text-[15px] font-bold text-[#1a1a2e] dark:text-white truncate">
                    {imagePreviewCert.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {imagePreviewCert.issue_date}
                    {imagePreviewCert.expiration_date
                      ? ` - ${imagePreviewCert.expiration_date}`
                      : ` - ${t('portfolio_view.present', 'Presente')}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setImagePreviewCert(null)}
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  aria-label={t('common.close', 'Cerrar')}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-5 overflow-auto flex items-center justify-center bg-[#f0f4f8] dark:bg-slate-950">
                <img
                  src={imagePreviewCert.image_url}
                  alt={imagePreviewCert.name}
                  className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        )}

        {/* Confirm Save Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowConfirmModal(false)}
            />
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-[340px] mx-4 flex flex-col items-center gap-4 text-center border border-gray-100 dark:border-gray-800 transition-colors">
              <h3 className="text-[16px] font-bold text-[#1a1a2e] dark:text-white mb-1">
                {t('certifications.confirm_title', 'Confirmar Acción')}
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
                  {t('common.cancel', 'Cancelar')}
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

        {/* Visibility Toggle Modal */}
        {showVisibilityModal && certificationToToggle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowVisibilityModal(false)}
            />
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-[440px] mx-4 flex flex-col gap-5 border border-gray-100 dark:border-gray-800 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${certificationToToggle.is_active ? 'bg-red-50 dark:bg-red-900/30 text-red-500' : 'bg-green-50 dark:bg-green-900/30 text-green-600'}`}>
                  {certificationToToggle.is_active ? <EyeOff size={24} /> : <Eye size={24} />}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-[17px] font-bold text-[#1a1a2e] dark:text-white mb-1">
                    {certificationToToggle.is_active ? 'Deshabilitar certificación' : 'Habilitar certificación'}
                  </h3>
                  <p className="text-[14px] text-gray-500 dark:text-gray-400">
                    {certificationToToggle.is_active ? 'Puedes re-habilitarla en cualquier momento' : 'Puedes deshabilitarla en cualquier momento'}
                  </p>
                </div>
              </div>

              <div className="text-[15px] text-[#1a1a2e] dark:text-gray-200 mt-2">
                ¿Deseas {certificationToToggle.is_active ? 'deshabilitar' : 'habilitar'} "{certificationToToggle.name}" de tu perfil?
              </div>

              <div className="bg-[#f5f8ff] dark:bg-blue-900/20 border border-[#e0eaff] dark:border-blue-900/30 rounded-xl p-4 flex gap-3 text-[13px] text-[#003087] dark:text-blue-300 leading-relaxed">
                <div className="shrink-0 mt-0.5">
                  <AlertCircle size={16} />
                </div>
                <p>
                  {certificationToToggle.is_active 
                    ? 'La certificación no se eliminará. Quedará oculta en tu portafolio público y podrás re-habilitarla cuando quieras desde esta misma pantalla.'
                    : 'La certificación volverá a ser visible en tu portafolio público de inmediato.'}
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowVisibilityModal(false)}
                  disabled={actionLoading}
                  className="h-10 px-5 text-[14px] font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmToggleVisibility}
                  disabled={actionLoading}
                  className={`h-10 px-5 text-[14px] font-medium text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${certificationToToggle.is_active ? 'bg-[#c8102e] hover:bg-red-700' : 'bg-[#003087] hover:bg-blue-800'}`}
                >
                  {actionLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    certificationToToggle.is_active ? 'Sí, deshabilitar' : 'Sí, habilitar'
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
