import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Eye, MapPin, CheckCircle2, ChevronRight } from "lucide-react";
import type { FeaturedProfile } from "../types";
import { getInitials } from "../utils";
import { useProfileStats } from "../../../hooks/useProfileVisits";

const accentColors = ['#003087', '#C8102E', '#001A5E']

function PortfolioCard({ profile, index }: { profile: FeaturedProfile; index: number }) {
  const accentColor = accentColors[index % accentColors.length];
  const initials = getInitials(profile.first_name, profile.last_name);
  const fullName = `${profile.first_name} ${profile.last_name}`;

  const portfolioIdToUse = profile.portfolio_id || profile.id || profile.user_id || null;
  const { stats, loading: statsLoading } = useProfileStats(portfolioIdToUse);

  const displayVisits = stats?.visits_count ?? profile.visits_count ?? 0;

  return (
    <div className="relative rounded-2xl bg-white overflow-hidden flex flex-col h-full border border-gray-100 group shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Banner Superior */}
      <div
        className="h-20 w-full relative"
        style={{
          backgroundColor: accentColor,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="px-6 pb-6 relative flex-1 flex flex-col">
        {/* Avatar */}
        <div className="absolute -top-10 left-6 border-4 border-white rounded-full bg-white shadow-sm">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={fullName} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: accentColor }}>
              {initials}
            </div>
          )}
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
            <CheckCircle2 size={16} className="text-blue-500" fill="#fff" />
          </div>
        </div>

        {/* Info */}
        <div className="mt-10 mb-5">
          <h3 className="font-extrabold text-lg text-gray-900 leading-tight mb-1">
            {fullName}
          </h3>
          <p className="text-sm font-semibold mb-2" style={{ color: accentColor }}>
            Profesional Destacado
          </p>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
            <MapPin size={12} />
            {profile.location || "UMSS · Cochabamba, BO"}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex items-center gap-4 py-4 border-y border-gray-100/80 mb-5 bg-gray-50/50 -mx-6 px-6">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Briefcase size={12} /> Proyectos
            </div>
            <div className="font-black text-xl text-gray-800">{profile.projects_count || 0}</div>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Eye size={12} /> Visitas
            </div>
            <div className="font-black text-xl text-gray-800">
              {statsLoading ? (
                <span className="text-gray-300 text-sm animate-pulse">...</span>
              ) : (
                displayVisits
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link
            to={`/portfolio/${portfolioIdToUse}`}
            className="w-full flex items-center justify-center gap-2 font-bold text-sm py-2.5 rounded-xl transition-all duration-300 no-underline text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: accentColor }}
          >
            <span>Ver portafolio</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function DraggableCarousel({ profiles }: { profiles: FeaturedProfile[] }) {
  const displayProfiles = profiles.length > 0
    ? Array.from({ length: Math.max(50, profiles.length * 10) }).map((_, i) => profiles[i % profiles.length])
    : [];
  const total = displayProfiles.length;

  const [progress, setProgress] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startProgress, setStartProgress] = useState(0);

  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= total - 3) return 2;
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isDragging, total]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartProgress(progress);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    let newProgress = startProgress - (deltaX / 150);
    newProgress = Math.max(0, Math.min(total - 1, newProgress));
    setProgress(newProgress);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    setProgress(Math.round(progress));
  };

  return (
    <div className="relative w-full py-16 flex justify-center items-center h-[600px] overflow-hidden">
      <style>{`
        .cine-container {
          perspective: 1200px;
          cursor: grab;
          touch-action: pan-y;
          position: relative;
          width: 320px;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .cine-container:active { cursor: grabbing; }
        .cine-card {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform var(--speed, 0.8s) cubic-bezier(0.25, 1, 0.5, 1), opacity var(--speed, 0.8s);
          user-select: none;
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
        style={{ '--speed': isDragging ? '0.05s' : '0.8s' } as React.CSSProperties}
      >
        {displayProfiles.map((p, i) => {
          const diff = i - progress;
          const absDiff = Math.abs(diff);
          const sign = Math.sign(diff);

          const translateX = diff * 150;
          const translateZ = -absDiff * 120 + (absDiff === 0 ? 80 : 0);
          let rotateY = 0;
          if (absDiff > 0.01) {
            rotateY = sign * -45 * Math.min(absDiff, 1.2);
          }
          const scale = Math.max(1 - absDiff * 0.1, 0.7);
          const zIndex = 100 - Math.round(absDiff * 10);
          const shadowOpacity = Math.min(absDiff * 0.35, 0.8);
          const opacity = absDiff > 3 ? 0 : 1;

          return (
            <div
              key={`cine-card-${i}`}
              className="cine-card shadow-2xl"
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
                '--shadow-opacity': shadowOpacity,
              } as React.CSSProperties}
            >
              <div style={{ pointerEvents: (isDragging || absDiff >= 0.5) ? 'none' : 'auto' }}>
                <PortfolioCard profile={p} index={i} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Componente principal ───────────────────────────────────────

export default function RecentPortfolios({
  profiles,
  loading
}: {
  profiles: FeaturedProfile[]
  loading: boolean
}) {
  // Ordenar por visitas descendente y tomar los 5 primeros
  const top5 = useMemo(() => {
    return [...profiles]
      .sort((a, b) => (b.visits_count ?? 0) - (a.visits_count ?? 0))
      .slice(0, 5);
  }, [profiles]);

  return (
    <section className="py-24" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-extrabold text-3xl lg:text-4xl mb-4" style={{ color: '#1A1A2E' }}>
            Portafolios más visitados
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Los 5 profesionales con más visitas en la plataforma.
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
        ) : top5.length === 0 ? (
          <p className="text-center text-gray-400 py-16">
            Aún no hay portafolios con visitas registradas.
          </p>
        ) : (
          <DraggableCarousel profiles={top5} />
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
  );
}
