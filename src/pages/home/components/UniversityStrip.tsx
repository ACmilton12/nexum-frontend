import { useTranslation } from 'react-i18next'

export default function UniversityStrip() {
  const { t } = useTranslation()

  return (
    <div className="py-8 border-y" style={{ backgroundColor: '#FFFFFF', borderColor: '#C9D1D9' }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-6">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1A1A2E' }}>
          {t('university_strip.backed_by')}
        </p>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {['UMSS', 'FCyT', t('university_strip.dept')].map((uni) => (
            <span
              key={uni}
              className="text-xs font-bold px-4 py-1.5 rounded-full border"
              style={{ color: '#003087', borderColor: '#003087', backgroundColor: '#f0f4ff' }}
            >
              {uni}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
