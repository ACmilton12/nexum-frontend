import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/constants';

const VerifyEmailRedirect = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    const hash = searchParams.get('hash');
    const expires = searchParams.get('expires');
    const signature = searchParams.get('signature');

    if (id && hash) {
      // Reconstruir la URL del backend para la verificación
      let backendUrl = `${API_BASE_URL}/auth/email/verify/${id}/${hash}`;
      
      const queryParams = new URLSearchParams();
      if (expires) queryParams.append('expires', expires);
      if (signature) queryParams.append('signature', signature);
      
      const queryString = queryParams.toString();
      if (queryString) {
        backendUrl += `?${queryString}`;
      }

      // Redirigir el navegador completamente al backend para que este procese
      // la verificación y nos devuelva al /login con el estado correcto.
      window.location.href = backendUrl;
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003087] mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Redirigiendo para procesar tu verificación...</p>
    </div>
  );
};

export default VerifyEmailRedirect;
