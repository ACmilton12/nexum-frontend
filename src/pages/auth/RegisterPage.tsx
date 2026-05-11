import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Eye, EyeOff, Mail, User } from 'lucide-react'
import { registerService } from '../../services/auth.service'
import Navbar from '../../components/ui/Navbar'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Step 1 states
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 2 states
  const [title, setTitle] = useState('')

  // Validation & API states
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [registerError, setRegisterError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password validation checks
  const hasMinLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  const passwordStrengthCount = [hasMinLength, hasUpper, hasNumber, hasSpecial].filter(
    Boolean
  ).length

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {}

    if (!firstName) newErrors.firstName = 'El nombre es obligatorio.'
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(firstName)) {
      newErrors.firstName = 'Solo se permiten letras y espacios.'
    }

    if (!lastName) newErrors.lastName = 'El apellido es obligatorio.'
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastName)) {
      newErrors.lastName = 'Solo se permiten letras y espacios.'
    }

    if (!email) newErrors.email = 'El correo es obligatorio.'
    else if (!/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]{2,}$/.test(email)) {
      newErrors.email = 'Formato de correo no válido.'
    }

    if (!password) newErrors.password = 'La contraseña es obligatorio.'
    else if (!hasMinLength || !hasUpper || !hasNumber || !hasSpecial) {
      newErrors.password = 'La contraseña no cumple los requisitos.'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1 && !validateStep1()) return

    try {
      setLoading(true)
      setRegisterError('')

      await registerService({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirmation: confirmPassword
      })

      // Mostrar mensaje de éxito y redirigir tras un breve retraso
      setRegistrationSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err: unknown) {
      const error = err as {
        status?: number
        errors?: { [key: string]: string[] }
        message?: string
      }
      if (error.status === 422 && error.errors) {
        const serverErrors: { [key: string]: string } = {}
        if (error.errors.first_name) serverErrors.firstName = error.errors.first_name[0]
        if (error.errors.last_name) serverErrors.lastName = error.errors.last_name[0]
        if (error.errors.email) serverErrors.email = error.errors.email[0]
        if (error.errors.password) serverErrors.password = error.errors.password[0]

        setErrors((prev) => ({ ...prev, ...serverErrors }))
      } else {
        setRegisterError(error.message || 'Ocurrió un error inesperado al registrar el usuario.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-surface rounded-xl shadow-md p-8 md:p-12 relative overflow-hidden">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-textMain mb-2">Crear Cuenta en NEXUM</h1>
            <p className="text-sm text-gray-500">
              {step === 1
                ? 'Formulario de 2 etapas con validación online y activación por correo electrónico.'
                : 'Perfil Profesional'}
            </p>
          </div>

          {registrationSuccess && (
            <div className="bg-[#E6F4EA] text-[#2E7D32] p-4 rounded-md text-sm mb-6 border border-[#A2CFAC] text-center animate-fadeIn">
              Cuenta creada exitosamente, puede iniciar sesión con las credenciales.
            </div>
          )}

          {registerError && (
            <div className="bg-red-50 text-action p-3 rounded mb-6 text-sm border border-red-200 text-center animate-fadeIn">
              {registerError}
            </div>
          )}

          {!registrationSuccess ? (
            <form onSubmit={handleRegister}>
              {/* Progress Bar Header */}
              <div className="mb-6">
                <div className="flex h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full bg-primary transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="text-gray-500">
                    Paso {step}: {step === 1 ? 'Información básica' : 'Perfil Profesional'}
                  </span>
                  {step === 1 && (
                    <span className="text-xs bg-[#e6ebf5] text-primary px-3 py-1 rounded font-medium">
                      Cuenta creada
                    </span>
                  )}
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nombres */}
                    <div>
                      <label className="text-sm font-semibold text-textMain block mb-1">
                        Nombres
                      </label>
                      <div
                        className={`flex items-center border rounded px-3 py-2 text-sm transition-colors ${
                          errors.firstName
                            ? 'border-action bg-red-50'
                            : 'border-gray-300 bg-white focus-within:border-primary'
                        }`}
                      >
                        {errors.firstName && <User size={16} className="text-action mr-2" />}
                        <input
                          type="text"
                          placeholder="Juan Pablo"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value)
                            if (errors.firstName) setErrors({ ...errors, firstName: '' })
                          }}
                          className="flex-1 outline-none bg-transparent w-full"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-action text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Apellidos */}
                    <div>
                      <label className="text-sm font-semibold text-textMain block mb-1">
                        Apellidos
                      </label>
                      <div
                        className={`flex items-center border rounded px-3 py-2 text-sm transition-colors ${
                          errors.lastName
                            ? 'border-action bg-red-50'
                            : 'border-gray-300 bg-white focus-within:border-primary'
                        }`}
                      >
                        {errors.lastName && <User size={16} className="text-action mr-2" />}
                        <input
                          type="text"
                          placeholder="Pérez Álvarez"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value)
                            if (errors.lastName) setErrors({ ...errors, lastName: '' })
                          }}
                          className="flex-1 outline-none bg-transparent w-full"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-action text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Correo Electrónico */}
                  <div>
                    <label className="text-sm font-semibold text-textMain block mb-1">
                      Correo Electrónico
                    </label>
                    <div
                      className={`flex items-center border rounded px-3 py-2 text-sm transition-colors ${
                        errors.email
                          ? 'border-action bg-red-50'
                          : 'border-gray-300 bg-white focus-within:border-primary'
                      }`}
                    >
                      {errors.email && <Mail size={16} className="text-action mr-2" />}
                      <input
                        type="email"
                        placeholder="jperez@gmail.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (errors.email) setErrors({ ...errors, email: '' })
                        }}
                        className="flex-1 outline-none bg-transparent w-full"
                      />
                    </div>
                    {errors.email && <p className="text-action text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Contraseña */}
                    <div>
                      <label className="text-sm font-semibold text-textMain block mb-1">
                        Contraseña
                      </label>
                      <div
                        className={`flex items-center border rounded px-3 py-2 bg-white transition-colors ${
                          errors.password
                            ? 'border-action'
                            : 'border-gray-300 focus-within:border-primary'
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
                      {errors.password && (
                        <p className="text-action text-xs mt-1">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirmar Contraseña */}
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
                            if (errors.confirmPassword)
                              setErrors({ ...errors, confirmPassword: '' })
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
                  </div>

                  {/* Password Strength Section */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-textMain mb-2">
                      Fortaleza de contraseña en tiempo real
                    </p>
                    <div className="flex gap-2 mb-3">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                            passwordStrengthCount >= level ? 'bg-[#10B981]' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                      <div
                        className={`flex items-center gap-1.5 ${hasMinLength ? 'text-[#10B981]' : 'text-gray-400'}`}
                      >
                        <Check size={14} strokeWidth={hasMinLength ? 3 : 2} />
                        <span>Mínimo 8 caracteres</span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 ${hasUpper ? 'text-[#10B981]' : 'text-gray-400'}`}
                      >
                        <Check size={14} strokeWidth={hasUpper ? 3 : 2} />
                        <span>1 mayúscula</span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 ${hasNumber ? 'text-[#10B981]' : 'text-gray-400'}`}
                      >
                        <Check size={14} strokeWidth={hasNumber ? 3 : 2} />
                        <span>1 número</span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 ${hasSpecial ? 'text-[#10B981]' : 'text-gray-400'}`}
                      >
                        <Check size={14} strokeWidth={hasSpecial ? 3 : 2} />
                        <span>1 especial</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Text Box */}
                  <div className="bg-[#E6F4EA] text-[#2E7D32] p-4 rounded-md text-xs mt-4">
                    Se enviará un correo de confirmación con un enlace válido por 24 horas para
                    activar el perfil. Si expiró, permitir reenvío.
                  </div>

                  {/* Step 1 Actions */}
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="bg-action text-white font-medium px-6 py-2 rounded text-sm hover:opacity-90 transition-opacity"
                      >
                        Atrás
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="border border-gray-300 text-textMain font-medium px-6 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
                      >
                        Perfil profesional
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-action text-white font-medium px-6 py-2 rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? 'Creando...' : 'Crear Cuenta'}
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Titulo Profesional */}
                  <div>
                    <label className="text-sm font-semibold text-textMain block mb-1">
                      Titulo Profesional
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Senior Frontend Developer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Step 2 Actions */}
                  <div className="flex justify-between items-center pt-8">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="bg-action text-white font-medium px-6 py-2 rounded text-sm hover:opacity-90 transition-opacity"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="border border-gray-300 text-textMain font-medium px-8 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
                      >
                        Atras
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-action text-white font-medium px-6 py-2 rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? 'Creando...' : 'Crear Cuenta'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 animate-fadeIn">
              <div className="bg-[#E6F4EA] rounded-full p-4 mb-4">
                <Check className="text-[#2E7D32]" size={40} />
              </div>
              <p className="text-gray-600 text-center">
                Redirigiendo al inicio de sesión en unos segundos...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4 bg-white">
        Copyright © 2026 CODI
      </footer>
    </div>
  )
}
