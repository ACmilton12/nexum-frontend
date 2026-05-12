import React from "react";
import { UserPlus, ShieldCheck, Briefcase, FileText, Globe, Settings, Sparkles } from "lucide-react";

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  { icon: UserPlus, title: "Registro de usuario", description: "Los profesionales TIS pueden registrarse y acceder con usuario y contraseña asociados a la universidad." },
  { icon: ShieldCheck, title: "Control de roles", description: "Sistema de permisos por roles: estudiantes, docentes, coordinadores y administradores del sistema." },
  { icon: Briefcase, title: "Gestión de proyectos", description: "Administra proyectos académicos y laborales, mantén actualizadas tus experiencias de trabajo." },
  { icon: FileText, title: "Exportación PDF", description: "Genera y exporta tu portafolio como archivo PDF profesional listo para compartir con empleadores." },
  { icon: Globe, title: "Multilenguaje", description: "Soporte completo en español e inglés para ampliar las oportunidades a nivel internacional." },
  { icon: Settings, title: "Panel Administrativo", description: "Herramientas de administración para la gestión de usuarios, estadísticas y resolución de incidencias." },
];

function FeatureCard({ feat }: { feat: FeatureItem }) {
  const Icon = feat.icon;
  return (
    <div className="group relative bg-white rounded-[24px] p-8 sm:p-10 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden z-10">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003087] mb-6 group-hover:bg-[#003087] group-hover:text-white transition-colors duration-300 border border-blue-100 group-hover:border-[#003087]">
        <Icon size={26} strokeWidth={1.5} />
      </div>

      <h3 className="font-bold text-[1.15rem] mb-3 text-slate-900 group-hover:text-[#003087] transition-colors">{feat.title}</h3>
      <p className="text-slate-500 leading-relaxed text-[15px]">{feat.description}</p>
    </div>
  )
}

export default function Features() {
  return (
    <section className="pt-12 pb-24 sm:pt-16 sm:pb-32 relative bg-slate-100 overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 text-[#003087] text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            <Sparkles size={16} className="text-[#003087]" />
            <span>Por qué elegirnos</span>
          </div>
          <h2 className="font-extrabold text-4xl lg:text-5xl mb-6 text-slate-900 tracking-tight drop-shadow-sm">
            Funcionalidades diseñadas <br className="hidden sm:block" /> para profesionales
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Todo lo que necesitas para construir, gestionar y destacar tu portafolio profesional en la industria tecnológica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat) => <FeatureCard key={feat.title} feat={feat} />)}
        </div>
      </div>
    </section>
  )
}
