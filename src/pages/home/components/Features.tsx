
import { useTranslation } from 'react-i18next'
import type { Feature } from '../types'

function FeatureCard({ feat }: { feat: Feature }) {

  return (
    <div className="group relative bg-white rounded-[24px] p-8 sm:p-10 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden z-10">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003087] mb-6 group-hover:bg-[#003087] group-hover:text-white transition-colors duration-300 border border-blue-100 group-hover:border-[#003087]">
        <span className="text-2xl">{feat.icon}</span>
      </div>

      <h3 className="font-bold text-[1.15rem] mb-3 text-slate-900 group-hover:text-[#003087] transition-colors">{feat.title}</h3>
      <p className="text-slate-500 leading-relaxed text-[15px]">{feat.description}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat) => <FeatureCard key={feat.title} feat={feat} />)}
        </div>
      </div>
    </section>
  )
}
