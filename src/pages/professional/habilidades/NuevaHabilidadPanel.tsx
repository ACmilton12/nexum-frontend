import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
    { key: t('skills.basic') as NivelTecnico, desc: t('skills.basic_desc') },
    { key: t('skills.intermediate') as NivelTecnico, desc: t('skills.intermediate_desc') },
    { key: t('skills.advanced') as NivelTecnico, desc: t('skills.advanced_desc') }
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
      setErrorDuplicado(t('skills.already_active', { name: item.nombre }))
      setSkillSeleccionada(null)
      return
    }
    if (yaExisteDeshabilitada) {
      setErrorDuplicado(t('skills.already_disabled', { name: item.nombre }))
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
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-slate-900/50">
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
              {skillSeleccionada
                ? t('skills.new_skill_specific', { name: skillSeleccionada.nombre })
                : t('skills.new_skill_title')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {isTecnica ? t('skills.instruction_technical') : t('skills.instruction_soft')}
            </p>
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-0.5 self-start sm:self-auto flex-shrink-0">
            {(['Técnica', 'Blanda'] as TipoHabilidad[]).map((t_item) => (
              <button
                key={t_item}
                onClick={() => handleTipoChange(t_item)}
                disabled={saving}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all disabled:opacity-50 ${tipo === t_item ? (isTecnica ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'bg-white dark:bg-slate-800 text-navbar shadow-sm') : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                {t_item === 'Técnica' ? t('skills.technical') : t('skills.soft')}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-5 sm:space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <span className="text-gray-400 dark:text-gray-500 mr-1.5">1.</span>
              {t('skills.step_category')}
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
                    className={`text-left p-3.5 rounded-xl border-2 transition-all disabled:opacity-50 ${isActive ? `${accentBorder} ${accentBg}` : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                  >
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? accentText : 'text-gray-400 dark:text-gray-500'}`}
                    >
                      {cat.sublabel}
                    </span>
                    <p
                      className={`text-sm font-semibold mt-0.5 ${isActive ? accentText : 'text-gray-800 dark:text-white'}`}
                    >
                      {cat.label}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">
                      {cat.ejemplos}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <span className="text-gray-400 dark:text-gray-500 mr-1.5">2.</span>
              {t('skills.step_search')}
            </p>
            <div
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 transition-colors ${categoriaSeleccionada ? 'border-gray-300 dark:border-slate-700 focus-within:border-primary' : 'border-gray-200 dark:border-slate-800 opacity-50 pointer-events-none'}`}
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
                    ? t('skills.search_catalog_placeholder')
                    : t('skills.select_category_first')
                }
                className="flex-1 outline-none text-sm text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 bg-transparent disabled:opacity-50"
              />
              <IconSearch className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
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
              <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                    {isTecnica
                      ? t('skills.technical').toUpperCase()
                      : t('skills.soft').toUpperCase()}{' '}
                    · {categoriaLabel.toUpperCase()}
                  </span>
                  {skillSeleccionada && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${accentBadge}`}
                    >
                      ✓ {skillSeleccionada.nombre}
                    </span>
                  )}
                </div>
                <div className="divide-y divide-gray-50 dark:divide-slate-800 max-h-52 overflow-y-auto">
                  {loadingCatalog && (
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
                      <IconSpinner className="w-4 h-4 text-gray-400" />{' '}
                      {t('skills.loading_catalog')}
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
                          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${bloqueada ? 'opacity-40 cursor-not-allowed' : isSelected ? accentBg : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${isSelected ? (isTecnica ? 'bg-primary/10' : 'bg-navbar/10') : 'bg-gray-100 dark:bg-slate-800'}`}
                            >
                              {isTecnica ? (
                                <svg
                                  className={`w-3.5 h-3.5 ${isSelected ? 'text-primary dark:text-blue-400' : 'text-gray-500 dark:text-gray-500'}`}
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
                                  className={`w-3.5 h-3.5 ${isSelected ? 'text-navbar dark:text-blue-400' : 'text-gray-500 dark:text-gray-500'}`}
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
                                className={`text-sm font-medium ${isSelected ? accentText : 'text-gray-800 dark:text-white'}`}
                              >
                                {item.nombre}
                              </p>
                              {item.descripcion && (
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                  {item.descripcion}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            {yaRegistradaActiva ? (
                              <span className="text-[10px] text-gray-400 italic">
                                {t('skills.registered_already')}
                              </span>
                            ) : yaRegistradaDisabled ? (
                              <span className="text-[10px] text-orange-400 italic">
                                {t('skills.disabled_already')}
                              </span>
                            ) : isSelected ? (
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${accentBadge}`}
                              >
                                {t('skills.selected')}
                              </span>
                            ) : null}
                          </div>
                        </button>
                      )
                    })}
                  {sinResultados && (
                    <div className="px-4 py-5 flex flex-col items-center gap-3 text-center">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('skills.no_results_found', { name: busqueda })}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {t('skills.suggest_info')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModalSugerencia(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
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
                        {t('skills.suggest_btn', { name: busqueda })}
                      </button>
                    </div>
                  )}
                  {!loadingCatalog &&
                    !sinResultados &&
                    itemsFiltrados.length === 0 &&
                    !busqueda.trim() && (
                      <div className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                        {t('skills.write_to_search')}
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <span className="text-gray-400 dark:text-gray-500 mr-1.5">3.</span>
              {t('skills.step_level')}
            </p>
            {isTecnica ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {nivelesTecnicos.map((n) => (
                  <button
                    key={n.key}
                    type="button"
                    disabled={saving}
                    onClick={() => setNivelTecnico(n.key)}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all disabled:opacity-50 ${nivelTecnico === n.key ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-gray-600'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${NIVEL_DOT[n.key]}`} />
                      <span
                        className={`text-sm font-semibold ${nivelTecnico === n.key ? 'text-primary' : 'text-gray-700 dark:text-gray-200'}`}
                      >
                        {n.key}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">
                      {n.desc}
                    </p>
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all disabled:opacity-50 ${isActive ? `${n.border} ${n.bg}` : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                    >
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${n.dot}`} />
                      <div className="flex-1">
                        <p
                          className={`text-sm font-semibold ${isActive ? n.text : 'text-gray-700 dark:text-gray-200'}`}
                        >
                          {n.key}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{n.desc}</p>
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

          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={onCancel}
              disabled={saving}
              className="flex-1 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {t('skills.cancel_btn')}
            </button>
            <button
              onClick={handleGuardar}
              disabled={!canSave || saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving && <IconSpinner className="w-4 h-4" />}
              {t('skills.save_skill_btn')}
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
