import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import type { FeaturedProfile } from '../types'
import { getInitials } from '../utils'

export default function SuggestedProfilesWidget({ profiles }: { profiles: FeaturedProfile[] }) {
  if (!profiles || profiles.length === 0) return null;

  // Tomamos hasta 3 perfiles al azar o los primeros 3
  const displayProfiles = profiles.slice(0, 3)

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 sticky top-24">
      <div className="flex items-center gap-2 mb-5">
        <Users className="text-[#003087]" size={20} />
        <h3 className="font-bold text-gray-900 text-lg">Sugerencias</h3>
      </div>
      
      <div className="space-y-5">
        {displayProfiles.map(profile => {
          const initials = getInitials(profile.first_name, profile.last_name)
          const fullName = `${profile.first_name} ${profile.last_name}`
          
          return (
            <div key={profile.id} className="flex gap-3 items-start group">
              <Link to={`/portfolio/${profile.id}`} className="shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={fullName} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-gray-100">
                    {initials}
                  </div>
                )}
              </Link>
              
              <div className="flex-1 min-w-0">
                <Link to={`/portfolio/${profile.id}`} className="font-bold text-sm text-gray-900 hover:text-[#003087] transition-colors block truncate">
                  {fullName}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      
      <Link to="/directorio" className="block text-center mt-5 text-sm font-bold text-[#003087] hover:text-[#001A5E] hover:underline">
        Ver todos
      </Link>
    </div>
  )
}
