import { Search } from 'lucide-react';
import Sidebar from '../admin/components/Sidebar';

const HomeDirectory = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar activeItem="Home" />

      <main className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
            <Search className="h-8 w-8 text-slate-300" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Bienvenido al Directorio</h1>
          <p className="text-slate-500 max-w-sm mx-auto">
            Utiliza el menú lateral para gestionar tu portafolio o explora nuevas conexiones pronto.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HomeDirectory;
