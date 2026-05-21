import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown, CheckCircle } from 'lucide-react'
import { updateLocaleService } from '../../services/auth.service'
import { useState, useRef, useEffect } from 'react'

const LanguageSelector = () => {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ]

  const currentLanguage =
    languages.find((l) => l.code === (i18n.language?.split('-')[0] || 'es')) || languages[0]

  const changeLanguage = async (lng: string) => {
    const updateLocalUser = (storage: Storage) => {
      const userStr = storage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          user.locale = lng
          storage.setItem('user', JSON.stringify(user))
        } catch (e) {
          console.error('Error updating local user locale:', e)
        }
      }
    }
    updateLocalUser(localStorage)
    updateLocalUser(sessionStorage)

    i18n.changeLanguage(lng)
    localStorage.setItem('i18nextLng', lng)
    setIsOpen(false)

    try {
      await updateLocaleService(lng)
    } catch (error) {
      console.error('Error updating locale in DB:', error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white/80 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 shadow-sm"
      >
        <Globe size={16} />
        <span className="text-xs font-bold uppercase tracking-wider">{currentLanguage.code}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 max-w-[calc(100vw-1rem)] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 animate-fadeIn z-[100] transition-colors duration-300">
          <div className="px-4 py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-gray-700/50 mb-1">
            {t('navbar.select_language')}
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                currentLanguage.code === lang.code
                  ? 'text-[#C8102E] dark:text-red-400 font-bold bg-blue-50/50 dark:bg-slate-700/50'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {currentLanguage.code === lang.code && (
                <CheckCircle size={16} className="text-[#C8102E] dark:text-red-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
