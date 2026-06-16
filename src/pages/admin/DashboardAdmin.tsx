import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,

  BookOpen
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import { Link, useLocation } from 'react-router-dom'
import Calendar from '../../components/ui/Calendar'
import Toast from '../../components/ui/Toast'
import { getUsers, getActivityLogs } from '../../services/admin.service'

import { API_BASE_URL } from '../../utils/constants'

const API_BASE = API_BASE_URL

function getAuthToken(): string {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || ''
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
      ...(options.headers ?? {})
    }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message ?? `Error ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
// ─── Tipos ────────────────────────────────────────────────────────────────────
interface SkillSuggestion {
  id: number
  type: 'tecnica' | 'blanda'
  category: string
  name: string
  level: string
  justification: string | null
  status: 'pending' | 'approved' | 'rejected'
  reviewed_at: string | null
  reviewed_by: { id: number; name: string } | null
  skill_id: number | null
  user: { id: number; name: string; email: string }
  created_at: string
}

interface SuggestionsResponse {
  data: SkillSuggestion[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}

interface CategorySuggestion {
  id: number
  name: string
  justification: string | null
  status: 'pending' | 'approved' | 'rejected'
  reviewed_at: string | null
  reviewed_by: { id: number; name: string } | null
  category_id: number | null
  project: { id: number; title: string }
  user: { id: number; name: string; email: string }
  created_at: string
}

interface CategorySuggestionsResponse {
  data: CategorySuggestion[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const NIVEL_LABEL: Record<string, string> = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  en_formacion: 'En formación',
  desarrollada: 'Desarrollada',
  fortalecida: 'Fortalecida'
}

const getLocalizedLevel = (
  level: string,
  type: 'tecnica' | 'blanda',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any
): string => {
  if (type === 'tecnica') {
    return t(`skills.levels.technical.${level}`, NIVEL_LABEL[level] ?? level)
  } else {
    const key = level === 'en_formacion' ? 'formacion' : level
    return t(`skills.levels.soft.${key}`, NIVEL_LABEL[level] ?? level)
  }
}

function IconSpinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

// ─── Modal de revisión de sugerencias ────────────────────────────────────────
function SkillSuggestionsModal({
  onClose,
  onCountChange
}: {
  onClose: () => void
  onCountChange: (n: number) => void
}) {
  const { t } = useTranslation()
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    ; (async () => {
      setLoading(true)
      try {
        const res = await apiFetch<SuggestionsResponse>('/admin/skill-suggestions?status=pending')
        setSuggestions(res.data)
        onCountChange(res.meta.total)
      } catch {
        setToast({ msg: t('admin.dashboard.skills_modal.error_load', 'No se pudieron cargar las sugerencias.'), ok: false })
      } finally {
        setLoading(false)
      }
    })()
  }, [onCountChange, t])

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setActionId(id)
    try {
      await apiFetch(`/admin/skill-suggestions/${id}/${action}`, { method: 'PATCH' })
      setSuggestions((prev) => prev.filter((s) => s.id !== id))
      onCountChange(suggestions.length - 1)
      setToast({
        msg: action === 'approve'
          ? t('admin.dashboard.skills_modal.toast_approved', 'Sugerencia aprobada.')
          : t('admin.dashboard.skills_modal.toast_rejected', 'Sugerencia rechazada.'),
        ok: action === 'approve'
      })
    } catch {
      setToast({ msg: t('admin.dashboard.skills_modal.toast_error', 'Error al procesar la acción.'), ok: false })
    } finally {
      setActionId(null)
    }
  }

  // Auto-ocultar toast
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[85vh] border border-gray-100 dark:border-gray-800 transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {t('admin.dashboard.skills_modal.title', 'Sugerencias de Habilidades')}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {t('admin.dashboard.skills_modal.subtitle', 'Revisa y aprueba o rechaza las sugerencias de los usuarios.')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
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

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-400">
              <IconSpinner className="w-5 h-5 text-gray-400" /> {t('admin.dashboard.skills_modal.loading', 'Cargando sugerencias...')}
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle size={24} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t('admin.dashboard.skills_modal.no_pending', 'Sin sugerencias pendientes')}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {t('admin.dashboard.skills_modal.all_reviewed', 'Todas las sugerencias han sido revisadas.')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Info de la sugerencia */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {s.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.type === 'tecnica'
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : 'bg-navbar/10 text-navbar border-navbar/20'
                            }`}
                        >
                          {s.type === 'tecnica' ? t('skills.technical', 'Técnica') : t('skills.soft', 'Blanda')}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                          {getLocalizedLevel(s.level, s.type, t)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">
                        <span className="font-medium text-gray-500">{t('admin.dashboard.skills_modal.category', 'Categoría:')}</span> {s.category}
                      </p>
                      <p className="text-xs text-gray-400 mb-1">
                        <span className="font-medium text-gray-500">{t('admin.dashboard.skills_modal.user', 'Usuario:')}</span> {s.user.name}{' '}
                        <span className="text-gray-300">·</span> {s.user.email}
                      </p>
                      {s.justification && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-700 italic">
                          "{s.justification}"
                        </p>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAction(s.id, 'approve')}
                        disabled={actionId === s.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 border-none cursor-pointer"
                      >
                        {actionId === s.id ? (
                          <IconSpinner className="w-3.5 h-3.5" />
                        ) : (
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {t('admin.dashboard.skills_modal.approve', 'Aprobar')}
                      </button>
                      <button
                        onClick={() => handleAction(s.id, 'reject')}
                        disabled={actionId === s.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-action rounded-lg hover:bg-action/90 transition-colors disabled:opacity-60 border-none cursor-pointer"
                      >
                        {actionId === s.id ? (
                          <IconSpinner className="w-3.5 h-3.5" />
                        ) : (
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                        {t('admin.dashboard.skills_modal.reject', 'Rechazar')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {t('admin.dashboard.skills_modal.pending_count', { count: suggestions.length })}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            {t('admin.dashboard.skills_modal.close', 'Cerrar')}
          </button>
        </div>

        {/* Toast interno */}
        {toast && (
          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium text-white ${toast.ok ? 'bg-primary' : 'bg-action'}`}
          >
            {toast.ok ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Modal de revisión de sugerencias de CATEGORÍAS ──────────────────────────
function CategorySuggestionsModal({
  onClose,
  onCountChange
}: {
  onClose: () => void
  onCountChange: (n: number) => void
}) {
  const { t } = useTranslation()
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    ; (async () => {
      setLoading(true)
      try {
        const res = await apiFetch<CategorySuggestionsResponse>(
          '/admin/category-suggestions?status=pending'
        )
        setSuggestions(res.data)
        onCountChange(res.meta.total)
      } catch {
        setToast({ msg: t('admin.dashboard.categories_modal.error_load', 'No se pudieron cargar las sugerencias de categorías.'), ok: false })
      } finally {
        setLoading(false)
      }
    })()
  }, [onCountChange, t])

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setActionId(id)
    try {
      await apiFetch(`/admin/category-suggestions/${id}/${action}`, { method: 'PATCH' })
      setSuggestions((prev) => prev.filter((s) => s.id !== id))
      onCountChange(suggestions.length - 1)
      setToast({
        msg: action === 'approve'
          ? t('admin.dashboard.categories_modal.toast_approved', 'Sugerencia aprobada.')
          : t('admin.dashboard.categories_modal.toast_rejected', 'Sugerencia rechazada.'),
        ok: action === 'approve'
      })
    } catch {
      setToast({ msg: t('admin.dashboard.categories_modal.toast_error', 'Error al procesar la acción.'), ok: false })
    } finally {
      setActionId(null)
    }
  }

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[85vh] border border-gray-100 dark:border-gray-800 transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {t('admin.dashboard.categories_modal.title', 'Sugerencias de Categorías')}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {t('admin.dashboard.categories_modal.subtitle', 'Revisa y aprueba o rechaza las sugerencias de nuevas categorías.')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
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

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-400">
              <IconSpinner className="w-5 h-5 text-gray-400" /> {t('admin.dashboard.categories_modal.loading', 'Cargando sugerencias...')}
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle size={24} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t('admin.dashboard.categories_modal.no_pending', 'Sin sugerencias pendientes')}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {t('admin.dashboard.categories_modal.all_reviewed', 'Todas las sugerencias han sido revisadas.')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {s.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/20">
                          {t('admin.dashboard.categories_modal.new_category', 'Nueva Categoría')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">
                        <span className="font-medium text-gray-500">{t('admin.dashboard.categories_modal.project', 'Proyecto:')}</span>{' '}
                        {s.project.title}
                      </p>
                      <p className="text-xs text-gray-400 mb-1">
                        <span className="font-medium text-gray-500">{t('admin.dashboard.categories_modal.user', 'Usuario:')}</span> {s.user.name}{' '}
                        <span className="text-gray-300">·</span> {s.user.email}
                      </p>
                      {s.justification && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-700 italic">
                          "{s.justification}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAction(s.id, 'approve')}
                        disabled={actionId === s.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 border-none cursor-pointer"
                      >
                        {actionId === s.id ? (
                          <IconSpinner className="w-3.5 h-3.5" />
                        ) : (
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {t('admin.dashboard.categories_modal.approve', 'Aprobar')}
                      </button>
                      <button
                        onClick={() => handleAction(s.id, 'reject')}
                        disabled={actionId === s.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-action rounded-lg hover:bg-action/90 transition-colors disabled:opacity-60 border-none cursor-pointer"
                      >
                        {actionId === s.id ? (
                          <IconSpinner className="w-3.5 h-3.5" />
                        ) : (
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                        {t('admin.dashboard.categories_modal.reject', 'Rechazar')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 flex items-center justify-between">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t('admin.dashboard.categories_modal.pending_count', { count: suggestions.length })}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            {t('admin.dashboard.categories_modal.close', 'Cerrar')}
          </button>
        </div>

        {toast && (
          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium text-white ${toast.ok ? 'bg-primary' : 'bg-action'}`}
          >
            {toast.ok ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Subcomponente fuera del render ───────────────────────────────────────────
// ─── Subcomponente fuera del render ───────────────────────────────────────────
const RightPanelContent = ({
  inactiveUsers,
  failedLogins,
  loadingCount,
  pendingCount,
  loadingCategoryCount,
  pendingCategoryCount,
  onShowSugerencias,
  onShowCategorias
}: {
  inactiveUsers: number
  failedLogins: number
  loadingCount: boolean
  pendingCount: number | null
  loadingCategoryCount: boolean
  pendingCategoryCount: number | null
  onShowSugerencias: () => void
  onShowCategorias: () => void
}) => {
  const { t } = useTranslation()
  return (
    <div className="sticky top-6">
      <Calendar />
      <div className="mt-8">
        <h3 className="font-bold text-textMain dark:text-white text-sm mb-4 flex items-center gap-2">
          <ShieldAlert size={16} className="text-action" />
          {t('admin.dashboard.notifications.title', 'Notificaciones')}
        </h3>
        <div className="space-y-3">
          {inactiveUsers > 0 && (
            <div className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-400 leading-tight">
              <AlertTriangle size={14} className="text-action shrink-0" />
              <span>
                {t('admin.dashboard.notifications.inactive_users', { count: inactiveUsers })}
              </span>
            </div>
          )}
          {failedLogins > 0 && (
            <div className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-400 leading-tight">
              <AlertTriangle size={14} className="text-action shrink-0" />
              <span>
                {t('admin.dashboard.notifications.failed_logins', { count: failedLogins })}
              </span>
            </div>
          )}
          {/* Notificación dinámica de sugerencias */}
          {!loadingCount && !!pendingCount && pendingCount > 0 && (
            <div
              onClick={onShowSugerencias}
              className="flex items-start gap-2 text-[11px] text-action leading-tight cursor-pointer hover:underline"
            >
              <BookOpen size={14} className="text-action shrink-0" />
              <span>
                {t('admin.dashboard.notifications.pending_skills', { count: pendingCount })}
              </span>
            </div>
          )}
          {/* Notificación dinámica de categorías */}
          {!loadingCategoryCount && !!pendingCategoryCount && pendingCategoryCount > 0 && (
            <div
              onClick={onShowCategorias}
              className="flex items-start gap-2 text-[11px] text-action leading-tight cursor-pointer hover:underline"
            >
              <BookOpen size={14} className="text-action shrink-0" />
              <span>
                {t('admin.dashboard.notifications.pending_categories', { count: pendingCategoryCount })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard principal ──────────────────────────────────────────────────────
// ─── Dashboard principal ──────────────────────────────────────────────────────
const DashboardAdmin = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [modalSugerencias, setModalSugerencias] = useState(false)
  const [pendingCount, setPendingCount] = useState<number | null>(null)
  const [loadingCount, setLoadingCount] = useState(true)

  const [modalCategorias, setModalCategorias] = useState(false)

  // Abrir modal automáticamente según la URL (útil para links desde notificaciones)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get('modal') === 'skills') {
      setModalSugerencias(true)
    } else if (searchParams.get('modal') === 'categories') {
      setModalCategorias(true)
    }
  }, [location.search])
  const [pendingCategoryCount, setPendingCategoryCount] = useState<number | null>(null)
  const [loadingCategoryCount, setLoadingCategoryCount] = useState(true)

  // Stats dinámicos
  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [inactiveUsers, setInactiveUsers] = useState<number>(0)

  const [failedLogins, setFailedLogins] = useState<number>(0)
  const [lastBackupTimestamp, setLastBackupTimestamp] = useState<string | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [toast, setToast] = useState<{
    mensaje: string
    tipo: 'success' | 'error' | 'info'
  } | null>(null)
  const handleCloseToast = useCallback(() => setToast(null), [])

  // Carga datos al montar
  useEffect(() => {
    ; (async () => {
      // Pending suggestions count
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token') || ''
        const res = await fetch(
          `${API_BASE_URL}/admin/skill-suggestions?status=pending&per_page=1`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (res.ok) {
          const data = await res.json()
          setPendingCount(data.meta?.total ?? 0)
        } else {
          setPendingCount(0)
        }
      } catch {
        setPendingCount(0)
        setToast({ mensaje: t('admin.dashboard.toasts.error_skills', 'No se pudieron cargar las sugerencias pendientes.'), tipo: 'error' })
      } finally {
        setLoadingCount(false)
      }

      // Pending category suggestions count
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token') || ''
        const res = await fetch(
          `${API_BASE_URL}/admin/category-suggestions?status=pending&per_page=1`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (res.ok) {
          const data = await res.json()
          setPendingCategoryCount(data.meta?.total ?? 0)
        } else {
          setPendingCategoryCount(0)
        }
      } catch {
        setPendingCategoryCount(0)
      } finally {
        setLoadingCategoryCount(false)
      }

      // Users stats
      try {
        const users = await getUsers()
        setTotalUsers(users.length)
        setInactiveUsers(users.filter((u: { status: string }) => u.status === 'Inactivo').length)
      } catch {
        setTotalUsers(0)
        setToast({ mensaje: t('admin.dashboard.toasts.error_users', 'No se pudieron cargar los datos de usuarios.'), tipo: 'error' })
      }

      // Activity logs — intentos fallidos recientes + último backup
      try {
        const logs = await getActivityLogs({ per_page: 100 })
        const failed = logs.data.filter((l: { event: string }) => l.event === 'login_failed')
        setFailedLogins(failed.length)

        // Obtener fecha del último backup real
        const backupLog = logs.data.find((l: { event: string }) => l.event === 'backup.generated')
        if (backupLog) {
          setLastBackupTimestamp(backupLog.timestamp || backupLog.created_at)
        }
      } catch {
        setFailedLogins(0)
        setToast({ mensaje: t('admin.dashboard.toasts.error_activity', 'No se pudo cargar el historial de actividad.'), tipo: 'error' })
      }

      setLoadingStats(false)
      setToast((prev) =>
        prev === null
          ? { mensaje: t('admin.dashboard.toasts.success_load', 'Panel de administración cargado correctamente.'), tipo: 'success' }
          : prev
      )
    })()
  }, [t])

  return (
    <div className="h-full max-h-full bg-background dark:bg-slate-900 flex flex-col transition-colors duration-300 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem="Dashboard" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-background dark:bg-slate-900 transition-colors duration-300">
          <div className="flex-1 p-4 sm:p-6 md:p-6 overflow-y-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-textMain dark:text-white mb-1">
              {t('admin.dashboard.title', 'Panel de Administración')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {t('admin.dashboard.subtitle', 'Control general de la plataforma NEXUM')}
            </p>

            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('admin.dashboard.stats.total_users', 'Total Usuarios Registrados')}
                </p>
                <p className="text-3xl font-bold text-primary dark:text-blue-400">
                  {loadingStats ? '—' : (totalUsers ?? 0)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {t('admin.dashboard.stats.total_users_desc', 'Total de usuarios en la plataforma')}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('admin.dashboard.stats.inactive_users', 'Usuarios Inactivos')}
                </p>
                <p className="text-3xl font-bold text-primary dark:text-blue-400">
                  {loadingStats ? '—' : inactiveUsers}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {inactiveUsers > 0
                    ? t('admin.dashboard.stats.inactive_users_attention', 'Requieren atención')
                    : t('admin.dashboard.stats.inactive_users_all_active', 'Todos activos')}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('admin.dashboard.stats.failed_logins', 'Accesos Fallidos Recientes')}
                </p>
                <p className="text-3xl font-bold text-action">
                  {loadingStats ? '—' : failedLogins}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {failedLogins > 0
                    ? t('admin.dashboard.stats.failed_logins_check', 'Revisar logs de auditoría')
                    : t('admin.dashboard.stats.failed_logins_no_alerts', 'Sin alertas')}
                </p>
              </div>
            </div>

            {/* Cards de acciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Gestión de Usuarios */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={18} className="text-textMain dark:text-white" />
                  <h2 className="font-semibold text-textMain dark:text-white">
                    {t('admin.dashboard.users_card.title', 'Gestión de Usuarios')}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                  {t('admin.dashboard.users_card.desc', 'Administra cuentas, roles, estados y permisos de los usuarios.')}
                </p>
                <div
                  className={`text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-block font-medium border ${inactiveUsers > 0
                    ? 'bg-action/5 text-action border-action/20'
                    : 'bg-primary/5 text-primary border-primary/20'
                    }`}
                >
                  {loadingStats
                    ? t('admin.dashboard.users_card.loading', 'Cargando...')
                    : inactiveUsers > 0
                      ? t('admin.dashboard.users_card.inactive_count', { count: inactiveUsers })
                      : t('admin.dashboard.users_card.all_active', 'Todos los usuarios están activos.')}
                </div>
                <br />
                <Link
                  to="/admin/usuarios"
                  className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-all inline-block shadow-sm no-underline"
                >
                  {t('admin.dashboard.users_card.button', 'Ver usuarios')}
                </Link>
              </div>

              {/* Copias de Seguridad */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={18} className="text-textMain dark:text-white" />
                  <h2 className="font-semibold text-textMain dark:text-white">
                    {t('admin.dashboard.backups_card.title', 'Copias de Seguridad')}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                  {t('admin.dashboard.backups_card.desc', 'Gestiona y programa los respaldos automáticos de la plataforma.')}
                </p>
                <div className="bg-primary/5 text-primary text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-block font-medium border border-primary/20">
                  {loadingStats
                    ? t('admin.dashboard.backups_card.loading', 'Cargando...')
                    : lastBackupTimestamp
                      ? t('admin.dashboard.backups_card.last_backup', {
                          date: (() => {
                            const d = new Date(lastBackupTimestamp)
                            return (
                              d.toLocaleDateString(i18n.language, { day: '2-digit', month: 'short', year: 'numeric' }) +
                              ' ' +
                              d.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })
                            )
                          })()
                        })
                      : t('admin.dashboard.backups_card.no_backups', 'Sin backups registrados.')}
                </div>
                <br />
                <Link
                  to="/admin/backups"
                  className="bg-action text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm inline-block no-underline"
                >
                  {t('admin.dashboard.backups_card.button', 'Gestionar backups')}
                </Link>
              </div>

              {/* ── NUEVA CARD: Sugerencias de Habilidades ── */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 sm:col-span-2 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={18} className="text-textMain dark:text-white" />
                      <h2 className="font-semibold text-textMain dark:text-white">
                        {t('admin.dashboard.skills_card.title', 'Sugerencias de Habilidades')}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                      {t('admin.dashboard.skills_card.desc', 'Revisa las habilidades propuestas por los usuarios antes de que aparezcan en el catálogo.')}
                    </p>
                    {loadingCount ? (
                      <div className="bg-gray-50 text-gray-400 text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-flex items-center gap-1.5 border border-gray-100">
                        <IconSpinner className="w-3 h-3" /> {t('admin.dashboard.skills_card.loading', 'Cargando...')}
                      </div>
                    ) : pendingCount === 0 ? (
                      <div className="bg-primary/5 text-primary text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-flex items-center gap-1.5 font-medium border border-primary/20">
                        <CheckCircle size={12} /> {t('admin.dashboard.skills_card.no_pending', 'Sin sugerencias pendientes.')}
                      </div>
                    ) : (
                      <div className="bg-action/5 text-action text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-flex items-center gap-1.5 font-medium border border-action/20">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {t('admin.dashboard.skills_card.pending_count', { count: pendingCount })}
                      </div>
                    )}
                    <br />
                    <button
                      onClick={() => setModalSugerencias(true)}
                      className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm inline-flex items-center gap-2 border-none cursor-pointer"
                    >
                      <BookOpen size={14} />
                      {t('admin.dashboard.skills_card.button', 'Revisar sugerencias')}
                    </button>
                  </div>
                </div>
              </div>

              {/* ── NUEVA CARD: Sugerencias de Categorías ── */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 sm:col-span-2 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={18} className="text-textMain dark:text-white" />
                      <h2 className="font-semibold text-textMain dark:text-white">
                        {t('admin.dashboard.categories_card.title', 'Sugerencias de Categorías')}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                      {t('admin.dashboard.categories_card.desc', 'Revisa las categorías propuestas por los usuarios para organizar mejor los proyectos.')}
                    </p>
                    {loadingCategoryCount ? (
                      <div className="bg-gray-50 text-gray-400 text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-flex items-center gap-1.5 border border-gray-100">
                        <IconSpinner className="w-3 h-3" /> {t('admin.dashboard.categories_card.loading', 'Cargando...')}
                      </div>
                    ) : pendingCategoryCount === 0 ? (
                      <div className="bg-primary/5 text-primary text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-flex items-center gap-1.5 font-medium border border-primary/20">
                        <CheckCircle size={12} /> {t('admin.dashboard.categories_card.no_pending', 'Sin sugerencias pendientes.')}
                      </div>
                    ) : (
                      <div className="bg-action/5 text-action text-[11px] px-3 py-1.5 rounded-lg mb-4 inline-flex items-center gap-1.5 font-medium border border-action/20">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {t('admin.dashboard.categories_card.pending_count', { count: pendingCategoryCount })}
                      </div>
                    )}
                    <br />
                    <button
                      onClick={() => setModalCategorias(true)}
                      className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm inline-flex items-center gap-2 border-none cursor-pointer"
                    >
                      <BookOpen size={14} />
                      {t('admin.dashboard.categories_card.button', 'Revisar categorías')}
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Aside derecho */}
          <aside className="hidden lg:block w-64 p-6 bg-white dark:bg-slate-900 lg:border-l border-gray-200 dark:border-gray-800 shrink-0 overflow-y-auto transition-colors duration-300">
            <RightPanelContent
              inactiveUsers={inactiveUsers}
              failedLogins={failedLogins}
              loadingCount={loadingCount}
              pendingCount={pendingCount}
              loadingCategoryCount={loadingCategoryCount}
              pendingCategoryCount={pendingCategoryCount}
              onShowSugerencias={() => setModalSugerencias(true)}
              onShowCategorias={() => setModalCategorias(true)}
            />
          </aside>
        </main>
      </div>

      {modalSugerencias && (
        <SkillSuggestionsModal
          onClose={() => setModalSugerencias(false)}
          onCountChange={setPendingCount}
        />
      )}
      {modalCategorias && (
        <CategorySuggestionsModal
          onClose={() => setModalCategorias(false)}
          onCountChange={setPendingCategoryCount}
        />
      )}
      {toast && <Toast message={toast.mensaje} type={toast.tipo} onClose={handleCloseToast} />}
    </div>
  )
}

export default DashboardAdmin
