import { Link } from 'react-router-dom'
import logoUmss from '../../../assets/logoUmss.png'

export default function Footer() {
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
            <p className="text-blue-300 text-sm leading-relaxed">
              Plataforma institucional de portafolios digitales para profesionales.
            </p>
          </div>
          <div>
            <div className="text-white font-bold text-xs mb-4 uppercase tracking-widest">
              Navegación
            </div>
            <Link
              to="/"
              className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
            >
              Inicio
            </Link>
            <Link
              to="/Home"
              className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
            >
              Explorar Portafolios
            </Link>
            <Link
              to="/login"
              className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
            >
              Acceder
            </Link>
            <Link
              to="/register"
              className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
            >
              Registrarse
            </Link>
          </div>
          <div>
            <div className="text-white font-bold text-xs mb-4 uppercase tracking-widest">
              Recursos
            </div>
            {['Guía de uso', 'Formato PDF', 'Preguntas frecuentes', 'Normativa'].map((l) => (
              <a
                key={l}
                href="#"
                className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline"
              >
                {l}
              </a>
            ))}
          </div>
          <div>
            <div className="text-white font-bold text-xs mb-4 uppercase tracking-widest">
              Contacto
            </div>
            <p className="text-blue-300 text-sm mb-2">soporte@nexum.umss.edu.bo</p>
            <p className="text-blue-300 text-sm mb-2">FCyT · UMSS</p>
            <p className="text-blue-300 text-sm">Cochabamba, Bolivia</p>
          </div>
        </div>
        <div
          className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.15)' }}
        >
          <p className="text-blue-400 text-xs">
            © 2025 NEXUM · Universidad Mayor de San Simón · Facultad de Ciencias y Tecnología
          </p>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono font-bold text-sm">&lt;/&gt;</span>
            <span className="text-blue-400 text-xs">
              CODI · Departamento de Informática y Sistemas
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
