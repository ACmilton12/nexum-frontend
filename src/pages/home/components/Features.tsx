import { useTranslation } from 'react-i18next'
import { UserPlus, ShieldCheck, Briefcase, FileText, Globe2, SlidersHorizontal } from 'lucide-react'
import type { Feature } from '../types'

function FeatureCard({ feat }: { feat: Feature }) {
  return (
    <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden z-10">
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
        {feat.icon}
      </div>

      <h3 className="font-bold text-xl mb-3 text-textMain tracking-tight">{feat.title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm font-medium">{feat.description}</p>
    </div>
  )
}

export default function Features() {
  const { t } = useTranslation()

  const features: Feature[] = [
    {
      icon: <UserPlus className="w-7 h-7" strokeWidth={2} />,
      title: t('features_list.register.title'),
      description: t('features_list.register.desc')
    },
    {
      icon: <ShieldCheck className="w-7 h-7" strokeWidth={2} />,
      title: t('features_list.roles.title'),
      description: t('features_list.roles.desc')
    },
    {
      icon: <Briefcase className="w-7 h-7" strokeWidth={2} />,
      title: t('features_list.projects.title'),
      description: t('features_list.projects.desc')
    },
    {
      icon: <FileText className="w-7 h-7" strokeWidth={2} />,
      title: t('features_list.pdf.title'),
      description: t('features_list.pdf.desc')
    },
    {
      icon: <Globe2 className="w-7 h-7" strokeWidth={2} />,
      title: t('features_list.i18n.title'),
      description: t('features_list.i18n.desc')
    },
    {
      icon: <SlidersHorizontal className="w-7 h-7" strokeWidth={2} />,
      title: t('features_list.admin.title'),
      description: t('features_list.admin.desc')
    }
  ]

  return (
    <section className="pt-16 pb-24 sm:pt-20 sm:pb-32 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-textMain mb-5">
            {t('features_list.title')}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg font-medium">
            {t('features_list.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat) => <FeatureCard key={feat.title} feat={feat} />)}
        </div>
      </div>
    </section>
  )
}
