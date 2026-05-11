import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { FeaturedProfile } from '../types'
import { getInitials } from '../utils'

const accentColors = ['#003087', '#C8102E', '#001A5E']

function PortfolioCard({ profile, index }: { profile: FeaturedProfile; index: number }) {
  const [btnHovered, setBtnHovered] = useState(false)
  const accentColor = accentColors[index % accentColors.length]
  const initials = getInitials(profile.first_name, profile.last_name)
  const fullName = `${profile.first_name} ${profile.last_name}`

  return (
    <div
      className="rounded-2xl p-6 border-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#C9D1D9' }}
    >
      <div className="flex items-center gap-4 mb-5">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={fullName}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            {initials}
          </div>
        )}
        <div>
          <div className="font-bold text-base" style={{ color: '#1A1A2E' }}>
            {fullName}
          </div>
          <div className="text-gray-500 text-xs">{profile.location || 'UMSS · FCyT'}</div>
          <div className="text-gray-400 text-xs">Universidad Mayor de San Simón</div>
        </div>
      </div>
      <div
        className="flex items-center gap-8 mb-6 pt-4 border-t-2"
        style={{ borderColor: '#C9D1D9' }}
      >
        <div className="flex-1 border-r-2 pr-8" style={{ borderColor: '#C9D1D9' }}>
          <div className="font-extrabold text-2xl" style={{ color: '#1A1A2E' }}>
            {profile.projects_count}
          </div>
          <div className="text-gray-400 text-xs">Proyectos</div>
        </div>
        <div className="flex-1">
          <div className="font-extrabold text-2xl" style={{ color: '#1A1A2E' }}>
            —
          </div>
          <div className="text-gray-400 text-xs">Visitas</div>
        </div>
      </div>
      <Link
        to="/Home"
        className="w-full font-bold text-sm py-2.5 rounded-xl border-2 transition-all duration-200 no-underline text-center inline-block"
        style={{
          color: btnHovered ? '#FFFFFF' : '#C8102E',
          borderColor: '#C8102E',
          backgroundColor: btnHovered ? '#C8102E' : 'transparent'
        }}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
      >
        Ver portafolio →
      </Link>
    </div>
  )
}

export default function RecentPortfolios({
  profiles,
  loading
}: {
  profiles: FeaturedProfile[]
  loading: boolean
}) {
  return (
    <section className="py-24" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-extrabold text-3xl lg:text-4xl mb-4" style={{ color: '#1A1A2E' }}>
            Portafolios recientes
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Conoce el trabajo de los profesionales.
          </p>
        </div>

        {loading ? (
          // Skeleton de carga
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border-2 animate-pulse"
                style={{ borderColor: '#C9D1D9' }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-16 bg-gray-200 rounded mb-4" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profiles.map((p, i) => (
              <PortfolioCard key={`${p.first_name}-${p.last_name}`} profile={p} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/Home"
            className="text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg no-underline inline-block"
            style={{ backgroundColor: '#003087' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#001A5E')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#003087')
            }
          >
            Ver todos los portafolios
          </Link>
        </div>
      </div>
    </section>
  )
}
