import React, { useState, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { GlobalStats } from '../types'

export default function Hero({
  stats,
  onSearch: _onSearch,
  searchTerm: externalSearchTerm = ''
}: {
  stats: GlobalStats;
  onSearch?: (term: string) => void;
  searchTerm?: string;
}) {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(0)
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm)

  useEffect(() => {
    setSearchTerm(externalSearchTerm)
  }, [externalSearchTerm])

  const slides = [
    { color: '#C8102E' },
    { color: '#111111' },
    { color: '#003087' }
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent((c) => (c + 1) % slides.length)

  const formatNumber = (n: number) => n?.toLocaleString()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (_onSearch) _onSearch(searchTerm)
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '550px' }}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{ backgroundColor: slide.color }}
        >
          <div className="max-w-5xl w-full px-6 text-center text-white mt-10">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
              {t('hero.title_start')}{' '}
              <span className="text-white/80">{t('hero.title_accent')}</span> {t('hero.title_end')}
            </h1>
            <p className="text-base md:text-xl opacity-90 mb-10 max-w-3xl mx-auto font-medium">
              {t('hero.description')}
            </p>

            {/* Buscador */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
              <div className="bg-white rounded-full p-1.5 shadow-2xl flex items-center gap-2 overflow-hidden border-2 border-transparent focus-within:border-white/30 transition-all">
                <div className="flex-1 flex items-center px-4">
                  <Search className="text-gray-400 mr-2" size={22} />
                  <input
                    type="text"
                    placeholder={t('hero.search_placeholder')}
                    className="w-full py-3 text-gray-800 outline-none text-sm md:text-base border-none bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#C8102E] text-white px-8 py-3 rounded-full font-bold text-sm md:text-base hover:bg-[#a50d25] transition-all cursor-pointer border-none shadow-lg active:scale-95"
                >
                  {t('hero.search_button')}
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="flex flex-col items-center mb-6">
              <div className="text-white font-black text-2xl sm:text-3xl tracking-tight leading-none mb-1">
                {formatNumber(stats.total_users) || "—"}
              </div>
              <div className="text-blue-200/70 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                Usuarios
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap justify-center gap-3 opacity-95">
              {[
                { label: t('hero.filter_area') },
                { label: t('hero.filter_skills') },
                { label: t('hero.filter_order') }
              ].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all duration-500 cursor-pointer border-0 shadow-lg"
                  style={{
                    width: i === current ? "32px" : "10px",
                    height: "10px",
                    backgroundColor:
                      i === current ? "#ffffff" : "rgba(255,255,255,0.4)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Flechas de navegación */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  )
}