import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from '../../admin/components/Sidebar'
import Toast from '../../../components/ui/Toast'

import {
  getPortfolioSkills,
  getCatalogSkills,
  addPortfolioSkill,
  updatePortfolioSkill,
  disablePortfolioSkill
} from '../../../services/habilidades.service'

import type { Skill, TipoHabilidad, CatalogItem, NivelHabilidad } from './types'
import { mapPortfolioSkill, frontendLevelToApi } from './types'
import { CATEGORIA_KEY_MAP } from './constants'
import { IconSpinner } from './Icons'
import { IconEyeOff, IconEye } from './Icons'
import SkillChip from './SkillChip'
import NuevaHabilidadPanel from './NuevaHabilidadPanel'
import DisableModal from './modals/DisableModal'
import EnableModal from './modals/EnableModal'
import EditNivelTecnicoModal from './modals/EditNivelTecnicoModal'
import EditNivelBlandaModal from './modals/EditNivelBlandaModal'
import { IconSearch } from './Icons'

export default function HabilidadesPage() {
  const { t } = useTranslation()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loadingSkills, setLoadingSkills] = useState(true)
  const [loadingCatalog, setLoadingCatalog] = useState(false)
  const [catalogoPorCategoria, setCatalogoPorCategoria] = useState<Record<string, CatalogItem[]>>(
    {}
  )
  const [filtroTipo, setFiltroTipo] = useState<'Todas' | TipoHabilidad>('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [mostrandoPanel, setMostrandoPanel] = useState(false)
  const [tipoNueva, setTipoNueva] = useState<TipoHabilidad>('Técnica')
  const [savingNew, setSavingNew] = useState(false)
  const [editando, setEditando] = useState<Skill | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [togglingSkill, setTogglingSkill] = useState<Skill | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ mensaje: string; tipo: 'success' | 'error' } | null>(null)

  useEffect(() => {
    ; (async () => {
      setLoadingSkills(true)
      try {
        const data = await getPortfolioSkills()
        setSkills(data.map(mapPortfolioSkill))
        setToast({
          mensaje: t('skills.toast_loaded', {
            count: data.length,
            defaultValue: t('skills.toast_loaded_plural', { count: data.length })
          }),
          tipo: 'success'
        })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : t('skills.error_loading')
        setToast({ mensaje: message, tipo: 'error' })
      } finally {
        setLoadingSkills(false)
      }
    })()
  }, [t])

  useEffect(() => {
    if (!mostrandoPanel || Object.keys(catalogoPorCategoria).length > 0) return
      ; (async () => {
        setLoadingCatalog(true)
        try {
          const data = await getCatalogSkills()
          const grouped: Record<string, CatalogItem[]> = {}
          for (const s of data) {
            const key: string = CATEGORIA_KEY_MAP[s.category] ?? 'otras'
            if (!grouped[key]) grouped[key] = []
            grouped[key].push({
              id: s.id,
              nombre: s.name,
              descripcion: '',
              tipo: s.type === 'tecnica' ? 'Técnica' : 'Blanda',
              categoria: s.category
            })
          }
          setCatalogoPorCategoria(grouped)
          setToast({ mensaje: t('skills.toast_catalog_loaded'), tipo: 'success' })
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : t('skills.error_catalog')
          setToast({ mensaje: message, tipo: 'error' })
        } finally {
          setLoadingCatalog(false)
        }
      })()
  }, [mostrandoPanel, catalogoPorCategoria, t])

  const handleGuardarNuevo = async (skillId: number, nivel: NivelHabilidad | null) => {
    setSavingNew(true)
    try {
      const level = nivel ? frontendLevelToApi(nivel) : undefined
      const created = await addPortfolioSkill(skillId, level)
      setSkills((prev) => [...prev, mapPortfolioSkill(created)])
      setMostrandoPanel(false)
      setToast({
        mensaje: t('skills.toast_added', { name: created.name }),
        tipo: 'success'
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('skills.error_adding')
      setToast({ mensaje: message, tipo: 'error' })
    } finally {
      setSavingNew(false)
    }
  }

  const handleGuardarNivel = async (nuevoNivel: NivelHabilidad) => {
    if (!editando) return
    setSavingEdit(true)
    try {
      const updated = await updatePortfolioSkill(
        editando.portfolioSkillId,
        frontendLevelToApi(nuevoNivel)
      )
      setSkills((prev) =>
        prev.map((s) =>
          s.portfolioSkillId === editando.portfolioSkillId ? mapPortfolioSkill(updated) : s
        )
      )
      setToast({
        mensaje: t('skills.toast_updated', { name: editando.nombre, level: nuevoNivel }),
        tipo: 'success'
      })
      setEditando(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('skills.error_updating')
      setToast({ mensaje: message, tipo: 'error' })
    } finally {
      setSavingEdit(false)
    }
  }

  const handleToggleDisableConfirm = async () => {
    if (!togglingSkill) return
    const isCurrentlyDisabled = togglingSkill.status === 'disabled'
    setTogglingId(togglingSkill.portfolioSkillId)
    try {
      if (isCurrentlyDisabled) {
        const created = await addPortfolioSkill(
          togglingSkill.skillId!,
          togglingSkill.nivel ? frontendLevelToApi(togglingSkill.nivel) : undefined
        )
        setSkills((prev) =>
          prev.map((s) =>
            s.portfolioSkillId === togglingSkill.portfolioSkillId ? mapPortfolioSkill(created) : s
          )
        )
      } else {
        const updated = await disablePortfolioSkill(togglingSkill.portfolioSkillId)
        setSkills((prev) =>
          prev.map((s) =>
            s.portfolioSkillId === togglingSkill.portfolioSkillId ? mapPortfolioSkill(updated) : s
          )
        )
      }
      setToast({
        mensaje: isCurrentlyDisabled
          ? t('skills.toast_enabled', { name: togglingSkill.nombre })
          : t('skills.toast_disabled', { name: togglingSkill.nombre }),
        tipo: 'success'
      })
      setTogglingSkill(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('skills.error_toggling')
      setToast({ mensaje: message, tipo: 'error' })
    } finally {
      setTogglingId(null)
    }
  }

  const handleCloseToast = useCallback(() => setToast(null), [])

  const skillsFiltered = skills.filter((s) => {
    const matchTipo = filtroTipo === 'Todas' || s.tipo === filtroTipo
    const matchBusqueda = s.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return matchTipo && matchBusqueda
  })

  const tecnicas = skillsFiltered.filter((s) => s.tipo === 'Técnica')
  const blandas = skillsFiltered.filter((s) => s.tipo === 'Blanda')

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col transition-colors duration-300">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem="Habilidades" />
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-background dark:bg-slate-900 transition-colors duration-300">
          <div className="flex-1 p-4 pl-16 sm:pl-6 md:p-8 overflow-y-auto">
            <header className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-0.5">
                {t('skills.platform_name')}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textMain dark:text-white">
                {t('skills.title')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('skills.subtitle')}
              </p>
            </header>

            {/* Filtros */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5 self-start transition-colors">
                  {(['Todas', 'Técnica', 'Blanda'] as const).map((tipo_f) => (
                    <button
                      key={tipo_f}
                      onClick={() => setFiltroTipo(tipo_f)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${filtroTipo === tipo_f ? 'bg-white dark:bg-slate-700 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                      {tipo_f === 'Todas'
                        ? t('skills.all')
                        : tipo_f === 'Técnica'
                          ? t('skills.technical')
                          : t('skills.soft')}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 hover:border-gray-400 dark:hover:border-slate-600 transition-colors w-full sm:w-auto">
                  <IconSearch className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder={t('skills.search_placeholder')}
                    className="outline-none text-sm text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 bg-transparent w-full sm:w-40"
                  />
                  {busqueda && (
                    <button
                      onClick={() => setBusqueda('')}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => setMostrandoPanel(true)}
                disabled={mostrandoPanel}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-action hover:bg-action/90 text-white text-sm font-semibold rounded-lg active:scale-95 transition-all whitespace-nowrap disabled:opacity-60 shadow-md"
              >
                + {t('skills.new_skill')}
              </button>
            </div>

            {/* Habilidades registradas */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-md p-5 mb-5 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-gray-800 dark:text-white">
                    {t('skills.registered_skills')}
                  </h2>
                  {!loadingSkills && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-900 px-2 py-0.5 rounded-full font-medium">
                      {skills.length}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                  {t('skills.edit_tip')} · <IconEyeOff className="inline w-3 h-3" /> →{' '}
                  {t('skills.disable_tip')} · <IconEye className="inline w-3 h-3" /> →{' '}
                  {t('skills.enable_tip')}
                </p>
              </div>

              {loadingSkills ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-400">
                  <IconSpinner className="w-5 h-5 animate-spin" />
                  {t('skills.loading_skills')}
                </div>
              ) : (
                <>
                  {(filtroTipo === 'Todas' || filtroTipo === 'Técnica') && (
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                          {t('skills.technical_skills_title')}
                        </p>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-900 px-1.5 py-0.5 rounded-full">
                          {tecnicas.length}
                        </span>
                      </div>
                      {tecnicas.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                          {t('skills.no_technical_skills')}
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {tecnicas.map((s) => (
                            <SkillChip
                              key={s.portfolioSkillId}
                              skill={s}
                              toggling={togglingId === s.portfolioSkillId}
                              onEdit={() => setEditando(s)}
                              onToggleDisable={() => setTogglingSkill(s)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {(filtroTipo === 'Todas' || filtroTipo === 'Blanda') && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                          {t('skills.soft_skills_title')}
                        </p>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-900 px-1.5 py-0.5 rounded-full">
                          {blandas.length}
                        </span>
                      </div>
                      {blandas.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                          {t('skills.no_soft_skills')}
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {blandas.map((s) => (
                            <SkillChip
                              key={s.portfolioSkillId}
                              skill={s}
                              toggling={togglingId === s.portfolioSkillId}
                              onEdit={() => setEditando(s)}
                              onToggleDisable={() => setTogglingSkill(s)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Panel nueva habilidad */}
            {mostrandoPanel && (
              <NuevaHabilidadPanel
                tipo={tipoNueva}
                onTipoChange={setTipoNueva}
                catalogoPorCategoria={catalogoPorCategoria}
                skillsExistentes={skills}
                loadingCatalog={loadingCatalog}
                saving={savingNew}
                onSave={handleGuardarNuevo}
                onCancel={() => setMostrandoPanel(false)}
                onToast={(msg, t) => setToast({ mensaje: msg, tipo: t })}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modales de edición */}
      {editando && editando.tipo === 'Técnica' && (
        <EditNivelTecnicoModal
          skill={editando}
          loading={savingEdit}
          onSave={handleGuardarNivel}
          onCancel={() => setEditando(null)}
        />
      )}
      {editando && editando.tipo === 'Blanda' && (
        <EditNivelBlandaModal
          skill={editando}
          loading={savingEdit}
          onSave={handleGuardarNivel}
          onCancel={() => setEditando(null)}
        />
      )}

      {/* Modal deshabilitar / re-habilitar */}
      {togglingSkill && togglingSkill.status !== 'disabled' && (
        <DisableModal
          skill={togglingSkill}
          loading={togglingId === togglingSkill.portfolioSkillId}
          onConfirm={handleToggleDisableConfirm}
          onCancel={() => setTogglingSkill(null)}
        />
      )}
      {togglingSkill && togglingSkill.status === 'disabled' && (
        <EnableModal
          skill={togglingSkill}
          loading={togglingId === togglingSkill.portfolioSkillId}
          onConfirm={handleToggleDisableConfirm}
          onCancel={() => setTogglingSkill(null)}
        />
      )}

      {toast && <Toast message={toast.mensaje} type={toast.tipo} onClose={handleCloseToast} />}
    </div>
  )
}
