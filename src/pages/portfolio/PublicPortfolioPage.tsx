import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  Loader2,
  AlertCircle,
  Calendar,
  Globe,
  Download
} from 'lucide-react'
import { getPublicPortfolio, type FullPortfolio } from '../../services/portfolio.service'
import { useRecordVisit, useProfileStats } from '../../hooks/useProfileVisits'
import Navbar from '../home/components/Navbar'


import Footer from '../home/components/Footer'

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

export default function PublicPortfolioPage() {
  const { id } = useParams<{ id: string }>()
  const [portfolio, setPortfolio] = useState<FullPortfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<
    'projects' | 'skills' | 'experience' | 'certifications'
  >('projects')

  // Registrar visita automáticamente
  useRecordVisit(portfolio?.id || null)

  // Obtener estadísticas reales (visitas)
  const { stats } = useProfileStats(portfolio?.id || null)


  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!id) return
      setLoading(true)
      try {
        const data = await getPublicPortfolio(id)
        
        if (data.global_privacy === 'private') {
          setError('Este portafolio es privado por decisión del usuario.');
          setPortfolio(null);
        } else {
          setPortfolio(data)

          // Determinar pestaña inicial basada en lo que hay disponible Y permitido por privacidad
          const canShowProjects = data.show_projects !== false && data.projects && data.projects.length > 0;
          const canShowSkills = data.show_skills !== false && data.skills && data.skills.length > 0;
          const canShowExperience = data.show_experience !== false && data.work_experiences && data.work_experiences.length > 0;
          const canShowCertifications = data.show_certifications !== false && data.certifications && data.certifications.length > 0;

          if (canShowProjects) setActiveTab('projects');
          else if (canShowSkills) setActiveTab('skills');
          else if (canShowExperience) setActiveTab('experience');
          else if (canShowCertifications) setActiveTab('certifications');
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el portafolio')
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#C8102E] animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Cargando portafolio profesional...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="text-[#C8102E]" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Ups! Algo salió mal</h2>
          <p className="text-gray-500 max-w-md mb-8">
            {error || 'No pudimos encontrar este portafolio.'}
          </p>
          <Link
            to="/"
            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-[#C8102E] transition-all"
          >
            Regresar al inicio
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const {
    user,
    profession,
    biography,
    location,
    avatar_url,
    linkedin_url,
    github_url,
    views_count
  } = portfolio

  return (
    <div
      className={`min-h-screen ${portfolio.design_pattern === 'dark_mode' ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] text-gray-900'} flex flex-col font-sans`}
    >
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative pt-20 pb-32 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-br from-[#003087] via-[#001A5E] to-[#C8102E] opacity-10 blur-3xl -z-10"></div>

          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 lg:gap-12">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-40 h-40 lg:w-56 lg:h-56 rounded-3xl overflow-hidden border-8 border-white shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500">
                  {avatar_url ? (
                    <img
                      src={avatar_url}
                      alt={user.first_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#C8102E] flex items-center justify-center text-white text-6xl font-bold">
                      {user.first_name[0]}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-500 border-8 border-[#F8FAFC] rounded-full z-20"></div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center lg:text-left pb-4">
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#C8102E]/10 text-[#C8102E] text-[10px] font-extrabold uppercase tracking-widest border border-[#C8102E]/20">
                    Talento UMSS
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                    {stats?.visits_count ?? views_count} Visualizaciones
                  </span>

                </div>
                <h1 className="text-4xl lg:text-6xl font-black mb-3 tracking-tight">
                  {user.first_name} <span className="text-[#C8102E]">{user.last_name}</span>
                </h1>
                <p className="text-xl lg:text-2xl font-medium text-gray-500 mb-6 max-w-2xl">
                  {profession || 'Especialista en tecnología'}
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm font-medium text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[#C8102E]" />
                    <span>{location || 'Cochabamba, Bolivia'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-[#C8102E]" />
                    <span>Universidad Mayor de San Simón</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 pb-4">
                {linkedin_url && (
                  <a
                    href={linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
                  >
                    <LinkedinIcon size={20} />
                  </a>
                )}
                {github_url && (
                  <a
                    href={github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all transform hover:-translate-y-1"
                  >
                    <GithubIcon size={20} />
                  </a>
                )}
                <Link
                  to={`/imprimir/${id}`}
                  className="px-6 h-12 rounded-2xl bg-white text-gray-900 font-bold shadow-lg border border-gray-100 hover:bg-gray-50 transition-all transform hover:-translate-y-1 flex items-center gap-2 no-underline"
                >
                  Descargar PDF <Download size={18} className="text-[#C8102E]" />
                </Link>
                <a
                  href={`mailto:${user.email}?subject=Contacto desde Nexum - ${user.first_name} ${user.last_name}`}
                  className="px-6 h-12 rounded-2xl bg-[#C8102E] text-white font-bold shadow-lg shadow-red-600/20 hover:bg-[#a50d25] transition-all transform hover:-translate-y-1 flex items-center gap-2 no-underline"
                >
                  Contactar <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar Left: About & Stats */}
            <div className="lg:col-span-4 space-y-10">
              <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                  <Award size={22} className="text-[#C8102E]" /> Perfil Profesional
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base whitespace-pre-line">
                  {biography || 'Este profesional aún no ha redactado su biografía pública.'}
                </p>

                <div className="mt-10 pt-10 border-t border-gray-50 grid grid-cols-2 gap-4">
                  {portfolio.show_projects !== false && (
                    <div className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="text-2xl font-black text-[#C8102E]">
                        {portfolio.projects?.length || 0}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Proyectos
                      </div>
                    </div>
                  )}
                  {portfolio.show_skills !== false && (
                    <div className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="text-2xl font-black text-blue-600">
                        {portfolio.skills?.length || 0}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Habilidades
                      </div>
                    </div>
                  )}
                </div>

              </section>

              <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8102E]/5 rounded-full -mr-16 -mt-16"></div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                  <Phone size={22} className="text-[#C8102E]" /> Información de contacto
                </h3>
                <div className="space-y-4 relative z-10">
                  <a
                    href={`mailto:${user.email}`}
                    className="flex items-center gap-4 group cursor-pointer no-underline"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#C8102E]/10 group-hover:text-[#C8102E] transition-all">
                      <Mail size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Email
                      </div>
                      <div className="text-sm font-bold text-gray-700">{user.email}</div>
                    </div>
                  </a>
                  {portfolio.phone && (
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                        <Phone size={18} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Teléfono
                        </div>
                        <div className="text-sm font-bold text-gray-700">{portfolio.phone}</div>
                      </div>
                    </div>
                  )}
                  {(linkedin_url || github_url) && (
                    <div className="pt-4 mt-4 border-t border-gray-50">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Redes Profesionales
                      </div>
                      <div className="flex gap-2">
                        {linkedin_url && (
                          <a
                            href={linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                          >
                            <LinkedinIcon size={18} />
                          </a>
                        )}
                        {github_url && (
                          <a
                            href={github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-gray-50 text-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all"
                          >
                            <GithubIcon size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Main Content Right: Tabs & Data */}
            <div className="lg:col-span-8">
              {/* Tabs Navigation */}
              <div className="flex overflow-x-auto gap-2 p-1.5 bg-white border border-gray-100 rounded-2xl mb-10 shadow-sm no-scrollbar">
                {portfolio.show_projects !== false && (
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'projects' ? 'bg-[#C8102E] text-white shadow-lg shadow-red-600/20' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Briefcase size={18} /> Proyectos
                  </button>
                )}
                {portfolio.show_skills !== false && (
                  <button
                    onClick={() => setActiveTab('skills')}
                    className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'skills' ? 'bg-[#C8102E] text-white shadow-lg shadow-red-600/20' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Code2 size={18} /> Habilidades
                  </button>
                )}
                {portfolio.show_experience !== false && (
                  <button
                    onClick={() => setActiveTab('experience')}
                    className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'experience' ? 'bg-[#C8102E] text-white shadow-lg shadow-red-600/20' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                  >
                    <GraduationCap size={18} /> Trayectoria
                  </button>
                )}
                {portfolio.show_certifications !== false && (
                  <button
                    onClick={() => setActiveTab('certifications')}
                    className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'certifications' ? 'bg-[#C8102E] text-white shadow-lg shadow-red-600/20' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Award size={18} /> Certificados
                  </button>
                )}
              </div>


              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'projects' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                    {portfolio.projects && portfolio.projects.length > 0 ? (
                      portfolio.projects.map((project) => (
                        <div
                          key={project.id}
                          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500"
                        >
                          <div className="h-48 bg-gray-100 relative overflow-hidden">
                            {project.files && project.files.find((f) => f.file_type === 'image') ? (
                              <img
                                src={project.files.find((f) => f.file_type === 'image')?.url}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
                                <Briefcase size={40} className="text-gray-300" />
                              </div>
                            )}
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
                                {project.category?.name || 'Proyecto'}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#C8102E] transition-colors">
                              {project.title}
                            </h4>
                            <p className="text-sm text-gray-500 mb-6 line-clamp-3">
                              {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                              {project.skills?.map((skill) => (
                                <span
                                  key={skill.id}
                                  className="px-2 py-1 rounded-md bg-gray-50 text-gray-500 text-[10px] font-bold border border-gray-100"
                                >
                                  {skill.name}
                                </span>
                              ))}
                            </div>

                            {project.project_url && (
                              <a
                                href={project.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#C8102E] transition-all no-underline"
                              >
                                Visitar Proyecto <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-50">
                        <p className="text-gray-400 font-medium italic">
                          No hay proyectos públicos para mostrar.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-8 animate-fadeIn">
                    {portfolio.skills && portfolio.skills.length > 0 ? (
                      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {portfolio.skills.map((ps) => (
                            <div key={ps.id} className="space-y-2">
                              <div className="flex justify-between items-end">
                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                  {ps.name}
                                  <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">
                                    {ps.category}
                                  </span>
                                </h4>
                                <span className="text-xs font-bold text-[#C8102E]">{ps.level}</span>
                              </div>
                              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#C8102E] transition-all duration-1000 ease-out"
                                  style={{
                                    width:
                                      ps.level === 'Experto'
                                        ? '100%'
                                        : ps.level === 'Avanzado'
                                          ? '75%'
                                          : ps.level === 'Intermedio'
                                            ? '50%'
                                            : '25%'
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-20 text-center bg-white rounded-3xl border border-gray-50">
                        <p className="text-gray-400 font-medium italic">
                          No hay habilidades públicas listadas.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-6 animate-fadeIn">
                    {portfolio.work_experiences && portfolio.work_experiences.length > 0 ? (
                      portfolio.work_experiences.map((exp) => (
                        <div
                          key={exp.id}
                          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group"
                        >
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C8102E]/20 group-hover:bg-[#C8102E] transition-all"></div>
                          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Briefcase size={24} />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                              <div>
                                <h4 className="text-xl font-bold text-gray-900">{exp.position}</h4>
                                <p className="text-[#C8102E] font-bold flex items-center gap-2">
                                  {exp.company}
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wider">
                                    {exp.employment_type === 'remote'
                                      ? 'Remoto'
                                      : exp.employment_type === 'on_site'
                                        ? 'Presencial'
                                        : 'Híbrido'}
                                  </span>
                                </p>
                              </div>
                              <div className="px-4 py-2 rounded-xl bg-gray-50 text-gray-500 text-xs font-bold flex items-center gap-2">
                                <Calendar size={14} />
                                {exp.start_date} — {exp.end_date || 'Presente'}
                              </div>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                              {exp.description}
                            </p>
                            {exp.skills && exp.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {exp.skills.map((s, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 rounded bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider"
                                  >
                                    {s.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center bg-white rounded-3xl border border-gray-50">
                        <p className="text-gray-400 font-medium italic">
                          No hay trayectoria registrada.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'certifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                    {portfolio.certifications && portfolio.certifications.length > 0 ? (
                      portfolio.certifications.map((cert) => (
                        <div
                          key={cert.id}
                          className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-[#C8102E]/30 transition-all"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden flex items-center justify-center p-2 flex-shrink-0 border border-gray-100">
                            {cert.image_url ? (
                              <img
                                src={cert.image_url}
                                alt={cert.issuing_organization}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Award size={24} className="text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 truncate group-hover:text-[#C8102E] transition-colors">
                              {cert.name}
                            </h4>
                            <p className="text-sm text-[#C8102E] font-medium mb-1">
                              {cert.issuing_organization}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(cert.issue_date).toLocaleDateString('es-ES', {
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>

                            {cert.credential_url && (
                              <a
                                href={cert.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                              >
                                Ver credencial <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-50">
                        <p className="text-gray-400 font-medium italic">
                          No hay certificaciones públicas para mostrar.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
