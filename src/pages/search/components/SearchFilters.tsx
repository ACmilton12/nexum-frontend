import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search as SearchIcon, X, Filter } from 'lucide-react'

interface SearchFiltersProps {
  initialQuery: string
  initialArea: string
  initialSkills: string[]
  onSearch: (filters: { q: string; area: string; skills: string[] }) => void
}

export default function SearchFilters({
  initialQuery,
  initialArea,
  initialSkills,
  onSearch
}: SearchFiltersProps) {
  const { t } = useTranslation()
  const [q, setQ] = useState(initialQuery)
  const [area, setArea] = useState(initialArea)
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>(initialSkills)

  // Sincronizar el estado local cuando los props iniciales cambian desde afuera (ej. al limpiar en Hero)
  useEffect(() => {
    setQ(initialQuery)
    setArea(initialArea)
    setSkills(initialSkills)
  }, [initialQuery, initialArea, initialSkills])

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      if (!skills.includes(skillInput.trim())) {
        const newSkills = [...skills, skillInput.trim()]
        setSkills(newSkills)
        onSearch({ q, area, skills: newSkills })
      }
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((s) => s !== skillToRemove)
    setSkills(newSkills)
    onSearch({ q, area, skills: newSkills })
  }

  const handleApply = () => {
    onSearch({ q, area, skills })
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-8 sticky top-24">
      <div className="flex items-center gap-2 mb-2">
        <Filter size={20} className="text-[#C8102E]" />
        <h3 className="font-bold text-gray-900">{t('search.advanced_filters')}</h3>
      </div>

      <div className="space-y-6">
        {/* Búsqueda por Nombre */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            {t('search.search_by_name')}
          </label>
          <div className="relative">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder={t('search.name_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-[#C8102E] transition-all"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            />
          </div>
        </div>

        {/* Área / Profesión */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            {t('search.area_specialty')}
          </label>
          <input
            type="text"
            placeholder={t('search.area_placeholder_detailed')}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-[#C8102E] transition-all"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          />
        </div>

        {/* Habilidades */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            {t('search.technical_skills')}
          </label>
          <input
            type="text"
            placeholder={t('search.skills_placeholder_detailed')}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-[#C8102E] transition-all"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
          />

          <div className="flex flex-wrap gap-2 mt-4">
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 bg-[#C8102E]/5 text-[#C8102E] px-3 py-1 rounded-lg text-[10px] font-bold border border-[#C8102E]/10 group"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:bg-[#C8102E] hover:text-white rounded-md p-0.5 transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleApply}
        className="w-full py-3 bg-[#C8102E] text-white rounded-xl font-bold shadow-lg shadow-red-600/20 hover:bg-[#a50d25] transition-all mt-4"
      >
        {t('search.apply_filters')}
      </button>

      <button
        onClick={() => {
          setQ('')
          setArea('')
          setSkills([])
          onSearch({ q: '', area: '', skills: [] })
        }}
        className="w-full py-2 text-gray-400 text-xs font-bold hover:text-gray-600 transition-colors"
      >
        {t('search.clear_all')}
      </button>
    </div>
  )
}
