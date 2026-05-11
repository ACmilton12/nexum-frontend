import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import useAuth from '../../../hooks/useAuth'
import type { GlobalStats } from '../types'
import { formatNumber } from '../utils'

const PDFSlide = () => {
  const [innerCurrent, setInnerCurrent] = React.useState(0)
  const innerSlides = [
    {
      title: 'Crea tu portafolio',
      desc: 'Sube tus proyectos, habilidades y experiencia en minutos.'
    },
    {
      title: 'Comparte con empleadores',
      desc: 'Genera un enlace único o exporta tu PDF verificado por UMSS.'
    },
    {
      title: 'Destaca como profesional TIS',
      desc: 'Tu perfil validado por la FCyT te diferencia en el mercado.'
    }
  ]
  return (
    <div
      className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div
        className="px-5 py-4 flex items-center justify-between border-b"
        style={{ borderColor: '#C9D1D9' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: '#C8102E' }}
          >
            PDF
          </div>
          <div>
            <div className="font-bold text-xs" style={{ color: '#1A1A2E' }}>
              portafolio_cmendoza.pdf
            </div>
            <div className="text-gray-400 text-xs">Generado hoy · 2.4 MB</div>
          </div>
        </div>
        <button
          className="text-xs font-bold px-3 py-1.5 rounded-lg text-white flex-shrink-0"
          style={{ backgroundColor: '#003087' }}
        >
          ↓ Descargar
        </button>
      </div>
      <div
        className="mx-4 my-4 rounded-xl border overflow-hidden"
        style={{ borderColor: '#C9D1D9' }}
      >
        <div
          className="px-5 py-6 flex flex-col items-center text-center"
          style={{ backgroundColor: '#fafafa', minHeight: '120px' }}
        >
          <div className="font-bold text-sm mb-1" style={{ color: '#003087' }}>
            {innerSlides[innerCurrent].title}
          </div>
          <div className="text-xs text-gray-500">{innerSlides[innerCurrent].desc}</div>
        </div>
        <div
          className="flex items-center justify-center gap-2 py-3 border-t"
          style={{ borderColor: '#C9D1D9', backgroundColor: '#fafafa' }}
        >
          {innerSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setInnerCurrent(i)}
              style={{
                width: i === innerCurrent ? '20px' : '7px',
                height: '7px',
                borderRadius: i === innerCurrent ? '4px' : '50%',
                backgroundColor: i === innerCurrent ? '#003087' : '#C9D1D9',
                transition: 'all 0.2s',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>
      <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {[
          { label: 'PDF Completo', icon: '📄', active: true },
          { label: 'Solo CV', icon: '📋', active: false },
          { label: 'Compartir link', icon: '🔗', active: false }
        ].map((opt) => (
          <button
            key={opt.label}
            className="flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-bold transition-all"
            style={{
              borderColor: opt.active ? '#003087' : '#C9D1D9',
              color: opt.active ? '#003087' : '#9ca3af',
              backgroundColor: opt.active ? '#f0f4ff' : 'transparent'
            }}
          >
            <span style={{ fontSize: '16px' }}>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Hero({
  stats,
  onSearch
}: {
  stats: GlobalStats
  onSearch?: (term: string) => void
}) {
  const { user } = useAuth()
  const [current, setCurrent] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  const slides = [
    {
      title: 'Dashboard Principal',
      description: 'Vista general de tu portafolio',
      content: (
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: '#4a6b7a' }}
        >
          <div
            className="flex items-center justify-between px-5 py-3 border-b"
            style={{ backgroundColor: '#3d5a67', borderColor: 'rgba(255,255,255,0.15)' }}
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">
              ⚙
            </div>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">
              👤
            </div>
          </div>
          <div className="p-3 sm:p-5 flex flex-col sm:flex-row gap-3">
            <div
              className="hidden sm:flex w-32 flex-shrink-0 rounded-xl p-3 flex-col gap-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              {[
                { label: 'Dashboard', icon: '🏠' },
                { label: 'Settings', icon: '⚙️' },
                { label: 'Profile', icon: '👤' },
                { label: 'Documentation', icon: '📄' }
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-white/70 text-xs py-1.5 px-2 rounded-lg flex items-center gap-2"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div className="bg-white rounded-xl p-4">
                <div className="font-bold text-sm mb-1" style={{ color: '#1A1A2E' }}>
                  Project Progress
                </div>
                <div className="text-gray-400 text-xs mb-3">Q4 Performance</div>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#003087"
                        strokeWidth="4"
                        strokeDasharray="75 25"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold" style={{ color: '#1A1A2E' }}>
                        85%
                      </span>
                    </div>
                  </div>
                  <svg viewBox="0 0 100 40" className="flex-1 h-10">
                    <polyline
                      points="0,35 15,28 30,32 45,18 60,22 75,10 90,14 100,8"
                      fill="none"
                      stroke="#003087"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3">
                  <div className="font-bold text-xs mb-2" style={{ color: '#1A1A2E' }}>
                    Analytics
                  </div>
                  <div className="flex items-center justify-center py-1">
                    <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#003087"
                        strokeWidth="4"
                        strokeDasharray="55 45"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#C8102E"
                        strokeWidth="4"
                        strokeDasharray="25 75"
                        strokeDashoffset="-55"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="text-gray-400 text-xs text-center">Traffic Sources</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <div className="font-bold text-xs mb-2" style={{ color: '#1A1A2E' }}>
                    Reports
                  </div>
                  <div className="flex items-end justify-center gap-1 h-12 py-1">
                    {[40, 70, 50, 80, 60, 90].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          backgroundColor: i % 2 === 0 ? '#003087' : '#C9D1D9'
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-gray-400 text-xs text-center">Monthly Summary</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Exportación PDF',
      description: 'Descarga tu portafolio listo para empleadores',
      content: <PDFSlide />
    },
    {
      title: 'Gestión de Proyectos',
      description: 'Administra tu portafolio académico',
      content: (
        <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-white">
          <div
            className="px-5 py-4 border-b flex items-center justify-between"
            style={{ borderColor: '#C9D1D9' }}
          >
            <div className="font-bold text-sm" style={{ color: '#1A1A2E' }}>
              Mis Proyectos
            </div>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: '#003087' }}
            >
              + Nuevo
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: '#C9D1D9' }}>
            {[
              {
                name: 'Sistema de Inventario',
                tech: 'React · Laravel',
                status: 'Completado',
                color: '#16a34a'
              },
              {
                name: 'App Gestión Académica',
                tech: 'Vue · Node.js',
                status: 'En progreso',
                color: '#d97706'
              },
              {
                name: 'API REST Portafolio',
                tech: 'PHP · PostgreSQL',
                status: 'Completado',
                color: '#16a34a'
              },
              {
                name: 'Dashboard Analytics',
                tech: 'React · Python',
                status: 'Borrador',
                color: '#6b7280'
              }
            ].map((proj) => (
              <div key={proj.name} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm" style={{ color: '#1A1A2E' }}>
                    {proj.name}
                  </div>
                  <div className="text-gray-400 text-xs">{proj.tech}</div>
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{ color: proj.color, backgroundColor: `${proj.color}18` }}
                >
                  {proj.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent((c) => (c + 1) % slides.length)

  return (
    <section className="flex flex-col lg:flex-row min-h-screen pt-16">
      {/* Left — Azul UMSS */}
      <div
        className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-20 py-12 sm:py-20"
        style={{ backgroundColor: '#003087' }}
      >
        <div
          className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-2 mb-6 sm:mb-8 w-fit"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          <span className="text-white text-xs">🛡️</span>
          <span className="text-white text-xs font-bold tracking-widest uppercase">
            Plataforma No Oficial
          </span>
        </div>

        <h1 className="font-extrabold text-4xl lg:text-5xl xl:text-6xl leading-tight mb-8 text-white">
          {user
            ? `Bienvenido de vuelta, ${user.first_name || user.name || 'profesional'} 👋`
            : 'Plataforma de Portafolios Digitales para Profesionales'}
        </h1>

        <p className="text-blue-200 text-base leading-relaxed mb-10 max-w-lg">
          {user
            ? 'Accedé a tu perfil, actualizá tus proyectos y compartí tu portafolio profesional.'
            : 'Crea, gestiona y comparte tu perfil profesional.'}
        </p>

        {/* SEARCH BAR INTEGRATION */}
        <form onSubmit={handleSearchSubmit} className="mb-10 max-w-lg">
          <div className="bg-white rounded-xl p-1.5 shadow-xl flex items-center gap-2 overflow-hidden">
            <div className="flex-1 flex items-center px-3">
              <Search className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Buscar portafolios..."
                className="w-full py-2.5 text-gray-800 outline-none text-sm border-none bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-[#C8102E] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#a50d25] transition-all cursor-pointer border-none"
            >
              Buscar
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-4">
          {user ? (
            <Link
              to="/profile/personal-data"
              className="text-white font-bold text-base px-8 py-4 rounded transition-all duration-200 shadow-xl no-underline inline-block"
              style={{ backgroundColor: '#C8102E' }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#a50d25')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#C8102E')
              }
            >
              Ir a mi perfil →
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="text-white font-bold text-base px-8 py-4 rounded transition-all duration-200 shadow-xl no-underline inline-block"
                style={{ backgroundColor: '#C8102E' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#a50d25')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#C8102E')
                }
              >
                Registrarse ahora
              </Link>
              <Link
                to="/login"
                className="text-white font-bold text-base px-8 py-4 rounded border-2 border-white/50 transition-all duration-200 no-underline inline-block hover:border-white hover:bg-white/5"
              >
                Acceder
              </Link>
            </>
          )}
        </div>

        {/* Estadísticas del backend */}
        <div className="border-t border-white/20 mt-12 pt-10 flex flex-wrap gap-8 md:gap-12">
          {[
            { value: formatNumber(stats.total_users), label: 'USUARIOS' },
            { value: formatNumber(stats.total_projects), label: 'PROYECTOS' },
            { value: formatNumber(stats.total_views), label: 'VISITAS' }
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-white font-extrabold text-3xl">{stat.value || '—'}</div>
              <div className="text-blue-300 text-xs font-bold tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Carrusel */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 sm:py-20 relative w-full overflow-hidden"
        style={{ backgroundColor: '#C9D1D9' }}
      >
        <div className="w-full flex items-center justify-center" style={{ minHeight: '340px' }}>
          {slides[current].content}
        </div>
        <div className="mt-6 text-center">
          <div className="font-bold text-sm" style={{ color: '#1A1A2E' }}>
            {slides[current].title}
          </div>
          <div className="text-gray-500 text-xs mt-1">{slides[current].description}</div>
        </div>
        <div className="flex items-center gap-6 mt-6">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{ borderColor: '#003087', color: '#003087', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#003087'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#003087'
            }}
          >
            ‹
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300 cursor-pointer border-0"
                style={{
                  width: i === current ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: i === current ? '#003087' : '#94a3b8'
                }}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{ borderColor: '#003087', color: '#003087', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#003087'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#003087'
            }}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
