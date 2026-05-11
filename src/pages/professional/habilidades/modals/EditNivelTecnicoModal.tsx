import { useState } from 'react'
import type { Skill, NivelTecnico } from '../types'
import { NIVEL_DOT } from '../constants'
import { IconSpinner } from '../Icons'

export default function EditNivelTecnicoModal({
  skill,
  loading,
  onSave,
  onCancel
}: {
  skill: Skill
  loading: boolean
  onSave: (nivel: NivelTecnico) => void
  onCancel: () => void
}) {
  const [nivel, setNivel] = useState<NivelTecnico>((skill.nivel as NivelTecnico) ?? 'Básico')
  const niveles: { key: NivelTecnico; desc: string }[] = [
    { key: 'Básico', desc: 'Conceptos y uso guiado.' },
    { key: 'Intermedio', desc: 'Implementación funcional en proyectos.' },
    { key: 'Avanzado', desc: 'Uso profesional autónomo.' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Cambiar nivel de dominio</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              <span className="font-semibold text-gray-600">{skill.nombre}</span>
              {' · '}
              <span className="text-primary">{skill.tipo}</span>
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
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

        <div className="mx-6 mt-4 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 flex items-start gap-2">
          <svg
            className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0"
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
          <p className="text-xs text-gray-500">
            Ten en cuenta que cambiar el nivel refleja tu dominio real. Sé honesto con tu
            evaluación.
          </p>
        </div>

        <div className="px-6 py-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">Nivel de dominio</label>
          <div className="grid grid-cols-3 gap-2">
            {niveles.map((n) => (
              <button
                key={n.key}
                type="button"
                disabled={loading}
                onClick={() => setNivel(n.key)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all disabled:opacity-50 ${nivel === n.key ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${NIVEL_DOT[n.key]}`} />
                <span
                  className={`text-xs font-semibold ${nivel === n.key ? 'text-primary' : 'text-gray-600'}`}
                >
                  {n.key}
                </span>
                <span className="text-[10px] text-gray-400 text-center leading-tight">
                  {n.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(nivel)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading && <IconSpinner className="w-4 h-4" />}
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}
