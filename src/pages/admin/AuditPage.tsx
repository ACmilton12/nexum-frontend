import { useState, useEffect } from "react";
import { Search, Calendar as CalendarIcon, Download } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Calendar from "../../components/ui/Calendar";
import { getActivityLogs } from "../../services/admin.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface AuditLog {
  id: number;
  user_name: string;
  event: string;
  timestamp: string;
  detail: string;
  raw_date: string;
}

const AuditPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const result = await getActivityLogs({ per_page: 100 });
      setLogs(result.data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el historial de auditoría.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Historial de Auditoría - NEXUM", 14, 22);

    // Add date of generation
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["Usuario", "Evento", "Fecha/Hora", "Detalle"];
    const tableRows = filteredLogs.map(log => [
      log.user_name,
      log.event.toUpperCase(),
      log.timestamp,
      log.detail
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [0, 48, 135] }, // Primary color #003087
      styles: { fontSize: 8 },
    });

    doc.save(`historial_auditoria_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toString().includes(searchTerm);

    let matchesDate = true;
    if (dateFrom || dateTo) {
      const logDate = new Date(log.raw_date);
      if (dateFrom) {
        const [y, m, d] = dateFrom.split('-').map(Number);
        const from = new Date(y, m - 1, d, 0, 0, 0, 0);
        if (logDate < from) matchesDate = false;
      }
      if (dateTo) {
        const [y, m, d] = dateTo.split('-').map(Number);
        const to = new Date(y, m - 1, d, 23, 59, 59, 999);
        if (logDate > to) matchesDate = false;
      }
    }


    return matchesSearch && matchesDate;
  });


  const getEventBadgeClass = (event: string) => {
    switch (event.toLowerCase()) {
      case 'update_role':
      case 'updated':
        return 'bg-blue-100 text-blue-700';
      case 'login_failed':
        return 'bg-red-100 text-red-700';
      case 'profile_updated':
        return 'bg-green-100 text-green-700';
      case 'portfolio_edit':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "DD/MM/AA";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y.slice(-2)}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Breadcrumb */}
      <div className="px-6 py-2 text-sm text-gray-500">
        Home &gt; Panel de Administrador &gt;{" "}
        <span className="font-semibold text-textMain">Auditoria</span>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeItem="Auditoría" />

        {/* Contenido principal */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-textMain mb-6">
            Historial de Auditoría
          </h1>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Nombre o ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-transparent px-3 py-2 relative transition-all ring-1 ring-gray-100 focus-within:ring-primary/20">
              <CalendarIcon size={18} className="text-gray-400 mr-1" />
              <div className="flex items-center gap-4 text-xs font-medium">
                {/* Rango Desde */}
                <div className="flex items-center gap-2 relative">
                  <div className="flex flex-col w-16">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Desde</span>
                    <div className="text-textMain">{formatDateDisplay(dateFrom)}</div>
                  </div>
                  <CalendarIcon size={14} className="text-gray-300" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
                
                <div className="h-6 w-px bg-gray-200 mx-1"></div>

                {/* Rango Hasta */}
                <div className="flex items-center gap-2 relative">
                  <div className="flex flex-col w-16">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Hasta</span>
                    <div className="text-textMain">{formatDateDisplay(dateTo)}</div>
                  </div>
                  <CalendarIcon size={14} className="text-gray-300" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>
            </div>


            
          </div>


          {/* Tabla */}
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-100">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Cargando historial...</div>
            ) : error ? (
              <div className="p-8 text-center text-action">{error}</div>
            ) : (
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-textMain font-semibold">Usuario</th>
                    <th className="text-left px-6 py-4 text-textMain font-semibold">Evento</th>
                    <th className="text-left px-6 py-4 text-textMain font-semibold">Fecha/Hora</th>
                    <th className="text-left px-6 py-4 text-textMain font-semibold">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-textMain font-medium">{log.user_name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getEventBadgeClass(log.event)}`}>
                            {log.event.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{log.timestamp}</td>
                        <td className="px-6 py-4 text-gray-600 leading-relaxed">{log.detail}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                        No se encontraron registros de actividad.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="hidden lg:block w-72 p-6 bg-white border-l border-gray-200">
          <div className="mb-8">
            <h3 className="font-bold text-textMain mb-4">Calendario</h3>
            <Calendar />
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-textMain mb-4">Notificaciones</h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex gap-3">
              <div className="text-primary mt-0.5">
                <Search size={16} />
              </div>
              <p className="text-sm text-gray-600">
                Supervisión activa por nombre, ID, fecha y rol.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-textMain mb-4">Enlaces rápidos</h3>
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center gap-3 p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 group"
            >
              <Download size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
              <span>Exportar Historial</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditPage;
