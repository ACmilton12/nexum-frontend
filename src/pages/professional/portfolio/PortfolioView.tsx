import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Link as LinkIcon,
  Folder,
  Award
} from 'lucide-react'

import Navbar from '../../../components/ui/Navbar'

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
)

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const GitlabIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 5.11 2a.43.43 0 0 1 .4.27l2.89 8.89h7.2l2.89-8.89a.43.43 0 0 1 .4-.27.42.42 0 0 1 .4.22l2.44 7.51 1.22 3.78a.84.84 0 0 1-.3.94Z" />
  </svg>
)

const FigmaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5zM12 2h3.5a3.5 3.5 0 1 1 0 7H12V2zM5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5zM12 9h3.5a3.5 3.5 0 1 1 0 7H12V9zM8.5 16A3.5 3.5 0 1 1 8.5 23a3.5 3.5 0 0 1 0-7z" />
  </svg>
)

const DribbbleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm8.653-7.587c-1.393-.974-3.184-1.74-5.283-2.12-.34 1.054-.74 2.146-1.21 3.25 1.547.464 2.87 1.134 3.916 1.954 1.09-1.285 1.902-2.923 2.577-3.084zm-3.805 3.766c-.95-.744-2.16-1.353-3.585-1.782-.95 1.91-2.07 3.65-3.326 5.152 2.15.547 4.457.345 6.368-.624.16-.08.34-.183.543-.274L16.848 20.18zm-8.823-1.026c1.196-1.42 2.274-3.07 3.19-4.887-2.31-.476-4.9-.623-7.61-.416.516 2.145 1.848 4.015 3.71 5.12l.71.183zM2.08 11.23c2.97-.247 5.82-.046 8.35.535.45-1.066.86-2.164 1.22-3.29-2.73-1.004-5.7-1.405-8.73-1.16-.36.984-.575 2.05-.575 3.155 0 .26.015.518.046.772l-.31-.012zm10.155-8.7c-2.37.525-4.417 1.83-5.83 3.6 2.86-.237 5.67.147 8.24 1.096-.94-1.63-2.02-3.12-3.2-4.524l.79-.173zm4.562 2.37c1.11 1.34 2.08 2.8 2.89 4.35 1.63 3.11 2.3 6.64 1.98 10.14-1.45.69-3.06 1.14-4.73 1.3-1.07-.85-2.43-1.55-4-2.05.5-1.14.93-2.27 1.28-3.37 2.27.42 4.2.5 5.7.16 2.14-.49 3.97-1.6 5.25-3.13 1.29-1.52 2-3.4 2-5.4 0-2.3-.9-4.52-2.52-6.17-1.63-1.66-3.86-2.6-6.17-2.6-1.5 0-2.97.4-4.3 1.15z" />
  </svg>
)

const BehanceIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 7h-7v2h7V7zM11.5 14.5c0-3-2.5-5.5-5.5-5.5H0v14h6c3 0 5.5-2.5 5.5-5.5zm-5.5-3v2H4v-2h2c1.1 0 2 .9 2 2s-.9 2-2 2H4v2h2c1.1 0 2-.9 2-2s-.9-2-2-2H4v-2h2zM24 15.5c0-3-2.5-5.5-5.5-5.5s-5.5 2.5-5.5 5.5 2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5zm-8-1.5h5c0-1.1-.9-2-2-2s-2 .9-2 2zm2 4c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z" />
  </svg>
)

const VercelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 22.525H0l12-21.05 12 21.05z" />
  </svg>
)

const NetlifyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.8 24l-3-6.1L.5 15l6.5-.4-2.8-5L9 9v15h-3.2zM21 0l-3.3 5.4-6.4-1-.5 10.6H23l-2-15zm-9.3 16H1l6.7-7L9 6v10zm1.7-1.1V4h8.3l-8.3 10.9zM23.5 16h-11l5-8.5L23.5 16z" />
  </svg>
)

const BitbucketIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.78 2.45L2.9 21.46c.07.64.6 1.14 1.25 1.14h15.7c.65 0 1.18-.5 1.25-1.14l2.12-19.01a1.27 1.27 0 0 0-1.25-1.4H2.03a1.27 1.27 0 0 0-1.25 1.4zm13.97 12.1H9.25l-1.35-7.53h8.2l-1.35 7.53z" />
  </svg>
)

const MediumIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
)

const DevToIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41-.01.73-.08.96-.2.4-.21.62-.48.62-1.03 0-.58-.22-.92-.78-1.41zm15.65-4.8v13.5c0 1.05-.85 1.9-1.9 1.9H2.9A1.9 1.9 0 0 1 1 18.75V5.25C1 4.2 1.85 3.35 2.9 3.35h18.27c1.05 0 1.9.85 1.9 1.9zm-18.9 9.9c0 .7.56 1.45 1.3 1.86.5.28 1.17.41 2.37.41.92 0 1.62-.1 2.05-.28l.06-.04V15h-1.63v.8c-.37.1-.9.1-1.34.1-.73 0-1.1-.17-1.3-.4-.2-.23-.28-.68-.28-1.5V11c0-.98.08-1.4.3-1.65.22-.24.63-.35 1.36-.35.48 0 .84.05 1.24.16V8.14A3.94 3.94 0 0 0 6.66 8c-1.37 0-2.22.25-2.68.75-.45.48-.68 1.13-.68 2.22v4.18zm8.68-1.5h-2V15h2v1.5h-4.32V8.1h4.2v1.5h-1.94v2.06h1.96l.1 1.5zm6.53-2.65c0-.98-.22-1.57-.75-1.97-.55-.42-1.28-.58-2.52-.58H14v6.6h2.2c1.23 0 1.95-.15 2.5-.58.55-.4.76-.98.76-1.98v-1.5z" />
  </svg>
)

const PLATFORM_ICONS: Record<string, { svg: React.ReactNode; color: string; hoverColor: string }> = {
  github: { svg: <GithubIcon />, color: 'text-slate-600 dark:text-slate-300', hoverColor: 'hover:text-[#003087] dark:hover:text-white' },
  linkedin: { svg: <LinkedinIcon />, color: 'text-[#0077b5]', hoverColor: 'hover:text-[#00a0dc]' },
  gitlab: { svg: <GitlabIcon />, color: 'text-[#fc6d26]', hoverColor: 'hover:text-[#fd8c52]' },
  figma: { svg: <FigmaIcon />, color: 'text-[#F24E1E]', hoverColor: 'hover:text-[#f26e47]' },
  dribbble: { svg: <DribbbleIcon />, color: 'text-[#EA4C89]', hoverColor: 'hover:text-[#f082ac]' },
  behance: { svg: <BehanceIcon />, color: 'text-[#1769ff]', hoverColor: 'hover:text-[#4d8eff]' },
  vercel: { svg: <VercelIcon />, color: 'text-slate-900 dark:text-slate-100', hoverColor: 'hover:text-[#003087] dark:hover:text-white' },
  netlify: { svg: <NetlifyIcon />, color: 'text-[#00C7B7]', hoverColor: 'hover:text-[#00E5D3]' },
  bitbucket: { svg: <BitbucketIcon />, color: 'text-[#0052CC]', hoverColor: 'hover:text-[#2684FF]' },
  medium: { svg: <MediumIcon />, color: 'text-slate-900 dark:text-slate-100', hoverColor: 'hover:text-[#003087] dark:hover:text-white' },
  devto: { svg: <DevToIcon />, color: 'text-slate-900 dark:text-slate-100', hoverColor: 'hover:text-[#003087] dark:hover:text-white' },
  kaggle: { svg: <span className="font-black text-[12px] italic leading-none">k</span>, color: 'text-[#20BEFF]', hoverColor: 'hover:text-[#4bd1ff]' },
  huggingface: { svg: <span className="font-bold text-[12px] leading-none tracking-tighter">HF</span>, color: 'text-[#FFD21E]', hoverColor: 'hover:text-[#ffde53]' },
  heroku: { svg: <span className="font-bold text-[10px] leading-none uppercase">Hrk</span>, color: 'text-[#430098]', hoverColor: 'hover:text-[#6a34ba]' },
  website: { svg: <LinkIcon size={14} />, color: 'text-[#003087] dark:text-cyan-400', hoverColor: 'hover:text-[#003087] dark:text-cyan-300' },
}

import Sidebar from '../../admin/components/Sidebar'
import Calendar from '../../../components/ui/Calendar'

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
            })} - ${
              e.end_date
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
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
                    <p className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
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
                          ? `${personalData.user.first_name || ''} ${
                              personalData.user.last_name || ''
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

                    <button
                      onClick={() => navigate('/profile/personal-data')}
                      className="flex items-center gap-2 px-4 py-2 bg-[#003087] dark:bg-cyan-500 hover:bg-blue-800 dark:hover:bg-cyan-400 text-white dark:text-slate-950 rounded-lg text-xs font-bold transition-all duration-300 shadow-lg"
                    >
                      <Edit3 size={14} />
                      Editar Información
                    </button>
                  </div>
                </div>
              </div>

              {/* ESTADÍSTICAS GLOBALES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 shadow-xl"
                  >
                    <span className="text-3xl font-black text-[#003087] dark:text-cyan-400 mb-1">{stat.value}</span>

                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">
                      {stat.label}
                    </span>
                  </div>
                ))}
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
                      <Edit3 size={14} className="text-slate-400 dark:text-slate-500 dark:text-slate-400 group-hover:text-[#003087] dark:text-cyan-400" />
                    </div>

                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-[#003087] dark:hover:text-white transition-colors">
                      Configurar perfil
                    </span>
                  </div>

                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg group-hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <Eye size={14} className="text-slate-400 dark:text-slate-500 dark:text-slate-400 group-hover:text-[#003087] dark:text-cyan-400" />
                    </div>

                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-[#003087] dark:hover:text-white transition-colors">
                      Vista pública del perfil
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default PortfolioView
