import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, Briefcase, Eye } from 'lucide-react'
import type { SearchResult } from '../../../services/search.service'
import { useProfileStats } from '../../../hooks/useProfileVisits'
import useAuth from '../../../hooks/useAuth'


interface PortfolioCardProps {
  portfolio: SearchResult
  isInternal?: boolean
}

export default function PortfolioCard({ portfolio, isInternal = false }: PortfolioCardProps) {
  const { t } = useTranslation()
  const { user, profession, location, avatar_url, skills, views_count } = portfolio
  const fullName = `${user.first_name} ${user.last_name}`
  const { user: currentUser } = useAuth()
  const isMyProfile = currentUser?.id === user.id

  // Obtener estadísticas reales del backend
  const { stats } = useProfileStats(portfolio.id)
  const displayVisits = stats?.visits_count ?? views_count ?? 0


  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <div className="flex items-start gap-4 mb-6">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-50 dark:border-slate-700 shadow-inner group-hover:scale-105 transition-transform duration-500">
            {avatar_url ? (
              <img src={avatar_url} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#C8102E] flex items-center justify-center text-white text-2xl font-bold">
                {user.first_name[0]}
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-slate-800 rounded-full"></div>
        </div>

        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">{fullName}</h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Briefcase size={14} className="text-[#C8102E]" />
            <span className="truncate">{profession || t('portfolio_card.default_profession')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <MapPin size={14} />
            <span className="truncate">{location || t('portfolio_card.default_location')}</span>
          </div>
        </div>
      </div>

      {skills && skills.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-6 flex-grow">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-gray-100 dark:border-slate-800"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium py-1">
              {t('portfolio_card.more_skills', { count: skills.length - 4 })}
            </span>
          )}
        </div>
      ) : (
        <div className="mb-6 flex-grow">
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">{t('portfolio_card.no_skills')}</p>
        </div>
      )}

      <div className="pt-4 mt-auto border-t border-gray-50 dark:border-slate-700/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs">
          <Eye size={14} />
          <span>{t('portfolio_card.views', { count: displayVisits })}</span>
        </div>


        <Link
          to={isInternal ? `/directorio/perfil/${portfolio.id}` : `/portfolio/${portfolio.id}`}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all no-underline ${
            isMyProfile
              ? 'bg-[#003087] text-white hover:bg-[#002266]'
              : 'bg-gray-900 dark:bg-slate-700 text-white dark:text-gray-100 hover:bg-[#C8102E] dark:hover:bg-[#C8102E]'
          }`}
        >
          {isMyProfile ? t('portfolio_card.my_profile') : t('portfolio_card.view_profile')}
        </Link>
      </div>
    </div>
  )
}
