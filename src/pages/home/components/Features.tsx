import { useState } from 'react'
import type { Feature } from '../types'

const features: Feature[] = [
  {
    icon: '👤',
    title: 'Registro de usuario',
    description:
      'Los profesionales TIS pueden registrarse y acceder con usuario y contraseña asociados a la universidad.'
  },
  {
    icon: '🔑',
    title: 'Control de roles',
    description:
      'Sistema de permisos por roles: estudiantes, docentes, coordinadores y administradores del sistema.'
  },
  {
    icon: '📁',
    title: 'Gestión de proyectos',
    description:
      'Administra proyectos académicos y laborales, mantén actualizadas tus experiencias de trabajo.'
  },
  {
    icon: '📄',
    title: 'Exportación PDF',
    description:
      'Genera y exporta tu portafolio como archivo PDF profesional listo para compartir con empleadores.'
  },
  {
    icon: '🌐',
    title: 'Multilenguaje',
    description:
      'Soporte completo en español e inglés para ampliar las oportunidades a nivel internacional.'
  },
  {
    icon: '⚙️',
    title: 'Panel Administrativo',
    description:
      'Herramientas de administración para la gestión de usuarios, estadísticas y resolución de incidencias.'
  }
]

function FeatureCard({ feat }: { feat: Feature }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="rounded-2xl p-7 border transition-all duration-300 cursor-default hover:shadow-xl hover:-translate-y-1"
      style={{
        backgroundColor: hovered ? '#003087' : '#FFFFFF',
        borderColor: hovered ? '#003087' : '#C9D1D9'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-colors duration-300"
        style={{ backgroundColor: hovered ? 'rgba(255,255,255,0.15)' : '#f0f4ff' }}
      >
        {feat.icon}
      </div>
      <h3 className="font-bold text-lg mb-3" style={{ color: hovered ? '#FFFFFF' : '#1A1A2E' }}>
        {feat.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: hovered ? '#bfdbfe' : '#6b7280' }}>
        {feat.description}
      </p>
    </div>
  )
}

export default function Features() {
  return (
    <section className="py-24" style={{ backgroundColor: '#C9D1D9' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-extrabold text-3xl lg:text-4xl mb-4" style={{ color: '#1A1A2E' }}>
            Funcionalidades del Sistema
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base">
            Todo lo que necesitas para construir y gestionar tu portafolio profesional.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <FeatureCard key={feat.title} feat={feat} />
          ))}
        </div>
      </div>
    </section>
  )
}
