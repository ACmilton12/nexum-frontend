import Calendar from './Calendar';
import { Bell, BookOpen, LifeBuoy, FileText, History, Download, ImagePlus, UserCog, Globe } from 'lucide-react';

interface RightWidgetsProps {
  type?: 'profile' | 'admin' | 'audit';
}

const RightWidgets = ({ type = 'profile' }: RightWidgetsProps) => {
  return (
    <aside className="hidden lg:flex w-[292px] bg-white p-6 flex-col gap-6 border-l border-gray-200 overflow-y-auto">
      {/* Calendario del Milton*/}
      <div className="flex flex-col gap-3">
        <Calendar />
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-sm font-bold text-[#1a1a2e]">Notificaciones</div>
        <div className="flex flex-col gap-3">
          {type === 'profile' && (
            <div className="flex gap-2 items-start text-[13px] leading-snug text-gray-600">
              <ImagePlus size={18} className="text-[#003087] shrink-0" />
              <p>Precarga automática de datos registrados al acceder al formulario.</p>
            </div>
          )}
          {type === 'admin' && (
            <div className="flex gap-2 items-start text-[13px] text-gray-600">
              <Bell size={18} className="text-[#003087] shrink-0" />
              <p>La acción de desactivar requiere confirmación.</p>
            </div>
          )}
          {type === 'audit' && (
            <div className="flex gap-2 items-start text-[13px] text-gray-600">
              <History size={18} className="text-[#003087] shrink-0" />
              <p>Supervisión activa por nombre, ID, fecha y rol.</p>
            </div>
          )}
        </div>
      </div>

      {/* Enlaces Rápidos */}
      <div className="flex flex-col gap-4">
        <div className="text-sm font-bold text-[#1a1a2e]">Enlaces rápidos</div>
        <div className="flex flex-col gap-3">
          {type === 'profile' ? (
            <>
              <button className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-[#003087]">
                <UserCog size={18} /> Configurar perfil
              </button>
              <button className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-[#003087]">
                <Globe size={18} /> Vista pública del perfil
              </button>
            </>
          ) : (
            <>
              <button className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-[#003087]">
                <BookOpen size={18} /> Guía de Usuario
              </button>
              <button className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-[#003087]">
                <LifeBuoy size={18} /> Soporte Técnico
              </button>
              <button className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-[#003087]">
                <FileText size={18} /> Políticas UMSS
              </button>
            </>
          )}
          {type === 'audit' && (
            <button className="flex items-center gap-2 text-[13px] text-[#003087] font-semibold">
              <Download size={18} /> Exportar historial
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightWidgets;