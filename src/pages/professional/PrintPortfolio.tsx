import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Info, 
  Loader2, 
  ArrowLeft,
  Download,
  Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../admin/components/Sidebar';
import Calendar from '../../components/ui/Calendar';

const PrintPortfolio = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(true);
  
  // Datos mock del usuario
  const user = {
    name: "Juan Pérez",
    title: "Ingeniero de Sistemas • Cochabamba, Bolivia",
    avatar: null
  };

  const sections = [
    "Información de contacto",
    "Resumen profesional (Biografía)",
    "Proyectos destacados (3)",
    "Habilidades técnicas",
    "Experiencia laboral y académica"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsGenerating(false), 3000);
    return () => clearInterval(timer);
  }, []);

  const RightPanelContent = () => (
    <div className="sticky top-6 space-y-8">
      <div>
        <h3 className="font-bold text-textMain text-sm mb-4 uppercase tracking-wider">Calendario</h3>
        <Calendar />
      </div>
      <div>
        <h3 className="font-bold text-textMain text-sm mb-4 flex items-center gap-2 uppercase tracking-wider text-action">
          <Info size={18} /> NOTIFICACIONES
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
            <Info size={14} className="text-action mt-0.5 shrink-0" />
            <span>Tu PDF está listo para ser descargado.</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeItem="Dashboard" />
        
        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
          {/* SECCIÓN IZQUIERDA: Contenido de Exportación */}
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-textMain mb-1">Exportar Portafolio</h1>
                <p className="text-sm text-gray-500">
                  Genera un documento PDF optimizado para impresión.
                </p>
              </div>
              
              <button 
                disabled={isGenerating}
                className={`flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                  isGenerating ? 'bg-[#C8102E]/80 cursor-not-allowed' : 'bg-[#C8102E] hover:bg-[#a50d25]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Descargar PDF
                  </>
                )}
              </button>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden max-w-5xl">
              <div className="p-6 md:p-10">
                {/* Profile Brief */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
                      alt="Juan Pérez" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">{user.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">{user.title}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <span className="bg-[#E6F4EA] text-[#1E8E3E] px-3 py-1 rounded-full text-[10px] font-bold border border-[#CEEAD6]">
                        Perfil 100% completo
                      </span>
                      <span className="bg-[#E8F0FE] text-[#1967D2] px-3 py-1 rounded-full text-[10px] font-bold border border-[#D2E3FC]">
                        Público
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Included Sections */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-bold text-[#1a1a2e] text-sm mb-6">Secciones incluidas en el PDF</h3>
                    <div className="space-y-4">
                      {sections.map((section, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-gray-600 text-xs font-medium">{section}</span>
                          <CheckCircle2 className="text-green-500" size={18} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Options */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-[#1a1a2e] text-sm mb-4">Opciones de privacidad aplicadas</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        El PDF respeta tus configuraciones de privacidad actuales. Se excluirán las secciones marcadas como ocultas.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-3 text-gray-400">
                      <Info size={18} className="opacity-50" />
                      <p className="text-[10px] italic">Incluye pie de página con fecha de generación.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate(-1)}
              className="mt-6 text-gray-400 font-bold hover:text-primary transition-colors flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={16} /> Regresar al Dashboard
            </button>
          </div>

          {/* ASIDE DERECHO */}
          <aside className="w-full lg:w-72 p-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 shrink-0">
            <RightPanelContent />
          </aside>
        </main>
      </div>
    </div>
  );
};

export default PrintPortfolio;
