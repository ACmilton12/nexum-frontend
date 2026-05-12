import { useState, useEffect } from "react";
import { Filter, UserX, UserCheck, ShieldAlert, ExternalLink } from "lucide-react";
import Sidebar from "./components/Sidebar";
import useAuth from "../../hooks/useAuth";
import { getUsers, toggleUserStatus } from "../../services/admin.service";
import Calendar from "../../components/ui/Calendar";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Activo" | "Inactivo";
  registro: string;
  portfolio: string;
}

const AccountsPage = () => {
  useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDesactivar = (u: User) => {
    setSelectedUser(u);
    setShowModal(true);
  };

  const handleConfirmDesactivar = async () => {
    if (selectedUser) {
      try {
        await toggleUserStatus(selectedUser.id);
        setUsers(users.map((u) =>
          u.id === selectedUser.id ? { ...u, status: "Inactivo" } : u
        ));
      } catch (err: any) {
        alert(err.message || "Error al desactivar el usuario.");
      }
    }
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleReactivar = async (id: number) => {
    try {
      await toggleUserStatus(id);
      setUsers(users.map((u) =>
        u.id === id ? { ...u, status: "Activo" } : u
      ));
    } catch (err: any) {
      alert(err.message || "Error al reactivar el usuario.");
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col transition-colors duration-300">
      <div className="flex flex-1">
        {/* Sidebar adaptativo */}
        <Sidebar activeItem="Gestión Usuarios" />

        {/* Layout Principal: Columna en móvil, Fila en Desktop (lg) */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-background dark:bg-slate-900 transition-colors duration-300">
          
          {/* SECCIÓN IZQUIERDA: Listado y Tabla */}
          <div className="flex-1 p-4 pl-14 sm:pl-6 md:p-6 overflow-y-auto">
            
            {/* Header: Título y Filtros apilables */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-textMain dark:text-white">
                  Gestión de Usuarios
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administración de accesos Nexum</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 md:flex-none border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-textMain dark:text-gray-200 outline-none bg-white dark:bg-slate-800 shadow-sm"
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Activo">Activos</option>
                  <option value="Inactivo">Inactivos</option>
                </select>
                <button className="bg-action text-white p-2 md:px-4 md:py-2 rounded-lg text-sm hover:opacity-90 transition-all flex items-center gap-2">
                  <Filter size={16} />
                  <span className="hidden sm:inline">Filtrar</span>
                </button>
              </div>
            </div>

            {/* Estados de carga y error */}
            {loading && <div className="text-center py-20 text-gray-400 animate-pulse">Cargando base de datos...</div>}
            {error && <div className="text-center py-20 text-action font-medium">{error}</div>}

            {/* Tabla con contenedor de Scroll Horizontal */}
            {!loading && !error && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[800px]">
                    <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-gray-700">
                      <tr>
                        <th className="text-left px-6 py-4 text-textMain dark:text-white font-semibold">Usuario</th>
                        <th className="text-left px-6 py-4 text-textMain dark:text-white font-semibold">Email</th>
                        <th className="text-left px-6 py-4 text-textMain dark:text-white font-semibold">Rol</th>
                        <th className="px-6 py-4 text-textMain dark:text-white font-semibold text-center">Estado</th>
                        <th className="text-left px-6 py-4 text-textMain dark:text-white font-semibold">Registro</th>
                        <th className="text-center px-6 py-4 text-textMain dark:text-white font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                      {users
                        .filter((u) => filterStatus === "Todos" || u.status === filterStatus)
                        .map((u) => (
                          <tr key={u.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                            <td className="px-6 py-4 font-medium text-textMain dark:text-white">{u.name}</td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className="text-[11px] bg-gray-100 dark:bg-slate-900 px-2 py-1 rounded text-gray-600 dark:text-gray-400 font-medium lowercase">
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                u.status === "Activo" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-50 text-red-600"
                              }`}>
                                {u.status}
                              </span>
                            </td>
                             <td className="px-6 py-4 text-gray-400 dark:text-gray-500 text-xs">{u.registro}</td>
                            <td className="px-6 py-4 text-center">
                              {u.status === "Activo" ? (
                                <button
                                  onClick={() => handleDesactivar(u)}
                                  className="text-action hover:bg-red-50 p-2 rounded-lg transition-colors group"
                                  title="Suspender acceso"
                                >
                                  <UserX size={18} className="group-hover:scale-110 transition-transform" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleReactivar(u.id)}
                                  className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors group"
                                  title="Reactivar acceso"
                                >
                                  <UserCheck size={18} className="group-hover:scale-110 transition-transform" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">
                    Mostrando {users.length} registros en total. Deslice lateralmente en móvil.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PANEL DERECHO: w-full en móvil, w-64 en Desktop */}
          <aside className="w-full lg:w-64 p-6 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 shrink-0 overflow-y-auto transition-colors duration-300">
            <div className="sticky top-6">
              <Calendar />
              
              <div className="mt-8">
                <h3 className="font-bold text-textMain dark:text-white text-sm mb-4 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-yellow-500" />
                  Seguridad
                </h3>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                  <p className="text-[11px] text-yellow-800 dark:text-yellow-500 leading-relaxed">
                    La desactivación revoca tokens de sesión activos y bloquea el login del usuario seleccionado.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-bold text-textMain dark:text-white text-sm mb-4">Enlaces Rápidos</h3>
                <ul className="space-y-3">
                  <li className="group flex items-center justify-between text-xs text-primary dark:text-blue-400 cursor-pointer">
                    <span className="group-hover:underline">Políticas de Privacidad</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                  </li>
                  <li className="group flex items-center justify-between text-xs text-primary dark:text-blue-400 cursor-pointer">
                    <span className="group-hover:underline">Configuración Global</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                  </li>
                </ul>
              </div>
            </div>
          </aside>

        </main>
      </div>

      {/* MODAL DE CONFIRMACIÓN RESPONSIVO */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl scale-in-center border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <UserX size={24} />
            </div>
            <h2 className="text-lg font-bold text-textMain dark:text-white text-center mb-2">
              Confirmar Suspensión
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 leading-relaxed">
              ¿Estás seguro de desactivar a <span className="font-bold text-textMain dark:text-white">{selectedUser.name}</span>? 
              Perderá acceso inmediato a la plataforma.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleConfirmDesactivar}
                className="flex-1 px-4 py-2.5 text-sm font-semibold bg-action text-white rounded-xl hover:brightness-110 shadow-lg shadow-red-200 transition-all"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;