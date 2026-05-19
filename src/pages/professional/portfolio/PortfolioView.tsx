import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Mail,
  Phone,
  MapPin,
  ShieldAlert,
  Clock,
  Eye,
  Edit3,
  User as UserIcon,
  Briefcase,
  Lock,
  Folder,
  Award,
  Download
} from 'lucide-react'
import PLATFORM_ICONS from '../../../components/icons/SocialIcons'
import Sidebar from '../../admin/components/Sidebar'
import Calendar from '../../../components/ui/Calendar'
import Navbar from '../../../components/ui/Navbar'
import PdfTemplateModal from '../../../components/modals/PdfTemplateModal'

import { getPersonalData } from '../../../services/datapersonal.service'
import { getPortfolioSkills } from '../../../services/habilidades.service'
import { getExperiences } from '../../../services/experience.service'
import { getProjects } from '../../../services/project.service'
import { getCertifications } from '../../../services/certification.service'

import { API_BASE_URL } from '../../../utils/constants'
import { useProfileStats } from '../../../hooks/useProfileVisits'

interface PersonalData {
  avatar_url?: string;
  user?: { first_name?: string; last_name?: string; email?: string };
  profession?: string;
  location?: string;
  phone?: string;
  biography?: string;
}

interface TechSkill {
  name: string;
  level: string;
  rawLevel: string;
  description: string;
  type: string;
}

interface Experience {
  role: string;
  company: string;
  period: string;
  status: string;
  description: string;
}

interface Project {
  title: string;
  tags: string[];
  description: string;
  tech: string[];
  year: string;
}

interface Certification {
  title: string;
  tags: string[];
  description: string;
  tech: string[];
}

interface PrivacySettings {
  show_skills: boolean;
  show_experience: boolean;
  show_projects: boolean;
  show_certifications: boolean;
  global_privacy: string;
}

interface AdditionalLink {
  id: number;
  url: string;
  platform: string;
}

const PortfolioView = () => {
  const { t } = useTranslation()
  const [personalData, setPersonalData] = useState<PersonalData | null>(null)
  const [techSkills, setTechSkills] = useState<TechSkill[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [portfolioId, setPortfolioId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    show_skills: true,
    show_experience: true,
    show_projects: true,
    show_certifications: true,
    global_privacy: 'public'
  })
  const [mainLinks, setMainLinks] = useState<{ linkedin: string; github: string }>({ linkedin: '', github: '' })
  const [additionalLinks, setAdditionalLinks] = useState<AdditionalLink[]>([])

  const { stats: profileStats } = useProfileStats(portfolioId)

  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        const portfolioRes = fetch(`${API_BASE_URL}/portfolio`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }).then(r => r.json()).catch(() => ({}))

        const linksRes = fetch(`${API_BASE_URL}/portfolio/links`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }).then(r => r.json()).catch(() => ({}))

        const [personal, skills, exps, projs, certs, portfolioData, linksData] = await Promise.all([
          getPersonalData(),
          getPortfolioSkills(),
          getExperiences(),
          getProjects(),
          getCertifications(),
          portfolioRes,
          linksRes
        ])

        setPersonalData(personal)

        const mappedTech = skills
          .filter((s: { is_active?: boolean | null; status?: string | null }) => s.is_active !== false && s.status !== 'pending' && s.status !== 'rejected')
          .map((s: { name?: string | null; level?: string | null; justification?: string | null; type?: string | null }) => ({
            name: s.name || '',
            level: s.level?.toUpperCase().replace('_', ' ') || 'N/A',
            rawLevel: s.level || '',
            description: s.justification || '',
            type: s.type || 'tecnica'
          }))

        setTechSkills(mappedTech)

        setExperiences(
          exps.map((e: { position?: string | null; company?: string | null; start_date?: string | null; end_date?: string | null; description?: string | null }) => ({
            role: e.position || '',
            company: e.company || '',
            period: `${new Date(e.start_date || '').toLocaleDateString('es-ES', {
              month: 'short',
              year: 'numeric'
            })} - ${e.end_date
              ? new Date(e.end_date).toLocaleDateString('es-ES', {
                month: 'short',
                year: 'numeric'
              })
              : 'Presente'
              }`,
            status: e.end_date ? 'Anterior' : 'Actual',
            description: e.description || ''
          }))
        )

        setProjects(
          projs.map((p: { title?: string | null; category?: { name?: string | null }; description?: string | null; skills?: { name?: string | null }[]; created_at?: string | null }) => ({
            title: p.title || '',
            tags: ['PUBLICADO', p.category?.name || 'GENERAL'],
            description: p.description || '',
            tech: p.skills?.map((s: { name?: string | null }) => s.name || '') || [],
            year: p.created_at ? new Date(p.created_at).getFullYear().toString() : ''
          }))
        )

        setCertifications(
          certs.map((c: { name?: string | null; description?: string | null; issuing_entity?: string | null }) => ({
            title: c.name || '',
            tags: ['VERIFICADO'],
            description: c.description || '',
            tech: c.issuing_entity ? [c.issuing_entity] : []
          }))
        )

        if (portfolioData?.data) {
          if (portfolioData.data.id) setPortfolioId(portfolioData.data.id)
          setPrivacy({
            show_skills: portfolioData.data.show_skills !== false,
            show_experience: portfolioData.data.show_experience !== false,
            show_projects: portfolioData.data.show_projects !== false,
            show_certifications: portfolioData.data.show_certifications !== false,
            global_privacy: portfolioData.data.global_privacy || 'public'
          })
          setMainLinks({
            linkedin: portfolioData.data.linkedin_url || '',
            github: portfolioData.data.github_url || ''
          })
        }

        if (linksData?.data) {
          setAdditionalLinks(linksData.data)
        }
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#003087] dark:border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

          <p className="text-slate-600 dark:text-slate-400 font-medium">Cargando portafolio...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'VISTAS', value: profileStats?.visits_count || 0 }
  ]

  if (privacy.show_projects) stats.push({ label: 'PROYECTOS', value: projects.length })
  if (privacy.show_skills) stats.push({ label: 'TECNOLOGÍAS', value: techSkills.length })
  if (privacy.show_experience) stats.push({ label: 'EXPERIENCIA', value: experiences.length })

  const habilidadesTecnicas = techSkills.filter(s => s.type === 'tecnica')
  const habilidadesBlandas = techSkills.filter(s => s.type !== 'tecnica')

  return (
    <div className="h-full max-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Vista Portafolio" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          {/* CONTENIDO */}
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6 pb-12">
              {privacy.global_privacy === 'private' && (
                <div className="bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl p-4 flex items-start gap-3 shadow-sm">
                  <Lock className="text-amber-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="text-amber-500 font-bold text-sm">Portafolio Privado</h3>
                    <p className="text-slate-400 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                      Actualmente tu portafolio está <span className="font-bold text-slate-600 dark:text-slate-300">oculto al público</span>.
                      Los visitantes no podrán acceder a este enlace. Esta vista es solo para ti.
                    </p>
                  </div>
                </div>
              )}

              {/* HEADER */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="h-40 w-full bg-gradient-to-r from-[#001A5E] via-[#003087] to-[#C8102E] dark:from-slate-900 dark:via-slate-800 dark:to-cyan-900"></div>

                <div className="px-8 pb-8 relative">
                  <div className="absolute -top-12 left-8">
                    {personalData?.avatar_url ? (
                      <img
                        src={
                          personalData.avatar_url.startsWith('http')
                            ? personalData.avatar_url
                            : `${API_BASE_URL.replace('/api', '')}/storage/${personalData.avatar_url}`
                        }
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 uppercase text-3xl font-bold">
                        {personalData?.user?.first_name?.[0]}
                        {personalData?.user?.last_name?.[0] || <UserIcon size={48} />}
                      </div>
                    )}
                  </div>

                  <div className="pt-16 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                        {personalData?.user?.first_name || personalData?.user?.last_name
                          ? `${personalData.user.first_name || ''} ${personalData.user.last_name || ''
                            }`.trim()
                          : 'Usuario Nexum'}
                      </h1>

                      <p className="text-[#003087] dark:text-cyan-400 text-sm font-semibold uppercase tracking-wider mt-1">
                        {personalData?.profession || 'PROFESIONAL'}
                      </p>

                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 dark:text-slate-400 text-xs mt-3">
                        <MapPin size={14} />
                        <span>{personalData?.location || 'Ubicación no especificada'}</span>
                      </div>

                      <div className="flex flex-col gap-3 mt-5">
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs shadow-sm">
                            <Phone size={14} className="text-[#003087] dark:text-cyan-400" />
                            <span>{personalData?.phone || 'Sin teléfono'}</span>
                          </div>

                          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs shadow-sm">
                            <Mail size={14} className="text-[#003087] dark:text-cyan-400" />
                            <span>{personalData?.user?.email || 'Sin email'}</span>
                          </div>
                        </div>

                        {(mainLinks.linkedin || mainLinks.github || additionalLinks.length > 0) && (
                          <div className="flex flex-wrap items-center gap-2.5">
                            {(() => {
                              const linksToRender = [
                                ...(mainLinks.linkedin ? [{ id: 'linkedin', url: mainLinks.linkedin, platform: 'linkedin' }] : []),
                                ...(mainLinks.github ? [{ id: 'github', url: mainLinks.github, platform: 'github' }] : []),
                                ...additionalLinks
                              ];

                              return linksToRender.map(link => {
                                const meta = PLATFORM_ICONS[link.platform?.toLowerCase() || 'website'] || PLATFORM_ICONS.website;
                                return (
                                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" title={link.platform || 'Sitio Web'}
                                    className={`w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 ${meta.color} hover:bg-slate-100 dark:hover:bg-slate-700 ${meta.hoverColor} hover:scale-110 transition-all shadow-sm`}>
                                    {meta.svg}
                                  </a>
                                );
                              });
                            })()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side Actions and Stats Stack */}
                    <div className="flex flex-col items-stretch md:items-end gap-3 w-full md:w-auto self-stretch mt-4 md:mt-0">
                      <button
                        onClick={() => navigate('/profile/personal-data')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#003087] dark:bg-cyan-500 hover:bg-blue-800 dark:hover:bg-cyan-400 text-white dark:text-slate-950 rounded-lg text-xs font-bold transition-all duration-300 shadow-lg w-full md:w-56"
                      >
                        <Edit3 size={14} />
                        Editar Información
                      </button>

                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all duration-300 shadow-lg w-full md:w-56 cursor-pointer border-none"
                      >
                        <Download size={14} />
                        {t('portfolio_view.download_pdf', 'Descargar PDF')}
                      </button>

                      {/* STATS PANEL (Horizontal Row on both Desktop and Mobile) */}
                      <div className="flex flex-wrap md:flex-nowrap gap-2 w-full mt-1 justify-start md:justify-end">
                        {stats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="flex-1 md:flex-initial bg-slate-50 dark:bg-slate-800 rounded-xl p-3 px-4 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm min-w-[90px] md:min-w-[100px]"
                          >
                            <span className="text-xl font-black text-[#003087] dark:text-cyan-400 mb-0.5">
                              {stat.value}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
                              {stat.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACERCA DE MI */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acerca de mí</h2>

                  <button
                    onClick={() => navigate('/profile/personal-data')}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#003087] dark:text-cyan-400 rounded-lg text-xs font-bold transition-all"
                  >
                    <Edit3 size={14} />
                    Editar
                  </button>
                </div>

                <p className="text-[#003087] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                  MI PERFIL PROFESIONAL
                </p>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8">
                  {personalData?.biography || 'Sin biografía disponible.'}
                </p>


              </div>

              {/* HABILIDADES */}
              {privacy.show_skills && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Habilidades</h2>

                    <button
                      onClick={() => navigate('/profile/habilidades')}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#003087] dark:text-cyan-400 rounded-lg text-xs font-bold transition-all"
                    >
                      <Edit3 size={14} />
                      Editar
                    </button>
                  </div>

                  <p className="text-[#003087] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                    TECNOLOGÍAS Y COMPETENCIAS
                  </p>

                  <div className="space-y-8">
                    {/* TÉCNICAS */}
                    <div>
                      <h3 className="text-slate-900 dark:text-white text-sm font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        Habilidades Técnicas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#22d3ee transparent' }}>
                        {habilidadesTecnicas.length > 0 ? (
                          habilidadesTecnicas.map((skill, idx) => (
                            <div
                              key={idx}
                              className="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700"
                            >
                              <div className="flex flex-col pr-4">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">{skill.name}</span>
                                {skill.description && (
                                  <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-[11px] mt-1 line-clamp-1">{skill.description}</span>
                                )}
                              </div>
                              <span className="text-[10px] font-black px-2 py-1 rounded bg-blue-50 dark:bg-cyan-900/50 text-[#003087] dark:text-cyan-300 whitespace-nowrap">
                                {skill.level}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-10 text-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <p className="text-slate-600 dark:text-slate-300 font-bold text-sm mb-1">Sin habilidades técnicas</p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs">Agrega tecnologías a tu perfil.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BLANDAS */}
                    <div>
                      <h3 className="text-slate-900 dark:text-white text-sm font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                        Habilidades Blandas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c084fc transparent' }}>
                        {habilidadesBlandas.length > 0 ? (
                          habilidadesBlandas.map((skill, idx) => (
                            <div
                              key={idx}
                              className="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700"
                            >
                              <div className="flex flex-col pr-4">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">{skill.name}</span>
                                {skill.description && (
                                  <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-[11px] mt-1 line-clamp-1">{skill.description}</span>
                                )}
                              </div>
                              <span className="text-[10px] font-black px-2 py-1 rounded bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 whitespace-nowrap">
                                {skill.level}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-10 text-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <p className="text-slate-600 dark:text-slate-300 font-bold text-sm mb-1">Sin habilidades blandas</p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs">Agrega competencias a tu perfil.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EXPERIENCIA */}
              {privacy.show_experience && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Experiencia</h2>

                    <button
                      onClick={() => navigate('/experiencia')}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#003087] dark:text-cyan-400 rounded-lg text-xs font-bold transition-all"
                    >
                      <Edit3 size={14} />
                      Editar
                    </button>
                  </div>

                  <p className="text-[#003087] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                    TRAYECTORIA LABORAL
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {experiences.length > 0 ? (
                      experiences.map((exp, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-[#003087] dark:border-cyan-400 shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 p-6"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#003087] dark:text-cyan-400">
                              {exp.status}
                            </span>

                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400">{exp.period}</span>
                          </div>

                          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{exp.role}</h3>

                          <p className="text-[#003087] dark:text-cyan-400 text-xs font-bold mb-4">{exp.company}</p>

                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <Briefcase size={32} className="mx-auto text-slate-400 dark:text-slate-500 mb-3" />

                        <p className="text-slate-600 dark:text-slate-300 font-bold text-sm mb-1">
                          Sin trayectoria laboral
                        </p>

                        <p className="text-slate-400 dark:text-slate-500 text-xs">Registra tu experiencia profesional.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PROYECTOS */}
              {privacy.show_projects && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Proyectos</h2>

                    <button
                      onClick={() => navigate('/proyectos')}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#003087] dark:text-cyan-400 rounded-lg text-xs font-bold transition-all"
                    >
                      <Edit3 size={14} />
                      Editar
                    </button>
                  </div>

                  <p className="text-[#003087] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                    PORTAFOLIO DESTACADO
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projects.length > 0 ? (
                      projects.map((project, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-blue-500 shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col"
                        >
                          <div className="flex gap-2 mb-4">
                            {project.tags.map((tag: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="text-[9px] font-black px-2 py-1 rounded-md uppercase bg-slate-100 dark:bg-slate-700 text-[#003087] dark:text-cyan-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">{project.title}</h3>

                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed mb-4 flex-1">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech.map((t: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="bg-slate-100 dark:bg-slate-700 text-[#003087] dark:text-cyan-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 dark:border-slate-600"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          <div className="flex justify-end">
                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                              {project.year}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <Folder size={32} className="mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                        <p className="text-slate-600 dark:text-slate-300 font-bold text-sm mb-1">
                          Sin proyectos destacados
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs">Añade proyectos para mostrar tu trabajo.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CERTIFICACIONES */}
              {privacy.show_certifications && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Certificaciones</h2>

                    <button
                      onClick={() => navigate('/certificaciones')}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#003087] dark:text-cyan-400 rounded-lg text-xs font-bold transition-all"
                    >
                      <Edit3 size={14} />
                      Editar
                    </button>
                  </div>

                  <p className="text-[#003087] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                    LOGROS Y CURSOS COMPLETADOS
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {certifications.length > 0 ? (
                      certifications.map((cert, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-violet-500 shadow-lg hover:-translate-y-1 transition-all duration-300 p-6"
                        >
                          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">{cert.title}</h3>

                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed mb-4">
                            {cert.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {cert.tech.map((t: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="bg-slate-100 dark:bg-slate-700 text-violet-700 dark:text-violet-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 dark:border-slate-600"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <Award size={32} className="mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                        <p className="text-slate-600 dark:text-slate-300 font-bold text-sm mb-1">
                          Sin certificaciones
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs">Registra tus logros y cursos completados.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR DERECHO */}
          <aside className="w-full lg:w-72 p-6 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 shrink-0 overflow-y-auto">
            <div className="sticky top-6">
              <Calendar />

              <div className="mt-8">
                <h3 className="font-bold text-slate-900 dark:text-white text-[11px] mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <ShieldAlert size={14} className="text-[#003087] dark:text-cyan-400" />
                  NOTIFICACIONES
                </h3>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <Clock size={14} className="text-[#003087] dark:text-cyan-400" />
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-white">Precarga automática</span> de datos
                    registrados.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-bold text-slate-900 dark:text-white text-[11px] mb-4 uppercase tracking-widest">
                  Enlaces rápidos
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg group-hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <Edit3 size={14} className="text-slate-400 dark:text-slate-400 group-hover:text-[#003087] dark:group-hover:text-cyan-400" />
                    </div>

                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-[#003087] dark:hover:text-white transition-colors">
                      {t('portfolio_view.configure_profile')}
                    </span>
                  </div>

                  {portfolioId && (
                    <Link to={`/portfolio/${portfolioId}`} className="flex items-center gap-3 group cursor-pointer no-underline">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg group-hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <Eye size={14} className="text-slate-400 dark:text-slate-400 group-hover:text-[#003087] dark:group-hover:text-cyan-400" />
                      </div>

                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-[#003087] dark:hover:text-white transition-colors">
                        {t('portfolio_view.public_view')}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
      <PdfTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        portfolioId={portfolioId}
      />
    </div>
  )
}

export default PortfolioView
