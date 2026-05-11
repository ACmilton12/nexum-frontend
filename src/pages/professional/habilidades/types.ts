import type { ApiNivel, ApiPortfolioSkill } from '../../../services/habilidades.service'

// ─── Tipos internos del frontend ──────────────────────────────────────────────
export type TipoHabilidad = 'Técnica' | 'Blanda'
export type NivelTecnico = 'Básico' | 'Intermedio' | 'Avanzado'
export type NivelBlanda = 'En formación' | 'Desarrollada' | 'Fortalecida'
export type NivelHabilidad = NivelTecnico | NivelBlanda

export type CategoriaKey =
  | 'lenguajes'
  | 'frameworks'
  | 'bases-datos'
  | 'otras'
  | 'comunicacion-tecnica'
  | 'trabajo-equipo'
  | 'liderazgo'

export interface Skill {
  portfolioSkillId: number
  skillId: number | null
  suggestionId: number | null
  nombre: string
  tipo: TipoHabilidad
  nivel: NivelHabilidad | null
  categoria: string
  status: 'approved' | 'pending' | 'rejected' | 'disabled'
}

export interface CatalogItem {
  id: number
  nombre: string
  descripcion: string
  tipo: TipoHabilidad
  categoria: string
}

export interface CategoriaInfo {
  key: CategoriaKey
  label: string
  sublabel: string
  ejemplos: string
  tipo: TipoHabilidad
}

// ─── Mapeo API ↔ frontend ─────────────────────────────────────────────────────
function apiTypeToFrontend(type: 'tecnica' | 'blanda'): TipoHabilidad {
  return type === 'tecnica' ? 'Técnica' : 'Blanda'
}

export function frontendTypeToApi(tipo: TipoHabilidad): 'tecnica' | 'blanda' {
  return tipo === 'Técnica' ? 'tecnica' : 'blanda'
}

function apiLevelToFrontend(level: ApiNivel | null): NivelHabilidad | null {
  if (!level) return null
  const map: Record<ApiNivel, NivelHabilidad> = {
    basico: 'Básico',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
    en_formacion: 'En formación',
    desarrollada: 'Desarrollada',
    fortalecida: 'Fortalecida'
  }
  return map[level] ?? null
}

export function frontendLevelToApi(nivel: NivelHabilidad): ApiNivel {
  const map: Record<NivelHabilidad, ApiNivel> = {
    Básico: 'basico',
    Intermedio: 'intermedio',
    Avanzado: 'avanzado',
    'En formación': 'en_formacion',
    Desarrollada: 'desarrollada',
    Fortalecida: 'fortalecida'
  }
  return map[nivel]
}

export function mapPortfolioSkill(api: ApiPortfolioSkill): Skill {
  return {
    portfolioSkillId: api.id,
    skillId: api.skill_id ?? null,
    suggestionId: api.suggestion_id ?? null,
    nombre: api.name,
    tipo: apiTypeToFrontend(api.type),
    nivel: apiLevelToFrontend(api.level),
    categoria: api.category,
    status: api.is_active === false ? 'disabled' : (api.status ?? 'approved')
  }
}
