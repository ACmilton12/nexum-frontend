import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginService } from "../../services/auth.service";
import logoUmss from "../../assets/logoUmss.png";
import heroImage from "../../assets/prueba11.png";


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await loginService({ email, password });

     if (rememberMe) {
             localStorage.setItem("token", data.token);
             localStorage.setItem("user", JSON.stringify(data.user));
            } else {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));
          }
        setEmail("");
        setPassword("");
        setRememberMe(false);
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile/personal-data");
      }
    } catch (err: any) {
      setError(err.message || "Credenciales inválidas. Verifica tus datos e inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/*Navbar*/}
      <nav className="w-full bg-navbar px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={logoUmss}
            alt="Logo UMSS"
            className="w-8 h-8 object-contain"
          />
          <span className="text-white font-bold text-lg tracking-wide">
            NEXUM
          </span>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-surface rounded-lg shadow-lg overflow-hidden flex">

          {/* Panel izquierdo azul */}
          <div className="hidden md:flex w-1/2 bg-primary flex-col items-center justify-center p-10 text-white">
            <img
              src={heroImage}
              alt="Ilustración Nexum"
              className="w-64 h-64 object-contain mb-8"
            />
            <h2 className="text-2xl font-bold text-center mb-2">
              Tu portafolio profesional te espera
            </h2>
            <p className="text-sm text-center opacity-80 mb-6">
              Conecta con oportunidades y muestra tu talento al mundo
            </p>
            <div className="flex items-center justify-between w-full mt-4">
              <span className="border border-white text-white text-xs px-3 py-1 rounded">
                UMSS
              </span>
              <span className="text-white font-bold text-lg">Nexum</span>
            </div>
          </div>

          {/* Panel derecho - Formulario */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-10 bg-background">
            <p className="text-textMain text-sm font-bold mb-1">Bienvenido</p>
            <p className="text-textMain font-bold mb-6">
              Accede a tu cuenta para continuar
            </p>

            <div className="w-full bg-white rounded-lg border border-gray-200 p-6 shadow-md">
              <h2 className="text-lg font-bold text-textMain text-center mb-1">
                Iniciar Sesión
              </h2>
              <p className="text-xs text-gray-400 text-center mb-5">
                Ingresa tus credenciales para continuar
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-textMain block mb-1">
                    Correo electrónico
                  </label>
                  <div className="flex items-center border border-gray-300 rounded px-3 py-2 gap-2 focus-within:border-primary">
                    <Mail size={16} className="text-gray-400" />
                    <input
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className="flex-1 outline-none text-sm text-textMain bg-transparent"
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div>
                  <label className="text-sm font-medium text-textMain block mb-1">
                    Contraseña
                  </label>
                  <div className="flex items-center border border-gray-300 rounded px-3 py-2 gap-2 focus-within:border-primary">
                    <Lock size={16} className="text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      className="flex-1 outline-none text-sm text-textMain bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-primary"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-action text-xs mt-1">{error}</p>
                  )}
                </div>

                {/* Recordarme y olvidaste contraseña */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-textMain cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-primary"
                      autoComplete="off"
                    />
                    Recordarme
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Registro */}
                <p className="text-center text-sm text-textMain">
                  ¿No tienes cuenta?{" "}
                  <Link
                    to="/register"
                    className="text-primary font-semibold hover:underline"
                  >
                    Regístrate aquí
                  </Link>
                </p>

                {/* Botón */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-action text-white py-2.5 rounded font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4 bg-white">
        Copyright © 2026 CODI
      </footer>
    </div>
  );
};

export default LoginPage;