import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { forgotPasswordService } from '../../services/auth.service'
import Navbar from '../../components/ui/Navbar'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [maskedEmail, setMaskedEmail] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const maskEmailAddress = (emailStr: string) => {
    const [local, domain] = emailStr.split('@')
    if (!local || !domain) return emailStr

    if (local.length <= 2) {
      return `${local.charAt(0)}***@${domain}`
    }

    const prefix = local.substring(0, 2)
    const suffix = local.substring(local.length - 1)
    return `${prefix}***${suffix}@${domain}`
  }

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('El correo es requerido.')
      setIsSuccess(false)
      return
    }

    if (!/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]{2,}$/.test(email)) {
      setError('Error ante formato de correo inválido o no registrado.')
      setIsSuccess(false)
      return
    }

    try {
      await forgotPasswordService({ email })
      setError('')
      setMaskedEmail(maskEmailAddress(email))
      setIsSuccess(true)
      setCountdown(60)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Error al enviar el enlace de recuperación.')
      setIsSuccess(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-surface rounded-xl shadow-md p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-textMain mb-2">Recuperar Contraseña</h1>
            <p className="text-sm text-gray-500">
              Flujo con token seguro, confirmación de envío y reenvío controlado.
            </p>
          </div>

          <form onSubmit={handleSendLink} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-textMain block mb-1">
                Correo Electrónico
              </label>
              <div
                className={`flex items-center border rounded px-3 py-2 text-sm transition-colors ${
                  error
                    ? 'border-action bg-red-50'
                    : 'border-gray-300 bg-white focus-within:border-primary'
                }`}
              >
                {error && <Mail size={16} className="text-action mr-2" />}
                <input
                  type="email"
                  placeholder="admin2@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError('')
                    if (isSuccess) {
                      setIsSuccess(false)
                      setCountdown(0)
                    }
                  }}
                  className="flex-1 outline-none bg-transparent w-full"
                  disabled={countdown > 0}
                />
              </div>
              {error && <p className="text-action text-xs mt-1">{error}</p>}
            </div>

            {isSuccess && (
              <div className="bg-[#E6F4EA] text-[#2E7D32] p-4 rounded-md text-sm animate-fadeIn">
                Hemos enviado un enlace único de reseteo a <strong>{maskedEmail}</strong>. <br />
                Reenvío disponible en {countdown} segundos.
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="border border-gray-300 text-textMain font-medium px-6 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                Volver al Login
              </button>

              <button
                type="submit"
                disabled={countdown > 0}
                className="bg-action text-white font-medium px-6 py-2 rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? 'Enlace Enviado' : 'Enviar enlace'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4 bg-white">
        Copyright © 2026 CODI
      </footer>
    </div>
  )
}
