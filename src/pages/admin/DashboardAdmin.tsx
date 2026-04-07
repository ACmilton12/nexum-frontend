import { Users, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import Sidebar from "./components/Sidebar";
import { Link } from "react-router-dom";
import Calendar from "../../components/ui/Calendar";
const DashboardAdmin = () => {
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* Breadcrumb */}
      

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeItem="Dashboard" />

        {/* Contenido principal */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-textMain mb-1">
            Panel de Administración
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Control general de la plataforma NEXUM
          </p>

          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Total Usuarios Registrados</p>
              <p className="text-3xl font-bold text-primary">148</p>
              <p className="text-xs text-gray-400 mt-1">+5 esta semana</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Usuarios Activos Hoy</p>
              <p className="text-3xl font-bold text-primary">34</p>
              <p className="text-xs text-gray-400 mt-1">Última sesión: hace 2 min</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Alertas del Sistema</p>
              <p className="text-3xl font-bold text-action">2</p>
              <p className="text-xs text-gray-400 mt-1">Requieren atención</p>
            </div>
          </div>

          {/* Cards de acciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Users size={18} className="text-textMain" />
                <h2 className="font-semibold text-textMain">Gestión de Usuarios</h2>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Administra cuentas, roles, estados y permisos de los usuarios.
              </p>
              <div className="bg-yellow-50 text-yellow-700 text-xs px-3 py-1.5 rounded mb-3 inline-block">
                2 usuarios pendientes de activación.
              </div>
              <br />
              <Link to="/admin/usuarios" className="bg-primary text-white text-sm px-4 py-2 rounded hover:opacity-90 transition-opacity inline-block">
                 Ver usuarios
               </Link>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={18} className="text-textMain" />
                <h2 className="font-semibold text-textMain">Copias de Seguridad</h2>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Gestiona y programa los respaldos automáticos de la plataforma.
              </p>
              <div className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded mb-3 inline-block">
                Último backup: hoy 03:00 AM.
              </div>
              <br />
              <button className="bg-action text-white text-sm px-4 py-2 rounded hover:opacity-90 transition-opacity">
                Gestionar backups
              </button>
            </div>
          </div>

          {/* Control de acceso por roles */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-textMain mb-4">
              Control de acceso por roles en la plataforma
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-4">
                <h3 className="font-medium text-textMain mb-3">
                  Rutas del Administrador
                </h3>
                {["Dashboard", "Gestión Usuarios", "Auditoría", "Copias de Seguridad", "Configuración"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <CheckCircle size={14} className="text-green-500" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="bg-background rounded-lg p-4">
                <h3 className="font-medium text-textMain mb-3">
                  Rutas restringidas para Admin
                </h3>
                {["Proyectos", "Habilidades", "Experiencia", "Portafolio"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <AlertTriangle size={14} className="text-action" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="hidden lg:block w-56 p-4 bg-white border-l border-gray-200">
          {/* Calendario */}
          <Calendar />

          {/* Notificaciones */}
          <h3 className="font-semibold text-textMain mt-5 mb-2">Notificaciones</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <AlertTriangle size={12} className="text-yellow-500 mt-0.5 shrink-0" />
              2 usuarios inactivos por más de 30 días.
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <CheckCircle size={12} className="text-green-500 mt-0.5 shrink-0" />
              Backup automático completado exitosamente.
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <AlertTriangle size={12} className="text-action mt-0.5 shrink-0" />
              Intento de acceso no autorizado detectado.
            </div>
          </div>

          {/* Enlaces rápidos */}
          <h3 className="font-semibold text-textMain mt-5 mb-2">Enlaces rápidos</h3>
          <div className="space-y-2 text-xs text-primary">
            <p className="cursor-pointer hover:underline">📋 Guía de Usuario</p>
            <p className="cursor-pointer hover:underline">⚙️ Soporte Técnico</p>
            <p className="cursor-pointer hover:underline">📄 Políticas UMSS</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      
    </div>
  );
};

export default DashboardAdmin;