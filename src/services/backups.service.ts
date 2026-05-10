import { API_BASE_URL } from "../utils/constants";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const handleUnauthorized = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.location.href = "/login";
};

/**prueba
 * Genera un backup de la base de datos y lo descarga automáticamente.
 * El backend devuelve el archivo SQL directamente.
 */
export const generateBackup = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/admin/backup`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/sql, application/octet-stream, */*",
    },
  });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error("No autorizado");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Error al generar el backup.");
  }

  // Obtener el nombre del archivo del header Content-Disposition si es posible
  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = `backup_nexum_${new Date().toISOString().split("T")[0]}.sql`;
  
  if (contentDisposition && contentDisposition.indexOf("filename=") !== -1) {
    filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
  }

  // Descargar el archivo
  const blob = await response.blob();
  const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2);
  const formattedSize = `${sizeInMB} MB`;

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  return { success: true, filename, size: formattedSize };
};
