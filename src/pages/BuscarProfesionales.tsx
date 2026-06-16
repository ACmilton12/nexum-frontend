import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Loader2, Search as SearchIcon, X } from 'lucide-react'
import { useFeaturedProfiles } from './home/hooks/useFeaturedProfiles'
import {
  searchProfessionals,
  type SearchResult,
  type PaginationMeta
} from '../services/search.service'
import PortfolioCard from './search/components/PortfolioCard'
import SearchFilters from './search/components/SearchFilters'
import Navbar from './home/components/Navbar'
import Hero from './home/components/Hero'
import Footer from './home/components/Footer'

export default function BuscarProfesionales() {
  const { t } = useTranslation()
  const { stats } = useFeaturedProfiles()
  const [results, setResults] = useState<SearchResult[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

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
        per_page: query !== '' ? 6 : 8 // 8 portafolios en exploración full-width, 6 cuando hay filtros laterales
      })
      setResults(response.data)
      setMeta(response.meta)
    } catch (err) {
      console.error('Error fetching professionals:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolios(page, searchTerm, area, skills)
  }, [page, searchTerm, area, skills])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setPage(1) // Volver a la primera página
    
    // Scroll a resultados
    setTimeout(() => {
      const el = document.getElementById('search-grid-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleFilterChange = (filters: { q: string; area: string; skills: string[] }) => {
    setSearchTerm(filters.q)
    setArea(filters.area)
    setSkills(filters.skills)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 450, behavior: 'smooth' })
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setArea('')
    setSkills([])
    setPage(1)
  }

  const hasSearched = searchTerm !== ''

  return (
    <div className="min-h-screen font-sans antialiased bg-white flex flex-col">
      <Navbar />
      <Hero stats={stats} onSearch={handleSearch} searchTerm={searchTerm} />

      <main id="search-grid-section" className="flex-grow py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header de la sección */}
          <div className="mb-12 text-center relative">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              {hasSearched ? t('search.title', 'Resultados de búsqueda') : t('search.explore_title', 'Explorar Portafolios')}
            </h2>
            <p className="text-gray-500">
              {hasSearched 
                ? `${t('search.description', 'Explora perfiles públicos y encuentra especialistas')} ${t('search.for', 'para')} "${searchTerm}"`
                : t('search.explore_desc', 'Encuentra y conecta con el mejor talento de la comunidad.')
              }
            </p>
            {hasSearched && (
              <button
                onClick={handleClearSearch}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl shadow-sm border border-gray-200 transition-all cursor-pointer active:scale-95"
              >
                <X size={14} className="text-gray-400" />
                {t('search.show_all', 'Mostrar todos los portafolios')}
              </button>
            )}
          </div>

          {/* Cuerpo principal con transición de columnas */}
          <div className={`grid grid-cols-1 ${hasSearched ? 'lg:grid-cols-4' : ''} gap-8`}>
            
            {/* Sidebar de Filtros (Utiliza el componente oficial del sistema) */}
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

            {/* Grid de Portafolios / Resultados */}
            <div className={hasSearched ? 'lg:col-span-3' : 'w-full'}>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <Loader2 className="w-10 h-10 text-[#C8102E] animate-spin mb-4" />
                  <p className="text-gray-500 font-medium">{t('search.searching', 'Buscando portafolios...')}</p>
                </div>
              ) : results.length === 0 ? (
                <div className="bg-white p-16 rounded-3xl text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <SearchIcon size={30} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{t('search.no_results', 'Sin resultados')}</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {t('search.no_results_desc', 'No encontramos perfiles disponibles que coincidan con tu búsqueda.')}
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="bg-[#C8102E] hover:bg-[#a50d25] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95 border-none"
                  >
                    {t('search.view_all', 'Ver todos los portafolios')}
                  </button>
                </div>
              ) : (
                <>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${hasSearched ? 'xl:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
                    {results.map((portfolio) => (
                      <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                    ))}
                  </div>

                  {/* Paginación */}
                  {meta && meta.last_page > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                      <button
                        onClick={() => handlePageChange(meta.current_page - 1)}
                        disabled={meta.current_page === 1}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {Array.from({ length: meta.last_page }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all text-sm cursor-pointer ${meta.current_page === i + 1 ? 'bg-[#C8102E] text-white shadow-lg shadow-red-600/20' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(meta.current_page + 1)}
                        disabled={meta.current_page === meta.last_page}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
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
      </main>

      <Footer />
    </div>
  )
}
