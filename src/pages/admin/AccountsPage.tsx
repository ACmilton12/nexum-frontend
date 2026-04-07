import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
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
  const { user: currentUser } = useAuth(); // Renamed to avoid conflict if `user` is used elsewhere
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
    <div className="min-h-screen bg-background flex flex-col">
      

      {/* Breadcrumb */}
      

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeItem="Gestión Usuarios" />

        {/* Contenido principal */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-textMain">
              Gestión de Usuarios
            </h1>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm text-textMain outline-none"
              >
                <option value="Todos">Estado: Todos</option>
                <option value="Activo">Estado: Activo</option>
                <option value="Inactivo">Estado: Inactivo</option>
              </select>
              <button className="bg-action text-white px-4 py-1.5 rounded text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                <Filter size={14} />
                Filtrar
              </button>
            </div>
          </div>

          {/* Loading y error */}
          {loading && (
            <div className="text-center py-10 text-gray-500">
              Cargando usuarios...
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-action">
              {error}
            </div>
          )}

          {/* Tabla */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-textMain font-semibold">Usuario</th>
                    <th className="text-left px-4 py-3 text-textMain font-semibold">Email</th>
                    <th className="text-left px-4 py-3 text-textMain font-semibold">Rol</th>
                    <th className="text-left px-4 py-3 text-textMain font-semibold">Estado</th>
                    <th className="text-left px-4 py-3 text-textMain font-semibold">Registro</th>
                    <th className="text-left px-4 py-3 text-textMain font-semibold">Portafolio</th>
                    <th className="text-left px-4 py-3 text-textMain font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((u) => filterStatus === "Todos" || u.status === filterStatus)
                    .map((u) => (
                      <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3 text-textMain">{u.name}</td>
                        <td className="px-4 py-3 text-gray-500">{u.email}</td>
                        <td className="px-4 py-3 text-gray-500">{u.role}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            u.status === "Activo"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{u.registro}</td>
                        <td className="px-4 py-3 text-gray-500">{u.portfolio}</td>
                        <td className="px-4 py-3">
                          {u.status === "Activo" ? (
                            <button
                              onClick={() => handleDesactivar(u)}
                              className={`px-3 py-1.5 rounded text-xs transition-opacity ${
                                u.id === currentUser?.id ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-action text-white hover:opacity-90"
                              }`}
                              disabled={u.id === currentUser?.id}
                            >
                              Desactivar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReactivar(u.id)}
                              className="bg-primary text-white px-3 py-1.5 rounded text-xs hover:opacity-90 transition-colors"
                            >
                              Reactivar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 px-4 py-3">
                Filtro por estado "Inactivo" y restaura acceso con "Reactivar".
              </p>
            </div>
          )}
        </div>

        {/* Panel derecho */}
        <div className="hidden lg:block w-56 p-4 bg-white border-l border-gray-200">
         
            <Calendar />

          <h3 className="font-semibold text-textMain mt-5 mb-2">Notificaciones</h3>
          <div className="text-xs text-gray-600 flex items-start gap-2">
            <span>👤</span>
            La acción de desactivar requiere confirmación.
          </div>

          <h3 className="font-semibold text-textMain mt-5 mb-2">Enlaces rápidos</h3>
          <div className="text-xs text-primary cursor-pointer hover:underline flex items-center gap-1">
            ⚙️ Configuración Admin
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-lg font-bold text-textMain mb-2">
              Confirmar Desactivación
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              ¿Está seguro de que desea suspender el acceso a este usuario?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              El usuario pasa a "Inactivo" sin borrarse sus datos y pierde el acceso a la plataforma.
            </p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDesactivar}
                className="px-4 py-2 text-sm bg-action text-white rounded hover:opacity-90 transition-opacity"
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