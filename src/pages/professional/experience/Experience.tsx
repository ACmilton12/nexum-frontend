import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from '../../admin/components/Sidebar'
import Calendar from '../../../components/ui/Calendar'
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  X,
  Check,
  Plus,
  Briefcase,
  Edit2,
  Eye,
  EyeOff
} from 'lucide-react'
import {
  createExperience,
  updateExperience,
  getExperiences,
  toggleExperienceVisibility,
  type WorkExperience
} from '../../../services/experience.service'
import { getSkillsCatalog, type Skill } from '../../../services/project.service'

function Experience() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null)
  const [showVisibilityModal, setShowVisibilityModal] = useState(false)
  const [experienceToToggle, setExperienceToToggle] = useState<WorkExperience | null>(null)

  const [position, setPosition] = useState('')
  const [company, setCompany] = useState('')
  const [verificationUrl, setVerificationUrl] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [employmentType, setEmploymentType] = useState('remote')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [actionLoading, setActionLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { t, i18n } = useTranslation()

  const handleToggleVisibilityClick = (exp: WorkExperience) => {
    setExperienceToToggle(exp)
    setShowVisibilityModal(true)
  }

  const confirmToggleVisibility = async () => {
    if (!experienceToToggle) return
    try {
      setActionLoading(true)
      await toggleExperienceVisibility(experienceToToggle.id)
      await fetchExperiences()
      setShowVisibilityModal(false)
      setExperienceToToggle(null)
    } catch (error) {
      console.error('Error al alternar visibilidad:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const data = await getExperiences()
      setExperiences(data)
    } catch (error) {
      console.error('Error al obtener experiencias:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
    getSkillsCatalog().then(setAvailableSkills).catch(console.error)
  }, [])

  const handleEditClick = (exp: WorkExperience) => {
    // Backend returns dates as YYYY-MM, input type="date" needs YYYY-MM-DD
    const toDateInput = (val: string | null) => {
      if (!val) return ''
      // If already YYYY-MM-DD, return as-is
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
      // If YYYY-MM, append -01
      if (/^\d{4}-\d{2}$/.test(val)) return `${val}-01`
      return val
    }
    setEditingExperienceId(exp.id)
    setPosition(exp.position)
    setCompany(exp.company)
    setLocation(exp.location || '')
    setVerificationUrl(exp.verification_url || '')
    setStartDate(toDateInput(exp.start_date))
    setEndDate(toDateInput(exp.end_date || null))
    setEmploymentType(exp.employment_type)
    setDescription(exp.description || '')
    setSelectedSkills(
      (exp.skills || [])
        .map((expSkill) => availableSkills.find((s) => s.id === expSkill.id))
        .filter((s): s is Skill => s !== undefined)
    )
    setShowForm(true)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTechDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatToLongDate = (val: string) => {
    if (!val) return ''
    const [y, m] = val.split('-')
    const date = new Date(parseInt(y), parseInt(m) - 1)
    return new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(date)
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value)
  }

  const handleSave = async () => {
    setGlobalError(null)
    setSuccess(null)
    const errors: { [key: string]: string } = {}
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const start = new Date(startDate)

    if (!position.trim()) errors.position = t('experience.error_required')
    if (!company.trim()) errors.company = t('experience.error_required')
    if (!startDate) {
      errors.startDate = t('experience.error_required')
    } else {
     if (start > today) {
        errors.startDate = t('experience.error_future_date')
}
    }
    if (startDate && endDate && endDate < startDate) {
      errors.endDate = t('experience.error_date_range')
    }
    if (!employmentType) errors.employmentType = t('experience.error_required')
    if (!description.trim()) errors.description = t('experience.error_required')
    if (selectedSkills.length === 0) errors.skills = t('experience.error_min_skills')

    if (verificationUrl && !/^https?:\/\/.+/.test(verificationUrl)) {
      errors.verificationUrl = t('experience.error_invalid_url')
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

    // Native month input returns YYYY-MM
    const formatToBackend = (val: string) => {
      if (!val) return null
      const parts = val.split('-')
      if (parts.length >= 3) {
        const [y, m] = parts
        return `${y}-${m}`
      }
      return val
    }

    try {
      setActionLoading(true)

      const payload = {
        position,
        company,
        location: location || null,
        employment_type: employmentType,
        start_date: formatToBackend(startDate),
        end_date: formatToBackend(endDate),
        description: description,
        verification_url: verificationUrl || null,
        skill_ids: selectedSkills.map((s) => s.id)
      }

      if (editingExperienceId) {
        await updateExperience(editingExperienceId, payload)
        setSuccess(t('experience.toast_update_success', 'Experiencia actualizada con éxito'))
      } else {
        await createExperience(payload)
        setSuccess(t('experience.toast_success'))
      }

      // Reset form
      setEditingExperienceId(null)
      setPosition('')
      setCompany('')
      setStartDate('')
      setEndDate('')
      setEmploymentType('remote')
      setLocation('')
      setDescription('')
      setVerificationUrl('')
      setSelectedSkills([])
      setValidationErrors({})
      await fetchExperiences()
      setShowForm(false)
    } catch (err: unknown) {
      const error = err as { errors?: Record<string, string[]>; message?: string }
      if (error.errors) {
        const firstErr = Object.values(error.errors)[0]
        setGlobalError(firstErr[0])
      } else {
        setGlobalError(error.message || t('experience.toast_error'))
      }
    } finally {
      setActionLoading(false)
    }
  }

  const toggleSkill = (skill: Skill) => {
    if (selectedSkills.find((s) => s.id === skill.id)) {
      setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const removeSkill = (e: React.MouseEvent, skillId: number) => {
    e.stopPropagation()
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skillId))
  }


  return (
    <div className="h-full max-h-full bg-background dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300 overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Experiencia" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#cbd5e1] dark:bg-slate-900 transition-colors duration-300">
          <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto pt-2">
              <header className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-textMain dark:text-white">
                  {t('experience.title')}
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
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-textMain dark:text-white">
                      {t('portfolio_view.tab_experience', 'Trayectoria')}
                    </h2>
                    {!loading && experiences.length > 0 && (
                      <button
                        onClick={() => {
                          setSuccess(null)
                          setGlobalError(null)
                          setEditingExperienceId(null)
                          setPosition('')
                          setCompany('')
                          setVerificationUrl('')
                          setStartDate('')
                          setEndDate('')
                          setEmploymentType('remote')
                          setLocation('')
                          setDescription('')
                          setSelectedSkills([])
                          setValidationErrors({})
                          setShowForm(true)
                        }}
                        className="bg-action hover:brightness-110 text-white font-bold px-4 py-2 rounded-lg shadow-sm transition-all text-xs flex items-center gap-1.5"
                      >
                        <Plus size={14} />
                        {t('experience.add_experience')}
                      </button>
                    )}
                  </div>

                  {loading ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center text-gray-500 border border-gray-100 dark:border-gray-700">
                      <Loader2 className="animate-spin mx-auto mb-2 text-[#003087] dark:text-blue-500" size={24} />
                      {t('common.loading')}
                    </div>
                  ) : experiences.length === 0 ? (
                    <div className="py-12 px-6 text-center bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                      <Briefcase size={40} className="text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="text-gray-600 dark:text-gray-300 font-bold text-sm mb-4">
                        {t('experience.no_registered_experiences', 'no hay experiencias registradas')}
                      </p>
                      <button
                        onClick={() => {
                          setSuccess(null)
                          setGlobalError(null)
                          setShowForm(true)
                        }}
                        className="bg-action hover:brightness-110 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all text-sm flex items-center gap-2"
                      >
                        <Plus size={16} />
                        {t('experience.add_experience')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div
                          key={exp.id}
                          className={`bg-white dark:bg-slate-800 rounded-xl border-l-4 p-6 shadow-sm border flex justify-between items-start transition-all duration-300 hover:shadow-md ${!exp.is_active ? 'opacity-60 border-gray-400 dark:border-gray-600 grayscale-[0.5]' : 'border-[#003087] dark:border-cyan-400 border-gray-100 dark:border-gray-700'}`}
                        >
                          <div className="flex-grow min-w-0 pr-4">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#003087] dark:text-cyan-400">
                                {exp.end_date ? t('portfolio_view.previous') : t('portfolio_view.actual')}
                              </span>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                                {formatToLongDate(exp.start_date)} - {exp.end_date ? formatToLongDate(exp.end_date) : t('portfolio_view.present')}
                              </span>
                              {exp.employment_type && (
                                <>
                                  <span className="text-gray-300 dark:text-gray-600">•</span>
                                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase">
                                    {t(`experience.${exp.employment_type}`)}
                                  </span>
                                </>
                              )}
                            </div>
                            <h3 className="font-bold text-textMain dark:text-white text-base mb-1">
                              {exp.position}
                            </h3>
                            <p className="text-primary dark:text-blue-400 text-sm font-semibold mb-3">
                              {exp.company}
                              {exp.location && ` • ${exp.location}`}
                            </p>
                            {exp.description && (
                              <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-4 whitespace-pre-line">
                                {exp.description}
                              </p>
                            )}
                            {exp.verification_url && (
                              <a
                                href={exp.verification_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-primary dark:text-blue-400 hover:underline mb-3"
                              >
                                {t('portfolio_view.visit_project', 'Verificado')}
                              </a>
                            )}
                            {exp.skills && exp.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {exp.skills.map((s) => (
                                  <span
                                    key={s.id}
                                    className="bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded"
                                  >
                                    {s.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(exp)}
                              disabled={actionLoading || !exp.is_active}
                              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                                !exp.is_active
                                  ? 'bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-600 cursor-not-allowed'
                                  : 'bg-[#eff5ff] text-[#003087] dark:bg-blue-900/30 dark:text-cyan-400 transition-colors hover:brightness-95'
                              }`}
                              title={!exp.is_active ? t('experience.activate_to_edit', 'Activa la experiencia para poder editarla') : t('common.edit', 'Editar')}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleVisibilityClick(exp)}
                              disabled={actionLoading}
                              className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-colors ${!exp.is_active ? 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-slate-700' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-slate-700'}`}
                              title={exp.is_active ? t('experience.hide', 'Ocultar') : t('experience.show', 'Mostrar')}
                            >
                              {exp.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8 mb-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                  <h2 className="text-base font-bold text-textMain dark:text-gray-100 mb-6">
                    {t('experience.add_experience')}
                  </h2>

                  <div className="space-y-6 text-[#1a1a2e] dark:text-gray-200">
                    {/* Cargo / Puesto */}
                    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                      <label className="text-[13px] font-bold mt-2 dark:text-gray-300">
                        {t('experience.position_label')}: <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-col w-full">
                        <input
                          type="text"
                          placeholder={t('experience.position_placeholder')}
                          value={position}
                          onChange={(e) => {
                            const val = e.target.value
                            if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                              setPosition(val)
                              if (validationErrors.position)
                                setValidationErrors({ ...validationErrors, position: '' })
                            }
                          }}
                          disabled={actionLoading}
                          className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 ${validationErrors.position ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
                        />
                        {validationErrors.position && (
                          <span className="text-red-500 text-[11px] mt-1">
                            {validationErrors.position}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Empresa */}
                    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                      <label className="text-[13px] font-bold mt-2 dark:text-gray-300">
                        {t('experience.company_label')}: <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-col w-full">
                        <input
                          type="text"
                          placeholder={t('experience.company_placeholder')}
                          value={company}
                          onChange={(e) => {
                            const val = e.target.value
                            if (/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                              setCompany(val)
                              if (validationErrors.company)
                                setValidationErrors({ ...validationErrors, company: '' })
                            }
                          }}
                          disabled={actionLoading}
                          className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 ${validationErrors.company ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
                        />
                        {validationErrors.company && (
                          <span className="text-red-500 text-[11px] mt-1">
                            {validationErrors.company}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ubicación de la empresa */}
                    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                      <label className="text-[13px] font-bold mt-2 dark:text-gray-300">
                        {t('experience.location_label')}:
                      </label>
                      <div className="flex flex-col w-full">
                        <input
                          type="text"
                          placeholder={t('experience.location_placeholder')}
                          value={location}
                          onChange={(e) => {
                            const val = e.target.value
                            if (/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                              setLocation(val)
                              if (validationErrors.location)
                                setValidationErrors({ ...validationErrors, location: '' })
                            }
                          }}
                          disabled={actionLoading}
                          className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 ${validationErrors.location ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
                        />
                        {validationErrors.location && (
                          <span className="text-red-500 text-[11px] mt-1">
                            {validationErrors.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* URL */}
                    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                      <label className="text-[13px] font-bold mt-2 dark:text-gray-300">
                        {t('experience.url_label')}:
                      </label>
                      <div className="flex flex-col w-full">
                        <input
                          type="url"
                          placeholder="https://ejemplo.com"
                          value={verificationUrl}
                          onChange={(e) => {
                            setVerificationUrl(e.target.value)
                            if (validationErrors.verificationUrl)
                              setValidationErrors({ ...validationErrors, verificationUrl: '' })
                          }}
                          disabled={actionLoading}
                          className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 ${validationErrors.verificationUrl ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
                        />
                        {validationErrors.verificationUrl && (
                          <span className="text-red-500 text-[11px] mt-1">
                            {validationErrors.verificationUrl}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Fecha */}
                    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                      <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 mt-2">
                        {t('experience.date_label')}: <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-col w-full">
                        <div className="flex flex-col sm:flex-row items-start gap-3 w-full">
                          {/* Fecha Inicio */}
                          <div className="w-full sm:flex-1 min-w-0">
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => {
                                handleStartDateChange(e)
                                if (validationErrors.startDate)
                                  setValidationErrors({ ...validationErrors, startDate: '' })
                              }}
                              disabled={actionLoading}
                              className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm ${validationErrors.startDate ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
                            />
                            {validationErrors.startDate && (
                              <span className="text-red-500 text-[11px] mt-1 block text-center w-full">
                                {validationErrors.startDate}
                              </span>
                            )}
                          </div>

                          <span className="text-gray-400 hidden sm:block mt-3">-</span>

                          {/* Fecha Fin */}
                          <div className="w-full sm:flex-1 min-w-0">
                            <input
                              type="date"
                              value={endDate}
                              onChange={handleEndDateChange}
                              disabled={actionLoading}
                              className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm ${validationErrors.endDate ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
                            />
                            {validationErrors.endDate && (
                              <span className="text-red-500 text-[11px] mt-1 block text-center w-full">
                                {validationErrors.endDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modalidad de trabajo */}
                    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                      <label className="text-[13px] font-bold mt-2 dark:text-gray-300">
                        {t('experience.employment_type_label')}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-col w-full">
                        <div className="relative">
                          <select
                            value={employmentType}
                            onChange={(e) => {
                              setEmploymentType(e.target.value)
                              if (validationErrors.employmentType)
                                setValidationErrors({ ...validationErrors, employmentType: '' })
                            }}
                            disabled={actionLoading}
                            className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm appearance-none cursor-pointer ${validationErrors.employmentType ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
                          >
                            <option value="remote" className="dark:bg-slate-900">
                              {t('experience.remote')}
                            </option>
                            <option value="on_site" className="dark:bg-slate-900">
                              {t('experience.on_site')}
                            </option>
                            <option value="hybrid" className="dark:bg-slate-900">
                              {t('experience.hybrid')}
                            </option>
                            <option value="freelance" className="dark:bg-slate-900">
                              {t('experience.freelance')}
                            </option>
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                        {validationErrors.employmentType && (
                          <span className="text-red-500 text-[11px] mt-1">
                            {validationErrors.employmentType}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Descripcion */}
                    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                      <label className="text-[13px] font-bold mt-2 dark:text-gray-300">
                        {t('experience.description_label')}: <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-col w-full">
                        <input
                          type="text"
                          placeholder={t('experience.description_placeholder')}
                          value={description}
                          onChange={(e) => {
                            const val = e.target.value
                            if (/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:-]*$/.test(val)) {
                              setDescription(val)
                              if (validationErrors.description)
                                setValidationErrors({ ...validationErrors, description: '' })
                            }
                          }}
                          disabled={actionLoading}
                          className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 ${validationErrors.description ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'}`}
                        />
                        {validationErrors.description && (
                          <span className="text-red-500 text-[11px] mt-1">
                            {validationErrors.description}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tecnologías Usadas */}
                    <div
                      className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4"
                      ref={dropdownRef}
                    >
                      <label className="text-[13px] font-bold pt-2.5 dark:text-gray-300">
                        {t('experience.skills_label')}: <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-col w-full">
                        <div className="relative">
                          <div
                            className={`min-h-[42px] w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded transition-all cursor-pointer flex items-center justify-between gap-2 ${validationErrors.skills
                              ? 'border-red-500 ring-1 ring-red-500/20'
                              : isTechDropdownOpen
                                ? 'border-action ring-1 ring-action/10'
                                : 'border-gray-200 dark:border-gray-700'
                              }`}
                            onClick={() => setIsTechDropdownOpen(!isTechDropdownOpen)}
                          >
                            <div className="flex flex-wrap gap-1.5 flex-1">
                              {selectedSkills.length === 0 ? (
                                <span className="text-gray-300 dark:text-gray-600 select-none">
                                  {t('experience.skills_placeholder')}
                                </span>
                              ) : (
                                selectedSkills.map((skill) => (
                                  <span
                                    key={skill.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-[11px] font-semibold"
                                  >
                                    {skill.name}
                                    <span
                                      className="hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full p-0.5 transition-colors cursor-pointer"
                                      onClick={(e) => removeSkill(e, skill.id)}
                                    >
                                      <X size={12} />
                                    </span>
                                  </span>
                                ))
                              )}
                            </div>
                            <ChevronDown
                              size={16}
                              className={`text-gray-400 transition-transform ${isTechDropdownOpen ? 'rotate-180' : ''}`}
                            />
                          </div>

                          {isTechDropdownOpen && (
                            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto py-1 animate-fadeIn">
                              {availableSkills.map((skill) => {
                                const isSelected = selectedSkills.some((s) => s.id === skill.id)
                                return (
                                  <div
                                    key={skill.id}
                                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors"
                                    onClick={() => {
                                      toggleSkill(skill)
                                      if (validationErrors.skills)
                                        setValidationErrors({ ...validationErrors, skills: '' })
                                    }}
                                  >
                                    <span
                                      className={
                                        isSelected
                                          ? 'font-bold text-primary dark:text-blue-400'
                                          : 'text-[#1a1a2e] dark:text-gray-300'
                                      }
                                    >
                                      {skill.name}
                                    </span>
                                    {isSelected && (
                                      <Check size={16} className="text-primary dark:text-blue-400" />
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                        {validationErrors.skills && (
                          <span className="text-red-500 text-[11px] mt-1">
                            {validationErrors.skills}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-8 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingExperienceId(null)
                        setPosition('')
                        setCompany('')
                        setVerificationUrl('')
                        setStartDate('')
                        setEndDate('')
                        setEmploymentType('remote')
                        setLocation('')
                        setDescription('')
                        setSelectedSkills([])
                        setValidationErrors({})
                      }}
                      disabled={actionLoading}
                      className="px-6 py-2 rounded border border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm bg-white dark:bg-transparent"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPosition('')
                        setCompany('')
                        setVerificationUrl('')
                        setStartDate('')
                        setEndDate('')
                        setLocation('')
                        setDescription('')
                        setSelectedSkills([])
                        setValidationErrors({})
                      }}
                      disabled={actionLoading}
                      className="px-6 py-2 rounded border border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm bg-white dark:bg-transparent"
                    >
                      {t('experience.clear')}
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
                        t('experience.save')
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

        {/* Confirm Save Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowConfirmModal(false)}
            />
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-[340px] mx-4 flex flex-col items-center gap-4 text-center border border-gray-100 dark:border-gray-800 transition-colors">
              <h3 className="text-[16px] font-bold text-[#1a1a2e] dark:text-white mb-1">
                {t('experience.confirm_title')}
              </h3>
              <p className="text-[13px] text-[#5b6472] dark:text-gray-400 leading-relaxed">
                {t('experience.confirm_desc')}
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
                  className="flex-1 h-10 px-4 text-[13px] font-bold text-white bg-[#00388c] rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:bg-[#00388c]/60"
                >
                  {actionLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    t('experience.confirm_btn')
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visibility Toggle Modal */}
        {showVisibilityModal && experienceToToggle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowVisibilityModal(false)}
            />
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-[440px] mx-4 flex flex-col gap-5 border border-gray-100 dark:border-gray-800 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${experienceToToggle.is_active ? 'bg-red-50 dark:bg-red-900/30 text-red-500' : 'bg-green-50 dark:bg-green-900/30 text-green-600'}`}>
                  {experienceToToggle.is_active ? <EyeOff size={24} /> : <Eye size={24} />}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-[17px] font-bold text-[#1a1a2e] dark:text-white mb-1">
                    {experienceToToggle.is_active ? 'Deshabilitar experiencia' : 'Habilitar experiencia'}
                  </h3>
                  <p className="text-[14px] text-gray-500 dark:text-gray-400">
                    {experienceToToggle.is_active ? 'Puedes re-habilitarla en cualquier momento' : 'Puedes deshabilitarla en cualquier momento'}
                  </p>
                </div>
              </div>

              <div className="text-[15px] text-[#1a1a2e] dark:text-gray-200 mt-2">
                ¿Deseas {experienceToToggle.is_active ? 'deshabilitar' : 'habilitar'} "{experienceToToggle.position}" de tu perfil?
              </div>

              <div className="bg-[#f5f8ff] dark:bg-blue-900/20 border border-[#e0eaff] dark:border-blue-900/30 rounded-xl p-4 flex gap-3 text-[13px] text-[#003087] dark:text-blue-300 leading-relaxed">
                <div className="shrink-0 mt-0.5">
                  <AlertCircle size={16} />
                </div>
                <p>
                  {experienceToToggle.is_active 
                    ? 'La experiencia no se eliminará. Quedará oculta en tu portafolio público y podrás re-habilitarla cuando quieras desde esta misma pantalla.'
                    : 'La experiencia volverá a ser visible en tu portafolio público de inmediato.'}
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
                  className={`h-10 px-5 text-[14px] font-medium text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${experienceToToggle.is_active ? 'bg-[#c8102e] hover:bg-red-700' : 'bg-[#003087] hover:bg-blue-800'}`}
                >
                  {actionLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    experienceToToggle.is_active ? 'Sí, deshabilitar' : 'Sí, habilitar'
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

export default Experience
