import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, MapPin, Briefcase, Eye } from 'lucide-react'
import type { FeaturedProfile } from '../types'
import { getInitials } from '../utils'

function PortfolioCard({ profile, index }: { profile: FeaturedProfile; index: number }) {
  const { t } = useTranslation()
  const initials = getInitials(profile.first_name, profile.last_name)
  const fullName = `${profile.first_name} ${profile.last_name}`

  const gradients = [
    'from-blue-600 to-indigo-800',
    'from-indigo-600 to-purple-800',
    'from-slate-700 to-slate-900'
  ]
  const bgGradient = gradients[index % gradients.length]

  return (
    <div className="relative rounded-2xl bg-white overflow-hidden flex flex-col h-full border border-gray-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      {/* Banner */}
      <div className={`h-28 w-full relative overflow-hidden bg-gradient-to-br ${bgGradient}`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        {/* Mensaje hint en el banner */}
        <div className="absolute bottom-2 right-3 flex items-center gap-1 text-white/80 text-[10px] font-semibold">
          <span>Presiona la tarjeta para ver el portafolio</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>
      </div>

      <div className="px-6 pb-6 relative flex-1 flex flex-col">
        {/* Avatar */}
        <div className="absolute -top-12 left-6 border-4 border-white rounded-2xl bg-white shadow-xl overflow-hidden">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={fullName} className="w-20 h-20 object-cover" />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center bg-gray-50 text-gray-400 font-bold text-2xl">
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-12 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-extrabold text-xl text-textMain tracking-tight line-clamp-1">
              {fullName}
            </h3>
            <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0" fill="#fff" />
          </div>
          <p className="text-sm font-semibold text-primary/80 mb-3">{t('recent.featured_pro')}</p>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
            <MapPin size={14} className="text-gray-400" />
            <span className="line-clamp-1">{profile.location || 'UMSS · Cochabamba, BO'}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 py-5 border-y border-gray-100 mb-6 bg-gray-50/50 -mx-6 px-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <Briefcase size={12} /> {t('recent.projects')}
            </div>
            <div className="font-black text-2xl text-textMain tracking-tight">{profile.projects_count || 0}</div>
          </div>
          <div className="flex flex-col border-l border-gray-200 pl-4">
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <Eye size={12} /> {t('recent.views')}
            </div>
            <div className="font-black text-2xl text-textMain tracking-tight">
              {profile.visits_count ?? '—'}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-auto flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed border-[#C8102E]/30 text-[#C8102E]/60 text-xs font-semibold">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
          {t('recent.view_portfolio')}
        </div>
      </div>
    </div>
  )
}

function DraggableCarousel({ profiles }: { profiles: FeaturedProfile[] }) {
  const navigate = useNavigate()

  const displayProfiles = profiles.length > 0
    ? Array.from({ length: Math.max(50, profiles.length * 10) }).map((_, i) => profiles[i % profiles.length])
    : []
  const total = displayProfiles.length

  const [progress, setProgress] = useState(2)
  const [isDragging, setIsDragging] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startProgress, setStartProgress] = useState(0)

  useEffect(() => {
    if (isDragging) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= total - 3) return 2
        return prev + 1
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [isDragging, total])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setHasMoved(false)
    setStartX(e.clientX)
    setStartProgress(progress)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const deltaX = e.clientX - startX
    if (!hasMoved && Math.abs(deltaX) < 8) return
    setHasMoved(true)
    let newProgress = startProgress - (deltaX / 150)
    newProgress = Math.max(0, Math.min(total - 1, newProgress))
    setProgress(newProgress)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)

    if (hasMoved) {
      // fue drag, solo redondear
      setProgress(Math.round(progress))
    } else {
      // fue click limpio: navegar al card del frente
      const frontIndex = Math.round(progress)
      const profile = displayProfiles[frontIndex]
      if (profile?.id) {
        navigate(`/portfolio/${profile.id}`)
      }
    }
    setHasMoved(false)
  }

  return (
    <div className="relative w-full py-4 flex justify-center items-center h-[420px] overflow-hidden">
      <style>{`
        .cine-container {
          perspective: 1200px;
          cursor: pointer;
          touch-action: pan-y;
          position: relative;
          width: 320px;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .cine-card {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform var(--speed, 0.8s) cubic-bezier(0.25, 1, 0.5, 1), opacity var(--speed, 0.8s);
          user-select: none;
          pointer-events: none;
        }
        .cine-card.is-front {
          pointer-events: auto;
        }
        .cine-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: #000;
          opacity: var(--shadow-opacity);
          pointer-events: none;
          border-radius: 1rem;
          transition: opacity var(--speed, 0.8s);
        }
        .cine-card > div {
          background: white;
          border-radius: 1rem;
          height: 100%;
          overflow: hidden;
        }
      `}</style>

      <div
        className="cine-container"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ '--speed': isDragging && hasMoved ? '0.05s' : '0.8s' } as React.CSSProperties}
      >
        {displayProfiles.map((p, i) => {
          const diff = i - progress
          const absDiff = Math.abs(diff)
          const sign = Math.sign(diff)
          const isFront = absDiff < 0.5

          const translateX = diff * 150
          const translateZ = -absDiff * 120 + (absDiff === 0 ? 80 : 0)
          let rotateY = 0
          if (absDiff > 0.01) {
            rotateY = sign * -45 * Math.min(absDiff, 1.2)
          }
          const scale = Math.max(1 - absDiff * 0.1, 0.7)
          const zIndex = 100 - Math.round(absDiff * 10)
          const shadowOpacity = Math.min(absDiff * 0.35, 0.8)
          const opacity = absDiff > 3 ? 0 : 1

          return (
            <div
              key={`cine-card-${i}`}
              className={`cine-card shadow-2xl${isFront ? ' is-front' : ''}`}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
                '--shadow-opacity': shadowOpacity,
              } as React.CSSProperties}
            >
              <div>
                <PortfolioCard profile={p} index={i} />
              </div>
            </div>
          )
        })}
      </div>
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
  const { t } = useTranslation()

  return (
    <section className="pt-10 pb-20 sm:pt-14 sm:pb-28 bg-[#ccd4da] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-4 md:mb-8">
          <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-textMain mb-4">
            {t('recent.most_viewed')}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg font-medium">
            {t('recent.subtitle')}
          </p>
        </div>

        {loading ? (
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
        ) : profiles.length === 0 ? (
          <p className="text-center text-gray-400 py-16">
            {t('recent.no_views')}
          </p>
        ) : (
          <DraggableCarousel profiles={profiles} />
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
            {t('home.view_all')}
          </Link>
        </div>
      </div>
    </section>
  )
}