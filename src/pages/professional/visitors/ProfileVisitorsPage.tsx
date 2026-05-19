import { useState, useEffect, useCallback } from "react";
import Sidebar from "../../admin/components/Sidebar";
import Calendar from "../../../components/ui/Calendar";
import Toast from "../../../components/ui/Toast";
import {
  User,
  Eye,
  Users,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Settings,
  FileText,
  Loader2,
  RefreshCw,
  TrendingUp,
  UserCheck,
  UserX,
} from "lucide-react";
import { API_BASE_URL } from "../../../utils/constants";
import {
  getProfileStats,
  getProfileVisitors,
  type ProfileVisitor,
  type ProfileStats,
  type ProfileVisitorsPaginated,
} from "../../../services/profileVisits.service";

const ProfileVisitorsPage = () => {
  // ─── State ─────────────────────────────────────────────────────
  const [portfolioId, setPortfolioId] = useState<number | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [visitors, setVisitors] = useState<ProfileVisitor[]>([]);
  const [meta, setMeta] = useState<ProfileVisitorsPaginated["meta"] | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [perPage] = useState(15);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // ─── Fetch Portfolio ID ────────────────────────────────────────
  useEffect(() => {
    const fetchPortfolioId = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/portfolio`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        if (data?.data?.id) {
          setPortfolioId(data.data.id);
        }
      } catch {
        setToast({
          message: "No se pudo obtener tu portafolio.",
          type: "error",
        });
        setLoading(false);
      }
    };
    fetchPortfolioId();
  }, []);

  // ─── Fetch Stats + Visitors ────────────────────────────────────
  const fetchData = useCallback(
    async (pageNum: number, showRefreshIndicator = false) => {
      if (!portfolioId) return;
      if (showRefreshIndicator) setRefreshing(true);
      else setLoading(true);

      try {
        const [statsData, visitorsData] = await Promise.all([
          getProfileStats(portfolioId),
          getProfileVisitors(portfolioId, pageNum, perPage),
        ]);
        setStats(statsData);
        setVisitors(visitorsData.data);
        setMeta(visitorsData.meta);
      } catch (err: unknown) {
        setToast({
          message: err instanceof Error ? err.message : "Error al cargar los datos.",
          type: "error",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [portfolioId, perPage]
  );

  useEffect(() => {
    if (portfolioId) fetchData(page);
  }, [portfolioId, page, fetchData]);

  // ─── Helpers ───────────────────────────────────────────────────
  const formatDate = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatFullDate = (iso: string) => {
    return new Date(iso).toLocaleString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    if (name === "Visitante anónimo") return null;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRefresh = () => fetchData(page, true);

  // ─── Right Panel ───────────────────────────────────────────────
  const rightPanelContent = (
    <div className="sticky top-6 space-y-8">
      <div>
        <h3 className="font-bold text-textMain text-sm mb-4 uppercase tracking-wider">
          Calendario
        </h3>
        <Calendar />
      </div>

      <div>
        <h3 className="font-bold text-textMain text-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
          <ShieldCheck size={18} className="text-action" />
          NOTIFICACIONES
        </h3>
        <div className="space-y-3">
          {stats && stats.visits_count > 0 && (
            <div className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
              <AlertTriangle
                size={14}
                className="text-action mt-0.5 shrink-0"
              />
              <span>
                Tu perfil ha recibido {stats.visits_count} visita
                {stats.visits_count !== 1 ? "s" : ""} en total.
              </span>
            </div>
          )}
          <div className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
            <CheckCircle
              size={14}
              className="text-green-500 mt-0.5 shrink-0"
            />
            <span>Las visitas propias y de admins no se contabilizan.</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-normal text-textMain text-sm mb-4 uppercase tracking-wider">
          Enlaces rápidos
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-primary cursor-pointer hover:underline transition-all">
            <BookOpen size={16} className="text-orange-400" />
            <span className="font-medium">Guía de Usuario</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary cursor-pointer hover:underline transition-all">
            <Settings size={16} className="text-purple-400" />
            <span className="font-medium">Soporte Técnico</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary cursor-pointer hover:underline transition-all">
            <FileText size={16} className="text-blue-300" />
            <span className="font-medium">Políticas UMSS</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Loading State ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full bg-background flex flex-col font-sans overflow-hidden">
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar activeItem="Visitantes" />
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-8 flex items-center justify-center overflow-y-auto">
              <div className="flex flex-col items-center gap-3 text-gray-400 font-medium">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span>Cargando visitantes...</span>
              </div>
            </div>
            <aside className="w-full lg:w-72 p-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 shrink-0 overflow-y-auto">
              {rightPanelContent}
            </aside>
          </main>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div className="h-full bg-background flex flex-col font-sans overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Visitantes" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-8 overflow-y-auto">
            {/* HEADER */}
            <header className="mb-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-textMain mb-1">
                    Visitantes del Perfil
                  </h1>
                  <p className="text-sm text-gray-400">
                    Analiza quién ha visitado tu portafolio profesional.
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Actualizar
                </button>
              </div>
            </header>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Total visits */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-[60px] -mr-2 -mt-2 transition-all group-hover:bg-primary/10" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Eye size={18} className="text-primary" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Visitas totales
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-[#002e6b]">
                    {stats?.visits_count ?? 0}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Desde el inicio
                  </p>
                </div>
              </div>

              {/* Registered visitors */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-[60px] -mr-2 -mt-2 transition-all group-hover:bg-green-100/60" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                      <UserCheck size={18} className="text-green-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Registrados
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-[#002e6b]">
                    {stats?.recent_visitors.filter((v) => v.user_id !== null)
                      .length ?? 0}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Usuarios Nexum recientes
                  </p>
                </div>
              </div>

              {/* Anonymous visitors */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-[60px] -mr-2 -mt-2 transition-all group-hover:bg-orange-100/60" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                      <UserX size={18} className="text-orange-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Anónimos
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-[#002e6b]">
                    {stats?.recent_visitors.filter((v) => v.user_id === null)
                      .length ?? 0}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Visitantes sin cuenta
                  </p>
                </div>
              </div>
            </div>

            {/* RECENT VISITORS (from stats) */}
            {stats && stats.recent_visitors.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp size={18} className="text-primary" />
                  <h2 className="font-bold text-textMain">
                    Visitantes recientes
                  </h2>
                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full ml-auto">
                    Últimos 5
                  </span>
                </div>
                <div className="space-y-0">
                  {stats.recent_visitors.map((visitor, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between py-4 ${
                        idx !== stats.recent_visitors.length - 1
                          ? "border-b border-gray-50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {visitor.user_id !== null ? (
                          <div className="w-10 h-10 rounded-full bg-[#002e6b] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                            {getInitials(visitor.name)}
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100">
                            <User size={18} />
                          </div>
                        )}
                        <div>
                          <p
                            className={`text-sm ${
                              visitor.user_id !== null
                                ? "font-bold text-[#0a2540]"
                                : "text-gray-500 italic"
                            }`}
                          >
                            {visitor.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {formatFullDate(visitor.visited_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {visitor.user_id !== null && (
                          <span className="bg-[#eff4fa] text-[#002e6b] text-[10px] font-bold px-2 py-0.5 rounded-md hidden sm:inline-block">
                            Usuario Nexum
                          </span>
                        )}
                        <span className="text-xs text-gray-400 font-medium">
                          {formatDate(visitor.visited_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FULL VISITORS LIST */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  <h2 className="font-bold text-textMain">
                    Todos los visitantes
                  </h2>
                </div>
                {meta && (
                  <span className="text-xs text-gray-400 font-medium">
                    {meta.total} visitante{meta.total !== 1 ? "s" : ""} en total
                  </span>
                )}
              </div>

              {visitors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Eye size={28} className="text-gray-300" />
                  </div>
                  <p className="font-medium text-sm">
                    Aún no tienes visitantes
                  </p>
                  <p className="text-xs mt-1">
                    Comparte tu portafolio para empezar a recibir visitas.
                  </p>
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 bg-gray-50/60 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <span>Visitante</span>
                    <span className="w-28 text-center">Tipo</span>
                    <span className="w-40 text-right">Fecha de visita</span>
                  </div>

                  {/* Rows */}
                  {visitors.map((visitor, idx) => (
                    <div
                      key={visitor.id ?? idx}
                      className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 sm:gap-4 px-6 py-4 items-center transition-colors hover:bg-gray-50/40 ${
                        idx !== visitors.length - 1
                          ? "border-b border-gray-50"
                          : ""
                      }`}
                    >
                      {/* Visitor info */}
                      <div className="flex items-center gap-3">
                        {visitor.user_id !== null ? (
                          <div className="w-9 h-9 rounded-full bg-[#002e6b] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                            {getInitials(visitor.name)}
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100">
                            <User size={16} />
                          </div>
                        )}
                        <p
                          className={`text-sm ${
                            visitor.user_id !== null
                              ? "font-semibold text-[#0a2540]"
                              : "text-gray-500 italic"
                          }`}
                        >
                          {visitor.name}
                        </p>
                      </div>

                      {/* Type badge */}
                      <div className="w-28 flex justify-center">
                        {visitor.user_id !== null ? (
                          <span className="bg-[#eff4fa] text-[#002e6b] text-[10px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                            <UserCheck size={10} />
                            Registrado
                          </span>
                        ) : (
                          <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                            <UserX size={10} />
                            Anónimo
                          </span>
                        )}
                      </div>

                      {/* Date */}
                      <div className="w-40 text-right">
                        <p className="text-xs text-gray-500 font-medium">
                          {formatDate(visitor.visited_at)}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {formatFullDate(visitor.visited_at)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {meta && (meta.last_page ?? 1) > 1 && (() => {
                    const lastPage = meta.last_page ?? 1;
                    return (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                      <p className="text-xs text-gray-400">
                        Página {meta.current_page} de {lastPage}
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronLeft size={14} />
                        </button>

                        {Array.from(
                          { length: lastPage },
                          (_, i) => i + 1
                        )
                          .filter((p) => {
                            if (lastPage <= 5) return true;
                            if (p === 1 || p === lastPage) return true;
                            return Math.abs(p - page) <= 1;
                          })
                          .map((p, idx, arr) => {
                            const showEllipsis =
                              idx > 0 && p - arr[idx - 1] > 1;
                            return (
                              <span key={p} className="flex items-center">
                                {showEllipsis && (
                                  <span className="px-1 text-gray-400 text-xs">
                                    …
                                  </span>
                                )}
                                <button
                                  onClick={() => setPage(p)}
                                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                    p === page
                                      ? "bg-primary text-white shadow-sm"
                                      : "text-gray-500 hover:bg-white border border-transparent hover:border-gray-200"
                                  }`}
                                >
                                  {p}
                                </button>
                              </span>
                            );
                          })}

                        <button
                          onClick={() =>
                            setPage((p) => Math.min(lastPage, p + 1))
                          }
                          disabled={page === lastPage}
                          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                    );
                  })()}
                </>
              )}
            </div>

            {/* Info Banner */}
            <div className="p-4 bg-[#eff4fa] border-l-[3px] border-[#002e6b] text-[13px] text-[#0a2540] rounded-r-lg font-medium flex items-start gap-3 mb-6">
              <Clock size={16} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-bold mb-1">¿Cómo funcionan las visitas?</p>
                <ul className="space-y-1 text-[12px] text-gray-600">
                  <li>• Las visitas del dueño del perfil no se contabilizan.</li>
                  <li>• Las visitas de administradores no se contabilizan.</li>
                  <li>
                    • Visitas duplicadas desde la misma IP/usuario se deducen en
                    un periodo de 2 horas.
                  </li>
                  <li>
                    • Los visitantes anónimos se muestran como "Visitante
                    anónimo" para proteger la privacidad.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ASIDE DERECHO */}
          <aside className="w-full lg:w-72 p-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 shrink-0 overflow-y-auto">
            {rightPanelContent}
          </aside>
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProfileVisitorsPage;
