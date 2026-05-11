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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <IconEye className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-textMain">Re-habilitar habilidad</h3>
            <p className="text-sm text-gray-500">Volverá a ser visible en tu portafolio</p>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-3">
          ¿Deseas volver a mostrar{' '}
          <span className="font-semibold text-gray-900">"{skill.nombre}"</span> en tu perfil?
        </p>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10 mb-6">
          <svg
            className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-xs text-primary">
            La habilidad recuperará su estado anterior y será visible nuevamente en tu portafolio
            público.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading && <IconSpinner className="w-4 h-4" />}
            Sí, re-habilitar
          </button>
        </div>
      </div>
    </div>
  )
}
