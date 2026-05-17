import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from '../../admin/components/Sidebar'
import Calendar from '../../../components/ui/Calendar'
import {
  ShieldAlert,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  X,
  Check,
  Clock,
  Calendar as CalendarIcon
} from 'lucide-react'
import { createExperience } from '../../../services/experience.service'
import { getSkillsCatalog, type Skill } from '../../../services/project.service'

function Experience() {
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

  useEffect(() => {
    getSkillsCatalog().then(setAvailableSkills).catch(console.error)
  }, [])

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

    if (!position.trim()) errors.position = t('experience.error_required')
    if (!company.trim()) errors.company = t('experience.error_required')
    if (!startDate) {
      errors.startDate = t('experience.error_required')
    } else {
      const currentMonth = new Date().toISOString().slice(0, 7)
      if (startDate > currentMonth) {
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

      await createExperience(payload)

      setSuccess(t('experience.toast_success'))
      // Reset form
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

  const RightPanelContent = () => (
    <div className="sticky top-6">
      <Calendar />

      <div className="mt-8">
        <h3 className="font-bold text-textMain dark:text-gray-100 text-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
          <ShieldAlert size={16} className="text-action" />
          {t('dashboard.notifications')}
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-400 leading-tight bg-gray-50 dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors">
            <Clock size={14} className="text-action mt-0.5 shrink-0" />
            <span>{t('experience.notification_tip')}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-textMain dark:text-gray-100 text-sm mb-4 uppercase tracking-wider">
          {t('dashboard.quick_links')}
        </h3>
        <div className="space-y-3 text-xs text-primary dark:text-blue-400 transition-colors">
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>📋 {t('dashboard.user_guide')}</span>
            <ExternalLink
              size={12}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </p>
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>⚙️ {t('sidebar.support')}</span>
            <ExternalLink
              size={12}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Experiencia" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#cbd5e1] dark:bg-slate-900 transition-colors duration-300">
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto pt-2">
              <header className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-textMain dark:text-white">
                  {t('experience.title')}
                </h1>
              </header>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8 mb-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-base font-bold text-textMain dark:text-gray-100 mb-6">
                  {t('experience.add_experience')}
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
                        <div className="relative w-full sm:flex-1 min-w-0 group">
                          <input
                            type="month"
                            value={startDate}
                            onChange={(e) => {
                              handleStartDateChange(e)
                              if (validationErrors.startDate)
                                setValidationErrors({ ...validationErrors, startDate: '' })
                            }}
                            disabled={actionLoading}
                            className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 ${actionLoading ? 'pointer-events-none' : ''}`}
                          />
                          <div
                            className={`w-full p-2.5 rounded border bg-white dark:bg-slate-900 flex items-center justify-between text-sm transition-all ${validationErrors.startDate ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700 group-hover:border-action'}`}
                          >
                            <span
                              className={
                                startDate
                                  ? 'text-textMain dark:text-white'
                                  : 'text-gray-400 dark:text-gray-600'
                              }
                            >
                              {startDate
                                ? formatToLongDate(startDate)
                                : t('experience.date_placeholder')}
                            </span>
                            <CalendarIcon size={14} className="text-gray-400" />
                          </div>
                          {validationErrors.startDate && (
                            <span className="text-red-500 text-[11px] mt-1 block text-center w-full">
                              {validationErrors.startDate}
                            </span>
                          )}
                        </div>

                        <span className="text-gray-400 hidden sm:block mt-3">-</span>

                        {/* Fecha Fin */}
                        <div className="relative w-full sm:flex-1 min-w-0 group">
                          <input
                            type="month"
                            value={endDate}
                            onChange={handleEndDateChange}
                            disabled={actionLoading}
                            className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 ${actionLoading ? 'pointer-events-none' : ''}`}
                          />
                          <div className="w-full p-2.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 flex items-center justify-between text-sm transition-all group-hover:border-action">
                            <span
                              className={
                                endDate
                                  ? 'text-textMain dark:text-white'
                                  : 'text-gray-400 dark:text-gray-600'
                              }
                            >
                              {endDate
                                ? formatToLongDate(endDate)
                                : t('experience.date_placeholder')}
                            </span>
                            <CalendarIcon size={14} className="text-gray-400" />
                          </div>
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
            </div>
          </div>

          <aside className="w-full lg:w-72 p-6 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 shrink-0 overflow-y-auto transition-colors duration-300">
            <RightPanelContent />
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
      </div>
    </div>
  )
}

export default Experience
