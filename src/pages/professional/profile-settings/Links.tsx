import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../admin/components/Sidebar';
import RightWidgets from '../../../components/ui/RightWidgets';
import { Globe, Loader2, Plus, Trash2, ExternalLink, AlertTriangle, Link2, Save } from 'lucide-react';
import Toast from '../../../components/ui/Toast';
import { getLinksPrivacyData, updateLinksPrivacyData } from '../../../services/linksprivacy.service';
import { API_BASE_URL } from '../../../utils/constants';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// ─── Platform config ─────────────────────────────────────────────────────────
interface AdditionalLink {
  id: number;
  url: string;
  platform: string;
  created_at: string;
}

const PLATFORM_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  github:      { label: 'GitHub',      color: 'text-gray-900',   bg: 'bg-gray-100',    border: 'border-gray-200' },
  gitlab:      { label: 'GitLab',      color: 'text-orange-700', bg: 'bg-orange-50',   border: 'border-orange-200' },
  bitbucket:   { label: 'Bitbucket',   color: 'text-blue-700',   bg: 'bg-blue-50',     border: 'border-blue-200' },
  kaggle:      { label: 'Kaggle',      color: 'text-cyan-700',   bg: 'bg-cyan-50',     border: 'border-cyan-200' },
  huggingface: { label: 'Hugging Face',color: 'text-yellow-700', bg: 'bg-yellow-50',   border: 'border-yellow-200' },
  behance:     { label: 'Behance',     color: 'text-blue-600',   bg: 'bg-blue-50',     border: 'border-blue-200' },
  dribbble:    { label: 'Dribbble',    color: 'text-pink-600',   bg: 'bg-pink-50',     border: 'border-pink-200' },
  figma:       { label: 'Figma',       color: 'text-purple-700', bg: 'bg-purple-50',   border: 'border-purple-200' },
  linkedin:    { label: 'LinkedIn',    color: 'text-blue-700',   bg: 'bg-blue-50',     border: 'border-blue-200' },
  devto:       { label: 'Dev.to',      color: 'text-gray-900',   bg: 'bg-gray-100',    border: 'border-gray-200' },
  medium:      { label: 'Medium',      color: 'text-gray-800',   bg: 'bg-gray-100',    border: 'border-gray-200' },
  vercel:      { label: 'Vercel',      color: 'text-gray-900',   bg: 'bg-gray-100',    border: 'border-gray-200' },
  netlify:     { label: 'Netlify',     color: 'text-teal-700',   bg: 'bg-teal-50',     border: 'border-teal-200' },
  heroku:      { label: 'Heroku',      color: 'text-purple-700', bg: 'bg-purple-50',   border: 'border-purple-200' },
  website:     { label: 'Sitio Web',   color: 'text-primary',    bg: 'bg-primary/5',   border: 'border-primary/20' },
};

function getPlatformMeta(platform: string) {
  return PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.website;
}

// ─── Helper: auth token ──────────────────────────────────────────────────────
function getAuthToken(): string {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
}

// ─── Component ───────────────────────────────────────────────────────────────
function Links() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [website, setWebsite] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [additionalLinks, setAdditionalLinks] = useState<AdditionalLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAdditionalLinks = useCallback(async () => {
    try {
      setLoadingLinks(true);
      const res = await fetch(`${API_BASE_URL}/portfolio/links`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (res.ok) {
        const json = await res.json();
        setAdditionalLinks(json.data || []);
      }
    } catch (err) {
      console.error('Error al cargar enlaces adicionales:', err);
    } finally {
      setLoadingLinks(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getLinksPrivacyData();
        if (data) {
          setNombre(data.user.first_name || '');
          setApellido(data.user.last_name || '');
          setLinkedin(data.linkedin_url || '');
          setGithub(data.github_url || '');
          setIsPublic(data.global_privacy === 'public');
        } else {
          const storedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
          setNombre(storedUser.first_name || '');
          setApellido(storedUser.last_name || '');
        }
      } catch (error) {
        console.error("Error al cargar enlaces:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    fetchAdditionalLinks();
  }, [fetchAdditionalLinks]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const privacyValue = isPublic ? 'public' : 'private';
      await updateLinksPrivacyData({
        nombre, apellido, linkedin, github,
        global_privacy: privacyValue
      });
      setToast({ message: 'Enlaces actualizados con éxito', type: 'success' });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setToast({ message: 'Error al actualizar: ' + (error.message || 'Error desconocido'), type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    setIsAdding(true);
    try {
      const res = await fetch(`${API_BASE_URL}/portfolio/links`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmed }),
      });
      if (res.status === 201) {
        const json = await res.json();
        setAdditionalLinks((prev) => [json.data, ...prev]);
        setNewUrl('');
        setToast({ message: 'Enlace agregado correctamente', type: 'success' });
      } else {
        const errorData = await res.json();
        if (errorData.errors?.url) {
          setToast({ message: errorData.errors.url[0], type: 'error' });
        } else {
          setToast({ message: errorData.message || 'Error al agregar enlace', type: 'error' });
        }
      }
    } catch {
      setToast({ message: 'Error de conexión al agregar enlace', type: 'error' });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    setDeletingId(linkId);
    try {
      const res = await fetch(`${API_BASE_URL}/portfolio/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (res.ok) {
        setAdditionalLinks((prev) => prev.filter((l) => l.id !== linkId));
        setToast({ message: 'Enlace eliminado', type: 'success' });
      } else {
        const errorData = await res.json();
        setToast({ message: errorData.message || 'Error al eliminar enlace', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error de conexión al eliminar enlace', type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-background flex flex-col font-sans overflow-hidden">
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar activeItem="Enlaces" />
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-6 flex items-center justify-center overflow-y-auto">
              <div className="flex flex-col items-center gap-3 text-gray-400 font-medium">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span>Cargando...</span>
              </div>
            </div>
            <RightWidgets type="profile" className="w-full lg:w-64 shrink-0" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem="Enlaces" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-6 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-textMain mb-1">
                Enlaces
              </h1>
              <p className="text-sm text-gray-500">
                Gestiona tus redes profesionales y enlaces adicionales
              </p>
            </div>

            {/* ── Tarjeta unificada ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

              {/* ─── Sección 1: Redes Principales ─── */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Globe size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-textMain">Redes Principales</h3>
                    <p className="text-xs text-gray-400">LinkedIn, GitHub y sitio web personal</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-3">
                    {/* LinkedIn */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-gray-300 transition-colors focus-within:border-primary focus-within:bg-white">
                      <div className="w-9 h-9 rounded-lg bg-[#0077b5]/10 flex items-center justify-center shrink-0 text-[#0077b5]">
                        <LinkedinIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">LinkedIn</p>
                        <input
                          type="text"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/usuario"
                          disabled={isSaving}
                          className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* GitHub */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-gray-300 transition-colors focus-within:border-primary focus-within:bg-white">
                      <div className="w-9 h-9 rounded-lg bg-gray-900/10 flex items-center justify-center shrink-0 text-gray-800">
                        <GithubIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">GitHub</p>
                        <input
                          type="text"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="https://github.com/usuario"
                          disabled={isSaving}
                          className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* Sitio web */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-gray-300 transition-colors focus-within:border-primary focus-within:bg-white">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                        <Globe size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Sitio Web</p>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://tuportafolio.com"
                          disabled={isSaving}
                          className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-5">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2 bg-action text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed border-none cursor-pointer"
                    >
                      <Save size={14} />
                      {isSaving ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>

              {/* ─── Divider ─── */}
              <div className="border-t border-gray-100" />

              {/* ─── Sección 2: Enlaces Adicionales ─── */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Link2 size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-textMain">Enlaces Adicionales</h3>
                      <p className="text-xs text-gray-400">Kaggle, Behance, Dribbble, Figma y más</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                    {additionalLinks.length} / 10
                  </span>
                </div>

                {/* Input para agregar */}
                <form onSubmit={handleAddLink} className="flex gap-2 mb-5">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 hover:border-gray-300 transition-colors focus-within:border-primary focus-within:bg-white">
                    <Link2 size={14} className="text-gray-400 shrink-0" />
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="Pega un enlace y la plataforma se detecta automáticamente"
                      disabled={isAdding || additionalLinks.length >= 10}
                      className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent disabled:opacity-60"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAdding || !newUrl.trim() || additionalLinks.length >= 10}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed border-none cursor-pointer shrink-0"
                  >
                    {isAdding ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Plus size={14} />
                    )}
                    <span className="hidden sm:inline">{isAdding ? 'Agregando...' : 'Agregar'}</span>
                  </button>
                </form>

                {/* Límite */}
                {additionalLinks.length >= 10 && (
                  <div className="flex items-center gap-2 mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs font-medium">
                    <AlertTriangle size={13} className="shrink-0" />
                    Límite de 10 enlaces alcanzado.
                  </div>
                )}

                {/* Lista */}
                {loadingLinks ? (
                  <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    Cargando...
                  </div>
                ) : additionalLinks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Link2 size={20} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Sin enlaces adicionales</p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Pega un enlace arriba y se detectará la plataforma automáticamente.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {additionalLinks.map((link) => {
                      const meta = getPlatformMeta(link.platform);
                      return (
                        <div
                          key={link.id}
                          className="group flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all"
                        >
                          {/* Badge */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 border ${meta.color} ${meta.bg} ${meta.border}`}
                          >
                            {meta.label}
                          </span>

                          {/* URL */}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-sm text-gray-600 hover:text-primary truncate transition-colors flex items-center gap-1.5 no-underline"
                            title={link.url}
                          >
                            <span className="truncate">{link.url}</span>
                            <ExternalLink size={11} className="opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            disabled={deletingId === link.id}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-60 border-none bg-transparent cursor-pointer shrink-0"
                            title="Eliminar"
                          >
                            {deletingId === link.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <RightWidgets type="profile" className="w-full lg:w-64 shrink-0" />
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
}

export default Links;
