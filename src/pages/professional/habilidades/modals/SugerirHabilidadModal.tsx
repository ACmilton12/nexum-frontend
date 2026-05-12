import { useState } from 'react';
import type { TipoHabilidad, CategoriaKey } from '../types';
import { ALL_CATEGORIAS, CATEGORIA_KEY_TO_BACKEND } from '../constants';
import { frontendTypeToApi } from '../types';
import { IconSpinner } from '../Icons';
import { suggestSkill, type ApiNivel } from '../../../../services/habilidades.service';

export default function SugerirHabilidadModal({ nombreInicial, tipo, categoriaKey, onCancel, onToast }: {
  nombreInicial: string; tipo: TipoHabilidad; categoriaKey: CategoriaKey | null;
  onCancel: () => void;
  onToast: (msg: string, t: "success" | "error") => void;
}) {
  const [nombre, setNombre] = useState(nombreInicial);
  const [justificacion, setJustificacion] = useState("");
  const [errorNombre, setErrorNombre] = useState("");
  const [loading, setLoading] = useState(false);

  const nivelesDisponibles: { key: ApiNivel; label: string }[] =
    tipo === "Técnica"
      ? [{ key: "basico", label: "Básico" }, { key: "intermedio", label: "Intermedio" }, { key: "avanzado", label: "Avanzado" }]
      : [{ key: "en_formacion", label: "En formación" }, { key: "desarrollada", label: "Desarrollada" }, { key: "fortalecida", label: "Fortalecida" }];

  const [nivel, setNivel] = useState<ApiNivel>(nivelesDisponibles[0].key);
  const categoriaLabel = ALL_CATEGORIAS.find(c => c.key === categoriaKey)?.label ?? "—";

  const handleSubmit = async () => {
    if (!nombre.trim()) { setErrorNombre("El nombre es requerido."); return; }
    setLoading(true);
    try {
      const backendCategoria = categoriaKey ? (CATEGORIA_KEY_TO_BACKEND[categoriaKey] ?? categoriaKey) : "Herramientas & Plataformas";
      await suggestSkill(nombre.trim(), frontendTypeToApi(tipo), backendCategoria, nivel, justificacion.trim() || undefined);
      onToast(`Sugerencia "${nombre.trim()}" enviada correctamente.`, "success");
      onCancel();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al enviar la sugerencia.";
      onToast(message, "error");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-transparent dark:border-slate-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Sugerir habilidad</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Se enviará para revisión antes de aparecer en el catálogo.</p>
          </div>
          <button onClick={onCancel} disabled={loading} className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <p className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-0.5">Tipo</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{tipo}</p>
            </div>
            <div className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <p className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-0.5">Categoría</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{categoriaLabel}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre <span className="text-action dark:text-red-400">*</span></label>
            <input type="text" value={nombre} onChange={(e) => { setNombre(e.target.value); setErrorNombre(""); }}
              placeholder="Ej. Kotlin, Design Thinking..." disabled={loading}
              className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors disabled:opacity-50 dark:bg-slate-800 dark:text-white ${errorNombre ? "border-action dark:border-red-400 bg-action/5 dark:bg-red-900/10" : "border-gray-300 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/10"}`}
            />
            {errorNombre && <p className="text-xs text-action dark:text-red-400 mt-1">{errorNombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nivel <span className="text-action dark:text-red-400">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              {nivelesDisponibles.map(n => (
                <button key={n.key} type="button" disabled={loading} onClick={() => setNivel(n.key)}
                  className={`py-2 px-3 rounded-lg border-2 text-xs font-semibold transition-all disabled:opacity-50 ${nivel === n.key
                    ? tipo === "Técnica" ? "border-primary bg-primary/5 text-primary" : "border-navbar bg-navbar/5 text-navbar"
                    : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-slate-600"}`}>
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Justificación <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span></label>
            <textarea value={justificacion} onChange={(e) => setJustificacion(e.target.value)}
              placeholder="¿Por qué debería estar en el catálogo? ¿Para qué la usas?" rows={3} disabled={loading}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg outline-none resize-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600 disabled:opacity-50"
            />
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-action/5 dark:bg-red-900/10 border border-action/20 dark:border-red-900/30">
            <svg className="w-3.5 h-3.5 text-action dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-xs text-action dark:text-red-400">La sugerencia requiere aprobación del administrador antes de poder agregarse a perfiles.</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100 dark:border-slate-800">
          <button onClick={onCancel} disabled={loading} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-action rounded-lg hover:bg-action/90 active:scale-95 transition-all disabled:opacity-60">
            {loading && <IconSpinner className="w-4 h-4" />}
            Enviar sugerencia
          </button>
        </div>
      </div>
    </div>
  );
}
