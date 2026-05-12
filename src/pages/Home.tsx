import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useAuth from '../hooks/useAuth'
import { useFeaturedProfiles } from './home/hooks/useFeaturedProfiles'
import { ChevronLeft, ChevronRight, Filter, Search as SearchIcon, X, Loader2 } from 'lucide-react'
import {
  searchProfessionals,
  type SearchResult,
  type PaginationMeta
} from '../services/search.service'
import PortfolioCard from './search/components/PortfolioCard'

import Navbar from './home/components/Navbar'
import Hero from './home/components/Hero'
import UniversityStrip from './home/components/UniversityStrip'
import Features from './home/components/Features'
import CTA from './home/components/CTA'
import RecentPortfolios from './home/components/RecentPortfolios'
import Footer from './home/components/Footer'

// Removed PublicProfileCard as we use PortfolioCard

// ── Search Results Section ───────────────────────────────────────────────
interface SearchResultsProps {
  results: SearchResult[]
  meta: PaginationMeta | null
  loading: boolean
  onPageChange: (page: number) => void
  onFilterChange: (filters: { area: string; skills: string[] }) => void
}

function SearchResults({
  results,
  meta,
  loading,
  onPageChange,
  onFilterChange
}: SearchResultsProps) {
  const { t } = useTranslation()
  const [area, setArea] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      if (!skills.includes(skillInput.trim())) {
        const newSkills = [...skills, skillInput.trim()]
        setSkills(newSkills)
        onFilterChange({ area, skills: newSkills })
      }
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((s) => s !== skillToRemove)
    setSkills(newSkills)
    onFilterChange({ area, skills: newSkills })
  }

  const applyAreaFilter = () => {
    onFilterChange({ area, skills })
  }

  return (
    <section id="search-results" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t('search.title')}</h2>
          <p className="text-gray-500">{t('search.description')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filtros */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Filter size={20} className="text-[#C8102E]" />
                <h3 className="font-bold text-gray-900">{t('search.filters')}</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {t('search.area_label')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t('search.area_placeholder')}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#C8102E] transition-all"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      onBlur={applyAreaFilter}
                      onKeyDown={(e) => e.key === 'Enter' && applyAreaFilter()}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {t('search.skills_label')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('search.skills_placeholder')}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#C8102E] transition-all"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="flex items-center gap-1 bg-[#C8102E]/5 text-[#C8102E] px-2 py-1 rounded-lg text-[10px] font-bold border border-[#C8102E]/10"
                      >
                        {s}
                        <X size={12} className="cursor-pointer" onClick={() => removeSkill(s)} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Resultados Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                <Loader2 className="w-10 h-10 text-[#C8102E] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">{t('search.searching')}</p>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl text-center border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon size={30} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t('search.no_results')}</h3>
                <p className="text-gray-500 text-sm">{t('search.no_results_desc')}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.map((p) => (
                    <PortfolioCard key={p.id} portfolio={p} />
                  ))}
                </div>

                {meta && meta.last_page > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => onPageChange(meta.current_page - 1)}
                      disabled={meta.current_page === 1}
                      className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {Array.from({ length: meta.last_page }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => onPageChange(i + 1)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all text-sm ${meta.current_page === i + 1 ? 'bg-[#C8102E] text-white shadow-lg shadow-red-600/20' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => onPageChange(meta.current_page + 1)}
                      disabled={meta.current_page === meta.last_page}
                      className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { user } = useAuth()
  const { profiles, stats, loading: loadingFeatured } = useFeaturedProfiles()
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    q: '',
    area: '',
    skills: [] as string[],
    page: 1
  })

  const executeSearch = async (params: typeof searchParams) => {
    setLoading(true)
    try {
      const response = await searchProfessionals({
        q: params.q,
        area: params.area,
        skills: params.skills,
        page: params.page,
        per_page: 9
      })
      setSearchResults(response.data)
      setMeta(response.meta)
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    const newParams = { ...searchParams, q: term, page: 1 }
    setSearchParams(newParams)
    executeSearch(newParams)

    // Scroll a resultados
    setTimeout(() => {
      const el = document.getElementById('search-results')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handlePageChange = (page: number) => {
    const newParams = { ...searchParams, page }
    setSearchParams(newParams)
    executeSearch(newParams)
  }

  const handleFilterChange = (filters: { area: string; skills: string[] }) => {
    const newParams = { ...searchParams, ...filters, page: 1 }
    setSearchParams(newParams)
    executeSearch(newParams)
  }

  return (
    <div className="min-h-screen font-sans antialiased bg-white">
      <Navbar />
      <Hero stats={stats} onSearch={handleSearch} />

      {(searchResults.length > 0 || loading || searchParams.q) && (
        <SearchResults
          results={searchResults}
          meta={meta}
          loading={loading}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
        />
      )}

      <UniversityStrip />
      <Features />
      {!user && <CTA />}
      <RecentPortfolios profiles={profiles} loading={loadingFeatured} />
      <Footer />
    </div>
  )
}
