import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, ChevronDown, Check, Loader2, Send } from 'lucide-react'
import {
  getCategories,
  getSkillsCatalog,
  type ProjectCategory,
  type Skill,
  type Project
} from '../../../services/project.service'

interface Step1FormProps {
  projectToEdit?: Project | null
  onSubmit: (data: {
    title: string
    description: string
    projectUrl: string
    categoryId: number | ''
    selectedSkills: Skill[]
  }) => Promise<void>
  onCancel: () => void
  onDelete?: (id: number) => void
  isSaving: boolean
  onSuggestCategory?: (name: string, justification: string) => void
}

const Step1Form = ({
  projectToEdit,
  onSubmit,
  onCancel,
  onDelete,
  isSaving,
  onSuggestCategory
}: Step1FormProps) => {
  const { t } = useTranslation()
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState<number | string>('')
  const [description, setDescription] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [projectUrlError, setProjectUrlError] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // States for Suggest Category Modal
  const [showSuggestModal, setShowSuggestModal] = useState(false)
  const [suggestedCategoryName, setSuggestedCategoryName] = useState('')
  const [suggestedCategoryError, setSuggestedCategoryError] = useState('')
  const [suggestedCategoryJustification, setSuggestedCategoryJustification] = useState('')
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
    getSkillsCatalog().then(setAvailableSkills).catch(console.error)

    if (projectToEdit) {
      setTitle(projectToEdit.title)
      setCategoryId(projectToEdit.category?.id || '')
      setDescription(projectToEdit.description || '')
      setProjectUrl(projectToEdit.project_url || '')
      setSelectedSkills((projectToEdit.skills as unknown as Skill[]) || [])
    } else {
      setTitle('')
      setCategoryId('')
      setDescription('')
      setProjectUrl('')
      setSelectedSkills([])
    }
  }, [projectToEdit])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
        setIsTechDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const isValidGithubUrl = (url: string) => {
    if (!url.trim()) return true
    return /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+(\/.+)?$/.test(url.trim())
  }

  const handleProjectUrlBlur = () => {
    if (projectUrl && !isValidGithubUrl(projectUrl)) {
      setProjectUrlError(t('projects.modal.error_url_invalid'))
    } else {
      setProjectUrlError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert(t('projects.modal.error_title_req'))
      return
    }
    if (categoryId === 'otros') {
      alert(t('projects.modal.error_cat_invalid'))
      return
    }
    await onSubmit({
      title,
      description,
      projectUrl,
      categoryId: categoryId as number | '',
      selectedSkills
    })
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (val === 'otros') {
      setCategoryId('otros')
      setShowSuggestModal(true)
    } else {
      setCategoryId(val === '' ? '' : Number(val))
    }
  }

  const submitCategorySuggestion = async () => {
    if (!suggestedCategoryName.trim()) {
      setSuggestedCategoryError(t('projects.modal.suggest_error_name_req'))
      return
    }

    const exists = categories.some(
      (cat) => cat.name.toLowerCase() === suggestedCategoryName.trim().toLowerCase()
    )

    if (exists) {
      setSuggestedCategoryError(t('projects.modal.suggest_error_exists'))
      return
    }

    if (!suggestedCategoryJustification.trim()) {
      alert(t('projects.modal.suggest_error_just_req'))
      return
    }

    setIsSubmittingSuggestion(true)
    try {
      if (onSuggestCategory) {
        onSuggestCategory(suggestedCategoryName, suggestedCategoryJustification)
      }

      setSuccessMessage(
        t('projects.modal.suggest_success', { name: suggestedCategoryName })
      )
      setShowSuggestModal(false)
      setCategoryId('') // Reset category so they can save the project
      setSuggestedCategoryName('')
      setSuggestedCategoryError('')
      setSuggestedCategoryJustification('')

      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch {
      alert(t('projects.modal.suggest_error_api'))
    } finally {
      setIsSubmittingSuggestion(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-[520px]">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
        <p className="text-[14px] text-[#5b6472] dark:text-gray-400 leading-relaxed">
          {t('projects.modal.step1_subtitle')}
        </p>
        <span className="bg-[#eef3f8] dark:bg-slate-800 text-[#003087] dark:text-blue-400 px-3 py-1.5 rounded-md text-[13px] font-bold flex-shrink-0 self-start sm:self-auto transition-colors">
          {projectToEdit ? t('projects.modal.edit_badge') : t('projects.modal.create_badge')}
        </span>
      </div>

      {successMessage && (
        <div className="bg-[#E6F4EA] dark:bg-emerald-900/20 text-[#2E7D32] dark:text-emerald-400 p-3 rounded-md text-[13px] animate-fadeIn border border-[#C8E6C9] dark:border-emerald-800/30 shadow-sm">
          {successMessage}
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#1a1a2e] dark:text-gray-300 transition-colors">
              {t('projects.modal.title_label')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full h-10 px-3 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0030871a] focus:border-[#003087] transition-all text-[#1a1a2e] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder={t('projects.modal.title_placeholder')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#1a1a2e] dark:text-gray-300 transition-colors">
              {t('projects.modal.category_label')}
            </label>
            <select
              value={categoryId}
              onChange={handleCategoryChange}
              className="w-full h-10 px-3 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0030871a] focus:border-[#003087] transition-all cursor-pointer text-[#1a1a2e] dark:text-white"
            >
              <option value="" disabled className="dark:bg-slate-800">
                {t('projects.modal.category_select')}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="dark:bg-slate-800">
                  {c.name}
                </option>
              ))}
              <option value="otros" className="dark:bg-slate-800">
                {t('projects.modal.category_others')}
              </option>
            </select>
            <p className="text-[11px] text-[#5b6472] dark:text-gray-500 mt-0.5 leading-relaxed transition-colors">
              {t('projects.modal.category_desc')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 -mt-2">
          <label className="text-[13px] font-bold text-[#1a1a2e] dark:text-gray-300 transition-colors">
            {t('projects.modal.description_label')}
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0030871a] focus:border-[#003087] transition-all resize-none text-[#1a1a2e] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
            placeholder={t('projects.modal.description_placeholder')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-[#1a1a2e] dark:text-gray-300 transition-colors">
            {t('projects.modal.url_label')}
          </label>
          <input
            type="text"
            value={projectUrl}
            onChange={(e) => {
              setProjectUrl(e.target.value)
              if (projectUrlError) setProjectUrlError('')
            }}
            onBlur={handleProjectUrlBlur}
            className={`w-full h-10 px-3 text-sm bg-white dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0030871a] transition-all text-[#1a1a2e] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
              projectUrlError
                ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 dark:border-gray-700 focus:border-[#003087]'
            }`}
            placeholder={t('projects.modal.url_placeholder')}
          />
          {projectUrlError && (
            <p className="text-[11px] text-red-500 mt-0.5 leading-relaxed flex items-center gap-1">
              <span>{projectUrlError}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 mt-1" ref={dropdownRef}>
          <label className="text-[13px] font-bold text-[#1a1a2e] dark:text-gray-300 transition-colors">
            {t('projects.modal.skills_label')}
          </label>
          <div className="relative">
            <div
              className={`min-h-10 w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-lg transition-all cursor-pointer flex items-center justify-between gap-2 ${
                isTechDropdownOpen
                  ? 'ring-2 ring-[#0030871a] border-[#003087]'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setIsTechDropdownOpen(!isTechDropdownOpen)}
            >
              <div className="flex flex-wrap gap-1.5 flex-1">
                {selectedSkills.length === 0 ? (
                  <span className="text-[#5b6472] dark:text-gray-600 select-none">
                    {t('projects.modal.skills_placeholder')}
                  </span>
                ) : (
                  selectedSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0030871a] dark:bg-blue-900/30 text-[#003087] dark:text-blue-300 text-[11px] font-semibold transition-colors"
                    >
                      {skill.name}
                      <span
                        className="hover:bg-[#00308733] rounded-full p-0.5 transition-colors cursor-pointer"
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
                className={`text-[#5b6472] dark:text-gray-500 transition-transform flex-shrink-0 ${isTechDropdownOpen ? 'rotate-180' : ''}`}
              />
            </div>
            {isTechDropdownOpen && (
              <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto py-1">
                {availableSkills.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-400 dark:text-gray-600">
                    {t('projects.modal.loading_skills')}
                  </div>
                )}
                {availableSkills.map((skill) => {
                  const isSelected = selectedSkills.some((s) => s.id === skill.id)
                  return (
                    <div
                      key={skill.id}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-between transition-colors"
                      onClick={() => toggleSkill(skill)}
                    >
                      <span
                        className={
                          isSelected
                            ? 'font-bold text-[#003087] dark:text-blue-400'
                            : 'text-[#1a1a2e] dark:text-gray-300'
                        }
                      >
                        {skill.name}{' '}
                        <span className="text-[11px] text-gray-400 dark:text-gray-600 ml-1 font-normal">
                          ({skill.category})
                        </span>
                      </span>
                      {isSelected && (
                        <Check size={16} className="text-[#003087] dark:text-blue-400" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-between sm:items-center gap-3 pt-6 mt-2 border-t border-gray-100 dark:border-gray-800 transition-colors">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto h-10 px-5 text-[14px] font-bold text-[#1a1a2e] dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            {t('projects.modal.cancel_btn')}
          </button>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {projectToEdit && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(projectToEdit.id)
                  onCancel()
                }}
                className="w-full sm:w-auto h-10 px-6 text-[14px] font-bold text-white bg-[#c8102e] rounded-lg hover:brightness-110 transition-all shadow-sm"
              >
                {t('projects.modal.delete_btn')}
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving || categoryId === 'otros'}
              className={`w-full sm:w-auto h-10 px-6 text-[14px] font-bold text-white rounded-lg transition-all flex items-center justify-center gap-2 shadow-md ${
                isSaving || categoryId === 'otros'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#003087] hover:brightness-110'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> {t('projects.modal.saving_lbl')}
                </>
              ) : (
                <>
                  {t('projects.modal.next_btn')} <ChevronDown size={14} className="-rotate-90" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Modal for suggesting category */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowSuggestModal(false)
              setCategoryId('')
              setSuggestedCategoryError('')
            }}
          />
          <div
            className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-[400px] mx-4 flex flex-col gap-4 border border-gray-100 dark:border-gray-800 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowSuggestModal(false)
                setCategoryId('')
                setSuggestedCategoryError('')
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#C8102E] dark:hover:text-red-400 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center transition-colors">
                <Send size={18} className="text-[#003087] dark:text-blue-400" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1a1a2e] dark:text-white transition-colors">
                {t('projects.modal.suggest_title')}
              </h3>
            </div>

            <p className="text-[13px] text-[#5b6472] dark:text-gray-400 leading-relaxed mb-1 transition-colors">
              {t('projects.modal.suggest_desc')}
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#1a1a2e] dark:text-gray-300 transition-colors">
                  {t('projects.modal.suggest_name_label')}
                </label>
                <input
                  type="text"
                  value={suggestedCategoryName}
                  onChange={(e) => {
                    setSuggestedCategoryName(e.target.value)
                    setSuggestedCategoryError('')
                  }}
                  className={`w-full h-10 px-3 text-sm bg-white dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0030871a] focus:border-[#003087] transition-all text-[#1a1a2e] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
                    suggestedCategoryError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  placeholder={t('projects.modal.suggest_name_placeholder')}
                  autoFocus
                />
                {suggestedCategoryError && (
                  <span className="text-red-500 text-[11px] mt-1">{suggestedCategoryError}</span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#1a1a2e] dark:text-gray-300 transition-colors">
                  {t('projects.modal.suggest_just_label')}
                </label>
                <textarea
                  rows={3}
                  value={suggestedCategoryJustification}
                  onChange={(e) => setSuggestedCategoryJustification(e.target.value)}
                  className="w-full p-3 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0030871a] focus:border-[#003087] transition-all resize-none text-[#1a1a2e] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder={t('projects.modal.suggest_just_placeholder')}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuggestModal(false)
                  setCategoryId('')
                  setSuggestedCategoryError('')
                }}
                className="h-10 px-4 text-[13px] font-bold text-[#1a1a2e] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {t('projects.modal.cancel_btn')}
              </button>
              <button
                type="button"
                onClick={submitCategorySuggestion}
                disabled={isSubmittingSuggestion}
                className={`h-10 px-5 text-[13px] font-bold text-white rounded-lg transition-all flex items-center gap-2 shadow-md ${
                  isSubmittingSuggestion
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#003087] hover:brightness-110'
                }`}
              >
                {isSubmittingSuggestion ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> {t('projects.modal.suggest_sending')}
                  </>
                ) : (
                  t('projects.modal.suggest_send_btn')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step1Form
