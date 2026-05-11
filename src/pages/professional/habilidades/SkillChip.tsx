import type { Skill } from './types'
import { NIVEL_BADGE } from './constants'
import { IconEdit, IconEyeOff, IconEye, IconSpinner, SkillIcon } from './Icons'

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
  const isPending = skill.status === 'pending'
  const isDisabled = skill.status === 'disabled'

  return (
    <div
      className={`flex items-center gap-2 bg-white border rounded-lg px-2.5 sm:px-3 py-2 transition-colors max-w-full ${
        toggling
          ? 'opacity-50 border-gray-200'
          : isPending
            ? 'border-amber-300 bg-amber-50/60'
            : isDisabled
              ? 'border-gray-200 bg-gray-50 opacity-60'
              : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Icono con opacidad reducida si está deshabilitada */}
      <div className={isDisabled ? 'opacity-50' : ''}>
        <SkillIcon tipo={skill.tipo} />
      </div>

      <span
        className={`text-sm font-medium ${isDisabled ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-800'}`}
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
        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300 whitespace-nowrap">
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
          Pendiente aprobación
        </span>
      )}

      {/* Badge deshabilitada */}
      {isDisabled && (
        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200 whitespace-nowrap">
          <IconEyeOff className="w-2.5 h-2.5" />
          Deshabilitada
        </span>
      )}

      {/* Botón editar — solo activas y aprobadas */}
      <button
        onClick={onEdit}
        disabled={toggling || isPending || isDisabled}
        title={
          isPending
            ? 'No se puede editar mientras está pendiente'
            : isDisabled
              ? 'Re-habilita la habilidad para poder editarla'
              : 'Cambiar nivel'
        }
        className={`ml-1 p-0.5 rounded transition-colors disabled:cursor-not-allowed ${
          isPending || isDisabled ? 'text-gray-300' : 'text-gray-400 hover:text-primary'
        }`}
      >
        <IconEdit />
      </button>

      {/* Botón deshabilitar / re-habilitar */}
      <button
        onClick={onToggleDisable}
        disabled={toggling || isPending}
        title={
          isPending
            ? 'No se puede modificar mientras está pendiente'
            : isDisabled
              ? 'Re-habilitar habilidad'
              : 'Deshabilitar habilidad'
        }
        className={`p-0.5 rounded transition-colors disabled:cursor-not-allowed ${
          isPending
            ? 'text-gray-300'
            : isDisabled
              ? 'text-gray-400 hover:text-primary'
              : 'text-gray-400 hover:text-action'
        }`}
      >
        {toggling ? (
          <IconSpinner className="w-3.5 h-3.5 text-action" />
        ) : isDisabled ? (
          <IconEye />
        ) : (
          <IconEyeOff />
        )}
      </button>
    </div>
  )
}
