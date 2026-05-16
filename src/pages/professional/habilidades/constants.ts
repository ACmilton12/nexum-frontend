import type {
  CategoriaKey,
  CategoriaInfo,
  TipoHabilidad,
  NivelHabilidad,
  NivelBlanda
} from './types'

// ─── Mapeo categorías ─────────────────────────────────────────────────────────
export const CATEGORIA_KEY_MAP: Record<string, CategoriaKey> = {
  'Lenguajes de Programación': 'lenguajes',
  'Frameworks & Librerías': 'frameworks',
  'Bases de Datos': 'bases-datos',
  'Cloud & DevOps': 'otras',
  'Herramientas & Plataformas': 'otras',
  Comunicación: 'comunicacion-tecnica',
  Colaboración: 'trabajo-equipo',
  'Liderazgo & Gestión': 'liderazgo',
  'Pensamiento Analítico': 'otras',
  'Desarrollo Personal': 'otras'
}

export const CATEGORIA_KEY_TO_BACKEND: Record<CategoriaKey, string> = {
  lenguajes: 'Lenguajes de Programación',
  frameworks: 'Frameworks & Librerías',
  'bases-datos': 'Bases de Datos',
  otras: 'Herramientas & Plataformas',
  'comunicacion-tecnica': 'Comunicación',
  'trabajo-equipo': 'Colaboración',
  liderazgo: 'Liderazgo & Gestión'
}

// ─── Catálogos UI ─────────────────────────────────────────────────────────────
const CATEGORIAS_TECNICA: CategoriaInfo[] = [
  {
    key: 'lenguajes',
    label: 'Lenguajes',
    sublabel: 'TÉCNICA',
    ejemplos: 'Python, JavaScript, Java',
    tipo: 'Técnica'
  },
  {
    key: 'frameworks',
    label: 'Frameworks & Librerías',
    sublabel: 'TÉCNICA',
    ejemplos: 'React, Vue, Next.js',
    tipo: 'Técnica'
  },
  {
    key: 'bases-datos',
    label: 'Bases de Datos',
    sublabel: 'TÉCNICA',
    ejemplos: 'MySQL, PostgreSQL, Supabase',
    tipo: 'Técnica'
  },
  {
    key: 'otras',
    label: 'Otras',
    sublabel: 'TÉCNICA',
    ejemplos: 'Docker, Git, Figma',
    tipo: 'Técnica'
  }
]

const CATEGORIAS_BLANDA: CategoriaInfo[] = [
  {
    key: 'comunicacion-tecnica',
    label: 'Comunicación técnica',
    sublabel: 'SOFT',
    ejemplos: 'Feedback, documentación, presentaciones',
    tipo: 'Blanda'
  },
  {
    key: 'trabajo-equipo',
    label: 'Trabajo en equipo',
    sublabel: 'SOFT',
    ejemplos: 'Colaboración y coordinación',
    tipo: 'Blanda'
  },
  {
    key: 'liderazgo',
    label: 'Liderazgo',
    sublabel: 'SOFT',
    ejemplos: 'Guía y toma de decisiones',
    tipo: 'Blanda'
  }
]

export function categoriasParaTipo(tipo: TipoHabilidad): CategoriaInfo[] {
  return tipo === 'Técnica' ? CATEGORIAS_TECNICA : CATEGORIAS_BLANDA
}

export const ALL_CATEGORIAS = [...CATEGORIAS_TECNICA, ...CATEGORIAS_BLANDA]

// ─── Estilos de badges ────────────────────────────────────────────────────────
export const NIVEL_BADGE: Record<NivelHabilidad, string> = {
  Avanzado: 'bg-green-100 text-green-700 border border-green-200',
  Intermedio: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Básico: 'bg-gray-100 text-gray-500 border border-gray-200',
  Fortalecida: 'bg-purple-100 text-purple-700 border border-purple-200',
  Desarrollada: 'bg-indigo-100 text-indigo-600 border border-indigo-200',
  'En formación': 'bg-pink-50 text-pink-500 border border-pink-200'
}

export const NIVEL_DOT: Record<NivelHabilidad, string> = {
  Avanzado: 'bg-green-500',
  Intermedio: 'bg-yellow-400',
  Básico: 'bg-gray-400',
  Fortalecida: 'bg-purple-500',
  Desarrollada: 'bg-indigo-400',
  'En formación': 'bg-pink-400'
}

// ─── Niveles blandos (con estilos para selectores) ────────────────────────────
export const NIVELES_BLANDA: {
  key: NivelBlanda
  desc: string
  dot: string
  border: string
  bg: string
  text: string
}[] = [
  {
    key: 'En formación',
    desc: 'Estoy desarrollando esta habilidad.',
    dot: 'bg-pink-400',
    border: 'border-pink-400',
    bg: 'bg-pink-50',
    text: 'text-pink-700'
  },
  {
    key: 'Desarrollada',
    desc: 'La aplico con seguridad.',
    dot: 'bg-indigo-400',
    border: 'border-indigo-500',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700'
  },
  {
    key: 'Fortalecida',
    desc: 'Es una de mis fortalezas consolidadas.',
    dot: 'bg-purple-500',
    border: 'border-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-700'
  }
]
