import { useTranslation } from 'react-i18next'
import type { Skill } from '../types'
import { IconEye, IconSpinner } from '../Icons'

export default function EnableModal({
  skill,
  loading,
  onConfirm,
  onCancel
}: {
  skill: Skill
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md mx-4 p-5 sm:p-6 max-h-[90vh] overflow-y-auto border border-transparent dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
            <IconEye className="w-5 h-5 text-primary dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-textMain dark:text-white">
              {t('skills.enable_modal.title', 'Re-habilitar habilidad')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('skills.enable_modal.subtitle', 'Volverá a ser visible en tu portafolio')}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          {t('skills.enable_modal.question', {
            name: skill.nombre,
            defaultValue: `¿Deseas volver a mostrar "${skill.nombre}" en tu perfil?`
          })}
        </p>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 dark:bg-blue-900/10 border border-primary/10 dark:border-blue-900/20 mb-6">
          <svg
            className="w-3.5 h-3.5 text-primary dark:text-blue-400 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-xs text-primary dark:text-blue-400">
            {t(
              'skills.enable_modal.note',
              'La habilidad recuperará su estado anterior y será visible nuevamente en tu portafolio público.'
            )}
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {t('common.cancel', 'Cancelar')}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading && <IconSpinner className="w-4 h-4" />}
            {t('skills.enable_modal.confirm', 'Sí, re-habilitar')}
          </button>
        </div>
      </div>
    </div>
  )
}
