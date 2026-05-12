import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FolderOpen,
  CheckCircle,
} from "lucide-react";

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

        const [personal, skills, exps, projs, certs] =
          await Promise.all([
            getPersonalData(),
            getPortfolioSkills(),
            getExperiences(),
            getProjects(),
            getCertifications(),
          ]);

        setPersonalData(personal);

        const mappedTech = skills
          .filter((s: any) => s.type === "tecnica" && s.is_active)
          .map((s: any) => ({
            name: s.name,
            level:
              s.level?.toUpperCase().replace("_", " ") || "N/A",
            rawLevel: s.level,
            description: s.justification,
          }));

        const mappedSoft = skills
          .filter((s: any) => s.type === "blanda" && s.is_active)
          .map((s: any) => ({
            name: s.name,
            level:
              s.level === "en_formacion"
                ? "FORMACIÓN"
                : s.level?.toUpperCase() || "N/A",
            rawLevel: s.level,
            description: s.justification,
          }));

        setTechSkills(mappedTech);
        setSoftSkills(mappedSoft);

        setExperiences(
          exps.map((e: any) => ({
            role: e.position,
            company: e.company,
            period: `${new Date(
              e.start_date
            ).toLocaleDateString("es-ES", {
              month: "short",
              year: "numeric",
            })} - ${
              e.end_date
                ? new Date(e.end_date).toLocaleDateString(
                    "es-ES",
                    {
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "Presente"
            }`,
            status: e.end_date ? "Anterior" : "Actual",
            description: e.description,
          }))
        );

        setProjects(
          projs.map((p: any) => ({
            title: p.title,
            tags: [
              "PUBLICADO",
              p.category?.name || "GENERAL",
            ],
            description: p.description,
            tech:
              p.skills?.map((s: any) => s.name) || [],
            year: new Date(
              p.created_at
            ).getFullYear().toString(),
          }))
        );

        setCertifications(
          certs.map((c: any) => ({
            title: c.name,
            tags: ["VERIFICADO"],
            description: c.description,
            tech: [c.issuing_entity],
          }))
        );
      } catch (error) {
        console.error(
          "Error fetching portfolio data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

          <p className="text-slate-400 font-medium">
            Cargando portafolio...
          </p>
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Vista Portafolio" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-950">
          
          {/* CONTENIDO */}
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6 pb-12">

              {/* HEADER */}
              <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                <div className="h-40 w-full bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900"></div>

                <div className="px-8 pb-8 relative">
                  <div className="absolute -top-12 left-8">
                    {personalData?.avatar_url ? (
                      <img
                        src={`${API_BASE_URL.replace(
                          "/api",
                          ""
                        )}/storage/${
                          personalData.avatar_url
                        }`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-slate-900 object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-slate-900 bg-slate-700 flex items-center justify-center text-slate-300 uppercase text-3xl font-bold">
                        {personalData?.user?.first_name?.[0]}
                        {personalData?.user?.last_name?.[0] || (
                          <UserIcon size={48} />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-16 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h1 className="text-3xl font-black text-white">
                        {personalData?.user?.first_name ||
                        personalData?.user?.last_name
                          ? `${personalData.user.first_name || ""} ${
                              personalData.user.last_name || ""
                            }`.trim()
                          : "Usuario Nexum"}
                      </h1>

                      <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mt-1">
                        {personalData?.profession ||
                          "PROFESIONAL"}
                      </p>

                      <div className="flex items-center gap-2 text-slate-400 text-xs mt-3">
                        <MapPin size={14} />
                        <span>
                          {personalData?.location ||
                            "Ubicación no especificada"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-5">
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-200 text-xs">
                          <Phone
                            size={14}
                            className="text-cyan-400"
                          />
                          <span>
                            {personalData?.phone ||
                              "Sin teléfono"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-200 text-xs">
                          <Mail
                            size={14}
                            className="text-cyan-400"
                          />
                          <span>
                            {personalData?.user?.email ||
                              "Sin email"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate("/profile/personal-data")
                      }
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
                  <h2 className="text-2xl font-bold text-white">
                    Acerca de mí
                  </h2>

                  <button
                    onClick={() =>
                      navigate("/profile/personal-data")
                    }
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
                  {personalData?.biography ||
                    "Sin biografía disponible."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-700"
                    >
                      <span className="text-3xl font-black text-cyan-400 mb-1">
                        {stat.value}
                      </span>

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
                  <h2 className="text-2xl font-bold text-white">
                    Experiencia
                  </h2>

                  <button
                    onClick={() =>
                      navigate("/experiencia")
                    }
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

                          <span className="text-[10px] font-bold text-slate-400">
                            {exp.period}
                          </span>
                        </div>

                        <h3 className="font-bold text-white text-base mb-1">
                          {exp.role}
                        </h3>

                        <p className="text-cyan-400 text-xs font-bold mb-4">
                          {exp.company}
                        </p>

                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-slate-800 rounded-2xl border-2 border-dashed border-slate-700">
                      <Briefcase
                        size={32}
                        className="mx-auto text-slate-500 mb-3"
                      />

                      <p className="text-slate-300 font-bold text-sm mb-1">
                        Sin trayectoria laboral
                      </p>

                      <p className="text-slate-500 text-xs">
                        Registra tu experiencia profesional.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* PROYECTOS */}
              <div className="bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    Proyectos
                  </h2>

                  <button
                    onClick={() => navigate("/proyectos")}
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
                        {project.tags.map(
                          (tag: string, tIdx: number) => (
                            <span
                              key={tIdx}
                              className="text-[9px] font-black px-2 py-1 rounded-md uppercase bg-slate-700 text-cyan-300"
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>

                      <h3 className="font-bold text-white text-base mb-3">
                        {project.title}
                      </h3>

                      <p className="text-slate-300 text-[11px] leading-relaxed mb-4 flex-1">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map(
                          (t: string, tIdx: number) => (
                            <span
                              key={tIdx}
                              className="bg-slate-700 text-cyan-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-600"
                            >
                              {t}
                            </span>
                          )
                        )}
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
                  <h2 className="text-2xl font-bold text-white">
                    Certificaciones
                  </h2>

                  <button
                    onClick={() =>
                      navigate("/certificaciones")
                    }
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
                      <h3 className="font-bold text-white text-base mb-3">
                        {cert.title}
                      </h3>

                      <p className="text-slate-300 text-[11px] leading-relaxed mb-4">
                        {cert.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {cert.tech.map(
                          (t: string, tIdx: number) => (
                            <span
                              key={tIdx}
                              className="bg-slate-700 text-violet-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-600"
                            >
                              {t}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR DERECHO */}
          <aside className="w-full lg:w-72 p-6 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 shrink-0 overflow-y-auto">
            <div className="sticky top-6">
              <Calendar />

              <div className="mt-8">
                <h3 className="font-bold text-white text-[11px] mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <ShieldAlert
                    size={14}
                    className="text-cyan-400"
                  />
                  NOTIFICACIONES
                </h3>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <Clock
                      size={14}
                      className="text-cyan-400"
                    />
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <span className="font-bold text-white">
                      Precarga automática
                    </span>{" "}
                    de datos registrados.
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
                      <Edit3
                        size={14}
                        className="text-slate-400 group-hover:text-cyan-400"
                      />
                    </div>

                    <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                      Configurar perfil
                    </span>
                  </div>

                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                      <Eye
                        size={14}
                        className="text-slate-400 group-hover:text-cyan-400"
                      />
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
    </div>
  );
};

export default PortfolioView;