import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useAuth from '../hooks/useAuth'
import { useFeaturedProfiles } from './home/hooks/useFeaturedProfiles'
import { ChevronLeft, ChevronRight, Search as SearchIcon, Loader2 } from 'lucide-react'
import {
  searchProfessionals,
  type SearchResult,
  type PaginationMeta
} from '../services/search.service'
import PortfolioCard from './search/components/PortfolioCard'
import SearchFilters from './search/components/SearchFilters'

import Navbar from './home/components/Navbar'
import Hero from './home/components/Hero'
import Features from './home/components/Features'
import CTA from './home/components/CTA'
import RecentPortfolios from './home/components/RecentPortfolios'
import PublicationsFeed from './home/components/PublicationsFeed'
import SuggestedProfilesWidget from './home/components/SuggestedProfilesWidget'
import Calendar from '../components/ui/Calendar'
import Footer from './home/components/Footer'

// Removed PublicProfileCard as we use PortfolioCard

// ── Search Results Section ───────────────────────────────────────────────
interface SearchResultsProps {
  results: SearchResult[]
  meta: PaginationMeta | null
  loading: boolean
  onPageChange: (page: number) => void
  onFilterChange: (filters: { q: string; area: string; skills: string[] }) => void
  q: string
  area: string
  skills: string[]
}

function SearchResults({
  results,
  meta,
  loading,
  onPageChange,
  onFilterChange,
  q,
  area,
  skills
}: SearchResultsProps) {
  const { t } = useTranslation()

  return (
    <section id="search-results" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t('search.title')}</h2>
          <p className="text-gray-500">{t('search.description')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filtros */}
          <aside className="lg:col-span-1">
            <SearchFilters
              initialQuery={q}
              initialArea={area}
              initialSkills={skills}
              onSearch={onFilterChange}
            />
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
  const [hasSearched, setHasSearched] = useState(false)
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
    const trimmed = term.trim()

    // Si el término está vacío y no hay otros filtros, limpiar resultados y volver al inicio
    if (!trimmed && !searchParams.area.trim() && searchParams.skills.length === 0) {
      setSearchParams({ q: '', area: '', skills: [], page: 1 })
      setSearchResults([])
      setMeta(null)
      setHasSearched(false)
      return
    }

    const newParams = { ...searchParams, q: trimmed, page: 1 }
    setSearchParams(newParams)
    setHasSearched(true)
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

  const handleFilterChange = (filters: { q: string; area: string; skills: string[] }) => {
    // Si todos los filtros están vacíos, limpiar todo
    if (!filters.q.trim() && !filters.area.trim() && filters.skills.length === 0) {
      setSearchParams({ q: '', area: '', skills: [], page: 1 })
      setSearchResults([])
      setMeta(null)
      setHasSearched(false)
      return
    }

    const newParams = { ...searchParams, ...filters, page: 1 }
    setSearchParams(newParams)
    setHasSearched(true)
    executeSearch(newParams)
  }

  return (
    <div className="min-h-screen font-sans antialiased bg-white">
      <Navbar />
      <Hero stats={stats} onSearch={handleSearch} searchTerm={searchParams.q} />

      {hasSearched && (
        <SearchResults
          results={searchResults}
          meta={meta}
          loading={loading}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
          q={searchParams.q}
          area={searchParams.area}
          skills={searchParams.skills}
        />
      )}

      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Columna Izquierda: Sugerencias */}
            <div className="hidden lg:block lg:col-span-1">
              <SuggestedProfilesWidget profiles={profiles} />
            </div>
            
            {/* Columna Central: Feed */}
            <div className="col-span-1 lg:col-span-2">
              <PublicationsFeed />
            </div>

            {/* Columna Derecha: Calendario */}
            <div className="hidden lg:block lg:col-span-1 sticky top-24 h-fit">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Calendario</h3>
                <Calendar />
              </div>
            </div>
          </div>
        </div>
      </section>
      <RecentPortfolios profiles={profiles} loading={loadingFeatured} />
      {!user && <CTA />}
      <Features />
      <Footer />
    </div>
  )
}