import { useTranslation } from 'react-i18next'
import Navbar from '../home/components/Navbar'
import Footer from '../home/components/Footer'
import { Calendar } from 'lucide-react'

export default function RulesPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Cabecera Corporativa */}
      <div className="bg-[#001A5E] pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            {t('resources.rules.title')}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
            {t('resources.rules.description')}
          </p>
        </div>
      </div>

      <main className="flex-grow -mt-10 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-14">

            <div className="flex items-center gap-2 text-gray-500 text-sm mb-12 pb-6 border-b border-gray-100">
              <Calendar size={16} />
              <span>{t('resources.rules.last_updated')}</span>
            </div>

            <div className="prose prose-slate max-w-none">
              <section className="mb-14">
                <h2 className="text-2xl font-bold text-gray-900 mb-5 pb-2 border-b-2 border-blue-50 inline-block">
                  {t('resources.rules.sec1_title')}
                </h2>
                <div className="text-gray-700 space-y-4 leading-relaxed">
                  <p>{t('resources.rules.sec1_desc')}</p>
                  <ul className="list-disc pl-5 space-y-3">
                    <li><strong>{t('resources.rules.sec1_bullet1_title')}</strong> {t('resources.rules.sec1_bullet1_desc')}</li>
                    <li><strong>{t('resources.rules.sec1_bullet2_title')}</strong> {t('resources.rules.sec1_bullet2_desc')}</li>
                    <li><strong>{t('resources.rules.sec1_bullet3_title')}</strong> {t('resources.rules.sec1_bullet3_desc')}</li>
                  </ul>
                </div>
              </section>

              <section className="mb-14">
                <h2 className="text-2xl font-bold text-gray-900 mb-5 pb-2 border-b-2 border-blue-50 inline-block">
                  {t('resources.rules.sec2_title')}
                </h2>
                <div className="text-gray-700 space-y-4 leading-relaxed">
                  <p>{t('resources.rules.sec2_desc')}</p>
                  <ul className="list-disc pl-5 space-y-3">
                    <li>
                      <strong>{t('resources.rules.sec2_bullet1_title')}</strong> {t('resources.rules.sec2_bullet1_desc')}
                    </li>
                    <li>
                      <strong>{t('resources.rules.sec2_bullet2_title')}</strong> {t('resources.rules.sec2_bullet2_desc')}
                    </li>
                    <li>
                      <strong>{t('resources.rules.sec2_bullet3_title')}</strong> {t('resources.rules.sec2_bullet3_desc')}
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-5 pb-2 border-b-2 border-blue-50 inline-block">
                  {t('resources.rules.sec3_title')}
                </h2>
                <div className="text-gray-700 space-y-4 leading-relaxed">
                  <p>{t('resources.rules.sec3_desc1')}</p>
                  <p>{t('resources.rules.sec3_desc2')}</p>
                  <ul className="list-disc pl-5 space-y-3">
                    <li>{t('resources.rules.sec3_bullet1')}</li>
                    <li>{t('resources.rules.sec3_bullet2')}</li>
                  </ul>

                  <div className="mt-8 bg-slate-50 border-l-4 border-gray-400 p-5 text-sm text-gray-600 italic rounded-r-lg">
                    {t('resources.rules.sec3_note')}
                  </div>
                </div>
              </section>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
