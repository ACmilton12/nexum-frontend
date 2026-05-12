import { API_BASE_URL } from "../utils/constants";

// ─── Helpers ────────────────────────────────────────────────────
const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

// ─── Types ──────────────────────────────────────────────────────

export interface ProfileVisitor {
  id?: number;
  user_id: number | null;
  name: string;
  visited_at: string;
}

export interface ProfileStats {
  visits_count: number;
  recent_visitors: ProfileVisitor[];
}

export interface ProfileVisitorsPaginated {
  data: ProfileVisitor[];
  meta: {
    current_page: number;
    last_page?: number;
    per_page: number;
    total: number;
  };
}

export interface RecordVisitResponse {
  message: string;
  data?: {
    id: number;
    portfolio_id: number;
    user_id: number | null;
    visited_at: string;
  };
}

// ─── Service Functions ──────────────────────────────────────────

/**
 * Registra una visita al perfil.
 * - Si el visitante está logueado, envía el token.
 * - Devuelve 201 si la visita fue registrada.
 * - Devuelve 200 con un mensaje descriptivo si la visita
 *   no fue contada (dueño, admin, duplicado).
 */
export const recordProfileVisit = async (
  portfolioId: number
): Promise<RecordVisitResponse> => {
  const token = getToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/profile/${portfolioId}/visit`,
    {
      method: "POST",
      headers,
    }
  );

  const data = await response.json();

  if (response.status === 201 || response.status === 200) {
    return data;
  }

  if (response.status === 404) {
    throw new Error(data.message || "Portafolio no encontrado.");
  }

  throw new Error(data.message || "Error al registrar la visita.");
};

/**
 * Obtiene las estadísticas del perfil:
 * - visits_count (total de visitas)
 * - recent_visitors (últimos 5 visitantes)
 */
export const getProfileStats = async (
  portfolioId: number
): Promise<ProfileStats> => {
  const response = await fetch(
    `${API_BASE_URL}/profile/${portfolioId}/stats`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al obtener estadísticas del perfil."
    );
  }

  return await response.json();
};

/**
 * Obtiene la lista paginada de visitantes del perfil.
 * @param portfolioId  ID del portafolio
 * @param page         Número de página (por defecto 1)
 * @param perPage      Elementos por página (por defecto 20, máx 100)
 */
export const getProfileVisitors = async (
  portfolioId: number,
  page: number = 1,
  perPage: number = 20
): Promise<ProfileVisitorsPaginated> => {
  const response = await fetch(
    `${API_BASE_URL}/profile/${portfolioId}/visitors?page=${page}&per_page=${perPage}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al obtener la lista de visitantes."
    );
  }

  const raw = await response.json();

  // Calcular last_page si el backend no lo devuelve
  const meta = raw.meta || {};
  if (meta.last_page === undefined && meta.total !== undefined && meta.per_page) {
    meta.last_page = Math.ceil(meta.total / meta.per_page);
  }

  return { ...raw, meta };
};
