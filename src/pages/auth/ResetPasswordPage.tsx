import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { resetPasswordService } from '../../services/auth.service'
import Navbar from '../../components/ui/Navbar'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [generalError, setGeneralError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    const hasMinLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)

    if (!password) {
      newErrors.password = 'La contraseña es requerida.'
    } else if (!hasMinLength || !hasUpper || !hasNumber || !hasSpecial) {
      newErrors.password = 'Debe tener mín. 8 caracteres, 1 mayúscula, 1 número y 1 especial.'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    if (!validate()) return

    if (!token || !email) {
      setGeneralError('Enlace de recuperación inválido o expirado. Por favor, solicita uno nuevo.')
      return
    }

    try {
      await resetPasswordService({
        email,
        token,
        password,
        password_confirmation: confirmPassword
      })
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setGeneralError(error.message || 'Error al restablecer la contraseña.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-surface rounded-xl shadow-md p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-textMain mb-2">Nueva Contraseña</h1>
            {generalError && (
              <div className="mt-4 bg-red-50 text-action p-3 rounded-md text-sm">
                {generalError}
              </div>
            )}
            {isSuccess && (
              <div className="mt-4 bg-[#E6F4EA] text-[#2E7D32] p-3 rounded-md text-sm animate-fadeIn">
                Contraseña actualizada con éxito. Redirigiendo al login...
              </div>
            )}
          </div>

          <form onSubmit={handleConfirm} className="space-y-6">
            {/* Nueva contraseña */}
            <div>
              <label className="text-sm font-semibold text-textMain block mb-1">
                Nueva contraseña
              </label>
              <div
                className={`flex items-center border rounded px-3 py-2 bg-white transition-colors ${
                  errors.password ? 'border-action' : 'border-gray-300 focus-within:border-primary'
                }`}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: '' })
                  }}
                  className="flex-1 outline-none text-sm bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-textMain ml-2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-action text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="text-sm font-semibold text-textMain block mb-1">
                Confirmar contraseña
              </label>
              <div
                className={`flex items-center border rounded px-3 py-2 bg-white transition-colors ${
                  errors.confirmPassword
                    ? 'border-action'
                    : 'border-gray-300 focus-within:border-primary'
                }`}
              >
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
                  }}
                  className="flex-1 outline-none text-sm bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-500 hover:text-textMain ml-2"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-action text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="border border-gray-300 text-textMain font-medium px-8 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                Atras
              </button>

              <button
                type="submit"
                className="bg-action text-white font-medium px-6 py-2 rounded text-sm hover:opacity-90 transition-opacity"
              >
                Confirmar
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
