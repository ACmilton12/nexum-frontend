import React, { useState, useEffect } from 'react'
<<<<<<< HEAD
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
=======
import { Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, ArrowRight, Users, Briefcase } from 'lucide-react'
import useAuth from '../../../hooks/useAuth'
>>>>>>> feature/hu1-tercersprint
import type { GlobalStats } from '../types'
import { formatNumber } from '../utils'

export default function Hero({
  stats,
  onSearch
}: {
  stats: GlobalStats
  onSearch?: (term: string) => void
}) {
<<<<<<< HEAD
  const { t } = useTranslation()
=======
  const { user } = useAuth()
>>>>>>> feature/hu1-tercersprint
  const [current, setCurrent] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')


  const slides = [
    {
      gradient: 'linear-gradient(135deg, #C8102E 0%, #7a0a1c 100%)',
      title: "Encuentra el talento profesional de la UMSS"
    },
    {
      gradient: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
      title: "Conecta con expertos en tecnología"
    },
    {
      gradient: 'linear-gradient(135deg, #003087 0%, #001f57 100%)',
      title: "Tu futuro profesional empieza aquí"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 8000)
    return () => clearInterval(timer)
  }, [slides.length])

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent((c) => (c + 1) % slides.length)

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  return (
<<<<<<< HEAD
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

            {/* Filtros */}
            <div className="flex flex-wrap justify-center gap-3 opacity-95">
              {[
                { label: t('hero.filter_area'), active: false },
                { label: t('hero.filter_skills'), active: false },
                { label: t('hero.filter_order'), active: false }
              ].map((filter, i) => (
                <button
                  key={i}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs md:text-sm font-bold hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  {filter.label}
                  <span className="text-[10px]">▼</span>
                </button>
              ))}
=======
    <section className="relative w-full overflow-hidden flex items-center justify-center pt-24 pb-32" style={{ minHeight: '750px' }}>
      {/* Slides (Background with Gradient Overlays) */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: slide.gradient
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
      </div>

      {/* Static Content */}
      <div className="relative z-10 max-w-5xl w-full px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight leading-tight">
          {user ? (
            <>
              Bienvenido, <span className="text-blue-300 drop-shadow-sm">{user.first_name || 'Talento UMSS'}</span>
            </>
          ) : (
            slides[current].title
          )}
        </h1>

        <p className="text-lg md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          {user
            ? "Sigue gestionando tu perfil o explora los proyectos destacados de tus colegas en la comunidad UMSS."
            : "Explora portafolios públicos de los mejores desarrolladores, ingenieros y especialistas de nuestra universidad."}
        </p>

        {/* Buscador Premium */}
        <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto mb-12 relative group">
          <div className="bg-white rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center gap-2 overflow-hidden border border-white/20 transition-all focus-within:ring-4 focus-within:ring-white/20">
            <div className="flex-1 flex items-center px-5">
              <Search className="text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Buscar por nombre, especialidad o habilidades..."
                className="w-full py-4 px-3 text-gray-800 outline-none text-base md:text-lg border-none bg-transparent placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-[#C8102E] text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-[#a50d25] transition-all cursor-pointer border-none shadow-lg active:scale-95 flex items-center gap-2 shrink-0"
            >
              <span className="hidden md:inline">Buscar</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

        {/* Estadísticas Modernas */}
        <div className="max-w-xl mx-auto">
          <div className="grid grid-cols-2 gap-8 mb-10 pt-8 border-t border-white/20">
            <div className="text-center group cursor-default">
              <div className="text-2xl md:text-3xl font-black mb-1 group-hover:scale-110 transition-transform">{formatNumber(stats.total_users)}</div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Usuarios</div>
            </div>
            <div className="text-center group cursor-default">
              <div className="text-2xl md:text-3xl font-black mb-1 group-hover:scale-110 transition-transform">{formatNumber(stats.total_projects)}</div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Proyectos</div>
>>>>>>> feature/hu1-tercersprint
            </div>
          </div>
        </div>

        {/* Filtros Estilizados */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: 'Desarrollo de Software', icon: <Briefcase size={14} /> },
            { label: 'React & Node.js', icon: <Users size={14} /> },
            { label: 'Más Recientes', icon: <Search size={14} /> }
          ].map((filter, i) => (
            <button
              key={i}
              className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all backdrop-blur-md flex items-center gap-2 group"
            >
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navegación Refinada */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 md:px-12 z-20 pointer-events-none">
        <button
          onClick={prev}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-black/20 text-white/50 hover:text-white hover:bg-black/40 transition-all border border-white/10 cursor-pointer pointer-events-auto backdrop-blur-md"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={next}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-black/20 text-white/50 hover:text-white hover:bg-black/40 transition-all border border-white/10 cursor-pointer pointer-events-auto backdrop-blur-md"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Indicadores de Progreso */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 transition-all duration-500 border-none cursor-pointer rounded-full ${i === current ? 'w-16 bg-white shadow-lg' : 'w-4 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  )
}