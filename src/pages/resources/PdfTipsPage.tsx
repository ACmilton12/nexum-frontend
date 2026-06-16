import { useTranslation } from 'react-i18next'
import Navbar from '../home/components/Navbar'
import Footer from '../home/components/Footer'
import { LayoutTemplate, Image as ImageIcon, AlignLeft, CheckCircle2 } from 'lucide-react'

export default function PdfTipsPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Cabecera Corporativa */}
      <div className="bg-[#001A5E] pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            {t('resources.pdf.title')}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
            {t('resources.pdf.description')}
          </p>
        </div>
      </div>

      <main className="flex-grow -mt-10 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-14">

            <div className="prose prose-slate max-w-none">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">

                {/* Tip 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="text-slate-700" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 m-0">{t('resources.pdf.tip1_title')}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t('resources.pdf.tip1_desc')}
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                      <span>{t('resources.pdf.tip1_bullet1')}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                      <span>{t('resources.pdf.tip1_bullet2')}</span>
                    </li>
                  </ul>
                </div>

                {/* Tip 2 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlignLeft className="text-slate-700" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 m-0">{t('resources.pdf.tip2_title')}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t('resources.pdf.tip2_desc')}
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                      <span>{t('resources.pdf.tip2_bullet1')}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                      <span>{t('resources.pdf.tip2_bullet2')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <hr className="border-gray-100 my-12" />

              {/* Tip 3 */}
              <div className="mb-14">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LayoutTemplate className="text-slate-700" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 m-0">{t('resources.pdf.tip3_title')}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {t('resources.pdf.tip3_desc')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-slate-200 p-5 rounded-lg bg-slate-50">
                    <h4 className="font-bold text-gray-900 mb-2">{t('resources.pdf.classic')}</h4>
                    <p className="text-sm text-gray-600 m-0">
                      {t('resources.pdf.classic_desc')}
                    </p>
                  </div>
                  <div className="border border-slate-200 p-5 rounded-lg bg-slate-50">
                    <h4 className="font-bold text-gray-900 mb-2">{t('resources.pdf.modern')}</h4>
                    <p className="text-sm text-gray-600 m-0">
                      {t('resources.pdf.modern_desc')}
                    </p>
                  </div>
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
