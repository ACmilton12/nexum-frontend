import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Feature } from '../types'

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
  const { t } = useTranslation()

  const features: Feature[] = [
    {
      icon: '👤',
      title: t('features_list.register.title'),
      description: t('features_list.register.desc')
    },
    {
      icon: '🔑',
      title: t('features_list.roles.title'),
      description: t('features_list.roles.desc')
    },
    {
      icon: '📁',
      title: t('features_list.projects.title'),
      description: t('features_list.projects.desc')
    },
    {
      icon: '📄',
      title: t('features_list.pdf.title'),
      description: t('features_list.pdf.desc')
    },
    {
      icon: '🌐',
      title: t('features_list.i18n.title'),
      description: t('features_list.i18n.desc')
    },
    {
      icon: '⚙️',
      title: t('features_list.admin.title'),
      description: t('features_list.admin.desc')
    }
  ]

  return (
    <section className="py-24" style={{ backgroundColor: '#C9D1D9' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-extrabold text-3xl lg:text-4xl mb-4" style={{ color: '#1A1A2E' }}>
            {t('features_list.title')}
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base">{t('features_list.subtitle')}</p>
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
