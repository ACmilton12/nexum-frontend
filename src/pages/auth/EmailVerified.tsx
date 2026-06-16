import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const EmailVerified = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'success' || status === 'already-verified') {
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [status, navigate]);

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">¡Email verificado!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Tu cuenta ha sido verificada exitosamente.</p>
          <div className="animate-pulse text-sm font-medium text-blue-600 dark:text-blue-400">
            Redirigiendo al login en 3 segundos...
          </div>
        </div>
      </div>
    );
  }

  if (status === 'already-verified') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ℹ
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Email ya verificado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Tu cuenta ya se encontraba verificada previamente.</p>
          <div className="animate-pulse text-sm font-medium text-blue-600 dark:text-blue-400">
            Redirigiendo al login en 3 segundos...
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✕
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Link inválido o expirado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Por favor, solicitá un nuevo email de verificación desde la plataforma.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full px-4 py-2 bg-[#003087] hover:bg-blue-800 text-white font-medium rounded-lg transition-colors"
          >
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003087] mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Procesando verificación...</p>
    </div>
  );
};

export default EmailVerified;
