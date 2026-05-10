import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, ShieldAlert, Clock, Eye, Edit3, User as UserIcon, Briefcase, FolderOpen, CheckCircle } from "lucide-react";
import Sidebar from "../../admin/components/Sidebar";
import Calendar from "../../../components/ui/Calendar";
import { getPersonalData } from "../../../services/datapersonal.service";
import { getPortfolioSkills } from "../../../services/habilidades.service";
import { getExperiences } from "../../../services/experience.service";
import { getProjects } from "../../../services/project.service";
import { getCertifications } from "../../../services/certification.service";
import { API_BASE_URL } from "../../../utils/constants";

const PortfolioView = () => {
  const [personalData, setPersonalData] = useState<any>(null);
  const [techSkills, setTechSkills] = useState<any[]>([]);
  const [softSkills, setSoftSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [personal, skills, exps, projs, certs] = await Promise.all([
          getPersonalData(),
          getPortfolioSkills(),
          getExperiences(),
          getProjects(),
          getCertifications()
        ]);

        setPersonalData(personal);

        // Map skills
        const mappedTech = skills
          .filter((s: any) => s.type === "tecnica" && s.is_active)
          .map((s: any) => ({
            name: s.name,
            level: s.level?.toUpperCase().replace("_", " ") || "N/A",
            rawLevel: s.level,
            description: s.justification,
          }));
        
        const mappedSoft = skills
          .filter((s: any) => s.type === "blanda" && s.is_active)
          .map((s: any) => ({
            name: s.name,
            level: s.level === "en_formacion" ? "FORMACIÓN" : s.level?.toUpperCase() || "N/A",
            rawLevel: s.level,
            description: s.justification,
          }));

        setTechSkills(mappedTech);
        setSoftSkills(mappedSoft);
        
        // Map experiences
        setExperiences(exps.map((e: any) => ({
          role: e.position,
          company: e.company,
          period: `${new Date(e.start_date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })} - ${e.end_date ? new Date(e.end_date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }) : 'Presente'}`,
          status: e.end_date ? "Anterior" : "Actual",
          description: e.description
        })));

        // Map projects
        setProjects(projs.map((p: any) => ({
          title: p.title,
          tags: ["PUBLICADO", p.category?.name || "GENERAL"],
          description: p.description,
          tech: p.skills?.map((s: any) => s.name) || [],
          year: new Date(p.created_at).getFullYear().toString()
        })));

        // Map certifications
        setCertifications(certs.map((c: any) => ({
          title: c.name,
          tags: ["VERIFICADO"],
          description: c.description,
          tech: [c.issuing_entity]
        })));

      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#cbd5e1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Cargando portafolio...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "PROYECTOS", value: projects.length },
    { label: "TECNOLOGÍAS", value: techSkills.length },
    { label: "EXPERIENCIA", value: experiences.length },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Vista Portafolio" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#cbd5e1]">
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6 pb-12">
              
              {/* --- HEADER SECTION --- */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-40 w-full bg-[#1e293b]"></div>
                <div className="px-8 pb-8 relative">
                  <div className="absolute -top-12 left-8">
                    {personalData?.avatar_url ? (
                      <img 
                        src={`${API_BASE_URL.replace('/api', '')}/storage/${personalData.avatar_url}`} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md bg-white"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-slate-400 shadow-md uppercase text-3xl font-bold">
                        {personalData?.user?.first_name?.[0]}{personalData?.user?.last_name?.[0] || <UserIcon size={48} />}
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-16 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-[#1e293b]">
                        {personalData?.user?.first_name || personalData?.user?.last_name 
                          ? `${personalData.user.first_name || ''} ${personalData.user.last_name || ''}`.trim() 
                          : "Usuario Nexum"}
                      </h1>
                      <p className="text-[#64748b] text-sm font-semibold uppercase tracking-wider mt-1">
                        {personalData?.profession || "PROFESIONAL"}
                      </p>
                      <div className="flex items-center gap-1 text-[#94a3b8] text-xs mt-2">
                        <MapPin size={14} />
                        <span>{personalData?.location || "Ubicación no especificada"}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f1f5f9] rounded-lg border border-gray-100 text-[#334155] text-xs font-medium">
                          <Phone size={14} className="text-[#3b82f6]" />
                          <span>{personalData?.phone || "Sin teléfono"}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f1f5f9] rounded-lg border border-gray-100 text-[#334155] text-xs font-medium">
                          <Mail size={14} className="text-[#3b82f6]" />
                          <span>{personalData?.user?.email || "Sin email"}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-4">
                        {personalData?.linkedin_url && (
                          <a href={personalData.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm min-w-[140px] hover:border-primary/30 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                            <div>
                              <p className="text-[11px] font-bold text-[#1e293b]">LinkedIn</p>
                              <p className="text-[10px] text-[#94a3b8]">Ver perfil</p>
                            </div>
                          </a>
                        )}
                        {personalData?.github_url && (
                          <a href={personalData.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm min-w-[140px] hover:border-primary/30 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                            <div>
                              <p className="text-[11px] font-bold text-[#1e293b]">GitHub</p>
                              <p className="text-[10px] text-[#94a3b8]">Ver perfil</p>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate("/profile/personal-data")}
                      className="flex items-center gap-2 px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#3b82f6] rounded-lg text-xs font-bold transition-colors border border-transparent hover:border-[#3b82f6]/20"
                    >
                      <Edit3 size={14} />
                      Editar Información
                    </button>
                  </div>
                </div>
              </div>

              {/* --- ACERCA DE MÍ --- */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-[#1e293b]">Acerca de mí</h2>
                  <button 
                    onClick={() => navigate("/profile/personal-data")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#3b82f6] rounded-lg text-xs font-bold transition-colors"
                  >
                    <Edit3 size={14} />
                    Editar Acerca de mí
                  </button>
                </div>
                <p className="text-[#3b82f6] text-[10px] font-bold uppercase tracking-widest mb-8">MI PERFIL PROFESIONAL</p>
                <p className="text-[#475569] text-sm leading-relaxed mb-8">
                  {personalData?.biography || "Sin biografía disponible."}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="bg-[#f8fafc] rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-50">
                      <span className="text-3xl font-black text-[#3b82f6] mb-1">{stat.value}</span>
                      <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- HABILIDADES --- */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-[#1e293b]">Habilidades</h2>
                  <button 
                    onClick={() => navigate("/profile/habilidades")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#3b82f6] rounded-lg text-xs font-bold transition-colors"
                  >
                    <Edit3 size={14} />
                    Editar Habilidades
                  </button>
                </div>
                <p className="text-[#3b82f6] text-[10px] font-bold uppercase tracking-widest mb-8">TECNOLOGÍAS Y COMPETENCIAS</p>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-[#1e293b] mb-4">Técnicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {techSkills.length > 0 ? (
                        techSkills.map((skill, idx) => {
                          const levelColors: any = {
                            basico: "border-[#12b29c] shadow-[#12b29c]/10",
                            intermedio: "border-[#f5bd3f] shadow-[#f5bd3f]/10",
                            avanzado: "border-[#6c2e56] shadow-[#6c2e56]/10"
                          };
                          const colorClasses = levelColors[skill.rawLevel] || "border-gray-300 shadow-gray-100";
                          const badgeColors: any = {
                            basico: "bg-[#12b29c]",
                            intermedio: "bg-[#f5bd3f]",
                            avanzado: "bg-[#6c2e56]"
                          };
                          const badgeColor = badgeColors[skill.rawLevel] || "bg-gray-300";

                          return (
                            <div key={idx} className={`bg-white rounded-xl border-l-4 ${colorClasses} shadow-sm hover:shadow-md transition-all p-5`}>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-[#1e293b] text-sm">{skill.name}</span>
                                <span className={`text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${badgeColor}`}>
                                  {skill.level}
                                </span>
                              </div>
                              {skill.description && (
                                <p className="text-[#64748b] text-[10px] mt-2 leading-relaxed italic">{skill.description}</p>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-full py-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                          <p className="text-gray-400 text-xs italic">No has registrado habilidades técnicas. Añade tus fortalezas ahora.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#1e293b] mb-4">Blandas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {softSkills.length > 0 ? (
                        softSkills.map((skill, idx) => {
                          const levelColors: any = {
                            en_formacion: "border-[#12b29c] shadow-[#12b29c]/10",
                            desarrollada: "border-[#f5bd3f] shadow-[#f5bd3f]/10",
                            fortalecida: "border-[#6c2e56] shadow-[#6c2e56]/10"
                          };
                          const colorClasses = levelColors[skill.rawLevel] || "border-gray-300 shadow-gray-100";
                          const badgeColors: any = {
                            en_formacion: "bg-[#12b29c]",
                            desarrollada: "bg-[#f5bd3f]",
                            fortalecida: "bg-[#6c2e56]"
                          };
                          const badgeColor = badgeColors[skill.rawLevel] || "bg-gray-300";

                          return (
                            <div key={idx} className={`bg-white rounded-xl border-l-4 ${colorClasses} shadow-sm hover:shadow-md transition-all p-5`}>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-[#1e293b] text-sm">{skill.name}</span>
                                <span className={`text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${badgeColor}`}>
                                  {skill.level}
                                </span>
                              </div>
                              {skill.description && (
                                <p className="text-[#64748b] text-[10px] mt-2 leading-relaxed italic">{skill.description}</p>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-full py-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                          <p className="text-gray-400 text-xs italic">Aún no hay habilidades blandas registradas.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- EXPERIENCIA --- */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-[#1e293b]">Experiencia</h2>
                  <button 
                    onClick={() => navigate("/experiencia")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#3b82f6] rounded-lg text-xs font-bold transition-colors"
                  >
                    <Edit3 size={14} />
                    Editar Experiencia
                  </button>
                </div>
                <p className="text-[#3b82f6] text-[10px] font-bold uppercase tracking-widest mb-8">TRAYECTORIA LABORAL</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {experiences.length > 0 ? (
                    experiences.map((exp, idx) => (
                      <div key={idx} className="bg-white rounded-xl border-l-4 border-indigo-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${exp.status === "Actual" ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}></div>
                            <span className={`text-[10px] font-black uppercase tracking-wider ${exp.status === "Actual" ? "text-green-600" : "text-gray-400"}`}>{exp.status || "Anterior"}</span>
                          </div>
                          <span className="text-[10px] font-bold text-[#94a3b8]">{exp.period}</span>
                        </div>
                        <h3 className="font-bold text-[#1e293b] text-base mb-1 group-hover:text-indigo-600 transition-colors">{exp.role}</h3>
                        <p className="text-indigo-500 text-xs font-bold mb-4">{exp.company}</p>
                        <p className="text-[#64748b] text-[11px] leading-relaxed">{exp.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <Briefcase size={32} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-bold text-sm mb-1">Sin trayectoria laboral</p>
                      <p className="text-gray-400 text-xs">Registra tu experiencia profesional para potenciar tu perfil.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* --- PROYECTOS --- */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-[#1e293b]">Proyectos</h2>
                  <button 
                    onClick={() => navigate("/proyectos")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#3b82f6] rounded-lg text-xs font-bold transition-colors"
                  >
                    <Edit3 size={14} />
                    Editar Proyectos
                  </button>
                </div>
                <p className="text-[#3b82f6] text-[10px] font-bold uppercase tracking-widest mb-8">PORTAFOLIO DESTACADO</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {projects.length > 0 ? (
                    projects.map((project, idx) => (
                      <div key={idx} className="bg-white rounded-xl border-l-4 border-blue-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col group">
                        <div className="flex gap-2 mb-4">
                          {project.tags.map((tag: string, tIdx: number) => (
                            <span key={tIdx} className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${tag === "PUBLICADO" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-bold text-[#1e293b] text-base mb-3 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                        <p className="text-[#64748b] text-[11px] leading-relaxed mb-4 flex-1">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tech.map((t: string, tIdx: number) => (
                            <span key={tIdx} className="bg-slate-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded border border-blue-50">
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-end mt-auto">
                          <span className="text-[10px] font-bold text-[#94a3b8] bg-white px-2 py-1 rounded-full border border-gray-100 shadow-sm">
                            {project.year}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <FolderOpen size={32} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-bold text-sm mb-1">Portafolio vacío</p>
                      <p className="text-gray-400 text-xs">Comparte tus mejores proyectos con la comunidad.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* --- CERTIFICACIONES --- */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-[#1e293b]">Certificaciones</h2>
                  <button 
                    onClick={() => navigate("/certificaciones")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#3b82f6] rounded-lg text-xs font-bold transition-colors"
                  >
                    <Edit3 size={14} />
                    Editar Certificaciones
                  </button>
                </div>
                <p className="text-[#3b82f6] text-[10px] font-bold uppercase tracking-widest mb-8">LOGROS Y CURSOS COMPLETADOS</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {certifications.length > 0 ? (
                    certifications.map((cert, idx) => (
                      <div key={idx} className="bg-white rounded-xl border-l-4 border-violet-600 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col group">
                        <div className="flex gap-2 mb-4">
                          {cert.tags.map((tag: string, tIdx: number) => (
                            <span key={tIdx} className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${tag === "VERIFICADO" ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700"}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-bold text-[#1e293b] text-base mb-3 leading-snug group-hover:text-violet-600 transition-colors">{cert.title}</h3>
                        <p className="text-[#64748b] text-[11px] leading-relaxed mb-6 flex-1">{cert.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {cert.tech.map((t: string, tIdx: number) => (
                            <span key={tIdx} className="bg-slate-50 text-violet-600 text-[10px] font-bold px-2 py-1 rounded border border-violet-50">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <CheckCircle size={32} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-bold text-sm mb-1">Sin certificaciones</p>
                      <p className="text-gray-400 text-xs">Valida tus conocimientos añadiendo tus certificados.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDEBAR --- */}
          <aside className="w-full lg:w-72 p-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 shrink-0 overflow-y-auto">
            <div className="sticky top-6">
              <Calendar />

              <div className="mt-8">
                <h3 className="font-bold text-[#1e293b] text-[11px] mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <ShieldAlert size={14} className="text-[#3b82f6]" />
                  NOTIFICACIONES
                </h3>
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-50 shadow-sm">
                    <Clock size={14} className="text-[#3b82f6]" />
                  </div>
                  <p className="text-[11px] text-[#64748b] leading-relaxed">
                    <span className="font-bold text-[#1e293b]">Precarga automática</span> de datos registrados al acceder al formulario.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-bold text-[#1e293b] text-[11px] mb-4 uppercase tracking-widest">Enlaces rápidos</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-2 bg-[#f8fafc] rounded-lg group-hover:bg-[#eff6ff] transition-colors">
                      <Edit3 size={14} className="text-[#94a3b8] group-hover:text-[#3b82f6]" />
                    </div>
                    <span className="text-xs font-medium text-[#64748b] group-hover:text-[#1e293b] transition-colors">Configurar perfil</span>
                  </div>
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-2 bg-[#f8fafc] rounded-lg group-hover:bg-[#eff6ff] transition-colors">
                      <Eye size={14} className="text-[#94a3b8] group-hover:text-[#3b82f6]" />
                    </div>
                    <span className="text-xs font-medium text-[#64748b] group-hover:text-[#1e293b] transition-colors">Vista pública del perfil</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default PortfolioView;
