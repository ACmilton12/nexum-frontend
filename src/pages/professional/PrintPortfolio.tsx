import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Download, ArrowLeft, Loader2, Mail, Phone, MapPin, Globe, Award } from 'lucide-react'
import { getPublicPortfolio, type FullPortfolio } from '../../services/portfolio.service'
import { getProjects } from '../../services/project.service'
import { getPortfolioSkills } from '../../services/habilidades.service'
import { getExperiences } from '../../services/experience.service'
import { getCertifications } from '../../services/certification.service'
import { API_BASE_URL } from '../../utils/constants'
import PLATFORM_ICONS from '../../components/icons/SocialIcons'

const PrintPortfolio = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [portfolio, setPortfolio] = useState<FullPortfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [searchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const template = searchParams.get('template') || 'modern'

  const getTranslatedSkillLevel = (level: string) => {
    if (!level) return '';
    const normalized = level.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return t(`skills.levels.${normalized}`, level);
  }

  const formatCertDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    // Handle MM/YYYY format (e.g. "01/2026")
    const match = dateStr.match(/^(\d{1,2})\/(\d{4})$/);
    if (match) {
      const date = new Date(parseInt(match[2]), parseInt(match[1]) - 1, 1);
      const formatted = new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(date);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
    // Handle YYYY-MM or YYYY-MM-DD
    const ymMatch = dateStr.match(/^(\d{4})-(\d{2})/);
    if (ymMatch) {
      const date = new Date(parseInt(ymMatch[1]), parseInt(ymMatch[2]) - 1, 1);
      const formatted = new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(date);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
    return dateStr;
  }

  const formatExpDate = (dateStr: string | null | undefined, short = false) => {
    if (!dateStr) return '';
    const ymMatch = dateStr.match(/^(\d{4})-(\d{2})/);
    if (ymMatch) {
      const date = new Date(parseInt(ymMatch[1]), parseInt(ymMatch[2]) - 1, 1);
      const opts: Intl.DateTimeFormatOptions = short
        ? { month: 'short', year: 'numeric' }
        : { month: 'long', year: 'numeric' };
      const formatted = new Intl.DateTimeFormat(i18n.language, opts).format(date);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
    return dateStr;
  }

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true)
      try {
        if (id) {
          // Si hay ID, es un portafolio público o específico
          const data = await getPublicPortfolio(id)
          setPortfolio({
            ...data,
            additional_links: data.additional_links || [],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            projects: (data.projects || []).filter((p: any) => !p.archived),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            skills: (data.skills || []).map((s: any) => ({
              id: s.id,
              name: s.name,
              category: s.category,
              level:
                s.level === 'basico'
                  ? 'Básico'
                  : s.level === 'intermedio'
                    ? 'Intermedio'
                    : s.level === 'avanzado'
                      ? 'Avanzado'
                      : s.level === 'experto'
                        ? 'Experto'
                        : s.level || 'Básico'
            })),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            work_experiences: (data.work_experiences || []).map((e: any) => ({
              id: e.id,
              company: e.company,
              position: e.position,
              description: e.description || '',
              start_date: e.start_date,
              end_date: e.end_date || undefined,
              is_current: !e.end_date,
              location: e.location || ''
            })),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            certifications: (data.certifications || []).map((c: any) => ({
              id: c.id,
              name: c.name,
              issuing_organization: c.issuing_organization,
              issue_date: c.issue_date,
              expiration_date: c.expiration_date || undefined,
              image_url: c.image_url || undefined
            }))
          })
        } else {
          // Si no hay ID, es el del usuario logueado
          const token = localStorage.getItem('token') || sessionStorage.getItem('token')
          if (!token) {
            navigate('/login')
            return
          }

          // Fetch basic portfolio info
          const response = await fetch(`${API_BASE_URL}/portfolio`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          })
          if (!response.ok) throw new Error('No se pudo cargar tu portafolio básico.')
          const result = await response.json()
          const basic = result.data

          // Fetch other sections in parallel
          const [projects, skills, experiences, certifications, linksData] = await Promise.all([
            getProjects().catch(() => []),
            getPortfolioSkills().catch(() => []),
            getExperiences().catch(() => []),
            getCertifications().catch(() => []),
            fetch(`${API_BASE_URL}/portfolio/links`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
              }
            })
              .then((r) => r.json())
              .catch(() => ({ data: [] }))
          ])

          // Map the data to the FullPortfolio structure
          setPortfolio({
            ...basic,
            additional_links: linksData?.data || [],
            projects: projects.filter((p) => !p.archived),
            skills: skills.map((s) => ({
              id: s.id,
              name: s.name,
              category: s.category,
              level:
                s.level === 'basico'
                  ? 'Básico'
                  : s.level === 'intermedio'
                    ? 'Intermedio'
                    : s.level === 'avanzado'
                      ? 'Avanzado'
                      : 'Experto'
            })),
            work_experiences: experiences
              .filter((e: any) => e.is_active !== false)
              .map((e) => ({
                id: e.id,
                company: e.company,
                position: e.position,
                description: e.description || '',
                start_date: e.start_date,
                end_date: e.end_date || undefined,
                is_current: !e.end_date,
                location: e.location || ''
              })),
            certifications: certifications
              .filter((c: any) => c.is_active !== false)
              .map((c) => ({
                id: c.id,
                name: c.name,
                issuing_organization: c.issuing_entity,
                issue_date: c.issue_date,
                expiration_date: c.expiration_date || undefined,
                image_url: c.image_url || undefined
              }))
          })
        }
      } catch (err) {
        console.error('Print Error:', err)
        setError(err instanceof Error ? err.message : t('portfolio_view.error_results', 'Error al cargar los datos'))
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [id, navigate, t])

  const handleDownloadPDF = async () => {
    const element = document.getElementById('portfolio-content')
    if (!element) return

    setIsExporting(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      })

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(`Portafolio_${portfolio?.user.first_name}_${portfolio?.user.last_name}.pdf`)
    } catch (err) {
      console.error('Error generating PDF:', err)
      alert(t('portfolio_view.error_generating_pdf', 'Hubo un error al generar el PDF. Por favor intenta de nuevo.'))
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#003087] dark:text-cyan-500 animate-spin" />
          <p className="text-gray-500 dark:text-slate-400 font-medium">{t('portfolio_view.loading_doc', 'Preparando documento...')}</p>
        </div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('portfolio_view.error_title', 'Error')}</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-6">{error || t('portfolio_view.no_info', 'No se encontró información.')}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-[#003087] dark:bg-cyan-500 text-white dark:text-slate-950 rounded-xl font-bold shadow-lg transition-colors hover:bg-blue-800 dark:hover:bg-cyan-400 cursor-pointer"
          >
            {t('portfolio_view.back', 'Volver')}
          </button>
        </div>
      </div>
    )
  }

  const {
    user,
    profession,
    biography,
    location,
    phone,
    avatar_url,
    linkedin_url,
    github_url,
    additional_links
  } = portfolio

  const socialLinks = [
    ...(linkedin_url ? [{ id: 'linkedin', url: linkedin_url, platform: 'linkedin' }] : []),
    ...(github_url ? [{ id: 'github', url: github_url, platform: 'github' }] : []),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(additional_links || []).map((l: any) => ({ id: l.id, url: l.url, platform: l.platform }))
  ]

  const renderClassicTemplate = () => (
    <div
      id="portfolio-content"
      className="bg-white max-w-4xl mx-auto print:max-w-full font-serif border-t-8 border-[#333333] px-12 py-16"
    >
      <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-gray-300 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-xl text-gray-600 font-medium mb-4">
            {profession || t('portfolio_view.default_profession', 'Profesional')}
          </p>
          <div className="space-y-1 text-sm text-gray-600">
            {location && (
              <p className="flex items-center gap-2">
                <MapPin size={14} /> {location}
              </p>
            )}
            <p className="flex items-center gap-2">
              <Mail size={14} /> {user.email}
            </p>
            {phone && (
              <p className="flex items-center gap-2">
                <Phone size={14} /> {phone}
              </p>
            )}
          </div>
        </div>
        {avatar_url && (
          <div className="w-28 h-28 shrink-0 shadow-sm border border-gray-200">
            <img src={avatar_url} alt={user.first_name} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="space-y-10">
        {biography && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
              {t('portfolio_view.profile_section', 'Perfil Profesional')}
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line text-justify">
              {biography}
            </p>
          </section>
        )}

        {portfolio.work_experiences && portfolio.work_experiences.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
              {t('portfolio_view.experience_title', 'Experiencia Laboral')}
            </h3>
            <div className="space-y-6">
              {portfolio.work_experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 text-base">{exp.position}</h4>
                    <span className="text-sm font-medium text-gray-600">
                      {formatExpDate(exp.start_date)} — {exp.end_date ? formatExpDate(exp.end_date) : t('portfolio_view.present', 'Presente')}
                    </span>
                  </div>
                  <p className="text-gray-700 font-bold text-sm mb-2">{exp.company}</p>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {portfolio.skills && portfolio.skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
                {t('portfolio_view.skills_title', 'Habilidades')}
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {portfolio.skills.map((s) => (
                  <li key={s.id}>
                    <span className="font-bold">{s.name}</span> - {getTranslatedSkillLevel(s.level)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {portfolio.certifications && portfolio.certifications.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
                {t('portfolio_view.certs_title', 'Certificaciones')}
              </h3>
              <div className="space-y-3">
                {portfolio.certifications.map((cert) => (
                  <div key={cert.id}>
                    <h4 className="text-sm font-bold text-gray-900">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuing_organization}</p>
                    <p className="text-xs text-gray-500">
                      {formatCertDate(cert.issue_date)}{cert.expiration_date ? ` — ${formatCertDate(cert.expiration_date)}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {portfolio.projects && portfolio.projects.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
              {t('portfolio_view.projects_title', 'Proyectos Destacados')}
            </h3>
            <div className="space-y-5">
              {portfolio.projects.map((project) => (
                <div key={project.id}>
                  <h4 className="text-base font-bold text-gray-900 mb-1">{project.title}</h4>
                  <p className="text-gray-700 text-sm leading-relaxed text-justify mb-2">
                    {project.description}
                  </p>
                  {project.skills && project.skills.length > 0 && (
                    <p className="text-xs text-gray-600 italic">
                      {t('portfolio_view.technologies', 'Tecnologías')}: {project.skills.map((s) => s.name).join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {socialLinks.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 pb-2 mb-4">
              {t('portfolio_view.professional_networks', 'Redes Profesionales')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialLinks.map((link) => {
                const meta = PLATFORM_ICONS[link.platform?.toLowerCase()] || PLATFORM_ICONS.website
                return (
                  <div key={link.id} className="flex items-center gap-2 text-sm">
                    <span className={`${meta.color} shrink-0`}>{meta.svg}</span>
                    <span className="font-bold text-gray-700 capitalize">{link.platform}:</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {link.url}
                    </a>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>

      <div className="mt-16 pt-6 border-t border-gray-300 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest">
          {t('portfolio_view.generated_via', 'Generado vía Nexum UMSS')} • {new Date().toLocaleDateString(i18n.language)}
        </p>
      </div>
    </div>
  )

  const renderMinimalistTemplate = () => (
    <div
      id="portfolio-content"
      className="bg-[#fafafa] max-w-4xl mx-auto print:max-w-full font-sans px-16 py-20 text-[#262626]"
    >
      <div className="text-center mb-16">
        {avatar_url && (
          <img
            src={avatar_url}
            alt={user.first_name}
            className="w-24 h-24 rounded-full mx-auto mb-6 object-cover grayscale opacity-90"
          />
        )}
        <h1 className="text-5xl font-light tracking-tight mb-3">
          {user.first_name} <span className="font-bold">{user.last_name}</span>
        </h1>
        <p className="text-[#737373] tracking-widest uppercase text-sm">
          {profession || t('portfolio_view.default_profession', 'Profesional')}
        </p>

        <div className="flex justify-center gap-6 mt-6 text-sm text-[#737373]">
          {location && <span>{location}</span>}
          <span>{user.email}</span>
          {phone && <span>{phone}</span>}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-16">
        {biography && (
          <section className="text-center">
            <p className="text-[#525252] leading-relaxed text-base font-light">{biography}</p>
          </section>
        )}

        {portfolio.work_experiences && portfolio.work_experiences.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#a3a3a3] mb-8 text-center">
              {t('portfolio_view.experience_title', 'Experiencia')}
            </h3>
            <div className="space-y-8">
              {portfolio.work_experiences.map((exp) => (
                <div key={exp.id} className="grid grid-cols-[1fr_3fr] gap-8">
                  <div className="text-right text-sm text-[#a3a3a3] pt-1">
                    {exp.start_date.substring(0, 4)} —{' '}
                    {exp.end_date ? exp.end_date.substring(0, 4) : t('portfolio_view.present', 'Presente')}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#262626] mb-1">{exp.position}</h4>
                    <p className="text-[#737373] mb-3">{exp.company}</p>
                    <p className="text-[#525252] text-sm leading-relaxed font-light">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {portfolio.skills && portfolio.skills.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#a3a3a3] mb-8 text-center">
              {t('portfolio_view.skills_title', 'Habilidades')}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {portfolio.skills.map((s) => (
                <span
                  key={s.id}
                  className="px-4 py-2 border border-[#e5e5e5] rounded-full text-sm text-[#525252] bg-white"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {socialLinks.length > 0 && (
          <section className="mt-8 pt-6 border-t border-[#e5e5e5]">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#a3a3a3] mb-8 text-center">
              {t('portfolio_view.professional_networks', 'Redes Profesionales')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialLinks.map((link) => {
                const meta = PLATFORM_ICONS[link.platform?.toLowerCase()] || PLATFORM_ICONS.website
                return (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 p-4 rounded-xl border border-[#e5e5e5] bg-white hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#262626]/5 flex items-center justify-center text-[#262626] shrink-0">
                      {meta.svg}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <span className="text-[10px] font-bold text-[#a3a3a3] uppercase block tracking-wider mb-0.5">
                        {link.platform}
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#525252] font-semibold text-xs hover:text-[#262626] transition-colors hover:underline block break-all"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>

      <div className="mt-24 text-center">
        <p className="text-[10px] text-[#a3a3a3] tracking-[0.2em] uppercase">
          Nexum UMSS • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )

  const renderModernTemplate = () => (
    <div
      id="portfolio-content"
      className="bg-white shadow-xl max-w-4xl mx-auto print:shadow-none print:max-w-full"
    >
      {/* Header */}
      <div className="bg-[#1a1a2e] text-white p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/10 shrink-0 shadow-lg">
          {avatar_url ? (
            <img src={avatar_url} alt={user.first_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#C8102E] flex items-center justify-center text-4xl font-bold uppercase">
              {user.first_name[0]}
            </div>
          )}
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl md:text-4xl font-black mb-2 uppercase tracking-tight">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-xl text-[#C8102E] font-bold mb-4">
            {profession || t('portfolio_view.default_profession', 'Profesional')}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm opacity-80">
            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={16} /> {location}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Mail size={16} /> {user.email}
            </div>
            {phone && (
              <div className="flex items-center gap-1.5">
                <Phone size={16} /> {phone}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-10 space-y-12">
        {biography && (
          <section>
            <h3 className="text-lg font-black text-[#1a1a2e] uppercase tracking-widest border-b-2 border-[#C8102E] pb-2 mb-4">
              {t('portfolio_view.profile_section', 'Perfil Profesional')}
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line text-justify">
              {biography}
            </p>
          </section>
        )}

        {portfolio.work_experiences && portfolio.work_experiences.length > 0 && (
          <section>
            <h3 className="text-lg font-black text-[#1a1a2e] uppercase tracking-widest border-b-2 border-[#C8102E] pb-2 mb-6">
              {t('portfolio_view.experience_title', 'Trayectoria Laboral')}
            </h3>
            <div className="space-y-8">
              {portfolio.work_experiences.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-gray-100">
                  <div className="absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-[#C8102E] border-4 border-white shadow-sm"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{exp.position}</h4>
                    <span className="text-xs font-bold text-gray-400">
                      {formatExpDate(exp.start_date)} — {exp.end_date ? formatExpDate(exp.end_date) : t('portfolio_view.present', 'Presente')}
                    </span>
                  </div>
                  <p className="text-[#C8102E] font-bold text-sm mb-2">{exp.company}</p>
                  <p className="text-gray-500 text-xs leading-relaxed text-justify">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {portfolio.skills && portfolio.skills.length > 0 && (
            <section>
              <h3 className="text-lg font-black text-[#1a1a2e] uppercase tracking-widest border-b-2 border-[#C8102E] pb-2 mb-6">
                {t('portfolio_view.skills_title', 'Habilidades')}
              </h3>
              <div className="space-y-4">
                {portfolio.skills.map((s) => (
                  <div key={s.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span className="text-gray-700">{s.name}</span>
                      <span className="text-[#C8102E]">{getTranslatedSkillLevel(s.level)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C8102E]"
                        style={{
                          width:
                            s.level === 'Experto'
                              ? '100%'
                              : s.level === 'Avanzado'
                                ? '75%'
                                : s.level === 'Intermedio'
                                  ? '50%'
                                  : '25%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {portfolio.certifications && portfolio.certifications.length > 0 && (
            <section>
              <h3 className="text-lg font-black text-[#1a1a2e] uppercase tracking-widest border-b-2 border-[#C8102E] pb-2 mb-6">
                {t('portfolio_view.certs_title', 'Certificaciones')}
              </h3>
              <div className="space-y-4">
                {portfolio.certifications.map((cert) => (
                  <div key={cert.id} className="flex gap-3">
                    <Award size={16} className="text-[#C8102E] shrink-0 mt-1" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{cert.name}</h4>
                      <p className="text-xs text-gray-500">{cert.issuing_organization}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                        {formatCertDate(cert.issue_date)}{cert.expiration_date ? ` — ${formatCertDate(cert.expiration_date)}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {portfolio.projects && portfolio.projects.length > 0 && (
          <section>
            <h3 className="text-lg font-black text-[#1a1a2e] uppercase tracking-widest border-b-2 border-[#C8102E] pb-2 mb-6">
              {t('portfolio_view.projects_title', 'Proyectos Destacados')}
            </h3>
            <div className="space-y-6">
              {portfolio.projects.map((project) => (
                <div
                  key={project.id}
                  className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <h4 className="text-base font-bold text-gray-900">{project.title}</h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase bg-white px-2 py-1 rounded-md border border-gray-100">
                      {new Date(project.created_at).toLocaleDateString(i18n.language, {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-[#C8102E] uppercase mb-3 tracking-wider">
                    {project.category?.name || t('portfolio_view.project_default_category', 'Proyecto')}
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4 text-justify">
                    {project.description}
                  </p>
                  {project.skills && project.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase mr-1 mt-0.5">
                        {t('portfolio_view.technologies', 'Tecnologías')}:
                      </span>
                      {project.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-2 py-0.5 rounded-md bg-white text-gray-600 text-[9px] font-bold border border-gray-200 shadow-sm"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {socialLinks.length > 0 && (
          <section>
            <h3 className="text-lg font-black text-[#1a1a2e] uppercase tracking-widest border-b-2 border-[#C8102E] pb-2 mb-6">
              {t('portfolio_view.professional_networks', 'Redes Profesionales')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialLinks.map((link) => {
                const meta = PLATFORM_ICONS[link.platform?.toLowerCase()] || PLATFORM_ICONS.website
                return (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1a1a2e]/5 flex items-center justify-center text-[#C8102E] shrink-0">
                      {meta.svg}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase block tracking-wider mb-0.5">
                        {link.platform}
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1a1a2e] font-bold text-xs hover:text-[#C8102E] transition-colors hover:underline block break-all"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>

      <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
          <Globe size={12} /> {t('portfolio_view.generated_via', 'Generado vía Nexum UMSS')} •{' '}
          {new Date().toLocaleDateString(i18n.language)}
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 font-sans print:bg-white print:dark:bg-white transition-colors duration-300">
      {/* Barra de herramientas - No se imprime */}
      <div className="no-print bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 dark:text-slate-400 font-bold hover:text-[#C8102E] dark:hover:text-cyan-400 transition-colors flex items-center gap-2 text-sm cursor-pointer border-none bg-transparent"
          >
            <ArrowLeft size={18} /> {t('portfolio_view.return', 'Regresar')}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 bg-[#C8102E] dark:bg-cyan-500 text-white dark:text-slate-950 px-5 py-2.5 rounded-lg font-bold shadow-lg hover:bg-[#a50d25] dark:hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> {t('portfolio_view.generating_pdf', 'Generando PDF...')}
              </>
            ) : (
              <>
                <Download size={18} /> {t('portfolio_view.download_pdf', 'Descargar PDF')}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto pb-20">
        <main className="flex-1 py-10 px-4 sm:px-6 print:py-0 print:px-0">
          {template === 'classic'
            ? renderClassicTemplate()
            : template === 'minimalist'
              ? renderMinimalistTemplate()
              : renderModernTemplate()}
        </main>
      </div>
    </div>
  )
}

export default PrintPortfolio
