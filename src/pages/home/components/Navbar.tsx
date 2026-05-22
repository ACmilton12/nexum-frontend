import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuth from '../../../hooks/useAuth'
import logoUmss from '../../../assets/logoUmss.png'
import LanguageSelector from '../../../components/ui/LanguageSelector'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/')
    window.location.reload()
  }

  return (
    <nav
      style={{
        backgroundColor: scrolled ? 'rgba(0,26,94,0.97)' : '#001A5E',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease'
      }}
      className="fixed top-0 left-0 right-0 z-50 shadow-lg"
    >
      <div className="w-full px-6 h-16 flex items-center">
        {/* Logo — izquierda */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img src={logoUmss} alt="Logo UMSS" className="w-16 h-16 object-contain rounded-full" />
            <span className="text-white font-bold text-lg tracking-wide">NEXUM</span>
          </Link>
        </div>

        {/* Links — centro */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-10">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-white text-xs font-bold tracking-widest hover:text-gray-300 transition-colors duration-200 no-underline"
          >
            {t('navbar.home').toUpperCase()}
          </Link>
          <Link
            to={user ? '/directorio' : '/Home'}
            className="text-white text-xs font-bold tracking-widest hover:text-gray-300 transition-colors duration-200 no-underline"
          >
            {t('navbar.search').toUpperCase()}
          </Link>
          <a
            href="#contacto"
            className="text-white text-xs font-bold tracking-widest hover:text-gray-300 transition-colors duration-200 no-underline"
          >
            {t('navbar.contact', 'CONTACTO').toUpperCase()}
          </a>
        </div>

        {/* Botones — derecha */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-3">
          <LanguageSelector />
          {user ? (
            <>
              <span className="text-white text-sm opacity-80 font-medium">
                {user.first_name || user.name || user.email}
              </span>
              <Link
                to="/profile/personal-data"
                className="text-sm font-bold px-5 py-2 rounded border-2 border-white transition-all duration-200 no-underline"
                style={{ color: 'white', backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  const l = e.currentTarget as HTMLAnchorElement
                  l.style.backgroundColor = 'white'
                  l.style.color = '#001A5E'
                }}
                onMouseLeave={(e) => {
                  const l = e.currentTarget as HTMLAnchorElement
                  l.style.backgroundColor = 'transparent'
                  l.style.color = 'white'
                }}
              >
                {t('navbar.profile')}
              </Link>
              <button
                onClick={handleLogout}
                className="text-white text-sm font-bold px-5 py-2 rounded transition-all duration-200 border-0 cursor-pointer"
                style={{ backgroundColor: '#C8102E' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#a50d25')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C8102E')
                }
              >
                {t('navbar.logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-bold px-5 py-2 rounded border-2 border-white transition-all duration-200 no-underline"
                style={{ color: 'white', backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  const l = e.currentTarget as HTMLAnchorElement
                  l.style.backgroundColor = 'white'
                  l.style.color = '#001A5E'
                }}
                onMouseLeave={(e) => {
                  const l = e.currentTarget as HTMLAnchorElement
                  l.style.backgroundColor = 'transparent'
                  l.style.color = 'white'
                }}
              >
                {t('navbar.login')}
              </Link>
              <Link
                to="/register"
                className="text-white text-sm font-bold px-6 py-2 rounded transition-all duration-200 no-underline"
                style={{ backgroundColor: '#C8102E' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#a50d25')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#C8102E')
                }
              >
                {t('navbar.register')}
              </Link>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 ml-auto border-none bg-transparent"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4"
          style={{ backgroundColor: '#001A5E' }}
        >
          <Link to="/" className="text-white text-xs font-bold tracking-widest no-underline">
            {t('navbar.home').toUpperCase()}
          </Link>
          <Link to={user ? '/directorio' : '/Home'} className="text-white text-xs font-bold tracking-widest no-underline">
            {t('navbar.search').toUpperCase()}
          </Link>
          <a href="#contacto" className="text-white text-xs font-bold tracking-widest no-underline">
            {t('navbar.contact').toUpperCase()}
          </a>
          <div className="flex gap-3 pt-2">
            {user ? (
              <>
                <Link
                  to="/profile/personal-data"
                  className="flex-1 border-2 border-white text-white text-sm font-bold py-2 rounded text-center no-underline"
                >
                  {t('navbar.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex-1 text-white text-sm font-bold py-2 rounded text-center border-0 cursor-pointer"
                  style={{ backgroundColor: '#C8102E' }}
                >
                  {t('navbar.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex-1 border-2 border-white text-white text-sm font-bold py-2 rounded text-center no-underline"
                >
                  {t('navbar.login')}
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-white text-sm font-bold py-2 rounded text-center no-underline"
                  style={{ backgroundColor: '#C8102E' }}
                >
                  {t('navbar.register')}
                </Link>
              </>
            )}
          </div>
          {/* Selector de idioma en móvil — botones inline */}
          <div className="pt-3 mt-1 border-t border-white/10">
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">
              {t('navbar.select_language', 'Idioma')}
            </p>
            <div className="flex gap-2">
              {[
                { code: 'es', label: 'ES', flag: '🇪🇸' },
                { code: 'en', label: 'EN', flag: '🇺🇸' },
                { code: 'pt', label: 'PT', flag: '🇧🇷' }
              ].map((lang) => {
                const isActive = (i18n.language?.split('-')[0] || 'es') === lang.code
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code)
                      localStorage.setItem('i18nextLng', lang.code)
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all border-0 cursor-pointer"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                      border: isActive ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
