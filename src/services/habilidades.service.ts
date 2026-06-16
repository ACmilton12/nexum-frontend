/// habilidades.service.ts
import { API_BASE_URL } from '../utils/constants'

function getAuthToken(): string {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  return token ?? ''
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
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
    const message =
      body?.message ??
      body?.errors?.[Object.keys(body?.errors ?? {})[0]]?.[0] ??
      `Error ${res.status}`
    throw new Error(message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// ─── Tipos de la API ──────────────────────────────────────────────────────────
export interface ApiCatalogSkill {
  id: number
  name: string
  type: 'tecnica' | 'blanda'
  category: string
}

/**
 * Niveles técnicos: basico | intermedio | avanzado
 * Niveles blandos:  en_formacion | desarrollada | fortalecida
 */
export type ApiNivelTecnico = 'basico' | 'intermedio' | 'avanzado'
export type ApiNivelBlanda = 'en_formacion' | 'desarrollada' | 'fortalecida'
export type ApiNivel = ApiNivelTecnico | ApiNivelBlanda

/**
 * Skill del portfolio del usuario.
 * Los campos name/type/category son APLANADOS (no hay objeto skill anidado).
 */
export interface ApiPortfolioSkill {
  id: number
  skill_id: number | null
  suggestion_id?: number | null
  name: string
  type: 'tecnica' | 'blanda'
  category: string
  level: ApiNivel | null
  is_active: boolean
  status?: 'approved' | 'pending' | 'rejected' | 'disabled'
  justification?: string | null
  created_at: string
  updated_at: string
}

// ─── Wrappers de respuesta ────────────────────────────────────────────────────
interface ApiPortfolioSkillsResponse {
  data: {
    tecnica: Record<string, ApiPortfolioSkill[]>
    blanda: Record<string, ApiPortfolioSkill[]>
  }
}


interface ApiCatalogResponse {
  data: {
    tecnica: Record<string, ApiCatalogSkill[]>
    blanda: Record<string, ApiCatalogSkill[]>
  }
}

interface ApiSuggestResponse {
  data: {
    id: number
    suggestion_id: number
    name: string
    type: 'tecnica' | 'blanda'
    category: string
    level: ApiNivel | null
    is_active: boolean
    status: 'pending' | 'approved' | 'rejected'
    justification: string | null
    created_at: string
    updated_at: string
  }
}

// ─── Funciones del servicio ───────────────────────────────────────────────────

/** GET /portfolio/skills → array plano de skills del usuario */
export async function getPortfolioSkills(): Promise<ApiPortfolioSkill[]> {
  const res = await apiFetch<ApiPortfolioSkillsResponse>('/portfolio/skills?include_inactive=true')
  const tecnicas = Object.values(res.data?.tecnica ?? {}).flat()
  const blandas = Object.values(res.data?.blanda ?? {}).flat()
  return [...tecnicas, ...blandas]
}

/** GET /skills/catalog → array plano del catálogo global */
export async function getCatalogSkills(): Promise<ApiCatalogSkill[]> {
  const res = await apiFetch<ApiCatalogResponse>('/skills/catalog')
  const tecnicas = Object.values(res.data?.tecnica ?? {}).flat()
  const blandas = Object.values(res.data?.blanda ?? {}).flat()
  return [...tecnicas, ...blandas]
}

/** POST /portfolio/skills */
export async function addPortfolioSkill(
  skillId: number,
  level?: ApiNivel
): Promise<ApiPortfolioSkill> {
  const body: { skill_id: number; level?: string } = { skill_id: skillId }
  if (level) body.level = level
  const res = await apiFetch<any>('/portfolio/skills', {
    method: 'POST',
    body: JSON.stringify(body)
  })
  return res.data ?? res
}

/** PUT /portfolio/skills/{id} — actualiza nivel y/o status */
export async function updatePortfolioSkill(
  portfolioSkillId: number,
  level: ApiNivel // solo level, sin isActive
): Promise<ApiPortfolioSkill> {
  const res = await apiFetch<any>(`/portfolio/skills/${portfolioSkillId}`, {
    method: 'PUT',
    body: JSON.stringify({ level })
  })
  return res.data ?? res
}

/** Deshabilita una skill (soft-delete) */
export async function disablePortfolioSkill(portfolioSkillId: number): Promise<ApiPortfolioSkill> {
  const res = await apiFetch<any>(`/portfolio/skills/${portfolioSkillId}`, {
    method: 'DELETE'
  })
  return res.data ?? res
}
/**
 * POST /portfolio/skill-suggestions — sugerencia de nueva habilidad
 * El campo level es OBLIGATORIO según la spec.
 */
export async function suggestSkill(
  name: string,
  type: 'tecnica' | 'blanda',
  category: string,
  level: ApiNivel,
  justification?: string
): Promise<ApiSuggestResponse['data']> {
  const body: Record<string, string> = { name, type, category, level }
  if (justification) body.justification = justification
  const res = await apiFetch<any>('/portfolio/skill-suggestions', {
    method: 'POST',
    body: JSON.stringify(body)
  })
  return res.data ?? res
}
