import { Link } from 'react-router-dom'
import { MapPin, Briefcase, Eye } from 'lucide-react'
import type { SearchResult } from '../../../services/search.service'

interface PortfolioCardProps {
  portfolio: SearchResult
}

export default function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const { user, profession, location, avatar_url, skills, views_count } = portfolio
  const fullName = `${user.first_name} ${user.last_name}`

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <div className="flex items-start gap-4 mb-6">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
            {avatar_url ? (
              <img src={avatar_url} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#C8102E] flex items-center justify-center text-white text-2xl font-bold">
                {user.first_name[0]}
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{fullName}</h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
            <Briefcase size={14} className="text-[#C8102E]" />
            <span className="truncate">{profession || 'Profesional'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin size={14} />
            <span className="truncate">{location || 'Ubicación no especificada'}</span>
          </div>
        </div>
      </div>

      {skills && skills.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-6 flex-grow">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-gray-100"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-[10px] text-gray-400 font-medium py-1">
              +{skills.length - 4} más
            </span>
          )}
        </div>
      ) : (
        <div className="mb-6 flex-grow">
          <p className="text-xs text-gray-400 italic">Sin habilidades públicas listadas</p>
        </div>
      )}

      <div className="pt-4 mt-auto border-t border-gray-50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Eye size={14} />
          <span>{views_count} vistas</span>
        </div>

        <Link
          to={`/portfolio/${portfolio.id}`}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-[#C8102E] transition-all no-underline"
        >
          Ver Perfil
        </Link>
      </div>
    </div>
  )
}
