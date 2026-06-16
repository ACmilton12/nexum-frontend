import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Mail,
  Phone,
  MapPin,
  Edit3,
  User as UserIcon,
  Briefcase,
  Lock,
  Folder,
  Award,
  Download,
  X,
  Share2
} from 'lucide-react'
import PLATFORM_ICONS from '../../../components/icons/SocialIcons'
import Sidebar from '../../admin/components/Sidebar'
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
  id: number;
  name: string;
  level: string;
  rawLevel: string;
  category: string;
  type: string;
}

interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  status: string;
  description: string;
  skills?: {
    id: number;
    name: string;
  }[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  category?: {
    name: string;
  };
  skills?: {
    id: number;
    name: string;
  }[];
  files?: any[];
  project_url?: string;
  year: string;
}

interface Certification {
  id: number;
  title: string;
  description: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date?: string;
  image_url?: string;
  credential_url?: string;
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

const parseIssuingEntity = (issuingEntity?: string | null) => {
  if (!issuingEntity) return { issuing_organization: 'N/A', credential_url: undefined };
  if (issuingEntity.startsWith('http://') || issuingEntity.startsWith('https://')) {
    try {
      const url = new URL(issuingEntity);
      return {
        issuing_organization: url.hostname.replace('www.', ''),
        credential_url: issuingEntity
      };
    } catch {
      return {
        issuing_organization: issuingEntity,
        credential_url: issuingEntity
      };
    }
  }
  return {
    issuing_organization: issuingEntity,
    credential_url: undefined
  };
};

const formatExpDate = (dateStr: string | null | undefined, locale: string) => {
  if (!dateStr) return '';
  // Handle YYYY-MM format (e.g. "2024-03")
  const ymMatch = dateStr.match(/^(\d{4})-(\d{2})$/);
  if (ymMatch) {
    const date = new Date(parseInt(ymMatch[1]), parseInt(ymMatch[2]) - 1, 1);
    const formatted = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  // Handle YYYY-MM-DD
  const ymdMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymdMatch) {
    const date = new Date(parseInt(ymdMatch[1]), parseInt(ymdMatch[2]) - 1, parseInt(ymdMatch[3]));
    const formatted = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  return dateStr;
};

const formatCertDate = (dateStr: string | null | undefined, locale: string) => {
  if (!dateStr) return '';
  let formatted = dateStr;
  const match = dateStr.match(/^(\d{1,2})\/(\d{4})$/);
  if (match) {
    const month = parseInt(match[1]) - 1;
    const year = parseInt(match[2]);
    const date = new Date(year, month, 1);
    formatted = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
  } else {
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        formatted = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
      }
    } catch (e) {
      console.error(e);
    }
  }
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const PortfolioView = () => {
  const { t, i18n } = useTranslation()
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
  const [imagePreviewCert, setImagePreviewCert] = useState<Certification | null>(null)

  const handleShareProfile = async () => {
    if (!portfolioId) return;
    const url = `${window.location.origin}/portfolio/${portfolioId}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      alert(t('portfolio_view.share_success', '¡Enlace de tu portafolio copiado al portapapeles!'));
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Error al copiar el enlace');
    }
  }

  const getTranslatedLevel = (level: string) => {
    if (!level) return '';
    const normalized = level.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return t(`skills.levels.${normalized}`, level);
  }

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
          .filter((s: { is_active?: boolean | null; status?: string | null }) =>
            s.is_active !== false &&
            s.status !== 'pending' &&
            s.status !== 'rejected' &&
            s.status !== 'disabled'
          )
          .map((s: {
            id: number
            name?: string | null
            level?: string | null
            category?: string | null
            type?: string | null
          }) => ({
            id: s.id,
            name: s.name || '',
            level: s.level?.toUpperCase().replace('_', ' ') || 'N/A',
            rawLevel: s.level || '',
            category: s.category || '',
            type: s.type || 'tecnica'
          }))

        setTechSkills(mappedTech)

        setExperiences(
          exps
            .filter((e: any) => e.is_active !== false)
            .map((e: { id: number; position?: string | null; company?: string | null; start_date?: string | null; end_date?: string | null; description?: string | null; skills?: { id: number; name?: string | null }[] }) => ({
              id: e.id,
              role: e.position || '',
              company: e.company || '',
              period: `${formatExpDate(e.start_date, i18n.language)} - ${e.end_date
                ? formatExpDate(e.end_date, i18n.language)
                : t('portfolio_view.present')
                }`,
              status: e.end_date ? t('portfolio_view.previous') : t('portfolio_view.actual'),
              description: e.description || '',
              skills: e.skills?.map((s: { id: number; name?: string | null }) => ({
                id: s.id,
                name: s.name || ''
              })) || []
            }))
        )

        setProjects(
          projs.map((p: { id: number; title?: string | null; category?: { name?: string | null }; description?: string | null; skills?: { id: number; name?: string | null }[]; project_url?: string | null; created_at?: string | null }) => ({
            id: p.id,
            title: p.title || '',
            category: p.category ? { name: p.category.name || 'GENERAL' } : undefined,
            description: p.description || '',
            skills: p.skills?.map((s: { id: number; name?: string | null }) => ({
              id: s.id,
              name: s.name || ''
            })) || [],
            project_url: p.project_url || undefined,
            year: p.created_at ? new Date(p.created_at).getFullYear().toString() : ''
          }))
        )

        setCertifications(
          certs
            .filter((c: any) => c.is_active !== false)
            .map((c: { id: number; name?: string | null; description?: string | null; issuing_entity?: string | null; issue_date?: string | null; expiration_date?: string | null; image_url?: string | null }) => {
              const parsed = parseIssuingEntity(c.issuing_entity);
              return {
                id: c.id,
                title: c.name || '',
                description: c.description || '',
                issuing_organization: parsed.issuing_organization,
                credential_url: parsed.credential_url,
                issue_date: c.issue_date || '',
                expiration_date: c.expiration_date || undefined,
                image_url: c.image_url || undefined
              };
            })
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
  }, [i18n, t])

  const SkeletonPulse = ({ className }: { className: string }) => (
    <div className={`bg-slate-200 dark:bg-slate-800 animate-pulse ${className}`} />
  )

  const stats = [
    { label: t('portfolio_view.stats_views'), value: profileStats?.visits_count || 0 }
  ]

  if (privacy.show_projects) stats.push({ label: t('portfolio_view.stats_projects'), value: projects.length })
  if (privacy.show_skills) stats.push({ label: t('portfolio_view.stats_tech'), value: techSkills.length })
  if (privacy.show_experience) stats.push({ label: t('portfolio_view.stats_exp'), value: experiences.length })

  const habilidadesTecnicas = techSkills.filter((s) => s.type === 'tecnica')
  const habilidadesBlandas = techSkills.filter((s) => s.type === 'blanda')

  return (
    <div className="h-full max-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Vista Portafolio" />

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6 pb-12">
            {/* HEADER CARD - MATCHING OTHERS */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              {/* Banner */}
              <div className="h-48 md:h-64 w-full bg-gradient-to-r from-[#001A5E] via-[#003087] to-[#C8102E] dark:from-slate-900 dark:via-slate-800 dark:to-cyan-900"></div>

              {/* Content container */}
              <div className="px-6 md:px-8 pb-8 relative pt-6 md:pt-3">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 w-full">
                
                {/* Left Side: Avatar + Details in a horizontal flex layout on desktop */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full md:w-auto">
                  {/* Avatar wrapper with negative margin to overlap banner */}
                  <div className="-mt-16 md:-mt-20 shrink-0 z-10">
                    {loading ? (
                      <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 animate-pulse shadow-lg" />
                    ) : personalData?.avatar_url ? (
                      <img
                        src={
                          personalData.avatar_url.startsWith('http')
                            ? personalData.avatar_url
                            : `${API_BASE_URL.replace('/api', '')}/storage/${personalData.avatar_url}`
                        }
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 object-cover shadow-lg bg-white dark:bg-slate-950"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 uppercase text-3xl font-bold shadow-lg">
                        {personalData?.user?.first_name?.[0]}
                        {personalData?.user?.last_name?.[0] || <UserIcon size={48} />}
                      </div>
                    )}
                  </div>

                  {/* Info details */}
                  <div className="text-center md:text-left flex-grow">
                    {loading ? (
                      <div className="space-y-3 max-w-md mx-auto md:mx-0">
                        <SkeletonPulse className="w-64 h-8 rounded-lg mx-auto md:mx-0" />
                        <SkeletonPulse className="w-40 h-4 rounded-lg mx-auto md:mx-0" />
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                          <SkeletonPulse className="w-4 h-4 rounded-full" />
                          <SkeletonPulse className="w-32 h-3 rounded-lg" />
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                          <SkeletonPulse className="w-28 h-8 rounded-lg" />
                          <SkeletonPulse className="w-36 h-8 rounded-lg" />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                          {personalData?.user?.first_name || personalData?.user?.last_name
                            ? `${personalData.user.first_name || ''} ${personalData.user.last_name || ''}`.trim()
                            : t('portfolio_view.user_default')}
                        </h1>

                        <p className="text-[#003087] dark:text-cyan-400 text-sm font-semibold uppercase tracking-wider mt-1">
                          {personalData?.profession || t('portfolio_view.professional')}
                        </p>

                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 dark:text-slate-500 text-xs mt-2">
                          <MapPin size={14} />
                          <span>{personalData?.location || t('portfolio_view.location_unspecified')}</span>
                        </div>

                        <div className="flex flex-col gap-3 mt-3">
                          <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs shadow-sm">
                              <Phone size={14} className="text-[#003087] dark:text-cyan-400" />
                              <span>{personalData?.phone || t('portfolio_view.no_phone')}</span>
                            </div>

                            {personalData?.user?.email && (
                              <a
                                href={`mailto:${personalData.user.email}`}
                                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs shadow-sm no-underline hover:border-[#003087] dark:hover:border-cyan-400 transition-colors"
                              >
                                <Mail size={14} className="text-[#003087] dark:text-cyan-400" />
                                <span>{personalData.user.email}</span>
                              </a>
                            )}
                          </div>

                          {(mainLinks.linkedin || mainLinks.github || additionalLinks.length > 0) && (
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2.5">
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
                    )}
                  </div>
                </div>

                {/* Right Side: Actions and Stats Stack */}
                {loading ? (
                  <div className="flex flex-col items-stretch md:items-end gap-3 w-full md:w-auto self-stretch mt-4 md:mt-0">
                    <SkeletonPulse className="h-8 rounded-lg w-full md:w-56" />
                    <SkeletonPulse className="h-8 rounded-lg w-full md:w-56" />
                    <div className="flex gap-2 w-full mt-1 justify-start md:justify-end">
                      {[1, 2, 3, 4].map(n => (
                        <div key={n} className="flex-grow md:flex-initial bg-slate-50 dark:bg-slate-800 rounded-xl p-3 px-4 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm min-w-[90px] md:min-w-[100px] gap-2">
                          <SkeletonPulse className="w-8 h-6 rounded" />
                          <SkeletonPulse className="w-12 h-2.5 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-stretch md:items-end gap-3 w-full md:w-auto self-stretch mt-4 md:mt-0">
                    <button
                      onClick={() => navigate('/profile/personal-data')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#003087] dark:bg-cyan-500 hover:bg-blue-800 dark:hover:bg-cyan-400 text-white dark:text-slate-950 rounded-lg text-xs font-bold transition-all duration-300 shadow-lg w-full md:w-56 cursor-pointer border-none"
                    >
                      <Edit3 size={14} />
                      {t('portfolio_view.edit_info')}
                    </button>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#003087] dark:bg-[#003087] hover:bg-blue-800 dark:hover:bg-blue-850 text-white rounded-lg text-xs font-bold transition-all duration-300 shadow-lg w-full md:w-56 cursor-pointer border-none"
                    >
                      <Download size={14} />
                      {t('portfolio_view.download_pdf')}
                    </button>

                    <button
                      onClick={handleShareProfile}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#003087] dark:text-cyan-400 border border-[#003087] dark:border-cyan-400 rounded-lg text-xs font-bold transition-all duration-300 shadow-sm w-full md:w-56 cursor-pointer"
                    >
                      <Share2 size={14} />
                      {t('portfolio_view.share_profile', 'Compartir perfil')}
                    </button>

                    {/* STATS PANEL */}
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
                )}
              </div>
            </div>
          </div>

          {/* REST OF CARDS */}
            {!loading && privacy.global_privacy === 'private' && (
              <div className="bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl p-4 flex items-start gap-3 shadow-sm">
                <Lock className="text-amber-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-amber-500 font-bold text-sm">{t('portfolio_view.private_warning_title')}</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 leading-relaxed">
                    {t('portfolio_view.private_warning_desc')}
                  </p>
                </div>
              </div>
            )}

            {/* ACERCA DE MI */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('portfolio_view.about_me')}</h2>

                {!loading && (
                  <button
                    onClick={() => navigate('/profile/personal-data')}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#003087] dark:text-cyan-400 rounded-lg text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
                  >
                    <Edit3 size={14} />
                    {t('portfolio_view.edit')}
                  </button>
                )}
              </div>

              <p className="text-[#003087] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                {t('portfolio_view.my_profile')}
              </p>

              {loading ? (
                <div className="space-y-3 py-2">
                  <SkeletonPulse className="w-full h-4 rounded" />
                  <SkeletonPulse className="w-full h-4 rounded" />
                  <SkeletonPulse className="w-3/4 h-4 rounded" />
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {personalData?.biography || t('portfolio_view.no_bio')}
                </p>
              )}
            </div>

            {/* HABILIDADES */}
            {privacy.show_skills && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('portfolio_view.skills_title')}</h2>

                  <button
                    onClick={() => navigate('/profile/habilidades')}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#003087] dark:text-cyan-400 rounded-lg text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
                  >
                    <Edit3 size={14} />
                    {t('portfolio_view.edit')}
                  </button>
                </div>

                <p className="text-[#003087] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                  {t('portfolio_view.skills_subtitle')}
                </p>

                <div className="space-y-8">
                  {/* TÉCNICAS */}
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-sm font-bold mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      {t('portfolio_view.technical_skills')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#22d3ee transparent' }}>
                      {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                          {[1, 2].map(n => (
                            <div key={n} className="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700">
                              <div className="space-y-2 flex-grow pr-4">
                                <SkeletonPulse className="w-24 h-4 rounded" />
                                <SkeletonPulse className="w-16 h-3 rounded" />
                              </div>
                              <SkeletonPulse className="w-14 h-5 rounded" />
                            </div>
                          ))}
                        </div>
                      ) : habilidadesTecnicas.length > 0 ? (
                        habilidadesTecnicas.map((skill) => (
                          <div
                            key={skill.id}
                            className="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700"
                          >
                            <div className="flex flex-col pr-4">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">{skill.name}</span>
                              {skill.category && (
                                <span className="text-slate-400 dark:text-slate-500 text-[11px] mt-1 line-clamp-1">{skill.category}</span>
                              )}
                            </div>
                            {skill.rawLevel && (
                              <span className="text-[10px] font-black px-2 py-1 rounded bg-blue-50 dark:bg-cyan-900/50 text-[#003087] dark:text-cyan-300 whitespace-nowrap">
                                {getTranslatedLevel(skill.rawLevel)}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-10 text-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                          <p className="text-slate-600 dark:text-slate-300 font-bold text-sm mb-1">{t('portfolio_view.no_technical')}</p>
                          <p className="text-slate-400 dark:text-slate-500 text-xs">{t('portfolio_view.add_tech')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BLANDAS */}
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-sm font-bold mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      {t('portfolio_view.soft_skills')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c084fc transparent' }}>
                      {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                          {[1, 2].map(n => (
                            <div key={n} className="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700">
                              <div className="space-y-2 flex-grow pr-4">
                                <SkeletonPulse className="w-24 h-4 rounded" />
                                <SkeletonPulse className="w-16 h-3 rounded" />
                              </div>
                              <SkeletonPulse className="w-14 h-5 rounded" />
                            </div>
                          ))}
                        </div>
                      ) : habilidadesBlandas.length > 0 ? (
                        habilidadesBlandas.map((skill) => (
                          <div
                            key={skill.id}
                            className="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700"
                          >
                            <div className="flex flex-col pr-4">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">{skill.name}</span>
                              {skill.category && (
                                <span className="text-slate-400 dark:text-slate-500 text-[11px] mt-1 line-clamp-1">{skill.category}</span>
                              )}
                            </div>
                            {skill.rawLevel && (
                              <span className="text-[10px] font-black px-2 py-1 rounded bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 whitespace-nowrap">
                                {getTranslatedLevel(skill.rawLevel)}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-10 text-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                          <p className="text-slate-600 dark:text-slate-300 font-bold text-sm mb-1">{t('portfolio_view.no_soft')}</p>
                          <p className="text-slate-400 dark:text-slate-500 text-xs">{t('portfolio_view.add_soft')}</p>
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
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('portfolio_view.experience_title')}</h2>

                  <button
                    onClick={() => navigate('/experiencia')}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#003087] dark:text-cyan-400 rounded-lg text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
                  >
                    <Edit3 size={14} />
                    {t('portfolio_view.edit')}
                  </button>
                </div>

                <p className="text-[#003087] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                  {t('portfolio_view.experience_subtitle')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {loading ? (
                    [1, 2, 3].map(n => (
                      <div key={n} className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-slate-200 dark:border-slate-700 p-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <SkeletonPulse className="w-12 h-3 rounded" />
                          <SkeletonPulse className="w-16 h-3 rounded" />
                        </div>
                        <SkeletonPulse className="w-32 h-4 rounded" />
                        <SkeletonPulse className="w-20 h-3 rounded" />
                        <div className="space-y-2">
                          <SkeletonPulse className="w-full h-3 rounded" />
                          <SkeletonPulse className="w-5/6 h-3 rounded" />
                        </div>
                      </div>
                    ))
                  ) : experiences.length > 0 ? (
                    experiences.map((exp, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-[#003087] dark:border-cyan-400 shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#003087] dark:text-cyan-400">
                              {exp.status}
                            </span>

                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{exp.period}</span>
                          </div>

                          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{exp.role}</h3>

                          <p className="text-[#003087] dark:text-cyan-400 text-xs font-bold mb-4">{exp.company}</p>

                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                            {exp.description}
                          </p>
                        </div>

                        {exp.skills && exp.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {exp.skills.map((s, i) => (
                              <span
                                key={i}
                                className="bg-slate-100 dark:bg-slate-700 text-[#003087] dark:text-cyan-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 dark:border-slate-600 whitespace-nowrap"
                              >
                                {s.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <Briefcase size={32} className="mx-auto text-slate-400 dark:text-slate-500 mb-3" />

                      <p className="text-slate-600 dark:text-slate-300 font-bold text-sm mb-1">
                        {t('portfolio_view.no_exp')}
                      </p>

                      <p className="text-slate-400 dark:text-slate-500 text-xs">{t('portfolio_view.add_exp')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PROYECTOS */}
            {privacy.show_projects && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('portfolio_view.projects_title')}</h2>

                  <button
                    onClick={() => navigate('/proyectos')}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#003087] dark:text-cyan-400 rounded-lg text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
                  >
                    <Edit3 size={14} />
                    {t('portfolio_view.edit')}
                  </button>
                </div>

                <p className="text-[#003087] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                  {t('portfolio_view.projects_subtitle')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {loading ? (
                    [1, 2, 3].map(n => (
                      <div key={n} className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-slate-200 dark:border-slate-700 p-6 space-y-4">
                        <div className="flex gap-2">
                          <SkeletonPulse className="w-14 h-4 rounded" />
                          <SkeletonPulse className="w-10 h-4 rounded" />
                        </div>
                        <SkeletonPulse className="w-40 h-4 rounded" />
                        <div className="space-y-2">
                          <SkeletonPulse className="w-full h-3 rounded" />
                          <SkeletonPulse className="w-5/6 h-3 rounded" />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <SkeletonPulse className="w-12 h-3 rounded" />
                          <SkeletonPulse className="w-10 h-3 rounded" />
                        </div>
                      </div>
                    ))
                  ) : projects.length > 0 ? (
                    projects.map((project, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-blue-500 shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex gap-2 mb-4">
                            <span className="text-[9px] font-black px-2 py-1 rounded-md uppercase bg-slate-100 dark:bg-slate-700 text-[#003087] dark:text-cyan-300">
                              {project.category?.name || 'GENERAL'}
                            </span>
                          </div>

                          {project.files && project.files.some((f: any) => (f.type || f.file_type)?.startsWith('image')) && (
                            <img 
                              src={project.files.find((f: any) => (f.type || f.file_type)?.startsWith('image'))?.url} 
                              alt={project.title} 
                              className="w-full h-40 object-cover rounded-lg mb-4" 
                            />
                          )}

                          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">{project.title}</h3>

                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed mb-4">
                            {project.description}
                          </p>
                        </div>

                        <div>
                          {project.skills && project.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.skills.map((s) => (
                                <span
                                  key={s.id}
                                  className="bg-slate-100 dark:bg-slate-700 text-[#003087] dark:text-cyan-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 dark:border-slate-600 whitespace-nowrap"
                                >
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {project.project_url && (
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2 rounded-lg bg-slate-900 dark:bg-slate-700 hover:bg-[#003087] dark:hover:bg-cyan-500 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all no-underline cursor-pointer border-none mb-3"
                            >
                              {t('portfolio_view.visit_project')}
                            </a>
                          )}

                          <div className="flex justify-end">
                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                              {project.year}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <Folder size={32} className="mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                      <p className="text-slate-600 dark:text-slate-300 font-bold text-sm mb-1">
                        {t('portfolio_view.no_proj')}
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs">{t('portfolio_view.add_proj')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CERTIFICACIONES */}
            {privacy.show_certifications && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('portfolio_view.certs_title')}</h2>

                  <button
                    onClick={() => navigate('/certificaciones')}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#003087] dark:text-cyan-400 rounded-lg text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
                  >
                    <Edit3 size={14} />
                    {t('portfolio_view.edit')}
                  </button>
                </div>

                <p className="text-[#003087] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                  {t('portfolio_view.certs_subtitle')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {loading ? (
                    [1, 2, 3].map(n => (
                      <div key={n} className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-slate-200 dark:border-slate-700 p-6 space-y-4">
                        <SkeletonPulse className="w-36 h-4 rounded" />
                        <SkeletonPulse className="w-full h-3 rounded" />
                        <div className="flex gap-2">
                          <SkeletonPulse className="w-12 h-4 rounded" />
                          <SkeletonPulse className="w-14 h-4 rounded" />
                        </div>
                      </div>
                    ))
                  ) : certifications.length > 0 ? (
                    certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-slate-800 rounded-xl border-l-4 border-violet-500 shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">{cert.title}</h3>

                          {cert.image_url && (
                            <button
                              type="button"
                              onClick={() => setImagePreviewCert(cert)}
                              className="w-full text-left block cursor-pointer border-none bg-transparent p-0 mb-4 hover:opacity-90 transition-opacity"
                              title={t('portfolio_view.view_certificate', 'Ver certificado')}
                            >
                              <img
                                src={cert.image_url}
                                alt={cert.title}
                                className="w-full h-40 object-cover rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
                              />
                            </button>
                          )}

                          <p className="text-[#003087] dark:text-cyan-400 text-xs font-bold mb-2">{cert.issuing_organization}</p>
                          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">
                            {formatCertDate(cert.issue_date, i18n.language)} - {cert.expiration_date ? formatCertDate(cert.expiration_date, i18n.language) : t('portfolio_view.present', 'Presente')}
                          </p>
                          {cert.description && (
                            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed mb-4">
                              {cert.description}
                            </p>
                          )}
                        </div>
                        {!cert.image_url && cert.credential_url && (
                          <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline mt-auto pt-2">
                            {t('portfolio_view.view_credential')}
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <Award size={32} className="mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                      <p className="text-slate-600 dark:text-slate-300 font-bold text-sm mb-1">
                        {t('portfolio_view.no_certs')}
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs">{t('portfolio_view.add_certs')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <PdfTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        portfolioId={portfolioId}
      />

      {imagePreviewCert?.image_url && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setImagePreviewCert(null)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="min-w-0 pr-4">
                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white truncate">
                  {imagePreviewCert.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {imagePreviewCert.issue_date}
                  {imagePreviewCert.expiration_date
                    ? ` - ${imagePreviewCert.expiration_date}`
                    : ` - ${t('portfolio_view.present', 'Presente')}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setImagePreviewCert(null)}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                aria-label={t('common.close', 'Cerrar')}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 overflow-auto flex items-center justify-center bg-slate-100 dark:bg-slate-950">
              <img
                src={imagePreviewCert.image_url}
                alt={imagePreviewCert.title}
                className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PortfolioView
