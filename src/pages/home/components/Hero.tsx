import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import type { GlobalStats } from "../types";
import { formatNumber } from "../utils";

export default function Hero({
  stats,
  onSearch: _onSearch,
}: {
  stats: GlobalStats;
  onSearch?: (term: string) => void;
}) {
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);

  const slides = [
    { color: '#C8102E' }, // Rojo
    { color: '#111111' }, // Negro (ligeramente suavizado)
    { color: '#003087' } // Azul UMSS
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="flex flex-col lg:flex-row min-h-screen pt-16">
      {/* Left — Azul UMSS */}
      <div
        className="flex-1 flex flex-col px-6 sm:px-10 lg:px-16 py-12 relative overflow-hidden"
        style={{ backgroundColor: "#003087" }}
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 w-full my-auto">
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-5xl leading-[1.1] mb-4 lg:mb-6 text-white tracking-tight max-w-2xl">
            {user ? (
              <>
                Bienvenido de vuelta,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-100 to-white drop-shadow-sm">
                  {user.first_name || user.name || "profesional"}
                </span>
              </>
            ) : (
              <>
                Plataforma de{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-100 to-white drop-shadow-md">
                  Portafolios Digitales
                </span>{" "}
                para Profesionales
              </>
            )}
          </h1>

          <p className="text-blue-100/90 text-base sm:text-lg leading-relaxed mb-6 lg:mb-8 max-w-xl font-light">
            {user
              ? "Accedé a tu perfil, actualizá tus proyectos y compartí tu portafolio con el mundo."
              : "Crea, gestiona y destaca tu perfil profesional en minutos. Especialmente diseñado para la industria tecnológica."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 lg:mb-10 relative z-20">
            {/* Botón Principal */}
            <div className="relative group">
              {/* Efecto Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#C8102E] to-[#ff4d6a] rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <Link
                to={user ? "/profile/personal-data" : "/register"}
                className="relative flex items-center justify-center gap-3 text-white font-bold text-base px-8 py-3.5 rounded-xl transition-all duration-300 no-underline bg-gradient-to-r from-[#C8102E] to-[#b30e28] hover:from-[#e31233] hover:to-[#C8102E] border border-white/10"
              >
                <span>{user ? "Ir a mi perfil" : "Comenzar gratis"}</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1.5 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>

          {/* Estadísticas del backend */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-6 lg:pt-8 border-t border-white/10 w-full mt-4">
            {/* Card Usuarios */}
            <div className="flex items-center gap-4 bg-white/5 hover:bg-white/10 transition-colors duration-300 rounded-2xl px-5 py-4 border border-white/10 shadow-lg backdrop-blur-sm flex-1 sm:flex-none min-w-[200px]">
              <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-300 shrink-0">
                <Users size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <div className="text-white font-black text-2xl sm:text-3xl tracking-tight leading-none mb-1">
                  {formatNumber(stats.total_users) || "—"}
                </div>
                <div className="text-blue-200/70 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                  Usuarios
                </div>
              </div>
            </div>

            {/* Card Proyectos */}
            <div className="flex items-center gap-4 bg-white/5 hover:bg-white/10 transition-colors duration-300 rounded-2xl px-5 py-4 border border-white/10 shadow-lg backdrop-blur-sm flex-1 sm:flex-none min-w-[200px]">
              <div className="w-12 h-12 rounded-full bg-[#C8102E]/20 flex items-center justify-center text-[#ff4d6a] shrink-0">
                <Briefcase size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <div className="text-white font-black text-2xl sm:text-3xl tracking-tight leading-none mb-1">
                  {formatNumber(stats.total_projects) || "—"}
                </div>
                <div className="text-blue-200/70 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                  Proyectos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Carrusel */}
      <div className="flex-1 relative w-full overflow-hidden flex flex-col justify-end min-h-[50vh] lg:min-h-0 bg-[#1A1A2E]">
        {/* Imágenes de fondo */}
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt={slide.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-0" : "opacity-0 -z-10"
              }`}
          />
        ))}

        {/* Gradiente para que el texto sea legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none"></div>

        {/* Flechas de Navegación */}
        <button
          onClick={prev}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer"
        >
          <ChevronLeft size={48} strokeWidth={1.5} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer"
        >
          <ChevronRight size={48} strokeWidth={1.5} />
        </button>

        {/* Contenido inferior (Textos y Controles) */}
        <div className="relative z-20 px-6 sm:px-12 py-12 w-full flex flex-col items-center">
          <div className="text-center mb-8">
            <h3 className="font-bold text-2xl sm:text-3xl text-white mb-3 drop-shadow-md">
              {slides[current].title}
            </h3>
            <p className="text-gray-200 text-sm sm:text-base font-medium drop-shadow-sm">
              {slides[current].description}
            </p>
          </div>

          {/* Controles (dots) */}
          <div className="flex items-center gap-6">
            <div className="flex gap-2.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all duration-500 cursor-pointer border-0 shadow-lg"
                  style={{
                    width: i === current ? "32px" : "10px",
                    height: "10px",
                    backgroundColor:
                      i === current ? "#ffffff" : "rgba(255,255,255,0.4)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}