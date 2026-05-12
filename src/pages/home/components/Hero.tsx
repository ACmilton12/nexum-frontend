import React, { useState, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GlobalStats } from '../types'

export default function Hero({
  onSearch
}: {
  stats: GlobalStats
  onSearch?: (term: string) => void
}) {
  const [current, setCurrent] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const slides = [
    { color: '#C8102E' }, // Rojo
    { color: '#111111' }, // Negro (ligeramente suavizado)
    { color: '#003087' } // Azul UMSS
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 6000)
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
              Encuentra el talento profesional de la UMSS
            </h1>
            <p className="text-base md:text-xl opacity-90 mb-10 max-w-3xl mx-auto font-medium">
              Explora portafolios públicos de desarrolladores, ingenieros y especialistas.
            </p>

            {/* Buscador */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
              <div className="bg-white rounded-full p-1.5 shadow-2xl flex items-center gap-2 overflow-hidden border-2 border-transparent focus-within:border-white/30 transition-all">
                <div className="flex-1 flex items-center px-4">
                  <Search className="text-gray-400 mr-2" size={22} />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, especialidad o habilidades..."
                    className="w-full py-3 text-gray-800 outline-none text-sm md:text-base border-none bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#C8102E] text-white px-8 py-3 rounded-full font-bold text-sm md:text-base hover:bg-[#a50d25] transition-all cursor-pointer border-none shadow-lg active:scale-95"
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Filtros */}
            <div className="flex flex-wrap justify-center gap-3 opacity-95">
              {[
                { label: 'Área: Desarrollo de Software', active: false },
                { label: 'Habilidades: React, Node.js', active: false },
                { label: 'Ordenar: Relevancia', active: false }
              ].map((filter, i) => (
                <button
                  key={i}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs md:text-sm font-bold hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  {filter.label}
                  <span className="text-[10px]">▼</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Flechas de Navegación */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer"
      >
        <ChevronLeft size={48} strokeWidth={1.5} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer"
      >
        <ChevronRight size={48} strokeWidth={1.5} />
      </button>

      {/* Indicadores (Dots) */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 border-none cursor-pointer ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
            style={{ height: '6px', borderRadius: '3px' }}
          />
        ))}
      </div>
    </section>
  )
}
