import { useState } from 'react'
import type {
  TipoHabilidad,
  CategoriaKey,
  CatalogItem,
  Skill,
  NivelTecnico,
  NivelBlanda,
  NivelHabilidad
} from './types'
import { categoriasParaTipo, NIVEL_DOT, NIVELES_BLANDA } from './constants'
import { IconSearch, IconSpinner } from './Icons'
import SugerirHabilidadModal from './modals/SugerirHabilidadModal'

export default function NuevaHabilidadPanel({
  tipo,
  onTipoChange,
  catalogoPorCategoria,
  skillsExistentes,
  loadingCatalog,
  saving,
  onSave,
  onCancel,
  onToast
}: {
  tipo: TipoHabilidad
  onTipoChange: (t: TipoHabilidad) => void
  catalogoPorCategoria: Record<string, CatalogItem[]>
  skillsExistentes: Skill[]
  loadingCatalog: boolean
  saving: boolean
  onSave: (skillId: number, nivel: NivelHabilidad | null) => void
  onCancel: () => void
  onToast: (msg: string, t: 'success' | 'error') => void
}) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaKey | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [skillSeleccionada, setSkillSeleccionada] = useState<CatalogItem | null>(null)
  const [nivelTecnico, setNivelTecnico] = useState<NivelTecnico | null>(null)
  const [nivelBlanda, setNivelBlanda] = useState<NivelBlanda>('En formación')
  const [errorDuplicado, setErrorDuplicado] = useState('')
  const [modalSugerencia, setModalSugerencia] = useState(false)

  const isTecnica = tipo === 'Técnica'
  const accentBorder = isTecnica ? 'border-primary' : 'border-navbar'
  const accentBg = isTecnica ? 'bg-primary/5' : 'bg-navbar/5'
  const accentText = isTecnica ? 'text-primary' : 'text-navbar'
  const accentBadge = isTecnica
    ? 'text-primary bg-primary/10 border-primary/20'
    : 'text-navbar bg-navbar/10 border-navbar/20'
  const accentTag = isTecnica
    ? 'text-primary bg-primary/5 border-primary/10'
    : 'text-navbar bg-navbar/5 border-navbar/10'

  const nivelesTecnicos: { key: NivelTecnico; desc: string }[] = [
    { key: 'Básico', desc: 'Conceptos y uso guiado.' },
    { key: 'Intermedio', desc: 'Implementación funcional en proyectos.' },
    { key: 'Avanzado', desc: 'Uso profesional autónomo.' }
  ]

  const handleTipoChange = (t: TipoHabilidad) => {
    onTipoChange(t)
    setCategoriaSeleccionada(null)
    setBusqueda('')
    setSkillSeleccionada(null)
    setNivelTecnico(null)
    setNivelBlanda('En formación')
    setErrorDuplicado('')
  }

  const handleCategoriaClick = (key: CategoriaKey) => {
    setCategoriaSeleccionada(key)
    setBusqueda('')
    setSkillSeleccionada(null)
    setErrorDuplicado('')
  }

  const handleSeleccionarSkill = (item: CatalogItem) => {
    // Considerar "ya existe" si hay una skill activa (no deshabilitada) con ese skillId
    const yaExisteActiva = skillsExistentes.some(
      (s) => s.skillId !== null && s.skillId === item.id && s.status !== 'disabled'
    )
    // Si existe pero está deshabilitada, permitir re-agregar (el backend debe manejar re-enable)
    const yaExisteDeshabilitada = skillsExistentes.some(
      (s) => s.skillId !== null && s.skillId === item.id && s.status === 'disabled'
    )
    if (yaExisteActiva) {
      setErrorDuplicado(`"${item.nombre}" ya está activa en tu perfil.`)
      setSkillSeleccionada(null)
      return
    }
    if (yaExisteDeshabilitada) {
      setErrorDuplicado(`"${item.nombre}" está deshabilitada. Re-habilítala desde la lista.`)
      setSkillSeleccionada(null)
      return
    }
    setErrorDuplicado('')
    setSkillSeleccionada(item)
  }

  const itemsFiltrados: CatalogItem[] = (
    categoriaSeleccionada ? (catalogoPorCategoria[categoriaSeleccionada] ?? []) : []
  ).filter((s) => s.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  const sinResultados =
    !!categoriaSeleccionada &&
    busqueda.trim().length > 0 &&
    itemsFiltrados.length === 0 &&
    !loadingCatalog
  const categoriaLabel =
    categoriasParaTipo(tipo).find((c) => c.key === categoriaSeleccionada)?.label ?? ''

  const canSave =
    skillSeleccionada !== null &&
    categoriaSeleccionada !== null &&
    (isTecnica ? nivelTecnico !== null : true)

  const handleGuardar = () => {
    if (!canSave || !skillSeleccionada) return
    const nivel: NivelHabilidad | null = isTecnica ? nivelTecnico : nivelBlanda
    onSave(skillSeleccionada.id, nivel)
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide truncate">
              {skillSeleccionada ? `Nueva · ${skillSeleccionada.nombre}` : 'Nueva habilidad'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {isTecnica
                ? 'Selecciona del catálogo técnico y asigna tu nivel.'
                : 'Selecciona del catálogo de habilidades blandas y tu nivel de desarrollo.'}
            </p>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5 self-start sm:self-auto flex-shrink-0">
            {(['Técnica', 'Blanda'] as TipoHabilidad[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTipoChange(t)}
                disabled={saving}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all disabled:opacity-50 ${tipo === t ? (isTecnica ? 'bg-white text-primary shadow-sm' : 'bg-white text-navbar shadow-sm') : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-5 sm:space-y-6">
          {/* Paso 1 */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              <span className="text-gray-400 mr-1.5">1.</span>Selecciona categoría
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {categoriasParaTipo(tipo).map((cat) => {
                const isActive = categoriaSeleccionada === cat.key
                return (
                  <button
                    key={cat.key}
                    type="button"
                    disabled={saving}
                    onClick={() => handleCategoriaClick(cat.key)}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all disabled:opacity-50 ${isActive ? `${accentBorder} ${accentBg}` : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
                  >
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? accentText : 'text-gray-400'}`}
                    >
                      {cat.sublabel}
                    </span>
                    <p
                      className={`text-sm font-semibold mt-0.5 ${isActive ? accentText : 'text-gray-800'}`}
                    >
                      {cat.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">{cat.ejemplos}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Paso 2 */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              <span className="text-gray-400 mr-1.5">2.</span>Busca una habilidad
            </p>
            <div
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg bg-white transition-colors ${categoriaSeleccionada ? 'border-gray-300 focus-within:border-primary' : 'border-gray-200 opacity-50 pointer-events-none'}`}
            >
              {categoriaSeleccionada && (
                <span
                  className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 flex-shrink-0 border ${accentTag}`}
                >
                  {categoriaLabel.split(' ')[0].toUpperCase()}
                </span>
              )}
              <input
                type="text"
                value={busqueda}
                disabled={saving}
                onChange={(e) => {
                  setBusqueda(e.target.value)
                  setSkillSeleccionada(null)
                  setErrorDuplicado('')
                }}
                placeholder={
                  categoriaSeleccionada
                    ? 'Buscar en el catálogo...'
                    : 'Primero selecciona una categoría'
                }
                className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent disabled:opacity-50"
              />
              <IconSearch className="text-gray-400 flex-shrink-0" />
            </div>

            {errorDuplicado && (
              <p className="text-xs text-orange-500 mt-1.5 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
                {errorDuplicado}
              </p>
            )}

            {categoriaSeleccionada && (
              <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {isTecnica ? 'TÉCNICA' : 'SOFT SKILLS'} · {categoriaLabel.toUpperCase()}
                  </span>
                  {skillSeleccionada && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${accentBadge}`}
                    >
                      ✓ {skillSeleccionada.nombre}
                    </span>
                  )}
                </div>
                <div className="divide-y divide-gray-50 max-h-52 overflow-y-auto">
                  {loadingCatalog && (
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
                      <IconSpinner className="w-4 h-4 text-gray-400" /> Cargando catálogo...
                    </div>
                  )}
                  {!loadingCatalog &&
                    itemsFiltrados.map((item) => {
                      const isSelected = skillSeleccionada?.id === item.id
                      const yaRegistradaActiva = skillsExistentes.some(
                        (s) =>
                          s.skillId !== null && s.skillId === item.id && s.status !== 'disabled'
                      )
                      const yaRegistradaDisabled = skillsExistentes.some(
                        (s) =>
                          s.skillId !== null && s.skillId === item.id && s.status === 'disabled'
                      )
                      const bloqueada = yaRegistradaActiva || yaRegistradaDisabled
                      return (
                        <button
                          key={item.id}
                          type="button"
                          disabled={bloqueada || saving}
                          onClick={() => handleSeleccionarSkill(item)}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${bloqueada ? 'opacity-40 cursor-not-allowed' : isSelected ? accentBg : 'hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${isSelected ? (isTecnica ? 'bg-primary/10' : 'bg-navbar/10') : 'bg-gray-100'}`}
                            >
                              {isTecnica ? (
                                <svg
                                  className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : 'text-gray-500'}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className={`w-3.5 h-3.5 ${isSelected ? 'text-navbar' : 'text-gray-500'}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p
                                className={`text-sm font-medium ${isSelected ? accentText : 'text-gray-800'}`}
                              >
                                {item.nombre}
                              </p>
                              {item.descripcion && (
                                <p className="text-xs text-gray-400">{item.descripcion}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            {yaRegistradaActiva ? (
                              <span className="text-[10px] text-gray-400 italic">
                                Ya registrada
                              </span>
                            ) : yaRegistradaDisabled ? (
                              <span className="text-[10px] text-orange-400 italic">
                                Deshabilitada
                              </span>
                            ) : isSelected ? (
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${accentBadge}`}
                              >
                                Seleccionada
                              </span>
                            ) : null}
                          </div>
                        </button>
                      )
                    })}
                  {sinResultados && (
                    <div className="px-4 py-5 flex flex-col items-center gap-3 text-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          No se encontró{' '}
                          <span className="font-semibold text-gray-700">"{busqueda}"</span> en el
                          catálogo.
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          ¿Crees que debería estar? Puedes sugerirla.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModalSugerencia(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Sugerir "{busqueda}"
                      </button>
                    </div>
                  )}
                  {!loadingCatalog &&
                    !sinResultados &&
                    itemsFiltrados.length === 0 &&
                    !busqueda.trim() && (
                      <div className="px-4 py-6 text-center text-sm text-gray-400">
                        Escribe para buscar una habilidad.
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Paso 3: Nivel */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              <span className="text-gray-400 mr-1.5">3.</span>Nivel
            </p>
            {isTecnica ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {nivelesTecnicos.map((n) => (
                  <button
                    key={n.key}
                    type="button"
                    disabled={saving}
                    onClick={() => setNivelTecnico(n.key)}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all disabled:opacity-50 ${nivelTecnico === n.key ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${NIVEL_DOT[n.key]}`} />
                      <span
                        className={`text-sm font-semibold ${nivelTecnico === n.key ? 'text-primary' : 'text-gray-700'}`}
                      >
                        {n.key}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-tight">{n.desc}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {NIVELES_BLANDA.map((n) => {
                  const isActive = nivelBlanda === n.key
                  return (
                    <button
                      key={n.key}
                      type="button"
                      disabled={saving}
                      onClick={() => setNivelBlanda(n.key)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all disabled:opacity-50 ${isActive ? `${n.border} ${n.bg}` : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${n.dot}`} />
                      <div className="flex-1">
                        <p
                          className={`text-sm font-semibold ${isActive ? n.text : 'text-gray-700'}`}
                        >
                          {n.key}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                      </div>
                      {isActive && (
                        <svg
                          className={`w-4 h-4 flex-shrink-0 ${n.text}`}
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
            )}
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={onCancel}
              disabled={saving}
              className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={!canSave || saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving && <IconSpinner className="w-4 h-4" />}
              Guardar habilidad
            </button>
          </div>
        </div>
      </div>

      {modalSugerencia && (
        <SugerirHabilidadModal
          nombreInicial={busqueda.trim()}
          tipo={tipo}
          categoriaKey={categoriaSeleccionada}
          onCancel={() => setModalSugerencia(false)}
          onToast={onToast}
        />
      )}
    </>
  )
}
