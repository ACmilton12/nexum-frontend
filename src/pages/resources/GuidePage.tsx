import { useTranslation } from 'react-i18next'
import Navbar from '../home/components/Navbar'
import Footer from '../home/components/Footer'
import { BookOpen, UserCircle, Briefcase, FileText, CheckCircle2 } from 'lucide-react'

export default function GuidePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      {/* Cabecera Corporativa */}
      <div className="bg-[#001A5E] pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            {t('resources.guide.title')}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
            {t('resources.guide.description')}
          </p>
        </div>
      </div>

      <main className="flex-grow -mt-10 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-14">
            
            <div className="prose prose-slate max-w-none">
              
              {/* Paso 1 */}
              <div className="mb-14 flex flex-col md:flex-row gap-6 md:gap-10">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                    <UserCircle className="text-slate-700" size={28} />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('resources.guide.step1_title')}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t('resources.guide.step1_desc')}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                      <span>{t('resources.guide.step1_bullet1')}</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                      <span>{t('resources.guide.step1_bullet2')}</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                      <span>{t('resources.guide.step1_bullet3')}</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                      <span>{t('resources.guide.step1_bullet4')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <hr className="border-gray-100 my-10" />

              {/* Paso 2 */}
              <div className="mb-14 flex flex-col md:flex-row gap-6 md:gap-10">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                    <Briefcase className="text-slate-700" size={28} />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('resources.guide.step2_title')}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t('resources.guide.step2_desc')}
                  </p>
                  <ol className="list-decimal pl-5 space-y-3 text-gray-700 marker:text-slate-400 marker:font-bold">
                    <li className="pl-2">{t('resources.guide.step2_bullet1')}</li>
                    <li className="pl-2">{t('resources.guide.step2_bullet2')}</li>
                    <li className="pl-2">{t('resources.guide.step2_bullet3')}</li>
                    <li className="pl-2">{t('resources.guide.step2_bullet4')}</li>
                    <li className="pl-2"><strong>Tip clave:</strong> {t('resources.guide.step2_bullet5').replace('Tip clave: ', '')}</li>
                  </ol>
                </div>
              </div>

              <hr className="border-gray-100 my-10" />

              {/* Paso 3 */}
              <div className="mb-14 flex flex-col md:flex-row gap-6 md:gap-10">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                    <BookOpen className="text-slate-700" size={28} />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('resources.guide.step3_title')}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t('resources.guide.step3_desc')}
                  </p>
                  <ul className="space-y-4">
                    <li className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <strong className="block text-gray-900 mb-1">{t('resources.guide.step3_skills')}</strong>
                      <span className="text-gray-600">{t('resources.guide.step3_skills_desc')}</span>
                    </li>
                    <li className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <strong className="block text-gray-900 mb-1">{t('resources.guide.step3_exp')}</strong>
                      <span className="text-gray-600">{t('resources.guide.step3_exp_desc')}</span>
                    </li>
                    <li className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <strong className="block text-gray-900 mb-1">{t('resources.guide.step3_cert')}</strong>
                      <span className="text-gray-600">{t('resources.guide.step3_cert_desc')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <hr className="border-gray-100 my-10" />

              {/* Paso 4 */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                    <FileText className="text-slate-700" size={28} />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('resources.guide.step4_title')}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t('resources.guide.step4_desc')}
                  </p>
                  <ul className="list-disc pl-5 space-y-3 text-gray-700">
                    <li>{t('resources.guide.step4_bullet1')}</li>
                    <li>{t('resources.guide.step4_bullet2')}</li>
                    <li>{t('resources.guide.step4_bullet3')}</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
