import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Skill, NivelBlanda } from '../types'
import { IconSpinner } from '../Icons'

export default function EditNivelBlandaModal({
  skill,
  loading,
  onSave,
  onCancel
}: {
  skill: Skill
  loading: boolean
  onSave: (nivel: NivelBlanda) => void
  onCancel: () => void
}) {
  const { t } = useTranslation()
  const [nivel, setNivel] = useState<NivelBlanda>((skill.nivel as NivelBlanda) ?? 'En formación')

  const niveles: {
    key: NivelBlanda
    desc: string
    dot: string
    border: string
    bg: string
    text: string
  }[] = [
    {
      key: 'En formación',
      desc: t(
        'skills.levels.soft.formacion_desc',
        'Estoy desarrollando esta habilidad activamente.'
      ),
      dot: 'bg-pink-400',
      border: 'border-pink-400',
      bg: 'bg-pink-50',
      text: 'text-pink-700'
    },
    {
      key: 'Desarrollada',
      desc: t(
        'skills.levels.soft.desarrollada_desc',
        'La aplico con seguridad en contextos reales.'
      ),
      dot: 'bg-indigo-400',
      border: 'border-indigo-500',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700'
    },
    {
      key: 'Fortalecida',
      desc: t('skills.levels.soft.fortalecida_desc', 'Es una de mis fortalezas consolidadas.'),
      dot: 'bg-purple-500',
      border: 'border-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-700'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-transparent dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {t('skills.edit_modal.title_soft', 'Cambiar nivel de desarrollo')}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              <span className="font-semibold text-gray-600 dark:text-gray-300">{skill.nombre}</span>
              {' · '}
              <span className="text-navbar dark:text-blue-400 font-medium">
                {t('skills.soft_skill', 'Habilidad Blanda')}
              </span>
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mx-6 mt-4 px-3 py-2.5 rounded-lg bg-navbar/5 dark:bg-blue-900/10 border border-navbar/10 dark:border-blue-900/20 flex items-start gap-2">
          <svg
            className="w-3.5 h-3.5 text-navbar/60 dark:text-blue-400/60 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z"
            />
          </svg>
          <p className="text-xs text-navbar dark:text-blue-400">
            {t(
              'skills.edit_modal.note_soft',
              'Las habilidades blandas se valoran por su presencia y madurez. Elige el nivel que mejor refleje tu situación actual.'
            )}
          </p>
        </div>

        <div className="px-6 py-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('skills.edit_modal.label_soft', 'Nivel de desarrollo')}
          </label>
          <div className="flex flex-col gap-2">
            {niveles.map((n) => {
              const isActive = nivel === n.key
              return (
                <button
                  key={n.key}
                  type="button"
                  disabled={loading}
                  onClick={() => setNivel(n.key)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all disabled:opacity-50 ${isActive ? `${n.border} ${n.bg} dark:bg-blue-900/10 dark:border-blue-500` : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                >
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${n.dot}`} />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold ${isActive ? `${n.text} dark:text-blue-400` : 'text-gray-700 dark:text-gray-200'}`}
                    >
                      {n.key === 'En formación'
                        ? t('skills.levels.soft.formacion', 'En formación')
                        : n.key === 'Desarrollada'
                          ? t('skills.levels.soft.desarrollada', 'Desarrollada')
                          : t('skills.levels.soft.fortalecida', 'Fortalecida')}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{n.desc}</p>
                  </div>
                  {isActive && (
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${n.text} dark:text-blue-400`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100 dark:border-slate-800">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {t('common.cancel', 'Cancelar')}
          </button>
          <button
            onClick={() => onSave(nivel)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-navbar dark:bg-blue-600 rounded-lg hover:bg-navbar/90 dark:hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading && <IconSpinner className="w-4 h-4" />}
            {t('common.save_changes', 'Guardar cambios')}
          </button>
        </div>
      </div>
    </div>
  )
}
