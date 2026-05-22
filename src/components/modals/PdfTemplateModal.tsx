import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PdfTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId?: string | number | null;
}

// SVG Icons for the 3 templates
const ClassicPreview = () => (
  <svg viewBox="0 0 200 280" className="w-full h-full object-contain drop-shadow-md bg-white rounded-md">
    <rect width="200" height="280" fill="white" />
    <rect x="20" y="20" width="40" height="40" fill="#e2e8f0" rx="4" />
    <rect x="70" y="25" width="80" height="8" fill="#1e293b" rx="4" />
    <rect x="70" y="45" width="50" height="6" fill="#64748b" rx="3" />
    <line x1="20" y1="80" x2="180" y2="80" stroke="#cbd5e1" strokeWidth="2" />
    <rect x="20" y="100" width="160" height="6" fill="#94a3b8" rx="3" />
    <rect x="20" y="115" width="140" height="6" fill="#94a3b8" rx="3" />
    <rect x="20" y="130" width="150" height="6" fill="#94a3b8" rx="3" />
    <rect x="20" y="160" width="30" height="8" fill="#1e293b" rx="4" />
    <rect x="20" y="180" width="160" height="40" fill="#f1f5f9" rx="4" />
    <rect x="20" y="235" width="160" height="30" fill="#f1f5f9" rx="4" />
  </svg>
);

const ModernPreview = () => (
  <svg viewBox="0 0 200 280" className="w-full h-full object-contain drop-shadow-md bg-white rounded-md">
    <rect width="200" height="280" fill="white" />
    <rect width="200" height="80" fill="#1a1a2e" />
    <rect x="20" y="20" width="40" height="40" fill="#f8fafc" rx="8" />
    <rect x="70" y="25" width="80" height="8" fill="white" rx="4" />
    <rect x="70" y="45" width="50" height="6" fill="#C8102E" rx="3" />

    <rect x="20" y="100" width="160" height="6" fill="#94a3b8" rx="3" />
    <rect x="20" y="115" width="140" height="6" fill="#94a3b8" rx="3" />
    <rect x="20" y="130" width="150" height="6" fill="#94a3b8" rx="3" />
    <rect x="20" y="160" width="40" height="8" fill="#C8102E" rx="4" />
    <rect x="20" y="180" width="75" height="40" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" rx="6" />
    <rect x="105" y="180" width="75" height="40" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" rx="6" />
    <rect x="20" y="230" width="75" height="40" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" rx="6" />
  </svg>
);

const MinimalistPreview = () => (
  <svg viewBox="0 0 200 280" className="w-full h-full object-contain drop-shadow-md bg-white rounded-md">
    <rect width="200" height="280" fill="#fafafa" />
    <circle cx="100" cy="50" r="25" fill="#e5e5e5" />
    <rect x="60" y="90" width="80" height="8" fill="#262626" rx="4" />
    <rect x="80" y="105" width="40" height="4" fill="#a3a3a3" rx="2" />

    <rect x="30" y="140" width="140" height="4" fill="#d4d4d4" rx="2" />
    <rect x="30" y="150" width="120" height="4" fill="#d4d4d4" rx="2" />
    <rect x="30" y="160" width="130" height="4" fill="#d4d4d4" rx="2" />

    <rect x="90" y="190" width="20" height="4" fill="#262626" rx="2" />
    <rect x="30" y="205" width="140" height="20" fill="white" stroke="#e5e5e5" rx="4" />
    <rect x="30" y="235" width="140" height="20" fill="white" stroke="#e5e5e5" rx="4" />
  </svg>
);

export default function PdfTemplateModal({ isOpen, onClose, portfolioId }: PdfTemplateModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'minimalist'>('modern');

  if (!isOpen) return null;

  const handleGenerate = () => {
    onClose();
    if (portfolioId) {
      navigate(`/imprimir/${portfolioId}?template=${selectedTemplate}`);
    } else {
      navigate(`/imprimir?template=${selectedTemplate}`);
    }
  };

  const templates = [
    {
      id: 'classic',
      name: t('print.templates.classic.name'),
      desc: t('print.templates.classic.desc'),
      Preview: ClassicPreview
    },
    {
      id: 'modern',
      name: t('print.templates.modern.name'),
      desc: t('print.templates.modern.desc'),
      Preview: ModernPreview
    },
    {
      id: 'minimalist',
      name: t('print.templates.minimalist.name'),
      desc: t('print.templates.minimalist.desc'),
      Preview: MinimalistPreview
    }
  ] as const;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-200">

        {/* Left Side: Options */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('print.modal_title')}</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X size={20} />
            </button>
          </div>

          <h2 className="hidden md:block text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('print.modal_title')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">{t('print.modal_desc')}</p>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 ${selectedTemplate === tpl.id
                    ? 'border-[#003087] dark:border-cyan-500 bg-blue-50 dark:bg-cyan-900/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#003087]/30 dark:hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                  }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedTemplate === tpl.id ? 'border-[#003087] dark:border-cyan-500 bg-[#003087] dark:bg-cyan-500' : 'border-slate-300 dark:border-slate-600'
                  }`}>
                  {selectedTemplate === tpl.id && <Check size={12} className="text-white dark:text-slate-900" />}
                </div>
                <div>
                  <h3 className={`font-bold text-base mb-1 ${selectedTemplate === tpl.id ? 'text-[#003087] dark:text-cyan-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {tpl.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{tpl.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-slate-600 dark:text-slate-300 font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {t('print.cancel')}
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 py-3 px-4 rounded-xl text-white dark:text-slate-950 font-bold bg-[#003087] dark:bg-cyan-500 hover:bg-blue-800 dark:hover:bg-cyan-400 shadow-lg shadow-blue-900/20 dark:shadow-cyan-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              {t('print.download')}
            </button>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="hidden md:flex w-full md:w-1/2 bg-slate-200/50 dark:bg-slate-950 p-8 flex-col items-center justify-center relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <X size={24} />
          </button>

          <div className="w-full max-w-[300px] aspect-[1/1.414] bg-white dark:bg-slate-800 shadow-2xl rounded-lg p-2 transition-all duration-500 transform hover:scale-105">
            {templates.find(t => t.id === selectedTemplate)?.Preview()}
          </div>

          <div className="mt-6 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Previsualización en vivo
          </div>
        </div>
      </div>
    </div>
  );
}
