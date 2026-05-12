import { useState, useEffect, useCallback } from "react";
import {
  recordProfileVisit,
  getProfileStats,
  getProfileVisitors,
  type ProfileStats,
  type ProfileVisitor,
  type ProfileVisitorsPaginated,
} from "../services/profileVisits.service";

// ─── Hook: useRecordVisit ───────────────────────────────────────
/**
 * Registra una visita al perfil cuando se monta el componente.
 * Ideal para llamarlo en la vista pública de un portafolio.
 */
export const useRecordVisit = (portfolioId: number | null) => {
  const [recorded, setRecorded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!portfolioId) return;

    const doRecord = async () => {
      setLoading(true);
      setError(null);
      try {
        await recordProfileVisit(portfolioId);
        setRecorded(true);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al registrar visita");
      } finally {
        setLoading(false);
      }
    };

    doRecord();
  }, [portfolioId]);

  return { recorded, loading, error };
};

// ─── Hook: useProfileStats ──────────────────────────────────────
/**
 * Obtiene las estadísticas y visitantes recientes del perfil.
 */
export const useProfileStats = (portfolioId: number | null) => {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!portfolioId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getProfileStats(portfolioId);
      setStats(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al obtener estadísticas");
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// ─── Hook: useProfileVisitors ───────────────────────────────────
/**
 * Obtiene la lista paginada de visitantes del perfil.
 */
export const useProfileVisitors = (
  portfolioId: number | null,
  perPage: number = 20
) => {
  const [visitors, setVisitors] = useState<ProfileVisitor[]>([]);
  const [meta, setMeta] = useState<ProfileVisitorsPaginated["meta"] | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitors = useCallback(
    async (pageNum: number) => {
      if (!portfolioId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getProfileVisitors(portfolioId, pageNum, perPage);
        setVisitors(data.data);
        setMeta(data.meta);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al obtener visitantes");
      } finally {
        setLoading(false);
      }
    },
    [portfolioId, perPage]
  );

  useEffect(() => {
    fetchVisitors(page);
  }, [fetchVisitors, page]);

  const goToPage = (p: number) => setPage(p);
  const nextPage = () => {
    if (meta && meta.last_page && page < meta.last_page) setPage((prev) => prev + 1);
  };
  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return {
    visitors,
    meta,
    page,
    loading,
    error,
    goToPage,
    nextPage,
    prevPage,
    refetch: () => fetchVisitors(page),
  };
};
