import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoUmss from "../assets/logoUmss.png";
import useAuth from "../hooks/useAuth";
import { API_BASE_URL } from "../utils/constants";
import { MOCK_PORTFOLIOS, type PublicPortfolio } from "../utils/mockPortfolios";
import { Search, ChevronLeft, ChevronRight, Filter, SlidersHorizontal, ArrowUpDown, Globe, ChevronDown, CheckCircle } from "lucide-react";
// ── Interfaces ─────────────────────────────────────────────────────────────

interface Feature {
  icon: string;
  title: string;
  description: string;
}

// Datos que vienen del backend: GET /api/v1/featured-profiles
interface FeaturedProfile {
  first_name: string;
  last_name: string;
  location: string | null;
  avatar_url: string | null;
  projects_count: number;
}

// Estadísticas globales del sistema (vienen en el mismo endpoint)
// ⚠️ Ajustar los nombres de campo cuando el backend confirme la estructura
interface GlobalStats {
  total_users: number;
  total_projects: number;
  total_views: number;
}

const features: Feature[] = [
  { icon: "👤", title: "Registro de usuario", description: "Los profesionales TIS pueden registrarse y acceder con usuario y contraseña asociados a la universidad." },
  { icon: "🔑", title: "Control de roles", description: "Sistema de permisos por roles: estudiantes, docentes, coordinadores y administradores del sistema." },
  { icon: "📁", title: "Gestión de proyectos", description: "Administra proyectos académicos y laborales, mantén actualizadas tus experiencias de trabajo." },
  { icon: "📄", title: "Exportación PDF", description: "Genera y exporta tu portafolio como archivo PDF profesional listo para compartir con empleadores." },
  { icon: "🌐", title: "Multilenguaje", description: "Soporte completo en español e inglés para ampliar las oportunidades a nivel internacional." },
  { icon: "⚙️", title: "Panel Administrativo", description: "Herramientas de administración para la gestión de usuarios, estadísticas y resolución de incidencias." },
];

// ── Helpers ────────────────────────────────────────────────────────────────

// Genera iniciales del avatar a partir del nombre y apellido
function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// Formatea números grandes: 1200 → "1.2k"
function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ── Hook: carga perfiles destacados y estadísticas desde el backend ─────────
function useFeaturedProfiles() {
  const [profiles, setProfiles] = useState<FeaturedProfile[]>([]);
  const [stats, setStats] = useState<GlobalStats>({
    total_users: 0,
    total_projects: 0,
    total_views: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/featured-profiles`
        );
        if (!res.ok) throw new Error("Error al cargar perfiles");
        const json = await res.json();

        console.log("Estructura real del backend:", json);
        // Perfiles destacados
        if (Array.isArray(json.data)) setProfiles(json.data);

        // ⚠️ Estadísticas globales — ajustar nombres de campo cuando el backend confirme
        // Por ahora buscamos en json.stats, pero puede estar en json directamente
        const statsSource = json.stats ?? json;
        setStats({
          total_users: statsSource.total_users ?? 0,
          total_projects: statsSource.total_projects ?? 0,
          total_views: statsSource.total_views ?? 0,
        });
      } catch (err) {
        console.error("Error cargando featured profiles:", err);
        // Fallback con datos de ejemplo si el backend no responde
        setProfiles([
          { first_name: "Carlos", last_name: "Mendoza", location: null, avatar_url: null, projects_count: 12 },
          { first_name: "Lucía", last_name: "Martínez", location: null, avatar_url: null, projects_count: 8 },
          { first_name: "Marcelo", last_name: "Vargas", location: null, avatar_url: null, projects_count: 15 },
        ]);
        setStats({ total_users: 1200, total_projects: 3500, total_views: 15000 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { profiles, stats, loading };
}

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav
      style={{
        backgroundColor: scrolled ? "rgba(0,26,94,0.97)" : "#001A5E",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "all 0.3s ease",
      }}
      className="fixed top-0 left-0 right-0 z-50 shadow-lg"
    >
      <div className="w-full px-6 h-16 flex items-center">

        {/* Logo — izquierda */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img src={logoUmss} alt="Logo UMSS" className="w-16 h-16 object-contain rounded-full" />
            <span className="text-white font-bold text-lg tracking-wide">NEXUM</span>
          </Link>
        </div>

        {/* Links — centro */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-10">
          <Link to="/" className="text-white text-xs font-bold tracking-widest hover:text-gray-300 transition-colors duration-200 no-underline">
            INICIO
          </Link>
          <Link to="/Home" className="text-white text-xs font-bold tracking-widest hover:text-gray-300 transition-colors duration-200 no-underline">
            EXPLORAR PORTAFOLIOS
          </Link>
          <a href="#contacto" className="text-white text-xs font-bold tracking-widest hover:text-gray-300 transition-colors duration-200 no-underline">
            CONTACTO
          </a>
        </div>

        {/* Botones — derecha */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-3">
          {user ? (
            <>
              <span className="text-white text-sm opacity-80 font-medium">
                {user.first_name || user.name || user.email}
              </span>
              <Link
                to="/profile/personal-data"
                className="text-sm font-bold px-5 py-2 rounded border-2 border-white transition-all duration-200 no-underline"
                style={{ color: "white", backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  const l = e.currentTarget as HTMLAnchorElement;
                  l.style.backgroundColor = "white";
                  l.style.color = "#001A5E";
                }}
                onMouseLeave={(e) => {
                  const l = e.currentTarget as HTMLAnchorElement;
                  l.style.backgroundColor = "transparent";
                  l.style.color = "white";
                }}
              >
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="text-white text-sm font-bold px-5 py-2 rounded transition-all duration-200 border-0 cursor-pointer"
                style={{ backgroundColor: "#C8102E" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#a50d25")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C8102E")}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-bold px-5 py-2 rounded border-2 border-white transition-all duration-200 no-underline"
                style={{ color: "white", backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  const l = e.currentTarget as HTMLAnchorElement;
                  l.style.backgroundColor = "white";
                  l.style.color = "#001A5E";
                }}
                onMouseLeave={(e) => {
                  const l = e.currentTarget as HTMLAnchorElement;
                  l.style.backgroundColor = "transparent";
                  l.style.color = "white";
                }}
              >
                Acceder
              </Link>
              <Link
                to="/register"
                className="text-white text-sm font-bold px-6 py-2 rounded transition-all duration-200 no-underline"
                style={{ backgroundColor: "#C8102E" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#a50d25")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C8102E")}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 ml-auto"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4"
          style={{ backgroundColor: "#001A5E" }}
        >
          <Link to="/" className="text-white text-xs font-bold tracking-widest no-underline">INICIO</Link>
          <Link to="/Home" className="text-white text-xs font-bold tracking-widest no-underline">EXPLORAR PORTAFOLIOS</Link>
          <a href="#contacto" className="text-white text-xs font-bold tracking-widest no-underline">CONTACTO</a>
          <div className="flex gap-3 pt-2">
            {user ? (
              <>
                <Link to="/profile/personal-data" className="flex-1 border-2 border-white text-white text-sm font-bold py-2 rounded text-center no-underline">
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex-1 text-white text-sm font-bold py-2 rounded text-center border-0 cursor-pointer"
                  style={{ backgroundColor: "#C8102E" }}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex-1 border-2 border-white text-white text-sm font-bold py-2 rounded text-center no-underline">
                  Acceder
                </Link>
                <Link to="/register" className="flex-1 text-white text-sm font-bold py-2 rounded text-center no-underline" style={{ backgroundColor: "#C8102E" }}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Hero / Banner Carousel ────────────────────────────────────────────────
function Hero({ onSearch }: { onSearch: (results: PublicPortfolio[]) => void }) {
  const [current, setCurrent] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const AREAS = ["Todas las áreas", "Desarrollo de Software", "Diseño UX/UI", "Data Science", "Gestión de Proyectos"];
  const SKILLS = ["Todas las habilidades", "React", "Node.js", "Python", "Figma", "Go", "Flutter", "TypeScript", "SQL"];

  const handleSearch = () => {
    let filtered = [...MOCK_PORTFOLIOS];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.first_name.toLowerCase().includes(term) || 
        p.last_name.toLowerCase().includes(term) || 
        p.profession.toLowerCase().includes(term) ||
        p.skills.some(s => s.toLowerCase().includes(term))
      );
    }
    if (selectedArea && selectedArea !== "Todas las áreas") {
      filtered = filtered.filter(p => p.area === selectedArea);
    }
    if (selectedSkill && selectedSkill !== "Todas las habilidades") {
      filtered = filtered.filter(p => p.skills.includes(selectedSkill));
    }
    // Sorting logic (mocked)
    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }

    onSearch(filtered);
    // Scroll to results
    const resultsElement = document.getElementById("search-results");
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const banners = [
    {
      id: "search",
      title: "Encuentra el talento profesional de la UMSS",
      subtitle: "Explora portafolios públicos de desarrolladores, ingenieros y especialistas.",
      bg: "#C8102E", // UMSS Red
    },
    {
      id: "platform",
      title: "Plataforma de Portafolios Digitales",
      subtitle: "Crea, gestiona y comparte tu perfil profesional validado por la institución.",
      bg: "#003087", // UMSS Blue
    },
    {
      id: "pdf",
      title: "Exportación PDF Profesional",
      subtitle: "Genera tu currículum en formato PDF listo para compartir con empleadores en un clic.",
      bg: "#1e293b", // Dark
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);

  return (
    <section className="relative h-[650px] overflow-hidden mt-16">
      {/* Slides (Background and Text) */}
      <div className="absolute inset-0 transition-all duration-700 ease-in-out flex"
           style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((banner) => (
          <div 
            key={banner.id}
            className="w-full h-full flex-shrink-0 flex flex-col items-center justify-start pt-24 relative"
            style={{ backgroundColor: banner.bg }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 0 L100 0 L100 100 Z" fill="white" />
              </svg>
            </div>

            {/* Content (Title & Subtitle) */}
            <div className="w-full max-w-5xl mx-auto text-center text-white px-6 relative z-10">
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 animate-fadeIn">
                {banner.title}
              </h1>
              <p className="text-blue-100 text-lg mb-10 opacity-90">
                {banner.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Search Bar Overlay (Visible in all banners) */}
      <div className="absolute inset-0 flex items-center justify-center pt-32 pointer-events-none z-20">
        <div className="w-full max-w-5xl mx-auto text-center px-6 pointer-events-auto">
          <div className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row items-center gap-2 mb-6 max-w-4xl mx-auto">
            <div className="flex-1 flex items-center px-4 w-full">
              <Search className="text-gray-400 mr-3" size={24} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, especialidad o habilidades..."
                className="w-full py-4 text-gray-800 outline-none text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-[#C8102E] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#a50d25] transition-all w-full md:w-auto"
            >
              Buscar
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="relative group">
              <select 
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-medium outline-none cursor-pointer hover:bg-white/20 transition-all appearance-none pr-10"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                {AREAS.map(a => <option key={a} value={a} className="text-gray-800">{a === "Todas las áreas" ? "Área" : a}</option>)}
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" size={14} />
            </div>

            <div className="relative group">
              <select 
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-medium outline-none cursor-pointer hover:bg-white/20 transition-all appearance-none pr-10"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
              >
                {SKILLS.map(s => <option key={s} value={s} className="text-gray-800">{s === "Todas las habilidades" ? "Habilidades" : s}</option>)}
              </select>
              <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" size={14} />
            </div>

            <div className="relative group">
              <select 
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-medium outline-none cursor-pointer hover:bg-white/20 transition-all appearance-none pr-10"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance" className="text-gray-800">Ordenar: Relevancia</option>
                <option value="date" className="text-gray-800">Ordenar: Fecha</option>
              </select>
              <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button 
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-all z-30"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-all z-30"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-y-1/2 flex gap-3 z-30">
        {banners.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-10 h-3 bg-white' : 'w-3 h-3 bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
}

// ── Feature Card ───────────────────────────────────────────────────────────
function FeatureCard({ feat }: { feat: Feature }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl p-7 border transition-all duration-300 cursor-default hover:shadow-xl hover:-translate-y-1"
      style={{ backgroundColor: hovered ? "#003087" : "#FFFFFF", borderColor: hovered ? "#003087" : "#C9D1D9" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-colors duration-300" style={{ backgroundColor: hovered ? "rgba(255,255,255,0.15)" : "#f0f4ff" }}>
        {feat.icon}
      </div>
      <h3 className="font-bold text-lg mb-3" style={{ color: hovered ? "#FFFFFF" : "#1A1A2E" }}>{feat.title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: hovered ? "#bfdbfe" : "#6b7280" }}>{feat.description}</p>
    </div>
  );
}

// ── University Strip ───────────────────────────────────────────────────────
function UniversityStrip() {
  return (
    <div className="py-8 border-y" style={{ backgroundColor: "#FFFFFF", borderColor: "#C9D1D9" }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-6">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#1A1A2E" }}>
          Respaldado por la Universidad Mayor de San Simón
        </p>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {["UMSS", "FCyT", "Dpto. Informática y Sistemas"].map((uni) => (
            <span key={uni} className="text-xs font-bold px-4 py-1.5 rounded-full border"
              style={{ color: "#003087", borderColor: "#003087", backgroundColor: "#f0f4ff" }}>
              {uni}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Features ───────────────────────────────────────────────────────────────
function Features() {
  return (
    <section className="py-24" style={{ backgroundColor: "#C9D1D9" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-extrabold text-3xl lg:text-4xl mb-4" style={{ color: "#1A1A2E" }}>Funcionalidades del Sistema</h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base">Todo lo que necesitas para construir y gestionar tu portafolio profesional.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => <FeatureCard key={feat.title} feat={feat} />)}
        </div>
      </div>
    </section>
  );
}

// ── CTA ────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "#003087" }}>
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: "#C8102E" }} />
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <h2 className="text-white font-extrabold text-3xl lg:text-4xl mb-4">¿Eres profesional de software?</h2>
        <p className="text-blue-200 text-base mb-10 max-w-xl mx-auto">
          Crea tu portafolio institucional hoy mismo y destaca en tu área con una presencia digital profesional.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/register" className="text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-xl no-underline"
            style={{ backgroundColor: "#C8102E" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#a50d25")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C8102E")}>
            Comenzar ahora
          </Link>
          <Link to="/Home" className="border-2 border-white/50 hover:border-white text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 no-underline">
            Explorar portafolios
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Public Profile Card ──────────────────────────────────────────────────
function PublicProfileCard({ profile }: { profile: PublicPortfolio }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex flex-col items-center text-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner group-hover:scale-110 transition-transform duration-500">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.first_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-3xl font-bold">
              {profile.first_name[0]}
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.first_name} {profile.last_name}</h3>
      <p className="text-sm text-gray-500 mb-4">{profile.profession} • {profile.location}</p>

      <div className="flex flex-wrap justify-center gap-2 mb-8 h-16 overflow-hidden">
        {profile.skills.map(skill => (
          <span key={skill} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
            {skill}
          </span>
        ))}
      </div>

      <Link
        to={`/portfolio/${profile.id}`}
        className="w-full py-3 rounded-xl border-2 border-gray-100 text-gray-800 font-bold hover:bg-[#C8102E] hover:text-white hover:border-[#C8102E] transition-all no-underline"
      >
        Ver Portafolio
      </Link>
    </div>
  );
}

// ── Search Results Section ───────────────────────────────────────────────
function SearchResults({ results }: { results: PublicPortfolio[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const currentResults = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (results.length === 0) return null;

  return (
    <section id="search-results" className="py-20 bg-[#C9D1D9]/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Resultados de búsqueda ({results.length})</h2>
          <p className="text-gray-500">Excluyendo perfiles privados y secciones ocultas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentResults.map(p => (
            <PublicProfileCard key={p.id} profile={p} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === i + 1 ? 'bg-[#C8102E] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Portfolio Card ──────────────────────────────────────────────────────────
const accentColors = ["#003087", "#C8102E", "#001A5E"];

function PortfolioCard({ profile, index }: { profile: FeaturedProfile; index: number }) {
  const [btnHovered, setBtnHovered] = useState(false);
  const accentColor = accentColors[index % accentColors.length];
  const initials = getInitials(profile.first_name, profile.last_name);
  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <div className="rounded-2xl p-6 border-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: "#FFFFFF", borderColor: "#C9D1D9" }}>
      <div className="flex items-center gap-4 mb-5">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt={fullName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: accentColor }}>
            {initials}
          </div>
        )}
        <div>
          <div className="font-bold text-base" style={{ color: "#1A1A2E" }}>{fullName}</div>
          <div className="text-gray-500 text-xs">{profile.location || "UMSS · FCyT"}</div>
          <div className="text-gray-400 text-xs">Universidad Mayor de San Simón</div>
        </div>
      </div>
      <div className="flex items-center gap-8 mb-6 pt-4 border-t-2" style={{ borderColor: "#C9D1D9" }}>
        <div className="flex-1 border-r-2 pr-8" style={{ borderColor: "#C9D1D9" }}>
          <div className="font-extrabold text-2xl" style={{ color: "#1A1A2E" }}>{profile.projects_count}</div>
          <div className="text-gray-400 text-xs">Proyectos</div>
        </div>
        <div className="flex-1">
          <div className="font-extrabold text-2xl" style={{ color: "#1A1A2E" }}>—</div>
          <div className="text-gray-400 text-xs">Visitas</div>
        </div>
      </div>
      <Link to="/Home"
        className="w-full font-bold text-sm py-2.5 rounded-xl border-2 transition-all duration-200 no-underline text-center inline-block"
        style={{ color: btnHovered ? "#FFFFFF" : "#C8102E", borderColor: "#C8102E", backgroundColor: btnHovered ? "#C8102E" : "transparent" }}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}>
        Ver portafolio →
      </Link>
    </div>
  );
}

// ── Recent Portfolios ──────────────────────────────────────────────────────
function RecentPortfolios({ profiles, loading }: { profiles: FeaturedProfile[]; loading: boolean }) {
  return (
    <section className="py-24" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-extrabold text-3xl lg:text-4xl mb-4" style={{ color: "#1A1A2E" }}>Portafolios recientes</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">Conoce el trabajo de los profesionales destacados.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl p-6 border-2 animate-pulse" style={{ borderColor: "#C9D1D9" }}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-16 bg-gray-200 rounded mb-4" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profiles.slice(0, 3).map((p, i) => (
              <PortfolioCard key={`${p.first_name}-${p.last_name}`} profile={p} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/Home" className="text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg no-underline inline-block"
            style={{ backgroundColor: "#003087" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#001A5E")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#003087")}>
            Ver todos los portafolios
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="contacto" className="pt-16 pb-8" style={{ backgroundColor: "#001A5E" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 no-underline">
              <img src={logoUmss} alt="Logo UMSS" className="w-16 h-20 object-contain rounded-full" />
              <span className="text-white font-extrabold text-xl tracking-widest ml-1">NEXUM</span>
            </Link>
            <p className="text-blue-300 text-sm leading-relaxed">Plataforma institucional de portafolios digitales para profesionales.</p>
          </div>
          <div>
            <div className="text-white font-bold text-xs mb-4 uppercase tracking-widest">Navegación</div>
            <Link to="/" className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline">Inicio</Link>
            <Link to="/Home" className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline">Explorar Portafolios</Link>
            <Link to="/login" className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline">Acceder</Link>
            <Link to="/register" className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline">Registrarse</Link>
          </div>
          <div>
            <div className="text-white font-bold text-xs mb-4 uppercase tracking-widest">Recursos</div>
            {["Guía de uso", "Formato PDF", "Preguntas frecuentes", "Normativa"].map((l) => (
              <a key={l} href="#" className="block text-blue-300 hover:text-white text-sm mb-2.5 transition-colors no-underline">{l}</a>
            ))}
          </div>
          <div>
            <div className="text-white font-bold text-xs mb-4 uppercase tracking-widest">Contacto</div>
            <p className="text-blue-300 text-sm mb-2">soporte@nexum.umss.edu.bo</p>
            <p className="text-blue-300 text-sm mb-2">FCyT · UMSS</p>
            <p className="text-blue-300 text-sm">Cochabamba, Bolivia</p>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
          <p className="text-blue-400 text-xs">© 2025 NEXUM · Universidad Mayor de San Simón · Facultad de Ciencias y Tecnología</p>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono font-bold text-sm">&lt;/&gt;</span>
            <span className="text-blue-400 text-xs">CODI · Departamento de Informática y Sistemas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────
export default function Home() {
  const { user } = useAuth();
  const { profiles, stats, loading } = useFeaturedProfiles();
  const [searchResults, setSearchResults] = useState<PublicPortfolio[]>(MOCK_PORTFOLIOS);

  return (
    <div className="min-h-screen font-sans antialiased bg-white">
      <Navbar />
      <Hero onSearch={setSearchResults} />
      <SearchResults results={searchResults} />
      <UniversityStrip />
      <Features />
      {!user && <CTA />}
      <RecentPortfolios profiles={profiles} loading={loading} />
      <Footer />
    </div>
  );
}
