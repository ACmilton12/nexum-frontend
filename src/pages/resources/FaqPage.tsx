import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../home/components/Navbar'
import Footer from '../home/components/Footer'
import { HelpCircle, ChevronDown, Search, User, Briefcase, Shield, FileText } from 'lucide-react'

export default function FaqPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<string>('general')
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [searchTerm, setSearchTerm] = useState('')

  const faqCategories = [
    {
      id: 'general',
      name: t('resources.faq.cat_general'),
      icon: <User size={20} />,
      questions: [
        {
          q: t('resources.faq.q1'),
          a: t('resources.faq.a1')
        },
        {
          q: t('resources.faq.q2'),
          a: t('resources.faq.a2')
        },
        {
          q: t('resources.faq.q3'),
          a: t('resources.faq.a3')
        }
      ]
    },
    {
      id: 'portfolio',
      name: t('resources.faq.cat_portfolio'),
      icon: <Briefcase size={20} />,
      questions: [
        {
          q: t('resources.faq.q4'),
          a: t('resources.faq.a4')
        },
        {
          q: t('resources.faq.q5'),
          a: t('resources.faq.a5')
        }
      ]
    },
    {
      id: 'privacy',
      name: t('resources.faq.cat_privacy'),
      icon: <Shield size={20} />,
      questions: [
        {
          q: t('resources.faq.q6'),
          a: t('resources.faq.a6')
        },
        {
          q: t('resources.faq.q7'),
          a: t('resources.faq.a7')
        },
        {
          q: t('resources.faq.q8'),
          a: t('resources.faq.a8')
        }
      ]
    },
    {
      id: 'pdf',
      name: t('resources.faq.cat_pdf'),
      icon: <FileText size={20} />,
      questions: [
        {
          q: t('resources.faq.q9'),
          a: t('resources.faq.a9')
        },
        {
          q: t('resources.faq.q10'),
          a: t('resources.faq.a10')
        }
      ]
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Lógica de búsqueda global en todas las categorías
  const filteredQuestions = searchTerm
    ? faqCategories.flatMap(cat => cat.questions).filter(
        item => 
          item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqCategories.find(c => c.id === activeCategory)?.questions || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />
      
      {/* Header Interactivo */}
      <div className="bg-[#001A5E] pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">
            {t('resources.faq.title')}
          </h1>
          
          {/* Barra de Búsqueda Flotante */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder={t('resources.faq.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all border-none"
            />
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <main className="flex-grow -mt-10 pb-20 px-4 sm:px-6 z-20 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar de Categorías (Oculto si hay búsqueda) */}
            {!searchTerm && (
              <aside className="md:w-1/3 lg:w-1/4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">
                    {t('resources.faq.categories_title')}
                  </h3>
                  <nav className="space-y-1">
                    {faqCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setOpenIndex(0); // Abrir el primero por defecto al cambiar
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                          activeCategory === cat.id 
                            ? 'bg-blue-50 text-[#001A5E]' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className={`${activeCategory === cat.id ? 'text-[#001A5E]' : 'text-gray-400'}`}>
                          {cat.icon}
                        </span>
                        {cat.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
            )}

            {/* Área de Preguntas */}
            <section className={searchTerm ? "w-full max-w-3xl mx-auto" : "md:w-2/3 lg:w-3/4"}>
              
              {searchTerm && (
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {t('resources.faq.results_for')} "{searchTerm}" ({filteredQuestions.length})
                  </h2>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {t('resources.faq.clear_search')}
                  </button>
                </div>
              )}

              {filteredQuestions.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('resources.faq.no_results_title')}</h3>
                  <p className="text-gray-500">
                    {t('resources.faq.no_results_desc')} "{searchTerm}".
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((item, index) => {
                    const isExpanded = searchTerm ? true : openIndex === index;
                    
                    return (
                      <div 
                        key={index}
                        className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                          isExpanded ? 'border-blue-200 shadow-md ring-1 ring-blue-50' : 'border-gray-100 shadow-sm hover:border-blue-100'
                        }`}
                      >
                        <button
                          className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                          onClick={() => handleToggle(index)}
                        >
                          <h3 className={`font-semibold pr-8 leading-snug ${isExpanded ? 'text-[#001A5E]' : 'text-gray-800'}`}>
                            {item.q}
                          </h3>
                          {!searchTerm && (
                            <ChevronDown 
                              className={`flex-shrink-0 transition-transform duration-300 ${
                                isExpanded ? 'rotate-180 text-blue-600' : 'text-gray-400'
                              }`} 
                              size={20} 
                            />
                          )}
                        </button>
                        
                        <div 
                          className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="w-full h-px bg-gray-100 mb-4"></div>
                          <p className="text-gray-600 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Box de Contacto */}
              {!searchTerm && (
                <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between border border-blue-100/50 shadow-inner">
                  <div className="mb-4 sm:mb-0 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-[#001A5E] mb-1">{t('resources.faq.contact_box_title')}</h3>
                    <p className="text-blue-800/70 text-sm">
                      {t('resources.faq.contact_box_desc')}
                    </p>
                  </div>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=soportenexum2026@gmail.com&su=Consulta%20Soporte%20Nexum"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 bg-[#001A5E] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#001A5E]/90 hover:shadow-lg transition-all active:scale-95"
                  >
                    {t('resources.faq.contact_btn')}
                  </a>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
