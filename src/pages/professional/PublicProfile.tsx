import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, GraduationCap, Award, ExternalLink, Mail } from 'lucide-react';

// === MOCK DATA ===
const MOCK_PROFILE = {
  id: 1,
  firstName: "Carlos",
  lastName: "Mendoza",
  profession: "Desarrollador Full Stack Senior",
  avatarUrl: "https://ui-avatars.com/api/?name=Carlos+Mendoza&background=003087&color=fff&size=300", // Avatar seguro con iniciales
  
  socials: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    youtube: "https://youtube.com/",
    email: "carlos.mendoza@email.com"
  },
  
  skills: {
    hard: ["React.js", "Node.js", "TypeScript", "Python", "PostgreSQL", "MongoDB", "AWS", "Docker", "NestJS", "Next.js"],
    soft: ["Arquitectura de Software", "Liderazgo Técnico", "Metodologías Ágiles (Scrum)", "Resolución de Problemas", "Mentoría"]
  },
  
  experience: [
    {
      id: 1,
      title: "Desarrollador Full Stack Senior",
      company: "Tech Solutions S.A.",
      type: "Jornada completa",
      dateRange: "Ene 2022 - Actualidad",
      location: "Remoto",
      description: "Diseño y desarrollo de una plataforma SaaS escalable utilizando React y NestJS. Implementación de CI/CD con GitHub Actions y despliegue en AWS ECS. Reducción del tiempo de carga de la aplicación principal en un 60%."
    },
    {
      id: 2,
      title: "Desarrollador Backend",
      company: "Innovate Software Labs",
      type: "Jornada completa",
      dateRange: "Mar 2019 - Dic 2021",
      location: "Madrid, España",
      description: "Construcción de APIs RESTful de alto rendimiento usando Node.js y Express. Migración de base de datos monolítica a una arquitectura de microservicios. Optimización de consultas complejas en PostgreSQL."
    }
  ],
  
  education: [
    {
      id: 1,
      school: "Universidad de Tecnología Avanzada",
      degree: "Ingeniería de Software",
      dateRange: "2014 - 2018"
    }
  ],
  
  projects: [
    {
      id: 1,
      title: "Sistema de Reservas para Hotel Boutique",
      type: "Proyecto Principal",
      year: "2023",
      description: "Plataforma web completa que permite a los huéspedes visualizar disponibilidad, realizar reservas y pagos en línea. El panel administrativo incluye gestión de habitaciones, facturación y reportes de ocupación. Stack: React, Node.js, Express, PostgreSQL.",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Software de Gestión Odontológica",
      type: "Proyecto Freelance",
      year: "2022",
      description: "Sistema para clínicas dentales que incluye agenda electrónica, historias clínicas digitales, odontogramas interactivos y control de inventario de insumos médicos. Stack: Next.js, TailwindCSS, NestJS, MongoDB.",
      imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop"
    }
  ],
  
  certifications: [
    {
      id: 1,
      title: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services (AWS)",
      date: "Nov 2023"
    },
    {
      id: 2,
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera",
      date: "Ago 2022"
    }
  ]
};

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // En un entorno real, haríamos un fetch aquí usando el ID.
  const profile = MOCK_PROFILE;

  return (
    <div className="min-h-screen bg-[#f3f2ef] pb-12 font-sans">
      {/* Botón flotante para regresar */}
      <div className="max-w-4xl mx-auto pt-6 px-4 mb-4">
        <button 
          onClick={() => navigate('/directorio')}
          className="flex items-center text-[#666] hover:text-[#003087] font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver al Directorio
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 flex flex-col gap-4">
        
        {/* --- HEADER CARD --- */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
          {/* Cover Banner (Color plomo oscuro) */}
          <div className="h-48 w-full relative bg-slate-700"></div>
          
          <div className="px-6 pb-6 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm">
                <img src={profile.avatarUrl} alt={profile.firstName} className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* User Info Area */}
            <div className="pt-20 pb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h1>
                  <p className="text-gray-700 text-lg mt-1 font-medium">{profile.profession}</p>
                </div>
                
                {/* Social Icons instead of stats */}
                <div className="flex items-center gap-3">
                  <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors" title="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  </a>
                  <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#e8f3ff] hover:bg-[#d0e6ff] text-[#0a66c2] rounded-full transition-colors" title="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <a href={profile.socials.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#ffeded] hover:bg-[#ffdbdb] text-[#ff0000] rounded-full transition-colors" title="YouTube">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                  </a>
                  <a href={`mailto:${profile.socials.email}`} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors" title="Email">
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENIDO DEL PERFIL */}
        <div className="flex flex-col gap-4">
            
            {/* --- APTITUDES / HABILIDADES --- */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Aptitudes / Habilidades</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Informa sobre tu idoneidad para nuevas oportunidades. El 50 % de los técnicos de selección se basan en las aptitudes para cubrir sus vacantes.
              </p>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Habilidades Técnicas (Duras)</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.hard.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-[#f3f2ef] text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Habilidades Interpersonales (Blandas)</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.soft.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-[#f3f2ef] text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* --- EXPERIENCIA --- */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Experiencia</h2>
              <p className="text-sm text-gray-500 mb-6">Muestra tus logros y consigue hasta el doble de visualizaciones del perfil y contactos.</p>

              <div className="flex flex-col gap-6">
                {profile.experience.map(exp => (
                  <div key={exp.id} className="flex gap-4">
                    <div className="w-12 h-12 bg-[#f3f2ef] rounded-md flex items-center justify-center shrink-0 border border-gray-200">
                      <Building2 className="text-gray-500 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.title}</h3>
                      <p className="text-sm text-gray-800 font-medium">{exp.company} · {exp.type}</p>
                      <p className="text-xs text-gray-500 mt-1">{exp.dateRange} · {exp.location}</p>
                      <p className="text-sm text-gray-700 mt-3 leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- EDUCACIÓN --- */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Educación</h2>
              <p className="text-sm text-gray-500 mb-6">Muestra tus aptitudes y tendrás el doble de probabilidad de recibir mensajes InMail de técnicos de selección.</p>

              <div className="flex flex-col gap-6">
                {profile.education.map(edu => (
                  <div key={edu.id} className="flex gap-4">
                    <div className="w-12 h-12 bg-[#f3f2ef] rounded-md flex items-center justify-center shrink-0 border border-gray-200">
                      <GraduationCap className="text-gray-500 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.school}</h3>
                      <p className="text-sm text-gray-800">{edu.degree}</p>
                      <p className="text-xs text-gray-500 mt-1">{edu.dateRange}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- PROYECTOS DESTACADOS --- */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Proyectos Destacados</h2>
              <p className="text-sm text-gray-500 mb-6">Destaca los proyectos clave en los que has trabajado para demostrar tu experiencia práctica.</p>

              <div className="flex flex-col gap-6">
                {profile.projects.map(project => (
                  <div key={project.id} className="flex gap-4 flex-col sm:flex-row">
                    <div className="w-full sm:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600 font-medium">{project.type} - {project.year}</p>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">{project.description}</p>
                      <button className="mt-3 text-sm text-[#003087] font-semibold hover:underline flex items-center gap-1">
                        Ver proyecto <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- CERTIFICACIONES --- */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Certificaciones</h2>
              <p className="text-sm text-gray-500 mb-6">Las certificaciones aumentan tu credibilidad y te hacen destacar ante los reclutadores.</p>

              <div className="flex flex-col gap-6">
                {profile.certifications.map(cert => (
                  <div key={cert.id} className="flex gap-4">
                    <div className="w-12 h-12 bg-[#f3f2ef] rounded-md flex items-center justify-center shrink-0 border border-gray-200">
                      <Award className="text-gray-500 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{cert.title}</h3>
                      <p className="text-sm text-gray-800">{cert.issuer}</p>
                      <p className="text-xs text-gray-500 mt-1">Expedición: {cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

      </div>
    </div>
  );
};

export default PublicProfile;
