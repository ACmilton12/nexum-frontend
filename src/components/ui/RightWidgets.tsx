import Calendar from './Calendar'
import {
  Bell,
  BookOpen,
  LifeBuoy,
  FileText,
  History,
  Download,
  ImagePlus,
  UserCog,
  Globe
} from 'lucide-react'

interface RightWidgetsProps {
  type?: 'profile' | 'admin' | 'audit'
  className?: string
}

const RightWidgets = ({ type = 'profile', className = '' }: RightWidgetsProps) => {
  return (
    <aside className={`w-[292px] ${className} bg-white dark:bg-slate-900 p-6 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 overflow-y-auto transition-colors duration-300`}>
      {/* Calendario del Milton*/}
      <div className="flex flex-col gap-3">
        <Calendar />
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-sm font-bold text-[#1a1a2e] dark:text-white">Notificaciones</div>
        <div className="flex flex-col gap-3">
          {type === 'profile' && (
            <div className="flex gap-2 items-start text-[13px] leading-snug text-gray-600 dark:text-gray-400">
              <ImagePlus size={18} className="text-[#003087] dark:text-blue-400 shrink-0" />
              <p>Precarga automática de datos registrados al acceder al formulario.</p>
            </div>
          )}
          {type === 'admin' && (
            <div className="flex gap-2 items-start text-[13px] text-gray-600 dark:text-gray-400">
              <Bell size={18} className="text-[#003087] dark:text-blue-400 shrink-0" />
              <p>La acción de desactivar requiere confirmación.</p>
            </div>
          )}
          {type === 'audit' && (
            <div className="flex gap-2 items-start text-[13px] text-gray-600 dark:text-gray-400">
              <History size={18} className="text-[#003087] dark:text-blue-400 shrink-0" />
              <p>Supervisión activa por nombre, ID, fecha y rol.</p>
            </div>
          )}
        </div>
      </div>

      {/* Enlaces Rápidos */}
      <div className="flex flex-col gap-4">
        <div className="text-sm font-bold text-[#1a1a2e] dark:text-white">Enlaces rápidos</div>
        <div className="flex flex-col gap-3">
          {type === 'profile' ? (
            <>
              <button className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400 hover:text-[#003087] dark:hover:text-blue-400 transition-colors">
                <UserCog size={18} /> Configurar perfil
              </button>
              <button className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400 hover:text-[#003087] dark:hover:text-blue-400 transition-colors">
                <Globe size={18} /> Vista pública del perfil
              </button>
            </>
          ) : (
            <>
              <button className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400 hover:text-[#003087] dark:hover:text-blue-400 transition-colors">
                <BookOpen size={18} /> Guía de Usuario
              </button>
              <button className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400 hover:text-[#003087] dark:hover:text-blue-400 transition-colors">
                <LifeBuoy size={18} /> Soporte Técnico
              </button>
              <button className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400 hover:text-[#003087] dark:hover:text-blue-400 transition-colors">
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
  )
}

export default RightWidgets
