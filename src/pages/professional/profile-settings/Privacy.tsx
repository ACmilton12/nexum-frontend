import { useState, useEffect } from 'react';
import Sidebar from '../../admin/components/Sidebar';
import RightWidgets from '../../../components/ui/RightWidgets';
import { Loader2, Clock, Save, Globe, CheckCircle, Lock, Link2, Copy, Check, Folder, Star, Briefcase, Award, Info } from 'lucide-react';
import Toast from '../../../components/ui/Toast';
import { getLinksPrivacyData, updateLinksPrivacyData } from '../../../services/linksprivacy.service';
import { API_BASE_URL } from '../../../utils/constants';

const Toggle = ({ active, onToggle, disabled }: { active: boolean; onToggle: () => void; disabled?: boolean }) => (
  <div
    onClick={!disabled ? onToggle : undefined}
    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-action' : 'bg-gray-400'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
  >
    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${active ? 'left-5' : 'left-0.5'
      }`} />
  </div>
);

function Privacy() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  
  const [isPublic, setIsPublic] = useState(true);
  const [originalIsPublic, setOriginalIsPublic] = useState(true);
  
  const [showProjects, setShowProjects] = useState(true);
  const [originalShowProjects, setOriginalShowProjects] = useState(true);
  const [showSkills, setShowSkills] = useState(true);
  const [originalShowSkills, setOriginalShowSkills] = useState(true);
  const [showExperience, setShowExperience] = useState(true);
  const [originalShowExperience, setOriginalShowExperience] = useState(true);
  const [showCertifications, setShowCertifications] = useState(true);
  const [originalShowCertifications, setOriginalShowCertifications] = useState(true);

  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [copied, setCopied] = useState(false);
  const [portfolioId, setPortfolioId] = useState<number | null>(null);

  const DEPLOY_URL = 'https://nexum-frontend-wheat.vercel.app';
  const profileUrl = portfolioId
    ? `${DEPLOY_URL}/portfolio/${portfolioId}`
    : 'Cargando enlace...';

  const handleCopy = () => {
    if (!portfolioId) return;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getLinksPrivacyData();
        if (data) {
          setNombre(data.user.first_name || '');
          setApellido(data.user.last_name || '');
          setLinkedin(data.linkedin_url || '');
          setGithub(data.github_url || '');
          const isPub = data.global_privacy === 'public';
          setIsPublic(isPub);
          setOriginalIsPublic(isPub);

          // Privacidad por sección (defaults a true si no viene del backend)
          const sp = data.show_projects !== false;
          const ss = data.show_skills !== false;
          const se = data.show_experience !== false;
          const sc = data.show_certifications !== false;
          setShowProjects(sp);
          setOriginalShowProjects(sp);
          setShowSkills(ss);
          setOriginalShowSkills(ss);
          setShowExperience(se);
          setOriginalShowExperience(se);
          setShowCertifications(sc);
          setOriginalShowCertifications(sc);
        } else {
          const storedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
          setNombre(storedUser.first_name || '');
          setApellido(storedUser.last_name || '');
        }
      } catch (error) {
        console.error("Error al cargar privacidad:", error);
      }

      // Fetch portfolio ID for the shareable link
      try {
        const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/portfolio`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            Accept: 'application/json',
          },
        });
        const json = await res.json();
        if (json?.data?.id) {
          setPortfolioId(json.data.id);
        }
      } catch (err) {
        console.error('Error al obtener ID del portafolio:', err);
      }

      setLoading(false);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const privacyValue = isPublic ? 'public' : 'private';

      await updateLinksPrivacyData({
        nombre,
        apellido,
        linkedin,
        github,
        global_privacy: privacyValue,
        show_projects: showProjects,
        show_skills: showSkills,
        show_experience: showExperience,
        show_certifications: showCertifications,
      });
      setOriginalIsPublic(isPublic);
      setOriginalShowProjects(showProjects);
      setOriginalShowSkills(showSkills);
      setOriginalShowExperience(showExperience);
      setOriginalShowCertifications(showCertifications);
      setLastUpdated(new Date());
      setToast({ message: 'Privacidad actualizada con éxito', type: 'success' });
    } catch (error: unknown) {
      setToast({ message: 'Error al actualizar: ' + (error as Error).message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setIsPublic(originalIsPublic);
    setShowProjects(originalShowProjects);
    setShowSkills(originalShowSkills);
    setShowExperience(originalShowExperience);
    setShowCertifications(originalShowCertifications);
  };

  const hasChanges = isPublic !== originalIsPublic ||
                     showProjects !== originalShowProjects ||
                     showSkills !== originalShowSkills ||
                     showExperience !== originalShowExperience ||
                     showCertifications !== originalShowCertifications;

  if (loading) {
    return (
      <div className="h-full bg-background flex flex-col font-sans overflow-hidden">
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar activeItem="Privacidad" />
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

  const formattedDate = lastUpdated 
    ? `Hoy, ${new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: 'numeric', hour12: true }).format(lastUpdated).toUpperCase()}`
    : 'No disponible';

  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem="Privacidad" />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto w-full">
              {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8 gap-4 pt-2">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock size={16} />
                  <span>Última actualización: {formattedDate}</span>
                </div>
                <h1 className="text-3xl font-bold text-textMain mb-2">
                  Privacidad
                </h1>
                <p className="text-sm text-gray-600">
                  Gestiona quién puede ver tu portafolio y qué información compartes.
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-2 lg:mt-0">
                <button 
                  onClick={handleDiscard}
                  disabled={!hasChanges || isSaving}
                  className="px-6 py-2.5 rounded-full border border-gray-300 text-textMain bg-transparent hover:bg-gray-100 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Descartar
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-action text-white text-sm font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Card 1: Visibilidad Global */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                      <Globe className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-textMain mb-1">
                        Visibilidad Global
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 max-w-xl">
                        Controla si tu portafolio puede ser visto por cualquier persona con el enlace o si está completamente oculto.
                      </p>
                      {isPublic ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#edf7ed] border border-[#c3e6cb] text-[#2e7d32] text-xs font-semibold">
                          <CheckCircle size={15} />
                          Público · Visible
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold">
                          <Lock size={15} />
                          Privado · Oculto
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="shrink-0 mt-2 sm:mt-0 pl-16 sm:pl-0">
                    <Toggle
                      active={isPublic}
                      onToggle={() => setIsPublic(!isPublic)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Link público */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-12 h-12 rounded-full border border-blue-100 bg-blue-50 flex items-center justify-center shrink-0">
                    <Link2 className="text-primary" size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-textMain mb-1">
                      Link público de tu portafolio
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Comparte este enlace con reclutadores o quien quieras
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className={`flex-1 px-4 py-2.5 rounded-lg border text-sm flex items-center overflow-hidden ${!isPublic ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                        {isPublic && portfolioId ? (
                          <a 
                            href={profileUrl}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-action hover:underline truncate transition-colors"
                            title="Abrir portafolio en una nueva pestaña"
                          >
                            {profileUrl}
                          </a>
                        ) : (
                          <span className="truncate">{!isPublic ? 'Perfil privado' : profileUrl}</span>
                        )}
                      </div>
                      
                      <button
                        onClick={handleCopy}
                        disabled={!isPublic || !portfolioId || copied}
                        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors sm:w-40 border-none cursor-pointer
                          ${!isPublic || !portfolioId ? 'bg-[#7a96b8] text-white opacity-80 cursor-not-allowed'
                          : copied ? 'bg-[#3b7c2b] text-white' : 'bg-primary text-white hover:opacity-90'}`}
                      >
                        {copied ? (
                          <>
                            <Check size={16} /> ¡Copiado!
                          </>
                        ) : (
                          <>
                            <Copy size={16} /> Copiar link
                          </>
                        )}
                      </button>
                    </div>

                    {!isPublic && (
                      <div className="mt-5 p-3.5 bg-[#fef9f0] border-l-4 border-[#f0a04b] text-[#8a613c] text-sm font-medium">
                        Activa la visibilidad pública para poder compartir tu portafolio
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 3: Privacidad por Sección */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-textMain mb-2">
                    Privacidad por Sección
                  </h3>
                  <p className="text-sm text-gray-500">
                    Activa o desactiva secciones específicas. Solo aplica cuando el portafolio es público.
                  </p>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
                  <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-50">
                        <Folder size={16} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h4 className="font-semibold text-textMain text-sm">Proyectos</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${showProjects ? 'bg-green-100/60 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {showProjects ? 'VISIBLE' : 'OCULTO'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">Repositorios y proyectos destacados</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Toggle active={showProjects} onToggle={() => setShowProjects(!showProjects)} disabled={!isPublic || isSaving} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-orange-50">
                        <Star size={16} className="text-orange-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h4 className="font-semibold text-textMain text-sm">Habilidades</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${showSkills ? 'bg-green-100/60 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {showSkills ? 'VISIBLE' : 'OCULTO'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">Tecnologías y competencias técnicas</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Toggle active={showSkills} onToggle={() => setShowSkills(!showSkills)} disabled={!isPublic || isSaving} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-purple-50">
                        <Briefcase size={16} className="text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h4 className="font-semibold text-textMain text-sm">Experiencia</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${showExperience ? 'bg-green-100/60 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {showExperience ? 'VISIBLE' : 'OCULTO'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">Historial laboral y roles</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Toggle active={showExperience} onToggle={() => setShowExperience(!showExperience)} disabled={!isPublic || isSaving} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-green-50">
                        <Award size={16} className="text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h4 className="font-semibold text-textMain text-sm">Certificaciones</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${showCertifications ? 'bg-green-100/60 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {showCertifications ? 'VISIBLE' : 'OCULTO'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">Cursos y certificados obtenidos</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Toggle active={showCertifications} onToggle={() => setShowCertifications(!showCertifications)} disabled={!isPublic || isSaving} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-600">
                  <Info className="shrink-0 mt-0.5" size={18} />
                  <p className="text-sm">
                    Las secciones ocultas se omiten completamente del servidor. Si tu perfil es privado, la configuración global anulará estos valores y devolverá un error 404 a todos los visitantes.
                  </p>
                </div>
              </div>
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

export default Privacy;
