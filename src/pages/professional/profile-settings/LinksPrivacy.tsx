import { useState, useEffect } from 'react';
import Sidebar from '../../admin/components/Sidebar';
import RightWidgets from '../../../components/ui/RightWidgets';
import { Globe } from 'lucide-react';
import Toast from '../../../components/ui/Toast';
import { getLinksPrivacyData, updateLinksPrivacyData } from '../../../services/linksprivacy.service';

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

function LinksPrivacy() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [website, setWebsite] = useState('');

  // Unificamos la visibilidad en un solo estado para todos
  const [isPublic, setIsPublic] = useState(true);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getLinksPrivacyData();
        if (data) {
          setNombre(data.user.first_name || '');
          setApellido(data.user.last_name || '');
          setLinkedin(data.linkedin_url || '');
          setGithub(data.github_url || '');
          // Cargamos el estado global del backend: si es public, el switch está activo
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
  }, []);

  const normalizeUrl = (url: string) => {
    if (!url.trim()) return '';
    if (!/^https?:\/\//i.test(url)) return `https://${url}`;
    return url;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const privacyValue = isPublic ? 'public' : 'private';

      await updateLinksPrivacyData({
        nombre,
        apellido,
        linkedin: normalizeUrl(linkedin),
        github: normalizeUrl(github),
        global_privacy: privacyValue
      });
      setToast({ message: 'Enlaces y Privacidad actualizados con éxito', type: 'success' });
    } catch (error: any) {
      setToast({ message: 'Error al actualizar: ' + error.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAll = () => {
    setIsPublic(!isPublic);
  };

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <div
      onClick={!isSaving ? onToggle : undefined}
      style={{
        width: '44px', height: '24px', borderRadius: '999px',
        backgroundColor: active ? '#c8102e' : '#5b6472',
        position: 'relative', cursor: isSaving ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s'
      }}
    >
      <div style={{
        position: 'absolute', top: '2px', left: active ? '22px' : '2px',
        width: '20px', height: '20px', borderRadius: '50%',
        backgroundColor: '#fff', transition: 'left 0.2s'
      }} />
    </div>
  );

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', minHeight: '100vh', backgroundColor: '#e9eef5' }}>Cargando...</div>;

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 120px)', backgroundColor: '#e9eef5' }}>
      <Sidebar activeItem="Enlaces" />
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Enlaces y Privacidad</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', width: '100%', maxWidth: '1100px' }}>
          
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 6px 18px rgba(0, 26, 94, 0.06)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Redes Profesionales</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><LinkedinIcon /> LinkedIn</label>
                <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #00000014' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><GithubIcon /> GitHub</label>
                <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #00000014' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={18} /> Sitio web</label>
                <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #00000014' }} />
              </div>
            </div>
            <button onClick={handleSubmit} disabled={isSaving} style={{ alignSelf: 'flex-end', padding: '10px 20px', borderRadius: '8px', backgroundColor: isSaving ? '#ccc' : '#c8102e', color: 'white', border: 'none', fontWeight: 'bold', cursor: isSaving ? 'not-allowed' : 'pointer' }}>
              {isSaving ? 'Guardando...' : 'Guardar enlaces'}
            </button>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 6px 18px rgba(0, 26, 94, 0.06)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Visibilidad</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Mostrar proyectos</span>
                <Toggle active={isPublic} onToggle={handleToggleAll} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Mostrar habilidades</span>
                <Toggle active={isPublic} onToggle={handleToggleAll} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Mostrar experiencia</span>
                <Toggle active={isPublic} onToggle={handleToggleAll} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Mostrar contacto</span>
                <Toggle active={isPublic} onToggle={handleToggleAll} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <RightWidgets type="profile" />
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

export default LinksPrivacy;