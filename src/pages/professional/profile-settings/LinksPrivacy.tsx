import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from '../../admin/components/Sidebar'
import RightWidgets from '../../../components/ui/RightWidgets'
import { Globe, Loader2 } from 'lucide-react'
import Toast from '../../../components/ui/Toast'
import { getLinksPrivacyData, updateLinksPrivacyData } from '../../../services/linksprivacy.service'

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const GithubIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const Toggle = ({
  active,
  onToggle,
  disabled
}: {
  active: boolean
  onToggle: () => void
  disabled?: boolean
}) => (
  <div
    onClick={!disabled ? onToggle : undefined}
    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
      active ? 'bg-action' : 'bg-gray-400'
    } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
  >
    <div
      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
        active ? 'left-5' : 'left-0.5'
      }`}
    />
  </div>
)

function LinksPrivacy() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [website, setWebsite] = useState('')

  // Unificamos la visibilidad en un solo estado para todos
  const [isPublic, setIsPublic] = useState(true)
  const { t } = useTranslation()

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getLinksPrivacyData()
        if (data) {
          setNombre(data.user.first_name || '')
          setApellido(data.user.last_name || '')
          setLinkedin(data.linkedin_url || '')
          setGithub(data.github_url || '')
          // Cargamos el estado global del backend: si es public, el switch está activo
          setIsPublic(data.global_privacy === 'public')
        } else {
          const storedUser = JSON.parse(
            localStorage.getItem('user') || sessionStorage.getItem('user') || '{}'
          )
          setNombre(storedUser.first_name || '')
          setApellido(storedUser.last_name || '')
        }
      } catch (error) {
        console.error('Error al cargar enlaces:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      // Enviamos 'public' o 'private' según el estado actual de isPublic
      const privacyValue = isPublic ? 'public' : 'private'

      await updateLinksPrivacyData({
        nombre,
        apellido,
        linkedin,
        github,
        global_privacy: privacyValue
      })
      setToast({ message: t('privacy.toast_success'), type: 'success' })
    } catch (err: unknown) {
      const error = err as { message?: string }
      setToast({ message: t('privacy.toast_error') + ': ' + error.message, type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleAll = () => {
    setIsPublic(!isPublic)
  }

  if (loading) {
    return (
      <div className="h-full max-h-full bg-background dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300 overflow-hidden">
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar activeItem="Enlaces" />
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-background dark:bg-slate-900 transition-colors duration-300">
            <div className="flex-1 p-4 sm:p-6 md:p-6 flex items-center justify-center overflow-y-auto">
              <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500 font-medium">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span>{t('common.loading')}</span>
              </div>
            </div>
            <RightWidgets
              type="profile"
              className="hidden lg:block w-64 shrink-0 transition-colors duration-300"
            />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full max-h-full bg-background dark:bg-slate-900 flex flex-col transition-colors duration-300 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeItem="Enlaces" />

        {/* Contenido principal + Panel derecho */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* SECCIÓN IZQUIERDA: Formularios */}
          <div className="flex-1 p-4 sm:p-6 md:p-6 overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-textMain dark:text-white mb-1">
                {t('privacy.title')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('privacy.desc')}</p>
            </div>

            {/* Grid responsivo: 1 columna en móvil, 2 en desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tarjeta de Redes Profesionales */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-base font-bold text-textMain dark:text-white mb-5">
                  {t('privacy.social_networks')}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* LinkedIn */}
                  <div>
                    <label className="text-sm font-semibold text-textMain dark:text-white flex items-center gap-2 mb-2">
                      <LinkedinIcon />
                      {t('privacy.linkedin')}
                    </label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      disabled={isSaving}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 dark:text-white text-sm focus:border-primary focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* GitHub */}
                  <div>
                    <label className="text-sm font-semibold text-textMain dark:text-white flex items-center gap-2 mb-2">
                      <GithubIcon />
                      {t('privacy.github')}
                    </label>
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      disabled={isSaving}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 dark:text-white text-sm focus:border-primary focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Sitio web */}
                  <div>
                    <label className="text-sm font-semibold text-textMain dark:text-white flex items-center gap-2 mb-2">
                      <Globe size={18} />
                      {t('privacy.website')}
                    </label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://tuportafolio.com"
                      disabled={isSaving}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 dark:text-white text-sm focus:border-primary focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Botón de guardar */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-action text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-red-100 dark:shadow-none"
                    >
                      {isSaving ? t('profile.saving') : t('privacy.save_links')}
                    </button>
                  </div>
                </form>
              </div>

              {/* Tarjeta de Visibilidad */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-base font-bold text-textMain dark:text-white mb-5">
                  {t('privacy.public_visibility')}
                </h3>

                <div className="space-y-4">
                  {/* Switch principal */}
                  <div className="pb-4 border-b border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-textMain dark:text-white">
                          {t('privacy.make_public')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {isPublic
                            ? t('privacy.profile_is_public')
                            : t('privacy.profile_is_private')}
                        </p>
                      </div>
                      <Toggle active={isPublic} onToggle={handleToggleAll} disabled={isSaving} />
                    </div>
                  </div>

                  {/* Opciones de visibilidad individuales */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-textMain dark:text-gray-300">
                        {t('privacy.show_projects')}
                      </span>
                      <Toggle
                        active={isPublic}
                        onToggle={handleToggleAll}
                        disabled={isSaving || !isPublic}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-textMain dark:text-gray-300">
                        {t('privacy.show_skills')}
                      </span>
                      <Toggle
                        active={isPublic}
                        onToggle={handleToggleAll}
                        disabled={isSaving || !isPublic}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-textMain dark:text-gray-300">
                        {t('privacy.show_experience')}
                      </span>
                      <Toggle
                        active={isPublic}
                        onToggle={handleToggleAll}
                        disabled={isSaving || !isPublic}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-textMain dark:text-gray-300">
                        {t('privacy.show_contact')}
                      </span>
                      <Toggle
                        active={isPublic}
                        onToggle={handleToggleAll}
                        disabled={isSaving || !isPublic}
                      />
                    </div>
                  </div>

                  {/* Info adicional */}
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30 transition-colors">
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      💡 <span className="font-medium">{t('privacy.tip_title')}:</span>{' '}
                      {t('privacy.tip_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO (Responsivo) */}
          <RightWidgets type="profile" className="hidden lg:block w-64 shrink-0 transition-colors" />
        </main>
      </div>

      {/* Toast de notificación */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default LinksPrivacy
