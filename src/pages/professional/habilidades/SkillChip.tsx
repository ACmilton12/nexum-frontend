import type { Skill } from './types'
import { NIVEL_BADGE } from './constants'
import { IconEdit, IconEyeOff, IconEye, IconSpinner, SkillIcon } from './Icons'
import { useTranslation } from 'react-i18next'

export default function SkillChip({
  skill,
  onEdit,
  onToggleDisable,
  toggling
}: {
  skill: Skill
  onEdit: () => void
  onToggleDisable: () => void
  toggling: boolean
}) {
  const { t } = useTranslation()
  const isPending = skill.status === 'pending'
  const isDisabled = skill.status === 'disabled'

  return (
    <div
      className={`flex items-center gap-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg px-2.5 sm:px-3 py-2 transition-colors max-w-full ${
        toggling
          ? 'opacity-50 border-gray-200'
          : isPending
            ? 'border-amber-300 bg-amber-50/60 dark:bg-amber-900/20'
            : isDisabled
              ? 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/40 opacity-60'
              : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
      }`}
    >
      {/* Icono con opacidad reducida si está deshabilitada */}
      <div className={isDisabled ? 'opacity-50' : ''}>
        <SkillIcon tipo={skill.tipo} />
      </div>

      <span
        className={`text-sm font-medium ${
          isDisabled
            ? 'text-gray-400 dark:text-gray-500 line-through decoration-gray-300 dark:decoration-gray-700'
            : 'text-gray-800 dark:text-white'
        }`}
      >
        {skill.nombre}
      </span>

      {/* Badge nivel — solo aprobadas y activas */}
      {!isPending && !isDisabled && skill.nivel && (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${NIVEL_BADGE[skill.nivel]}`}
        >
          {skill.nivel}
        </span>
      )}

      {/* Badge pendiente */}
      {isPending && (
        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-500 border border-amber-300 dark:border-amber-900/30 whitespace-nowrap">
          <svg
            className="w-2.5 h-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {t('skills.status_pending', 'Pendiente aprobación')}
        </span>
      )}

      {/* Badge deshabilitada */}
      {isDisabled && (
        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-900 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-slate-800 whitespace-nowrap">
          <IconEyeOff className="w-2.5 h-2.5" />
          {t('skills.status_disabled', 'Deshabilitada')}
        </span>
      )}

      {/* Botón editar — solo activas y aprobadas */}
      <button
        onClick={onEdit}
        disabled={toggling || isPending || isDisabled}
        title={
          isPending
            ? t('skills.edit_pending_tip', 'No se puede editar mientras está pendiente')
            : isDisabled
              ? t('skills.edit_disabled_tip', 'Re-habilita la habilidad para poder editarla')
              : t('skills.edit_tip', 'Cambiar nivel')
        }
        className={`ml-1 p-1.5 rounded-md transition-all duration-200 disabled:cursor-not-allowed border ${
          isPending || isDisabled
            ? 'text-gray-300 dark:text-gray-700 border-transparent bg-transparent'
            : 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800/30 dark:hover:bg-blue-900/40 shadow-sm'
        }`}
      >
        <IconEdit className="w-4 h-4" />
      </button>

      {/* Botón deshabilitar / re-habilitar */}
      <button
        onClick={onToggleDisable}
        disabled={toggling || isPending}
        title={
          isPending
            ? t('skills.modify_pending_tip', 'No se puede modificar mientras está pendiente')
            : isDisabled
              ? t('skills.enable_tip', 'Re-habilitar habilidad')
              : t('skills.disable_tip', 'Deshabilitar habilidad')
        }
        className={`p-1.5 rounded-md transition-all duration-200 disabled:cursor-not-allowed border ${
          isPending
            ? 'text-gray-300 dark:text-gray-700 border-transparent bg-transparent'
            : isDisabled
              ? 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100 hover:text-green-700 hover:border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800/30 dark:hover:bg-green-900/40 shadow-sm'
              : 'text-gray-500 bg-gray-50 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:text-gray-400 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-red-900/30 dark:hover:text-red-400 shadow-sm'
        }`}
      >
        {toggling ? (
          <IconSpinner className="w-4 h-4 text-action" />
        ) : isDisabled ? (
          <IconEye className="w-4 h-4" />
        ) : (
          <IconEyeOff className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
