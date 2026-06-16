import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Loader2, Search as SearchIcon, X } from 'lucide-react'
import {
  searchProfessionals,
  type SearchResult,
  type PaginationMeta
} from '../../services/search.service'
import PortfolioCard from '../search/components/PortfolioCard'
import SearchFilters from '../search/components/SearchFilters'
import Sidebar from '../admin/components/Sidebar'

const HomeDirectory = () => {
  const { t } = useTranslation()
  const mainRef = useRef<HTMLElement>(null)
  
  const [results, setResults] = useState<SearchResult[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchValue, setSearchValue] = useState('')

  // Estados de filtros
  const [area, setArea] = useState('')
  const [skills, setSkills] = useState<string[]>([])

  const fetchPortfolios = async (currentPage: number, query: string, filterArea: string, filterSkills: string[]) => {
    setLoading(true)
    try {
      const response = await searchProfessionals({
        q: query,
        area: filterArea,
        skills: filterSkills,
        page: currentPage,
        per_page: query !== '' ? 6 : 8 // 8 portafolios en exploración, 6 con filtros
      })
      setResults(response.data)
      setMeta(response.meta)
    } catch (err) {
      console.error('Error fetching professionals in workspace directory:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolios(page, searchTerm, area, skills)
  }, [page, searchTerm, area, skills])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setPage(1)
    setTimeout(() => {
      if (mainRef.current) {
        mainRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100)
  }

  const handleFilterChange = (filters: { q: string; area: string; skills: string[] }) => {
    setSearchTerm(filters.q)
    setSearchValue(filters.q)
    setArea(filters.area)
    setSkills(filters.skills)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setSearchValue('')
    setArea('')
    setSkills([])
    setPage(1)
    setTimeout(() => {
      if (mainRef.current) {
        mainRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100)
  }

  const hasSearched = searchTerm !== '' || area !== '' || skills.length > 0

  return (
    <div className="h-full max-h-full bg-background dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300 overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Buscar profesionales" />

        <main 
          ref={mainRef}
          className="flex-grow overflow-y-auto bg-[#F8FAFC] dark:bg-slate-900 p-4 sm:p-6 md:p-8 transition-colors duration-300"
        >
          {/* Header de la sección */}
          <header className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {t('search.explore_title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('search.explore_desc')}
            </p>
          </header>

          {/* Caja del buscador */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-150 dark:border-gray-700 mb-8 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch(searchValue)
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#003087] transition-all text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSearch(searchValue)}
                  className="px-6 py-3 bg-[#003087] hover:bg-[#002266] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-sm border-none"
                >
                  {t('search.button')}
                </button>
                {hasSearched && (
                  <button
                    onClick={handleClearSearch}
                    className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl transition-all cursor-pointer border-none flex items-center justify-center"
                    title={t('search.clear')}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cuerpo principal con columnas responsivas */}
          <div className={`grid grid-cols-1 ${hasSearched ? 'lg:grid-cols-4' : ''} gap-6 items-start`}>
            
            {/* Filtros laterales si hay filtros activos */}
            {hasSearched && (
              <aside className="lg:col-span-1 animate-in fade-in slide-in-from-left-4 duration-300">
                <SearchFilters
                  key={`${searchTerm}_${area}_${skills.join(',')}`}
                  initialQuery={searchTerm}
                  initialArea={area}
                  initialSkills={skills}
                  onSearch={handleFilterChange}
                />
              </aside>
            )}

            {/* Cuadrícula de Portafolios */}
            <div className={hasSearched ? 'lg:col-span-3' : 'w-full'}>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-300">
                  <Loader2 className="w-10 h-10 text-[#C8102E] animate-spin mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">{t('search.searching')}</p>
                </div>
              ) : results.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 p-16 rounded-2xl text-center border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center transition-colors duration-300">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 transition-colors">
                    <SearchIcon size={30} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('search.no_results')}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    {t('search.no_results_desc')}
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="bg-[#C8102E] hover:bg-[#a50d25] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer border-none"
                  >
                    {t('search.view_all')}
                  </button>
                </div>
              ) : (
                <>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${hasSearched ? 'xl:grid-cols-3' : 'lg:grid-cols-4'} gap-5`}>
                    {results.map((portfolio) => (
                      <PortfolioCard key={portfolio.id} portfolio={portfolio} isInternal={true} />
                    ))}
                  </div>

                  {/* Paginador */}
                  {meta && meta.last_page > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => handlePageChange(meta.current_page - 1)}
                        disabled={meta.current_page === 1}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {Array.from({ length: meta.last_page }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all text-sm cursor-pointer ${
                            meta.current_page === i + 1
                              ? 'bg-[#C8102E] text-white shadow-lg shadow-red-600/20'
                              : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(meta.current_page + 1)}
                        disabled={meta.current_page === meta.last_page}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomeDirectory
