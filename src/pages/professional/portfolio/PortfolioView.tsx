import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Loader2,
  Download,
  FileText,
  X
} from 'lucide-react'

import Sidebar from '../../admin/components/Sidebar'
import Calendar from '../../../components/ui/Calendar'

import { getPersonalData } from '../../../services/datapersonal.service'
import { getPortfolioSkills } from '../../../services/habilidades.service'
import { getExperiences } from '../../../services/experience.service'
import { getProjects } from '../../../services/project.service'
import { getCertifications } from '../../../services/certification.service'

import { API_BASE_URL } from '../../../utils/constants'

const PortfolioView = () => {
  const { t } = useTranslation()
  const [personalData, setPersonalData] = useState<any>(null)
  const [techSkills, setTechSkills] = useState<any[]>([])
  const [experiences, setExperiences] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [certifications, setCertifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [personal, skills, exps, projs, certs] = await Promise.all([
          getPersonalData(),
          getPortfolioSkills(),
          getExperiences(),
          getProjects(),
          getCertifications()
        ])

        setPersonalData(personal)

        // Mapeo de Habilidades Técnicas
        const mappedTech = (skills || [])
          .filter((s: any) => s.type === 'tecnica' && s.is_active)
          .map((s: any) => ({
            name: s.name,
            level: s.level?.toUpperCase().replace('_', ' ') || 'N/A',
            rawLevel: s.level,
            description: s.justification
          }))
        setTechSkills(mappedTech)

        // Mapeo de Experiencia Laboral
        setExperiences(
          (exps || []).map((e: any) => ({
            role: e.position,
            company: e.company,
            period: `${new Date(e.start_date).toLocaleDateString('es-ES', {
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
            description: e.description
          }))
        )

        // Mapeo de Proyectos
        setProjects(
          (projs || []).map((p: any) => ({
            title: p.title,
            tags: ['PUBLICADO', p.category?.name || 'GENERAL'],
            description: p.description,
            tech: p.skills?.map((s: any) => s.name) || [],
            year: p.created_at ? new Date(p.created_at).getFullYear().toString() : 'N/A'
          }))
        )

        // Mapeo de Certificaciones
        setCertifications(
          (certs || []).map((c: any) => ({
            title: c.name,
            tags: ['VERIFICADO'],
            description: c.description,
            tech: [c.issuing_entity]
          }))
        )
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])



  const stats = [
    { label: 'PROYECTOS', value: projects.length },
    { label: 'TECNOLOGÍAS', value: techSkills.length },
    { label: 'EXPERIENCIA', value: experiences.length }
  ]

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Vista Portafolio" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-background dark:bg-slate-900 transition-colors duration-300">
          {/* CONTENIDO */}
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-8 overflow-y-auto">
            <header className="mb-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">
                    {t('skills.platform_name', 'NEXUM • PLATAFORMA PROFESIONAL')}
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-textMain dark:text-white">
                    {t('sidebar.portfolio_view', 'Vista de Portafolio')}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('portfolio.view_subtitle', 'Visualiza cómo se muestra tu perfil a los demás.')}
                  </p>
                </div>

                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg border border-slate-800 dark:border-white"
                >
                  <Download size={18} />
                  Descargar Portafolio
                </button>
              </div>
            </header>

            <div className="max-w-5xl mx-auto space-y-6 pb-12">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    {t('portfolio.loading', 'Cargando portafolio...')}
                  </p>
                </div>
              ) : (
                <>
                  {/* HEADER */}
                  <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                    <div className="h-40 w-full bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900"></div>

                    <div className="px-8 pb-8 relative">
                      <div className="absolute -top-12 left-8">
                        {personalData?.avatar_url ? (
                          <img
                            src={`${API_BASE_URL.replace('/api', '')}/storage/${personalData.avatar_url
                              }`}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-slate-900 object-cover shadow-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full border-4 border-slate-900 bg-slate-700 flex items-center justify-center text-slate-300 uppercase text-3xl font-bold">
                            {personalData?.user?.first_name?.[0]}
                            {personalData?.user?.last_name?.[0] || <UserIcon size={48} />}
                          </div>
                        )}
                      </div>

                      <div className="pt-16 flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <h1 className="text-3xl font-black text-white">
                            {personalData?.user?.first_name || personalData?.user?.last_name
                              ? `${personalData.user.first_name || ''} ${personalData.user.last_name || ''
                                }`.trim()
                              : 'Usuario Nexum'}
                          </h1>

                          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mt-1">
                            {personalData?.profession || 'PROFESIONAL'}
                          </p>

                          <div className="flex items-center gap-2 text-slate-400 text-xs mt-3">
                            <MapPin size={14} />
                            <span>{personalData?.location || 'Ubicación no especificada'}</span>
                          </div>

                          <div className="flex flex-wrap gap-4 mt-5">
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-200 text-xs">
                              <Phone size={14} className="text-cyan-400" />
                              <span>{personalData?.phone || 'Sin teléfono'}</span>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-200 text-xs">
                              <Mail size={14} className="text-cyan-400" />
                              <span>{personalData?.user?.email || 'Sin email'}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate('/profile/personal-data')}
                          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold transition-all duration-300 shadow-lg"
                        >
                          <Edit3 size={14} />
                          Editar Información
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ACERCA DE MI */}
                  <div className="bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-2xl font-bold text-white">Acerca de mí</h2>

                      <button
                        onClick={() => navigate('/profile/personal-data')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-bold transition-all"
                      >
                        <Edit3 size={14} />
                        Editar
                      </button>
                    </div>

                    <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                      MI PERFIL PROFESIONAL
                    </p>

                    <p className="text-slate-300 text-sm leading-relaxed mb-8">
                      {personalData?.biography || 'Sin biografía disponible.'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {stats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-700"
                        >
                          <span className="text-3xl font-black text-cyan-400 mb-1">{stat.value}</span>

                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EXPERIENCIA */}
                  <div className="bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-2xl font-bold text-white">Experiencia</h2>

                      <button
                        onClick={() => navigate('/experiencia')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-bold transition-all"
                      >
                        <Edit3 size={14} />
                        Editar
                      </button>
                    </div>

                    <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                      TRAYECTORIA LABORAL
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {experiences.length > 0 ? (
                        experiences.map((exp, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-800 rounded-xl border-l-4 border-cyan-400 shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 p-6"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                                {exp.status}
                              </span>

                              <span className="text-[10px] font-bold text-slate-400">{exp.period}</span>
                            </div>

                            <h3 className="font-bold text-white text-base mb-1">{exp.role}</h3>

                            <p className="text-cyan-400 text-xs font-bold mb-4">{exp.company}</p>

                            <p className="text-slate-300 text-[11px] leading-relaxed">
                              {exp.description}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-12 text-center bg-slate-800 rounded-2xl border-2 border-dashed border-slate-700">
                          <Briefcase size={32} className="mx-auto text-slate-500 mb-3" />

                          <p className="text-slate-300 font-bold text-sm mb-1">
                            Sin trayectoria laboral
                          </p>

                          <p className="text-slate-500 text-xs">Registra tu experiencia profesional.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PROYECTOS */}
                  <div className="bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-2xl font-bold text-white">Proyectos</h2>

                      <button
                        onClick={() => navigate('/proyectos')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-bold transition-all"
                      >
                        <Edit3 size={14} />
                        Editar
                      </button>
                    </div>

                    <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                      PORTAFOLIO DESTACADO
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {projects.map((project, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-800 rounded-xl border-l-4 border-blue-500 shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col"
                        >
                          <div className="flex gap-2 mb-4">
                            {project.tags.map((tag: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="text-[9px] font-black px-2 py-1 rounded-md uppercase bg-slate-700 text-cyan-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <h3 className="font-bold text-white text-base mb-3">{project.title}</h3>

                          <p className="text-slate-300 text-[11px] leading-relaxed mb-4 flex-1">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech.map((t: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="bg-slate-700 text-cyan-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-600"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          <div className="flex justify-end">
                            <span className="text-[10px] font-bold text-slate-300 bg-slate-700 px-2 py-1 rounded-full">
                              {project.year}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CERTIFICACIONES */}
                  <div className="bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-2xl font-bold text-white">Certificaciones</h2>

                      <button
                        onClick={() => navigate('/certificaciones')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-bold transition-all"
                      >
                        <Edit3 size={14} />
                        Editar
                      </button>
                    </div>

                    <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                      LOGROS Y CURSOS COMPLETADOS
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {certifications.map((cert, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-800 rounded-xl border-l-4 border-violet-500 shadow-lg hover:-translate-y-1 transition-all duration-300 p-6"
                        >
                          <h3 className="font-bold text-white text-base mb-3">{cert.title}</h3>

                          <p className="text-slate-300 text-[11px] leading-relaxed mb-4">
                            {cert.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {cert.tech.map((t: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="bg-slate-700 text-violet-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-600"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SIDEBAR DERECHO */}
          <aside className="w-full lg:w-72 p-6 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 shrink-0 overflow-y-auto">
            <div className="sticky top-6">
              <Calendar />

              <div className="mt-8">
                <h3 className="font-bold text-white text-[11px] mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <ShieldAlert size={14} className="text-cyan-400" />
                  NOTIFICACIONES
                </h3>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <Clock size={14} className="text-cyan-400" />
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <span className="font-bold text-white">Precarga automática</span> de datos
                    registrados.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-bold text-white text-[11px] mb-4 uppercase tracking-widest">
                  Enlaces rápidos
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                      <Edit3 size={14} className="text-slate-400 group-hover:text-cyan-400" />
                    </div>

                    <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                      Configurar perfil
                    </span>
                  </div>

                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                      <Eye size={14} className="text-slate-400 group-hover:text-cyan-400" />
                    </div>

                    <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                      Vista pública del perfil
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>

      {/* MODAL DE DESCARGA */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800 animate-slideUp">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Descargar Portafolio
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selecciona una plantilla para generar tu documento
                </p>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    id: 'modern',
                    name: 'MODERNO',
                    desc: 'Limpio y profesional con enfoque en legibilidad.',
                    color: 'bg-cyan-500'
                  },
                  {
                    id: 'elegant',
                    name: 'ELEGANTE',
                    desc: 'Minimalista y sofisticado para perfiles ejecutivos.',
                    color: 'bg-indigo-600'
                  },
                  {
                    id: 'creative',
                    name: 'CREATIVO',
                    desc: 'Dinámico y vibrante para destacar tu marca personal.',
                    color: 'bg-rose-500'
                  }
                ].map((tpl) => (
                  <div
                    key={tpl.id}
                    className="group relative bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border-2 border-transparent hover:border-cyan-400 transition-all cursor-pointer flex flex-col items-center text-center"
                  >
                    <div className={`${tpl.color} w-full h-32 rounded-xl mb-4 flex items-center justify-center text-white`}>
                      <FileText size={48} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm mb-2 uppercase tracking-wide">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                      {tpl.desc}
                    </p>
                    <div className="flex gap-2 w-full mt-auto">
                      <button
                        onClick={() => setPreviewTemplate(tpl)}
                        className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-[10px] font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye size={12} />
                        VISTA PREVIA
                      </button>
                      <button className="flex-1 py-2 bg-slate-900 dark:bg-cyan-600 text-white rounded-lg text-[10px] font-bold hover:bg-cyan-500 dark:hover:bg-cyan-400 transition-colors">
                        SELECCIONAR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 transition-colors"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PREVISUALIZACIÓN */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${previewTemplate.color}`}></div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Previsualización: {previewTemplate.name}
                </h2>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-gray-200 dark:bg-slate-950/50 flex justify-center">
              {/* SIMULACIÓN DE DOCUMENTO A4 */}
              <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl rounded-sm p-12 text-slate-900 relative">
                {/* DISEÑO SEGÚN TEMPLATE */}
                {previewTemplate.id === 'modern' && (
                  <div className="font-sans">
                    <div className="border-b-4 border-cyan-500 pb-8 mb-8 flex justify-between items-start">
                      <div>
                        <h1 className="text-4xl font-black uppercase mb-2">
                          {personalData?.user?.first_name} {personalData?.user?.last_name}
                        </h1>
                        <p className="text-cyan-600 font-bold tracking-widest uppercase">
                          {personalData?.profession}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{personalData?.location}</p>
                        <p>{personalData?.user?.email}</p>
                        <p>{personalData?.phone}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-12">
                      <div className="col-span-2 space-y-8">
                        <section>
                          <h2 className="text-lg font-bold border-l-4 border-cyan-500 pl-3 mb-4 uppercase">Perfil</h2>
                          <p className="text-sm leading-relaxed text-gray-700">{personalData?.biography}</p>
                        </section>

                        <section>
                          <h2 className="text-lg font-bold border-l-4 border-cyan-500 pl-3 mb-4 uppercase">Experiencia</h2>
                          <div className="space-y-6">
                            {experiences.slice(0, 3).map((exp, i) => (
                              <div key={i}>
                                <h3 className="font-bold text-sm">{exp.role}</h3>
                                <p className="text-cyan-600 text-xs font-bold">{exp.company} | {exp.period}</p>
                                <p className="text-xs mt-2 text-gray-600">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>

                      <div className="space-y-8">
                        <section>
                          <h2 className="text-lg font-bold border-l-4 border-cyan-500 pl-3 mb-4 uppercase">Habilidades</h2>
                          <div className="flex flex-wrap gap-2">
                            {techSkills.map((s, i) => (
                              <span key={i} className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold">{s.name}</span>
                            ))}
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                )}

                {previewTemplate.id === 'elegant' && (
                  <div className="font-serif">
                    <div className="text-center mb-16">
                      <h1 className="text-5xl font-light mb-4">
                        {personalData?.user?.first_name} {personalData?.user?.last_name}
                      </h1>
                      <div className="w-20 h-px bg-slate-300 mx-auto mb-4"></div>
                      <p className="italic text-slate-500 tracking-[0.2em]">{personalData?.profession}</p>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-12">
                      <section className="text-center">
                        <p className="text-sm italic leading-loose text-slate-600">"{personalData?.biography}"</p>
                      </section>

                      <section>
                        <h2 className="text-center text-xs tracking-[0.3em] uppercase mb-8 text-slate-400">Trayectoria</h2>
                        <div className="space-y-8">
                          {experiences.slice(0, 3).map((exp, i) => (
                            <div key={i} className="text-center">
                              <h3 className="text-sm font-bold uppercase tracking-widest">{exp.role}</h3>
                              <p className="text-xs text-slate-500 my-1">{exp.company} / {exp.period}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                )}

                {previewTemplate.id === 'creative' && (
                  <div className="font-sans flex h-full gap-0">
                    <div className="w-1/3 bg-slate-900 text-white p-8 -m-12 mr-8 flex flex-col">
                      <div className="w-32 h-32 rounded-2xl bg-rose-500 mb-8 overflow-hidden">
                         <div className="w-full h-full flex items-center justify-center text-4xl font-black">
                           {personalData?.user?.first_name?.[0]}
                         </div>
                      </div>
                      <h2 className="text-xl font-black uppercase mb-8">Contacto</h2>
                      <div className="space-y-4 text-xs text-slate-400">
                        <p>{personalData?.user?.email}</p>
                        <p>{personalData?.phone}</p>
                        <p>{personalData?.location}</p>
                      </div>
                    </div>
                    <div className="flex-1 py-4">
                       <h1 className="text-6xl font-black uppercase mb-2 tracking-tighter text-rose-500 leading-none">
                         {personalData?.user?.first_name}<br/>{personalData?.user?.last_name}
                       </h1>
                       <p className="text-xl font-bold uppercase tracking-widest mb-12">{personalData?.profession}</p>

                       <section className="mb-12">
                         <h2 className="text-sm font-black bg-rose-500 text-white inline-block px-3 py-1 uppercase mb-6 italic">Sobre mí</h2>
                         <p className="text-sm leading-relaxed">{personalData?.biography}</p>
                       </section>

                       <section>
                         <h2 className="text-sm font-black bg-rose-500 text-white inline-block px-3 py-1 uppercase mb-6 italic">Proyectos</h2>
                         <div className="grid grid-cols-2 gap-4">
                           {projects.slice(0, 4).map((p, i) => (
                             <div key={i} className="border-b-2 border-slate-100 pb-2">
                               <h3 className="font-bold text-xs uppercase">{p.title}</h3>
                               <p className="text-[10px] text-slate-500 uppercase">{p.year}</p>
                             </div>
                           ))}
                         </div>
                       </section>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex justify-center gap-4">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-8 py-3 bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                CERRAR VISTA PREVIA
              </button>
              <button
                className="px-8 py-3 bg-cyan-500 text-slate-950 rounded-xl font-bold text-sm hover:bg-cyan-400 transition-all shadow-lg"
              >
                USAR ESTA PLANTILLA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PortfolioView
