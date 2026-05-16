import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function CTA() {
  const { t } = useTranslation()

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#003087' }}>
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: '#C8102E' }}
        />
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <h2 className="text-white font-extrabold text-3xl lg:text-4xl mb-4">{t('cta.title')}</h2>
        <p className="text-blue-200 text-base mb-10 max-w-xl mx-auto">{t('cta.subtitle')}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-xl no-underline"
            style={{ backgroundColor: '#C8102E' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#a50d25')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#C8102E')
            }
          >
            {t('cta.start')}
          </Link>
          <Link
            to="/Home"
            className="border-2 border-white/50 hover:border-white text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 no-underline"
          >
            {t('recent.view_portfolio')}s
          </Link>
        </div>
      </div>
    </section>
  )
}
