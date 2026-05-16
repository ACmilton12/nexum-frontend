import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search as SearchIcon, Loader2, UserX } from 'lucide-react'
import {
  searchProfessionals,
  type SearchResult,
  type PaginationMeta
} from '../../services/search.service'
import Navbar from '../home/components/Navbar'
import Footer from '../home/components/Footer'
import SearchFilters from './components/SearchFilters'
import PortfolioCard from './components/PortfolioCard'

export default function SearchPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [results, setResults] = useState<SearchResult[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const q = searchParams.get('q') || ''
  const area = searchParams.get('area') || ''
  const skills = searchParams.getAll('skills')
  const page = parseInt(searchParams.get('page') || '1')

  const fetchResults = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await searchProfessionals({
        q,
        area,
        skills,
        page,
        per_page: 9
      })
      setResults(response.data)
      setMeta(response.meta)
    } catch (err) {
      setError(t('search.error_results'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [q, area, JSON.stringify(skills), page])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  const handleFilterChange = (filters: { q: string; area: string; skills: string[] }) => {
    const newParams = new URLSearchParams()
    if (filters.q) newParams.set('q', filters.q)
    if (filters.area) newParams.set('area', filters.area)
    filters.skills.forEach((s) => newParams.append('skills', s))
    newParams.set('page', '1') // Reset to page 1 on new search
    setSearchParams(newParams)
  }

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', newPage.toString())
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {t('search.explore_title')}
            </h1>
            <p className="text-gray-500">{t('search.explore_desc')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filtros */}
            <aside className="lg:col-span-1">
              <SearchFilters
                initialQuery={q}
                initialArea={area}
                initialSkills={skills}
                onSearch={handleFilterChange}
              />
            </aside>

            {/* Resultados */}
            <section className="lg:col-span-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                  <Loader2 className="w-12 h-12 text-[#C8102E] animate-spin mb-4" />
                  <p className="text-gray-500 font-medium">{t('search.loading')}</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
                  <p className="text-red-600 font-bold mb-2">¡Ups! {t('common.error')}</p>
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              ) : results.length === 0 ? (
                <div className="bg-white border border-gray-100 p-16 rounded-3xl text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <UserX className="text-gray-300" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('search.no_results')}</h3>
                  <p className="text-gray-500 max-w-md mx-auto">{t('search.no_results_desc')}</p>
                  <button
                    onClick={() => handleFilterChange({ q: '', area: '', skills: [] })}
                    className="mt-8 px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-[#C8102E] transition-all"
                  >
                    {t('search.view_all')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500">
                      {t('search.showing_results', { count: results.length, total: meta?.total })}
                    </p>
                    <div className="flex items-center gap-2">
                      {/* Aquí se podría agregar un selector de ordenamiento en el futuro */}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                        className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, meta.last_page) }).map((_, i) => {
                          let pageNum = i + 1
                          // Lógica simple para mostrar páginas cercanas a la actual si hay muchas
                          if (meta.last_page > 5 && meta.current_page > 3) {
                            pageNum = meta.current_page - 3 + i + 1
                            if (pageNum > meta.last_page) pageNum = meta.last_page - (4 - i)
                          }

                          if (pageNum <= 0) return null

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-xl font-bold transition-all text-sm ${
                                meta.current_page === pageNum
                                  ? 'bg-[#C8102E] text-white shadow-lg shadow-red-600/20'
                                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(meta.current_page + 1)}
                        disabled={meta.current_page === meta.last_page}
                        className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
