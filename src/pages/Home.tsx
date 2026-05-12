import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { useFeaturedProfiles } from './home/hooks/useFeaturedProfiles'
import { MOCK_PORTFOLIOS, type PublicPortfolio } from '../utils/mockPortfolios'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import Navbar from './home/components/Navbar'
import Hero from './home/components/Hero'
import Features from './home/components/Features'
import CTA from './home/components/CTA'
import RecentPortfolios from './home/components/RecentPortfolios'
import Footer from './home/components/Footer'

// ── Public Profile Card ──────────────────────────────────────────────────
function PublicProfileCard({ profile }: { profile: PublicPortfolio }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex flex-col items-center text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner group-hover:scale-110 transition-transform duration-500">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.first_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-3xl font-bold">
              {profile.first_name[0]}
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-1">
        {profile.first_name} {profile.last_name}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {profile.profession} • {profile.location}
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-8 h-16 overflow-hidden">
        {profile.skills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100"
          >
            {skill}
          </span>
        ))}
      </div>

      <Link
        to={`/portfolio/${profile.id}`}
        className="w-full py-3 rounded-xl border-2 border-gray-100 text-gray-800 font-bold hover:bg-[#C8102E] hover:text-white hover:border-[#C8102E] transition-all no-underline"
      >
        Ver Portafolio
      </Link>
    </div>
  )
}

// ── Search Results Section ───────────────────────────────────────────────
function SearchResults({ results }: { results: PublicPortfolio[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  const totalPages = Math.ceil(results.length / itemsPerPage)

  const currentResults = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (results.length === 0) return null

  return (
    <section id="search-results" className="py-20 bg-[#C9D1D9]/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Resultados de búsqueda ({results.length})
          </h2>
          <p className="text-gray-500">Excluyendo perfiles privados y secciones ocultas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentResults.map((p) => (
            <PublicProfileCard key={p.id} profile={p} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === i + 1 ? 'bg-[#C8102E] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default function Home() {
  const { user } = useAuth()
  const { profiles, stats, loading } = useFeaturedProfiles()
  const [searchResults, setSearchResults] = useState<PublicPortfolio[]>([])

  const handleSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([])
      return
    }
    const lowerTerm = term.toLowerCase()
    const filtered = MOCK_PORTFOLIOS.filter(
      (p) =>
        p.first_name.toLowerCase().includes(lowerTerm) ||
        p.last_name.toLowerCase().includes(lowerTerm) ||
        p.profession.toLowerCase().includes(lowerTerm) ||
        p.skills.some((s) => s.toLowerCase().includes(lowerTerm))
    )
    setSearchResults(filtered)

    // Scroll a resultados
    setTimeout(() => {
      const el = document.getElementById('search-results')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen font-sans antialiased bg-white">
      <Navbar />
      <Hero stats={stats} onSearch={handleSearch} />

      {searchResults.length > 0 && <SearchResults results={searchResults} />}

      <Features />
      {!user && <CTA />}
      <RecentPortfolios profiles={profiles} loading={loading} />
      <Footer />
    </div>
  )
}
