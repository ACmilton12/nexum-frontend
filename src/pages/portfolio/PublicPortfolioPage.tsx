import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  MapPin, Phone, Mail, Briefcase, Award, Loader2, AlertCircle, Folder, Download, X, Share2
} from 'lucide-react'
import { getPublicPortfolio, type FullPortfolio, type AdditionalLink } from '../../services/portfolio.service'
import { useRecordVisit, useProfileStats } from '../../hooks/useProfileVisits'
import PLATFORM_ICONS from '../../components/icons/SocialIcons'
import Navbar from '../home/components/Navbar'
import Footer from '../home/components/Footer'
import PdfTemplateModal from '../../components/modals/PdfTemplateModal'
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

export default function PublicPortfolioPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const [portfolio, setPortfolio] = useState<FullPortfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [additionalLinks, setAdditionalLinks] = useState<AdditionalLink[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imagePreviewCert, setImagePreviewCert] = useState<any | null>(null)

  useRecordVisit(portfolio?.id || null)
  const { stats } = useProfileStats(portfolio?.id || null)

  const handleShareProfile = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert(t('portfolio_view.share_success', '¡Enlace de tu portafolio copiado al portapapeles!'));
  }

  const getTranslatedLevel = (level: string) => {
    if (!level) return '';
    const normalized = level.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return t(`skills.levels.${normalized}`, level);
  }

  // Forzar modo claro para los visitantes en esta ruta pública
  useEffect(() => {
    const wasDark = document.documentElement.classList.contains('dark')
    if (wasDark) {
      document.documentElement.classList.remove('dark')
    }
    return () => {
      if (wasDark) {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!id) return
      setLoading(true)
      try {
        const data = await getPublicPortfolio(id)
        if (data.global_privacy === 'private') {
          setError(t('portfolio_view.error_private'))
          setPortfolio(null)
        } else {
          setPortfolio(data)
          setAdditionalLinks(data.additional_links || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el portafolio')
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [id, t])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#003087] animate-spin mb-4" />
          <p className="text-slate-500 font-medium">{t('portfolio_view.loading')}</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="text-[#C8102E]" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('portfolio_view.error_title')}</h2>
          <p className="text-slate-500 max-w-md mb-8">{error || t('portfolio_view.error_not_found')}</p>
          <Link to="/" className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-[#C8102E] transition-all">
            {t('portfolio_view.back_home')}
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const { user, profession, biography, location, avatar_url, linkedin_url, github_url, views_count } = portfolio

  // Build stats array
  const statsList = [
    { label: t('portfolio_view.stats_views'), value: stats?.visits_count || views_count || 0 }
  ]
  if (portfolio.show_projects !== false) statsList.push({ label: t('portfolio_view.stats_projects'), value: portfolio.projects?.length || 0 })
  if (portfolio.show_skills !== false) statsList.push({ label: t('portfolio_view.stats_tech'), value: portfolio.skills?.length || 0 })
  if (portfolio.show_experience !== false) statsList.push({ label: t('portfolio_view.stats_exp'), value: portfolio.work_experiences?.length || 0 })

  // All skills split by type
  const allSkills = portfolio.skills || []
  const techSkillsMapped = allSkills.map(s => ({
    ...s,
    level: s.level?.toUpperCase().replace('_', ' ') || 'N/A',
  }))
  const habilidadesTecnicas = techSkillsMapped.filter(s => s.type === 'tecnica')
  const habilidadesBlandas = techSkillsMapped.filter(s => s.type !== 'tecnica')

  // Build social links: linkedin + github + additional
  const socialLinks: { id: string | number; url: string; platform: string }[] = [
    ...(linkedin_url ? [{ id: 'linkedin', url: linkedin_url, platform: 'linkedin' }] : []),
    ...(github_url ? [{ id: 'github', url: github_url, platform: 'github' }] : []),
    ...additionalLinks.map(l => ({ id: l.id, url: l.url, platform: l.platform }))
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow bg-slate-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">
          {/* HEADER CARD - MATCHING OTHERS */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Banner full-width */}
          <div className="h-48 md:h-64 w-full bg-gradient-to-r from-[#001A5E] via-[#003087] to-[#C8102E]"></div>

          <div className="px-6 md:px-8 pb-8 relative pt-6 md:pt-3">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 w-full">
              
              {/* Left Side: Avatar + Details in a horizontal flex layout on desktop */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full md:w-auto">
                {/* Avatar wrapper with negative margin to overlap banner */}
                <div className="-mt-16 md:-mt-20 shrink-0 z-10">
                  {avatar_url ? (
                    <img src={avatar_url} alt={user.first_name} className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg bg-white" />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-slate-600 uppercase text-3xl font-bold shadow-lg">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                  )}
                </div>

                {/* Info details */}
                <div className="text-center md:text-left flex-grow">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900">
                      {user.first_name} {user.last_name}
                    </h1>
                    <p className="text-[#003087] text-sm font-semibold uppercase tracking-wider mt-1">
                      {profession || t('portfolio_view.default_profession')}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-xs mt-2">
                      <MapPin size={14} />
                      <span>{location || t('portfolio_view.default_location')}</span>
                    </div>

                    <div className="flex flex-col gap-3 mt-3">
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {/* Phone - always show like PortfolioView */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 text-slate-700 text-xs shadow-sm">
                          <Phone size={14} className="text-[#003087]" />
                          <span>{portfolio.phone || 'Sin teléfono'}</span>
                        </div>
                        <a href={`mailto:${user.email}`} className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 text-slate-700 text-xs shadow-sm no-underline hover:border-[#003087] transition-colors">
                          <Mail size={14} className="text-[#003087]" />
                          <span>{user.email}</span>
                        </a>
                      </div>

                      {/* Social links - white circle background matching PortfolioView */}
                      {socialLinks.length > 0 && (
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2.5">
                          {socialLinks.map(link => {
                            const meta = PLATFORM_ICONS[link.platform?.toLowerCase()] || PLATFORM_ICONS.website
                            return (
                              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" title={link.platform}
                                className={`w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 ${meta.color} hover:bg-slate-100 dark:hover:bg-slate-700 ${meta.hoverColor} hover:scale-110 transition-all shadow-sm`}>
                                {meta.svg}
                              </a>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Actions and Stats Stack */}
              <div className="flex flex-col items-stretch md:items-end gap-3 w-full md:w-auto self-stretch mt-4 md:mt-0">
                {/* Download PDF button instead of Edit */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#003087] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all duration-300 shadow-lg no-underline w-full md:w-56 cursor-pointer border-none"
                >
                  <Download size={14} />
                  {t('portfolio_view.download_pdf')}
                </button>

                <button
                  onClick={handleShareProfile}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-[#003087] border border-[#003087] rounded-lg text-xs font-bold transition-all duration-300 shadow-sm w-full md:w-56 cursor-pointer"
                >
                  <Share2 size={14} />
                  {t('portfolio_view.share_profile', 'Compartir perfil')}
                </button>

                {/* STATS PANEL (Horizontal Row on both Desktop and Mobile) */}
                <div className="flex flex-wrap md:flex-nowrap gap-2 w-full mt-1 justify-start md:justify-end">
                  {statsList.map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex-1 md:flex-initial bg-slate-50 rounded-xl p-3 px-4 flex flex-col items-center justify-center border border-slate-200 shadow-sm min-w-[90px] md:min-w-[100px]"
                    >
                      <span className="text-xl font-black text-[#003087] mb-0.5">
                        {stat.value}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REST OF CARDS */}

          {/* ABOUT */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('portfolio_view.about_me')}</h2>
            <p className="text-[#003087] text-[10px] font-bold uppercase tracking-widest mb-8">{t('portfolio_view.my_profile')}</p>
            <p className="text-slate-600 text-sm leading-relaxed">{biography || t('portfolio_view.no_bio')}</p>
          </div>

          {/* SKILLS */}
          {portfolio.show_skills !== false && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('portfolio_view.skills_title')}</h2>
              <p className="text-[#003087] text-[10px] font-bold uppercase tracking-widest mb-8">{t('portfolio_view.skills_subtitle')}</p>

              <div className="space-y-8">
                {/* TÉCNICAS */}
                <div>
                  <h3 className="text-slate-900 text-sm font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    {t('portfolio_view.technical_skills')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#22d3ee transparent' }}>
                    {habilidadesTecnicas.length > 0 ? (
                      habilidadesTecnicas.map((skill, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-4 flex items-center justify-between border border-slate-200">
                          <div className="flex flex-col pr-4">
                            <span className="font-bold text-slate-900 text-sm">{skill.name}</span>
                            {skill.category && (
                              <span className="text-slate-400 text-[11px] mt-1 line-clamp-1">{skill.category}</span>
                            )}
                          </div>
                          <span className="text-[10px] font-black px-2 py-1 rounded bg-blue-50 text-[#003087] whitespace-nowrap">
                            {getTranslatedLevel(skill.level)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-10 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-600 font-bold text-sm mb-1">{t('portfolio_view.no_technical')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* BLANDAS */}
                <div>
                  <h3 className="text-slate-900 text-sm font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    {t('portfolio_view.soft_skills')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c084fc transparent' }}>
                    {habilidadesBlandas.length > 0 ? (
                      habilidadesBlandas.map((skill, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-4 flex items-center justify-between border border-slate-200">
                          <div className="flex flex-col pr-4">
                            <span className="font-bold text-slate-900 text-sm">{skill.name}</span>
                            {skill.category && (
                              <span className="text-slate-400 text-[11px] mt-1 line-clamp-1">{skill.category}</span>
                            )}
                          </div>
                          <span className="text-[10px] font-black px-2 py-1 rounded bg-purple-50 text-purple-700 whitespace-nowrap">
                            {getTranslatedLevel(skill.level)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-10 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-600 font-bold text-sm mb-1">{t('portfolio_view.no_soft')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXPERIENCE */}

          {portfolio.show_experience !== false && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('portfolio_view.experience_title')}</h2>
              <p className="text-[#003087] text-[10px] font-bold uppercase tracking-widest mb-8">{t('portfolio_view.experience_subtitle')}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {portfolio.work_experiences && portfolio.work_experiences.length > 0 ? (
                  portfolio.work_experiences.map(exp => (
                    <div key={exp.id} className="bg-white rounded-xl border-l-4 border-[#003087] shadow-lg hover:-translate-y-1 transition-all duration-300 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#003087]">
                          {exp.is_current ? t('portfolio_view.actual') : t('portfolio_view.previous')}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {formatExpDate(exp.start_date, i18n.language)} - {exp.end_date ? formatExpDate(exp.end_date, i18n.language) : t('portfolio_view.present')}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">{exp.position}</h3>
                      <p className="text-[#003087] text-xs font-bold mb-4">{exp.company}</p>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{exp.description}</p>
                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {exp.skills.map((s, i) => (
                            <span key={i} className="bg-slate-100 text-[#003087] text-[10px] font-bold px-2 py-1 rounded border border-slate-200">{s.name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <Briefcase size={32} className="mx-auto text-slate-400 mb-3" />
                    <p className="text-slate-600 font-bold text-sm mb-1">{t('portfolio_view.no_exp')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {portfolio.show_projects !== false && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('portfolio_view.projects_title')}</h2>
              <p className="text-[#003087] text-[10px] font-bold uppercase tracking-widest mb-8">{t('portfolio_view.projects_subtitle')}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {portfolio.projects && portfolio.projects.length > 0 ? (
                  portfolio.projects.map(project => (
                    <div key={project.id} className="bg-white rounded-xl border-l-4 border-blue-500 shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col">
                      <div className="flex gap-2 mb-4">
                        <span className="text-[9px] font-black px-2 py-1 rounded-md uppercase bg-slate-100 text-[#003087]">
                          {project.category?.name || 'GENERAL'}
                        </span>
                      </div>
                      
                      {project.files && project.files.some(f => (f.type || f.file_type)?.startsWith('image')) && (
                        <img 
                          src={project.files.find(f => (f.type || f.file_type)?.startsWith('image'))?.url} 
                          alt={project.title} 
                          className="w-full h-40 object-cover rounded-lg mb-4" 
                        />
                      )}

                      <h3 className="font-bold text-slate-900 text-base mb-3">{project.title}</h3>
                      <p className="text-slate-600 text-[11px] leading-relaxed mb-4 flex-1">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skills?.map(s => (
                          <span key={s.id} className="bg-slate-100 text-[#003087] text-[10px] font-bold px-2 py-1 rounded border border-slate-200">{s.name}</span>
                        ))}
                      </div>
                      {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                          className="w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#003087] transition-all no-underline">
                          {t('portfolio_view.visit_project')}
                        </a>
                      )}
                      <div className="flex justify-end mt-3">
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                          {project.created_at ? new Date(project.created_at).getFullYear() : ''}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <Folder size={32} className="mx-auto text-slate-400 mb-3" />
                    <p className="text-slate-600 font-bold text-sm mb-1">{t('portfolio_view.no_proj')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {portfolio.show_certifications !== false && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('portfolio_view.certs_title')}</h2>
              <p className="text-[#003087] text-[10px] font-bold uppercase tracking-widest mb-8">{t('portfolio_view.certs_subtitle')}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {portfolio.certifications && portfolio.certifications.length > 0 ? (
                  portfolio.certifications.map(cert => {
                    const parsed = parseIssuingEntity((cert as any).issuing_entity);
                    const issuingOrg = parsed.issuing_organization || cert.issuing_organization;
                    const credUrl = parsed.credential_url || cert.credential_url;

                    return (
                      <div key={cert.id} className="bg-white rounded-xl border-l-4 border-violet-500 shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base mb-3">{cert.name}</h3>

                          {cert.image_url && (
                            <button
                              type="button"
                              onClick={() => setImagePreviewCert(cert)}
                              className="w-full text-left block cursor-pointer border-none bg-transparent p-0 mb-4 hover:opacity-90 transition-opacity"
                              title={t('portfolio_view.view_certificate', 'Ver certificado')}
                            >
                              <img
                                src={cert.image_url}
                                alt={cert.name}
                                className="w-full h-40 object-cover rounded-lg shadow-sm border border-slate-200"
                              />
                            </button>
                          )}

                          <p className="text-[#003087] text-xs font-bold mb-2">{issuingOrg}</p>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                            {formatCertDate(cert.issue_date, i18n.language)} - {cert.expiration_date ? formatCertDate(cert.expiration_date, i18n.language) : t('portfolio_view.present', 'Presente')}
                          </p>
                          {cert.description && (
                            <p className="text-slate-600 text-[11px] leading-relaxed mb-4">
                              {cert.description}
                            </p>
                          )}
                        </div>
                        {!cert.image_url && credUrl && (
                          <a href={credUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline mt-auto">
                            {t('portfolio_view.view_credential')}
                          </a>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <Award size={32} className="mx-auto text-slate-400 mb-3" />
                    <p className="text-slate-600 font-bold text-sm mb-1">{t('portfolio_view.no_certs')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
      <PdfTemplateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        portfolioId={id}
      />

      {imagePreviewCert?.image_url && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setImagePreviewCert(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="min-w-0 pr-4">
                <h3 className="text-[15px] font-bold text-slate-900 truncate">
                  {imagePreviewCert.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {formatCertDate(imagePreviewCert.issue_date, i18n.language)}
                  {imagePreviewCert.expiration_date
                    ? ` - ${formatCertDate(imagePreviewCert.expiration_date, i18n.language)}`
                    : ` - ${t('portfolio_view.present', 'Presente')}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setImagePreviewCert(null)}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                aria-label={t('common.close', 'Cerrar')}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 overflow-auto flex items-center justify-center bg-slate-100">
              <img
                src={imagePreviewCert.image_url}
                alt={imagePreviewCert.name}
                className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
