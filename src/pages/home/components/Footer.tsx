import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logoUmss from '../../../assets/logoUmss.png'
import useAuth from '../../../hooks/useAuth'

export default function Footer() {
  const { t } = useTranslation()
  const { user } = useAuth()
  return (
    <footer id="contacto" className="pt-16 pb-8" style={{ backgroundColor: '#001A5E' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 no-underline">
              <img
                src={logoUmss}
                alt="Logo UMSS"
                className="w-16 h-20 object-contain rounded-full"
              />
              <span className="text-white font-extrabold text-xl tracking-widest ml-1">NEXUM</span>
            </Link>
            <p className="text-blue-300 text-sm leading-relaxed">{t('footer.description')}</p>
          </div>
          <div>
            <div className="text-white font-bold text-xs mb-4 uppercase tracking-widest">
              {t('footer.navigation')}
            </div>
            <Link
              to="/"
              className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
            >
              {t('footer.home')}
            </Link>
            <Link
              to={user ? '/directorio' : '/Home'}
              className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
            >
              {t('footer.search')}
            </Link>
            <Link
              to="/login"
              className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
            >
              {t('footer.login')}
            </Link>
            <Link
              to="/register"
              className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
            >
              {t('footer.register')}
            </Link>
          </div>
          <div>
            <div className="text-white font-bold text-xs mb-4 uppercase tracking-widest">
              {t('footer.resources')}
            </div>
            <Link
              to="/guia"
              className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
            >
              {t('footer.resources_list.guide')}
            </Link>
            <Link
              to="/formato-pdf"
              className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
            >
              {t('footer.resources_list.pdf')}
            </Link>
            <Link
              to="/faq"
              className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
            >
              {t('footer.resources_list.faq')}
            </Link>
            <Link
              to="/normativa"
              className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
            >
              {t('footer.resources_list.rules')}
            </Link>
          </div>
          <div>
            <div className="text-white font-bold text-xs mb-4 uppercase tracking-widest">
              {t('footer.contact')}
            </div>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=soportenexum2026@gmail.com&su=Consulta%20Soporte%20Nexum"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-300 text-sm mb-2 hover:text-white transition-colors no-underline"
            >
              soportenexum2026@gmail.com
            </a>
            <p className="text-blue-300 text-sm">{t('footer.location')}</p>
          </div>
        </div>
        <div
          className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.15)' }}
        >
          <p className="text-blue-400 text-xs">{t('footer.copyright')}</p>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono font-bold text-sm">&lt;/&gt;</span>
            <span className="text-blue-400 text-xs">{t('footer.developed_by')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
