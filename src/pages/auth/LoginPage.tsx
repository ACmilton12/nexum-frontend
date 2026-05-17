import { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { loginService } from '../../services/auth.service'
import Toast from '../../components/ui/Toast'
import logoUmss from '../../assets/logoUmss.png'
import prueba11 from '../../assets/prueba12.png'
import prueba09 from '../../assets/prueba09.png'
import prueba10 from '../../assets/prueba10.png'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{
    mensaje: string
    tipo: 'success' | 'error' | 'info'
  } | null>(null)
  const handleCloseToast = useCallback(() => setToast(null), [])
  const navigate = useNavigate()

  const [idx, setIdx] = useState(0);
  const slides = [
    { img: prueba11, title: "Tu portafolio profesional ", desc: "Conecta con oportunidades y muestra tu talento al mundo" },
    { img: prueba09, title: "Proyectos que hablan por ti", desc: "Sube tu trabajo y déjalo brillar ante los empleadores" },
    { img: prueba10, title: "Verificado por UMSS · FCyT", desc: "Tu perfil con respaldo académico real" },
  ];

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorEmail('')
    setErrorPassword('')
    setError('')

    // Validaciones campo por campo
    if (!email && !password) {
      setErrorEmail('El correo electrónico es obligatorio.')
      setErrorPassword('La contraseña es obligatoria.')
      setToast({ mensaje: 'Por favor completa todos los campos.', tipo: 'error' })
      return
    }
    if (!email) {
      setErrorEmail('El correo electrónico es obligatorio.')
      setToast({ mensaje: 'Ingresa tu correo electrónico.', tipo: 'error' })
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorEmail('Ingresa un correo electrónico válido.')
      setToast({ mensaje: 'El formato del correo no es válido.', tipo: 'error' })
      return
    }
    if (!password) {
      setErrorPassword('La contraseña es obligatoria.')
      setToast({ mensaje: 'Ingresa tu contraseña.', tipo: 'error' })
      return
    }
    if (password.length < 6) {
      setErrorPassword('La contraseña debe tener al menos 6 caracteres.')
      setToast({ mensaje: 'La contraseña es demasiado corta.', tipo: 'error' })
      return
    }

    try {
      setLoading(true)
      setError('')
      const data = await loginService({ email, password })

      if (rememberMe) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('user', JSON.stringify(data.user))
      }

      setToast({
        mensaje: `¡Bienvenido/a, ${data.user.first_name || 'usuario'}! Iniciando sesión...`,
        tipo: 'success'
      })

      setEmail('')
      setPassword('')
      setRememberMe(false)

      // Redirigir tras un breve delay para que el toast se vea
      setTimeout(() => {
        if (data.user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/home')
        }
      }, 1200);
    } catch (err: unknown) {
      let rawMessage = (err as Error)?.message || "Credenciales inválidas. Verifica tus datos e inténtalo nuevamente.";

      // Traducción de errores comunes del backend
      if (
        rawMessage.includes('credentials are incorrect') ||
        rawMessage.includes('Invalid login')
      ) {
        rawMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.'
      } else if (rawMessage.includes('Too many attempts')) {
        rawMessage = 'Demasiados intentos. Por favor, intenta más tarde.'
      }

      const adminContact = 'admin@nexum.com'
      const isDeactivated = /desactivad|deactivated|disabled/i.test(rawMessage)
      const isNetwork = /fetch|network|failed/i.test(rawMessage)

      let errorMsg: string
      if (isDeactivated) {
        errorMsg = `Tu cuenta fue desactivada. Contacta al administrador: ${adminContact}`
      } else if (isNetwork) {
        errorMsg = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
      } else {
        errorMsg = rawMessage
      }

      setError(errorMsg)
      setToast({ mensaje: errorMsg, tipo: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="w-full  bg-navbar px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-white hover:opacity-80 transition-opacity border-none bg-transparent cursor-pointer"
          title="Retroceder al Home"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <img src={logoUmss} alt="Logo UMSS" className="w-8 h-10 object-contain" />
          <span className="text-white font-bold text-lg tracking-wide">NEXUM</span>
        </div>
        <div className="w-6" />
      </nav>

      {/* Contenido principal */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-4xl bg-surface rounded-[30px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-none overflow-hidden flex flex-col md:flex-row">

          {/* Panel izquierdo azul — solo en md+ */}
          <div className="hidden md:flex w-full md:w-1/2 rounded-none rounded-r-[120px] bg-primary flex-col items-center justify-center p-10 text-white shadow-2xl relative z-10">

            {/* Carrusel */}
            <div className="flex flex-col items-center w-full">
              <img
                key={idx}
                src={slides[idx].img}
                alt="Ilustración Nexum"
                className="w-48 h-48 lg:w-64 lg:h-64 object-contain mb-8 transition-opacity duration-500"
                  />
                  <h2 className="text-xl lg:text-2xl font-bold text-center mb-2">
                    {slides[idx].title}
                  </h2>
                  <p className="text-sm text-center opacity-80 mb-6">
                    {slides[idx].desc}
                  </p>
                  {/* Dots */}
                  <div className="flex gap-2 mb-6">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIdx(i)}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === idx ? "20px" : "8px",
                          height: "8px",
                          backgroundColor: i === idx ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
            </div>

            <div className="flex items-center justify-end w-full mt-4">
              <span className="text-white font-bold text-lg">Nexum</span>
            </div>
          </div>
          {/* Panel derecho - Formulario */}
          <div className="w-full md:w-1/2 flex flex-col rounded-2xl items-center justify-center p-6 sm:p-8 md:p-10 bg-white">

            {/* Logo visible solo en móvil (reemplaza al panel izquierdo) */}
            <div className="flex md:hidden flex-col items-center mb-8">
              <img src={logoUmss} alt="Logo UMSS" className="w-14 h-14 object-contain mb-3" />
              <span className="text-primary font-extrabold text-2xl tracking-widest">NEXUM</span>
            </div>

            <div className="w-full max-w-sm mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-textMain tracking-tight mb-1.5">
                  Bienvenido de nuevo
                </h2>
                <p className="text-sm text-gray-500">
                  Ingresa tus credenciales para acceder a tu cuenta
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="flex items-center bg-gray-200 border-2 border-transparent rounded-lg px-4 py-2.5 gap-3 focus-within:border-primary focus-within:bg-white transition-colors duration-300">
                    <Mail size={16} className="text-gray-400 shrink-0" />
                    <input
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                        setErrorEmail('')
                      }}
                      className="flex-1 outline-none text-sm text-textMain bg-transparent min-w-0 border-none w-full autofill:shadow-[inset_0_0_0px_1000px_#e5e7eb] focus:autofill:shadow-[inset_0_0_0px_1000px_#ffffff] autofill:[-webkit-text-fill-color:#1A1A2E]"
                      autoComplete="email"
                    />
                  </div>
                  {errorEmail && <p className="text-red-500 font-semibold text-xs mt-1.5">{errorEmail}</p>}
                </div>

                {/* Contraseña */}
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1.5">
                    Contraseña
                  </label>
                  <div className="flex items-center bg-gray-200 border-2 border-transparent rounded-lg px-4 py-2.5 gap-3 focus-within:border-primary focus-within:bg-white transition-colors duration-300">
                    <Lock size={16} className="text-gray-400 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError('')
                        setErrorPassword('')
                      }}
                      className="flex-1 outline-none text-sm text-textMain bg-transparent min-w-0 border-none w-full autofill:shadow-[inset_0_0_0px_1000px_#e5e7eb] focus:autofill:shadow-[inset_0_0_0px_1000px_#ffffff] autofill:[-webkit-text-fill-color:#1A1A2E]"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-primary shrink-0 border-none bg-transparent cursor-pointer transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {errorPassword && <p className="text-red-500 font-semibold text-xs mt-1.5">{errorPassword}</p>}
                  {error && <p className="text-red-500 font-semibold text-xs mt-1.5">{error}</p>}
                </div>

                {/* Recordarme y olvidaste contraseña */}
                <div className="flex flex-row items-center justify-between gap-2 pt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
                      autoComplete="off"
                    />
                    Recordarme
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary font-bold hover:text-primary/80 hover:underline transition-all"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Botón */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-action text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none disabled:transform-none border-none cursor-pointer"
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </button>
                </div>

                {/* Registro */}
                <p className="text-center text-sm text-gray-600 font-medium mt-6">
                  ¿No tienes cuenta?{' '}
                  <Link
                    to="/register"
                    className="text-primary font-bold hover:text-primary/80 hover:underline transition-all ml-1"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm rounded-2xl text-gray-800 py-4 bg-white">
        Copyright © 2026 CODI
      </footer>

      {toast && <Toast message={toast.mensaje} type={toast.tipo} onClose={handleCloseToast} />}
    </div>
  )
}

export default LoginPage
