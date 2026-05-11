import { useState, useEffect, useRef } from 'react'
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
  Clock
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

  const formatMonthYear = (val: string) => {
    let curr = val.replace(/\D/g, '')
    if (curr.length > 6) curr = curr.slice(0, 6)
    if (curr.length >= 3) {
      return curr.slice(0, 2) + '/' + curr.slice(2)
    }
    return curr
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(formatMonthYear(e.target.value))
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(formatMonthYear(e.target.value))
  }

  const handleSave = async () => {
    setGlobalError(null)
    setSuccess(null)
    const errors: { [key: string]: string } = {}

    if (!position.trim()) errors.position = 'Este campo es obligatorio'
    if (!company.trim()) errors.company = 'Este campo es obligatorio'
    if (!startDate) errors.startDate = 'Este campo es obligatorio'
    if (!employmentType) errors.employmentType = 'Este campo es obligatorio'
    if (!location.trim()) errors.location = 'Este campo es obligatorio'
    if (!description.trim()) errors.description = 'Este campo es obligatorio'
    if (selectedSkills.length === 0) errors.skills = 'Debe seleccionar al menos una tecnología'

    if (verificationUrl && !/^https?:\/\/.+/.test(verificationUrl)) {
      errors.verificationUrl = 'URL inválida (debe iniciar con http:// o https://)'
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

    // Convert MM/YYYY to YYYY-MM
    const formatToBackend = (val: string) => {
      if (!val || val.length < 7) return null
      const [m, y] = val.split('/')
      return `${y}-${m}`
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

      setSuccess('Experiencia laboral guardada exitosamente.')
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
        setGlobalError(error.message || 'Ocurrió un error al guardar.')
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
        <h3 className="font-bold text-textMain text-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
          <ShieldAlert size={16} className="text-action" />
          NOTIFICACIONES
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-[11px] text-gray-600 leading-tight bg-gray-50 p-3 rounded-lg border border-gray-100">
            <Clock size={14} className="text-action mt-0.5 shrink-0" />
            <span>Mantén tu experiencia actualizada para destacar ante reclutadores.</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-textMain text-sm mb-4 uppercase tracking-wider">
          Enlaces rápidos
        </h3>
        <div className="space-y-3 text-xs text-primary">
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>📋 Guía de Usuario</span>
            <ExternalLink
              size={12}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </p>
          <p className="cursor-pointer hover:underline flex items-center justify-between group">
            <span>⚙️ Soporte Técnico</span>
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
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Experiencia" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#cbd5e1]">
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto pt-2">
              <header className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-textMain">Experiencia</h1>
              </header>

              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
                <h2 className="text-base font-bold text-textMain mb-6">Añadir Experiencia</h2>

                {globalError && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3 animate-slideIn">
                    <AlertCircle size={18} />
                    {globalError}
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm flex items-center gap-3 animate-slideIn">
                    <CheckCircle2 size={18} />
                    {success}
                  </div>
                )}

                <div className="space-y-6 text-[#1a1a2e]">
                  {/* Cargo / Puesto */}
                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold mt-2">
                      Cargo / Puesto: <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col w-full">
                      <input
                        type="text"
                        placeholder="Ej. Desarrollador Frontend"
                        value={position}
                        onChange={(e) => {
                          setPosition(e.target.value)
                          if (validationErrors.position)
                            setValidationErrors({ ...validationErrors, position: '' })
                        }}
                        disabled={actionLoading}
                        className={`w-full p-2.5 rounded border bg-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300 ${validationErrors.position ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200'}`}
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
                    <label className="text-[13px] font-bold mt-2">
                      Empresa/nombre: <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col w-full">
                      <input
                        type="text"
                        placeholder="Ej. Comteco"
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
                        className={`w-full p-2.5 rounded border bg-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300 ${validationErrors.company ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200'}`}
                      />
                      {validationErrors.company && (
                        <span className="text-red-500 text-[11px] mt-1">
                          {validationErrors.company}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* URL */}
                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold mt-2">URL:</label>
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
                        className={`w-full p-2.5 rounded border bg-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300 ${validationErrors.verificationUrl ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200'}`}
                      />
                      {validationErrors.verificationUrl && (
                        <span className="text-red-500 text-[11px] mt-1">
                          {validationErrors.verificationUrl}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fecha (1) */}
                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold text-gray-700 mt-2">
                      Fecha: <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                        <input
                          type="text"
                          placeholder="Desde (MM/YYYY)"
                          value={startDate}
                          onChange={(e) => {
                            handleStartDateChange(e)
                            if (validationErrors.startDate)
                              setValidationErrors({ ...validationErrors, startDate: '' })
                          }}
                          disabled={actionLoading}
                          className={`w-full sm:flex-1 min-w-0 p-2.5 rounded border bg-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300 ${validationErrors.startDate ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200'}`}
                        />
                        <span className="text-gray-400 hidden sm:block">-</span>
                        <input
                          type="text"
                          placeholder="Hasta (MM/YYYY)"
                          value={endDate}
                          onChange={handleEndDateChange}
                          disabled={actionLoading}
                          className="w-full sm:flex-1 min-w-0 p-2.5 rounded border border-gray-200 bg-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300"
                        />
                      </div>
                      {validationErrors.startDate && (
                        <span className="text-red-500 text-[11px] mt-1">
                          {validationErrors.startDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Modalidad de trabajo */}
                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold mt-2">
                      Modalidad de trabajo <span className="text-red-500">*</span>
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
                          className={`w-full p-2.5 rounded border bg-white outline-none focus:border-action transition-all text-sm appearance-none cursor-pointer ${validationErrors.employmentType ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200'}`}
                        >
                          <option value="remote">Remoto</option>
                          <option value="on_site">Presencial</option>
                          <option value="hybrid">Híbrido</option>
                          <option value="freelance">Freelance</option>
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

                  {/* Ubicacion */}
                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold mt-2">
                      Ubicacion <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col w-full">
                      <input
                        type="text"
                        placeholder="Av. Villazon"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value)
                          if (validationErrors.location)
                            setValidationErrors({ ...validationErrors, location: '' })
                        }}
                        disabled={actionLoading}
                        className={`w-full p-2.5 rounded border bg-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300 ${validationErrors.location ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200'}`}
                      />
                      {validationErrors.location && (
                        <span className="text-red-500 text-[11px] mt-1">
                          {validationErrors.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Descripcion */}
                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start gap-4">
                    <label className="text-[13px] font-bold mt-2">
                      Descripcion: <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col w-full">
                      <input
                        type="text"
                        placeholder="Funciones de trabajo"
                        value={description}
                        onChange={(e) => {
                          const val = e.target.value
                          if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                            setDescription(val)
                            if (validationErrors.description)
                              setValidationErrors({ ...validationErrors, description: '' })
                          }
                        }}
                        disabled={actionLoading}
                        className={`w-full p-2.5 rounded border bg-white outline-none focus:border-action transition-all text-sm placeholder:text-gray-300 ${validationErrors.description ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200'}`}
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
                    <label className="text-[13px] font-bold pt-2.5">
                      Tecnologías Usadas: <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col w-full">
                      <div className="relative">
                        <div
                          className={`min-h-[42px] w-full px-3 py-2 text-sm bg-white border rounded transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            validationErrors.skills
                              ? 'border-red-500 ring-1 ring-red-500/20'
                              : isTechDropdownOpen
                                ? 'border-action ring-1 ring-action/10'
                                : 'border-gray-200'
                          }`}
                          onClick={() => setIsTechDropdownOpen(!isTechDropdownOpen)}
                        >
                          <div className="flex flex-wrap gap-1.5 flex-1">
                            {selectedSkills.length === 0 ? (
                              <span className="text-gray-300 select-none">React, Laravel</span>
                            ) : (
                              selectedSkills.map((skill) => (
                                <span
                                  key={skill.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-primary text-[11px] font-semibold"
                                >
                                  {skill.name}
                                  <span
                                    className="hover:bg-blue-100 rounded-full p-0.5 transition-colors cursor-pointer"
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
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto py-1 animate-fadeIn">
                            {availableSkills.map((skill) => {
                              const isSelected = selectedSkills.some((s) => s.id === skill.id)
                              return (
                                <div
                                  key={skill.id}
                                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center justify-between transition-colors"
                                  onClick={() => {
                                    toggleSkill(skill)
                                    if (validationErrors.skills)
                                      setValidationErrors({ ...validationErrors, skills: '' })
                                  }}
                                >
                                  <span
                                    className={
                                      isSelected ? 'font-bold text-primary' : 'text-[#1a1a2e]'
                                    }
                                  >
                                    {skill.name}
                                  </span>
                                  {isSelected && <Check size={16} className="text-primary" />}
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
                    className="px-6 py-2 rounded border border-gray-200 font-medium text-sm text-gray-700 hover:bg-gray-50 transition-all shadow-sm bg-white"
                  >
                    Limpiar
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={actionLoading}
                    className="px-6 py-2 rounded font-medium text-sm text-white bg-[#dc2626] hover:bg-red-700 shadow-sm transition-all flex items-center gap-2 min-w-[150px] justify-center"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-72 p-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 shrink-0 overflow-y-auto">
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
            <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-[340px] mx-4 flex flex-col items-center gap-4 text-center">
              <h3 className="text-[16px] font-bold text-[#1a1a2e] mb-1">Confirmar Acción</h3>
              <p className="text-[13px] text-[#5b6472] leading-relaxed">
                ¿Desea guardar la experiencia?
              </p>
              <div className="flex justify-center gap-3 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={actionLoading}
                  className="flex-1 h-10 px-4 text-[13px] font-bold text-[#1a1a2e] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmSave}
                  disabled={actionLoading}
                  className="flex-1 h-10 px-4 text-[13px] font-bold text-white bg-[#00388c] rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:bg-[#00388c]/60"
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

export default Experience
