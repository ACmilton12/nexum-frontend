import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { Link } from 'react-router-dom'
import { Clock, Briefcase, PlusCircle, Edit, Lock } from 'lucide-react'
import { getFeed, type FeedItem } from '../../../services/feed.service'
import useAuth from '../../../hooks/useAuth'

function timeAgo(dateString: string, t: TFunction): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) return t('feed.time.years', `hace ${Math.floor(interval)} años`, { count: Math.floor(interval) })

  interval = seconds / 2592000
  if (interval > 1) return t('feed.time.months', `hace ${Math.floor(interval)} meses`, { count: Math.floor(interval) })

  interval = seconds / 86400
  if (interval > 1) return t('feed.time.days', `hace ${Math.floor(interval)} días`, { count: Math.floor(interval) })

  interval = seconds / 3600
  if (interval > 1) return t('feed.time.hours', `hace ${Math.floor(interval)} horas`, { count: Math.floor(interval) })

  interval = seconds / 60
  if (interval > 1) return t('feed.time.minutes', `hace ${Math.floor(interval)} minutos`, { count: Math.floor(interval) })

  return t('feed.time.just_now', 'hace un momento')
}

export default function PublicationsFeed() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await getFeed(1, 5) // Fetch top 5 recent activities
        setItems(response.data)
      } catch (err) {
        console.error('Error fetching feed:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeed()
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        {[1, 2].map((i) => (
          <div key={i} className="mb-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="mt-4 h-16 bg-gray-100 rounded-xl"></div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return null; // Hide the section if there's no activity
  }

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {t('feed.title', 'Actividad Reciente')}
          </h2>
        </div>

        <div className="space-y-6 relative">
          {items.map((item, index) => {
            const isBlurred = !user && index > 0;
            return (
              <div key={item.id} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 transition-all ${isBlurred ? 'blur-sm opacity-60 select-none pointer-events-none' : 'hover:shadow-md'}`}>
                <div className="flex items-start justify-between">

                  {/* User Info & Header */}
                  <div className="flex items-center gap-4">
                    <Link to={`/portfolio/${item.user.portfolio_id}`} className="shrink-0">
                      {item.user.avatar_url ? (
                        <img src={item.user.avatar_url} alt={`${item.user.first_name} avatar`} className="w-14 h-14 rounded-full object-cover border-2 border-gray-50 shadow-sm" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-50 shadow-sm">
                          <span className="text-gray-500 font-bold text-xl">
                            {item.user.first_name[0]}{item.user.last_name[0]}
                          </span>
                        </div>
                      )}
                    </Link>

                    <div>
                      <div className="flex items-center gap-2">
                        <Link to={`/portfolio/${item.user.portfolio_id}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                          {item.user.first_name} {item.user.last_name}
                        </Link>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          <Clock size={14} className="text-gray-400" />
                          {timeAgo(item.created_at, t)}
                        </span>
                      </div>

                      {/* Profession below name */}
                      {item.user.profession && (
                        <div className="text-sm text-gray-600 mt-0.5 flex items-center gap-1.5">
                          <Briefcase size={14} className="text-gray-400" />
                          <span className="line-clamp-1">{item.user.profession}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action content */}
                <div className="mt-4 ml-[72px]">
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50 flex items-start gap-3">
                    {item.event === 'created' ? (
                      <div className="bg-blue-100 p-2 rounded-lg shrink-0 mt-0.5">
                        <PlusCircle size={20} className="text-blue-600" />
                      </div>
                    ) : (
                      <div className="bg-emerald-100 p-2 rounded-lg shrink-0 mt-0.5">
                        <Edit size={20} className="text-emerald-600" />
                      </div>
                    )}

                    <div>
                      <p className="text-gray-800 font-medium leading-snug">
                        {item.event === 'created'
                          ? t('feed.event.created', 'Ha creado su nuevo portafolio profesional en Nexum.')
                          : t('feed.event.updated', 'Ha actualizado su perfil profesional. ¡Mira las novedades!')}
                      </p>
                      <Link to={`/portfolio/${item.user.portfolio_id}`} className="inline-block mt-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                        {t('feed.view_profile', 'Ver perfil completo')} →
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}

          {!user && items.length > 1 && (
            <div className="absolute inset-0 top-[200px] flex flex-col items-center justify-center z-10 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent pt-32 pb-10">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center max-w-sm mx-auto animate-fade-in-up">
                <Lock className="w-12 h-12 text-[#003087] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Descubre más talento</h3>
                <p className="text-gray-500 text-sm mb-6">Inicia sesión para ver toda la actividad reciente de nuestros profesionales.</p>
                <Link to="/login" className="inline-block bg-[#003087] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#001A5E] transition-colors shadow-lg w-full">
                  Iniciar sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
