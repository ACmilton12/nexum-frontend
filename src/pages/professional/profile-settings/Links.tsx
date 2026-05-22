import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../admin/components/Sidebar';
import RightWidgets from '../../../components/ui/RightWidgets';
import { Globe, Loader2, Plus, Trash2, ExternalLink, Link2, AlertTriangle } from 'lucide-react';
import Toast from '../../../components/ui/Toast';
import { getLinksPrivacyData, updateLinksPrivacyData } from '../../../services/linksprivacy.service';
import { API_BASE_URL } from '../../../utils/constants';

interface AdditionalLink {
  id: number;
  url: string;
  platform: string;
  created_at: string;
}

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
)

const GitlabIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 5.11 2a.43.43 0 0 1 .4.27l2.89 8.89h7.2l2.89-8.89a.43.43 0 0 1 .4-.27.42.42 0 0 1 .4.22l2.44 7.51 1.22 3.78a.84.84 0 0 1-.3.94Z" />
  </svg>
)

const FigmaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5zM12 2h3.5a3.5 3.5 0 1 1 0 7H12V2zM5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5zM12 9h3.5a3.5 3.5 0 1 1 0 7H12V9zM8.5 16A3.5 3.5 0 1 1 8.5 23a3.5 3.5 0 0 1 0-7z" />
  </svg>
)

const DribbbleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm8.653-7.587c-1.393-.974-3.184-1.74-5.283-2.12-.34 1.054-.74 2.146-1.21 3.25 1.547.464 2.87 1.134 3.916 1.954 1.09-1.285 1.902-2.923 2.577-3.084zm-3.805 3.766c-.95-.744-2.16-1.353-3.585-1.782-.95 1.91-2.07 3.65-3.326 5.152 2.15.547 4.457.345 6.368-.624.16-.08.34-.183.543-.274L16.848 20.18zm-8.823-1.026c1.196-1.42 2.274-3.07 3.19-4.887-2.31-.476-4.9-.623-7.61-.416.516 2.145 1.848 4.015 3.71 5.12l.71.183zM2.08 11.23c2.97-.247 5.82-.046 8.35.535.45-1.066.86-2.164 1.22-3.29-2.73-1.004-5.7-1.405-8.73-1.16-.36.984-.575 2.05-.575 3.155 0 .26.015.518.046.772l-.31-.012zm10.155-8.7c-2.37.525-4.417 1.83-5.83 3.6 2.86-.237 5.67.147 8.24 1.096-.94-1.63-2.02-3.12-3.2-4.524l.79-.173zm4.562 2.37c1.11 1.34 2.08 2.8 2.89 4.35 1.63 3.11 2.3 6.64 1.98 10.14-1.45.69-3.06 1.14-4.73 1.3-1.07-.85-2.43-1.55-4-2.05.5-1.14.93-2.27 1.28-3.37 2.27.42 4.2.5 5.7.16 2.14-.49 3.97-1.6 5.25-3.13 1.29-1.52 2-3.4 2-5.4 0-2.3-.9-4.52-2.52-6.17-1.63-1.66-3.86-2.6-6.17-2.6-1.5 0-2.97.4-4.3 1.15z" />
  </svg>
)

const BehanceIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 7h-7v2h7V7zM11.5 14.5c0-3-2.5-5.5-5.5-5.5H0v14h6c3 0 5.5-2.5 5.5-5.5zm-5.5-3v2H4v-2h2c1.1 0 2 .9 2 2s-.9 2-2 2H4v2h2c1.1 0 2-.9 2-2s-.9-2-2-2H4v-2h2zM24 15.5c0-3-2.5-5.5-5.5-5.5s-5.5 2.5-5.5 5.5 2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5zm-8-1.5h5c0-1.1-.9-2-2-2s-2 .9-2 2zm2 4c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z" />
  </svg>
)

const VercelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 22.525H0l12-21.05 12 21.05z" />
  </svg>
)

const NetlifyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.8 24l-3-6.1L.5 15l6.5-.4-2.8-5L9 9v15h-3.2zM21 0l-3.3 5.4-6.4-1-.5 10.6H23l-2-15zm-9.3 16H1l6.7-7L9 6v10zm1.7-1.1V4h8.3l-8.3 10.9zM23.5 16h-11l5-8.5L23.5 16z" />
  </svg>
)

const BitbucketIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.78 2.45L2.9 21.46c.07.64.6 1.14 1.25 1.14h15.7c.65 0 1.18-.5 1.25-1.14l2.12-19.01a1.27 1.27 0 0 0-1.25-1.4H2.03a1.27 1.27 0 0 0-1.25 1.4zm13.97 12.1H9.25l-1.35-7.53h8.2l-1.35 7.53z" />
  </svg>
)

const MediumIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
)

const DevToIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41-.01.73-.08.96-.2.4-.21.62-.48.62-1.03 0-.58-.22-.92-.78-1.41zm15.65-4.8v13.5c0 1.05-.85 1.9-1.9 1.9H2.9A1.9 1.9 0 0 1 1 18.75V5.25C1 4.2 1.85 3.35 2.9 3.35h18.27c1.05 0 1.9.85 1.9 1.9zm-18.9 9.9c0 .7.56 1.45 1.3 1.86.5.28 1.17.41 2.37.41.92 0 1.62-.1 2.05-.28l.06-.04V15h-1.63v.8c-.37.1-.9.1-1.34.1-.73 0-1.1-.17-1.3-.4-.2-.23-.28-.68-.28-1.5V11c0-.98.08-1.4.3-1.65.22-.24.63-.35 1.36-.35.48 0 .84.05 1.24.16V8.14A3.94 3.94 0 0 0 6.66 8c-1.37 0-2.22.25-2.68.75-.45.48-.68 1.13-.68 2.22v4.18zm8.68-1.5h-2V15h2v1.5h-4.32V8.1h4.2v1.5h-1.94v2.06h1.96l.1 1.5zm6.53-2.65c0-.98-.22-1.57-.75-1.97-.55-.42-1.28-.58-2.52-.58H14v6.6h2.2c1.23 0 1.95-.15 2.5-.58.55-.4.76-.98.76-1.98v-1.5z" />
  </svg>
)

const PLATFORM_ICONS: Record<string, { svg: React.ReactNode; color: string; hoverColor: string }> = {
  github: { svg: <GithubIcon />, color: 'text-slate-300', hoverColor: 'hover:text-white' },
  linkedin: { svg: <LinkedinIcon />, color: 'text-[#0077b5]', hoverColor: 'hover:text-[#00a0dc]' },
  gitlab: { svg: <GitlabIcon />, color: 'text-[#fc6d26]', hoverColor: 'hover:text-[#fd8c52]' },
  figma: { svg: <FigmaIcon />, color: 'text-[#F24E1E]', hoverColor: 'hover:text-[#f26e47]' },
  dribbble: { svg: <DribbbleIcon />, color: 'text-[#EA4C89]', hoverColor: 'hover:text-[#f082ac]' },
  behance: { svg: <BehanceIcon />, color: 'text-[#1769ff]', hoverColor: 'hover:text-[#4d8eff]' },
  vercel: { svg: <VercelIcon />, color: 'text-slate-100', hoverColor: 'hover:text-white' },
  netlify: { svg: <NetlifyIcon />, color: 'text-[#00C7B7]', hoverColor: 'hover:text-[#00E5D3]' },
  bitbucket: { svg: <BitbucketIcon />, color: 'text-[#0052CC]', hoverColor: 'hover:text-[#2684FF]' },
  medium: { svg: <MediumIcon />, color: 'text-slate-100', hoverColor: 'hover:text-white' },
  devto: { svg: <DevToIcon />, color: 'text-slate-100', hoverColor: 'hover:text-white' },
  kaggle: { svg: <span className="font-black text-[12px] italic leading-none">k</span>, color: 'text-[#20BEFF]', hoverColor: 'hover:text-[#4bd1ff]' },
  huggingface: { svg: <span className="font-bold text-[12px] leading-none tracking-tighter">HF</span>, color: 'text-[#FFD21E]', hoverColor: 'hover:text-[#ffde53]' },
  heroku: { svg: <span className="font-bold text-[10px] leading-none uppercase">Hrk</span>, color: 'text-[#430098]', hoverColor: 'hover:text-[#6a34ba]' },
  website: { svg: <Link2 size={14} />, color: 'text-cyan-400', hoverColor: 'hover:text-cyan-300' },
}

function getPlatformMeta(platform: string) {
  return PLATFORM_ICONS[platform?.toLowerCase() || 'website'] || PLATFORM_ICONS.website;
}

function getAuthToken(): string {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
}

function Links() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [mainLinks, setMainLinks] = useState({ linkedin: '', github: '' });
  const [additionalLinks, setAdditionalLinks] = useState<AdditionalLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

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
          setMainLinks({
            linkedin: data.linkedin_url || '',
            github: data.github_url || ''
          });
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

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    let trimmed = newUrl.trim();
    if (!trimmed) return;

    // Regex corregido sin escapes innecesarios
    const domainRegex = /^(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

    if (!domainRegex.test(trimmed)) {
      setToast({ message: 'Por favor, ingresa un enlace válido con dominio (ej. tusitio.com)', type: 'error' });
      return;
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
    }

    const isLinkedin = trimmed.includes('linkedin.com');
    const isGithub = trimmed.includes('github.com');

    const allExistingUrls = [
      mainLinks.linkedin,
      mainLinks.github,
      ...additionalLinks.map(l => l.url)
    ].filter(Boolean).map(u => u.toLowerCase());

    if (allExistingUrls.includes(trimmed.toLowerCase())) {
      setToast({ message: 'Este enlace ya ha sido registrado previamente', type: 'error' });
      return;
    }

    if (isLinkedin && mainLinks.linkedin) {
      setToast({ message: 'Ya tienes un enlace de LinkedIn. Elimínalo primero para agregar uno nuevo', type: 'error' });
      return;
    }
    if (isGithub && mainLinks.github) {
      setToast({ message: 'Ya tienes un enlace de GitHub. Elimínalo primero para agregar uno nuevo', type: 'error' });
      return;
    }

    setIsAdding(true);

    try {
      if (isLinkedin || isGithub) {
        const updatedLinks = {
          ...mainLinks,
          ...(isLinkedin ? { linkedin: trimmed } : { github: trimmed })
        };

        await updateLinksPrivacyData({
          nombre,
          apellido,
          linkedin: updatedLinks.linkedin,
          github: updatedLinks.github,
          global_privacy: isPublic ? 'public' : 'private'
        });

        setMainLinks(updatedLinks);
        setNewUrl('');
        setToast({ message: 'Enlace principal actualizado correctamente', type: 'success' });
      } else {
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
      }
    } catch {
      setToast({ message: 'Error de conexión al agregar enlace', type: 'error' });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteLink = async (id: number | string, platformType: 'main' | 'additional') => {
    setDeletingId(id);
    try {
      if (platformType === 'main') {
        const updatedLinks = {
          ...mainLinks,
          ...(id === 'linkedin' ? { linkedin: '' } : { github: '' })
        };

        await updateLinksPrivacyData({
          nombre,
          apellido,
          linkedin: updatedLinks.linkedin,
          github: updatedLinks.github,
          global_privacy: isPublic ? 'public' : 'private'
        });

        setMainLinks(updatedLinks);
        setToast({ message: 'Enlace eliminado', type: 'success' });
      } else {
        const res = await fetch(`${API_BASE_URL}/portfolio/links/${id}`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        if (res.ok) {
          setAdditionalLinks((prev) => prev.filter((l) => l.id !== id));
          setToast({ message: 'Enlace eliminado', type: 'success' });
        } else {
          const errorData = await res.json();
          setToast({ message: errorData.message || 'Error al eliminar enlace', type: 'error' });
        }
      }
    } catch {
      setToast({ message: 'Error de conexión al eliminar enlace', type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 w-full bg-background dark:bg-slate-900 flex flex-col font-sans overflow-hidden transition-colors duration-300">
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar activeItem="Enlaces" />
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <div className="flex-1 p-4 sm:p-6 md:p-6 flex items-center justify-center overflow-y-auto">
              <div className="flex flex-col items-center gap-3 text-gray-400 font-medium">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span>Cargando...</span>
              </div>
            </div>
            <RightWidgets type="profile" className="hidden lg:block w-64 shrink-0" />
          </main>
        </div>
      </div>
    );
  }

  const allLinks = [
    ...(mainLinks.linkedin ? [{ id: 'linkedin', platform: 'linkedin', url: mainLinks.linkedin, type: 'main' as const }] : []),
    ...(mainLinks.github ? [{ id: 'github', platform: 'github', url: mainLinks.github, type: 'main' as const }] : []),
    ...additionalLinks.map(l => ({ id: l.id, platform: l.platform, url: l.url, type: 'additional' as const }))
  ];

  return (
    <div className="flex-1 w-full bg-background dark:bg-slate-900 flex flex-col overflow-hidden transition-colors duration-300">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem="Enlaces" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 p-4 sm:p-6 md:p-6 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-textMain dark:text-white mb-1">
                Enlaces del Portafolio
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pega tus enlaces (LinkedIn, GitHub, Kaggle, etc.) y los detectaremos automáticamente.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
              <div className="p-6 sm:p-8">
                <form onSubmit={handleAddLink} className="flex gap-2 mb-6">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors focus-within:border-primary dark:focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-800">
                    <Globe size={14} className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="Pega la URL de tu red o sitio web..."
                      disabled={isAdding || additionalLinks.length >= 10}
                      className="flex-1 outline-none text-sm text-gray-700 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-500 bg-transparent disabled:opacity-60"
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

                {additionalLinks.length >= 10 && (
                  <div className="flex items-center gap-2 mb-4 p-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-400 text-xs font-medium transition-colors">
                    <AlertTriangle size={13} className="shrink-0" />
                    Límite de 10 enlaces adicionales alcanzado.
                  </div>
                )}

                {loadingLinks ? (
                  <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    Cargando enlaces...
                  </div>
                ) : allLinks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3 transition-colors">
                      <Link2 size={20} className="text-gray-300 dark:text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Sin enlaces configurados</p>
                    <p className="text-xs text-gray-300 dark:text-gray-500 mt-0.5">
                      Pega un enlace arriba y se detectará la plataforma automáticamente.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {allLinks.map((link) => {
                      const meta = getPlatformMeta(link.platform);
                      return (
                        <div
                          key={link.id}
                          className="group flex items-center gap-4 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-slate-900 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm transition-all"
                        >
                          <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 ${meta.color} shadow-sm shrink-0`}>
                            {meta.svg}
                          </div>

                          <div className="flex-1 flex flex-col justify-center min-w-0">
                            <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-0.5">
                              {link.platform || 'Sitio Web'}
                            </span>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 truncate transition-colors flex items-center gap-1.5 no-underline"
                              title={link.url}
                            >
                              <span className="truncate">{link.url}</span>
                              <ExternalLink size={12} className="opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
                            </a>
                          </div>

                          <button
                            onClick={() => handleDeleteLink(link.id, link.type)}
                            disabled={deletingId === link.id}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-60 border-none bg-transparent cursor-pointer shrink-0"
                            title="Eliminar"
                          >
                            {deletingId === link.id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
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

          <RightWidgets type="profile" className="hidden lg:block w-64 shrink-0" />
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
