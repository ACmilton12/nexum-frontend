import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import React from "react";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import RegisterPage from "../pages/auth/RegisterPage";
import RolesPage from "../pages/admin/RolesPage";
import AccountsPage from "../pages/admin/AccountsPage";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import AuditPage from "../pages/admin/AuditPage";
import CategoriesPage from "../pages/admin/CategoriesPage";
import BackupsPage from "../pages/admin/BackupsPage";
import PersonalData from "../pages/professional/profile-settings/PersonalData";
import LinksPrivacy from "../pages/professional/profile-settings/LinksPrivacy";
import HabilidadesPage from "../pages/professional/Habilidades";
import Experience from "../pages/professional/experience/Experience";
import Certifications from "../pages/professional/certifications/Certifications";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import ProjectsPage from "../pages/professional/projects/ProjectsPage";
import HomeDirectory from "../pages/professional/HomeDirectory";
import PublicProfile from "../pages/professional/PublicProfile";
import PortfolioView from "../pages/professional/portfolio/PortfolioView";

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const pathnames = pathname.split("/").filter((x) => x);

  const routeLabels: { [key: string]: string } = {
    "profile": "Perfil",
    "admin": "Administración",
    "usuarios": "Gestión de Usuarios",
    "roles": "Roles",
    "dashboard": "Dashboard",
    "personal-data": "Datos Personales",
    "links": "Enlaces y Privacidad",
    "projects": "Proyectos",
    "proyectos": "Proyectos",
    "habilidades": "Habilidades",
    "experiencia": "Experiencia",
    "certificaciones": "Certificaciones",
    "portfolio": "Portafolio"
  };

  const isProfessionalRoute = ["/dashboard", "/proyectos", "/habilidades", "/experiencia", "/certificaciones", "/portfolio"].includes(pathname) || pathname.startsWith("/profile");

  return (
    <div style={{
      padding: '12px 40px',
      backgroundColor: '#eef3f8',
      borderBottom: '1px solid #ddd',
      fontSize: '13px',
      color: '#666'
    }}>
      {pathname === "/" ? (
        <span style={{ fontWeight: 'bold', color: '#003087' }}>Menú principal</span>
      ) : (
        <>
          <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Menú principal</Link>
          
          {isProfessionalRoute ? (
            <>
              <span style={{ margin: '0 8px', color: '#999' }}>&gt;</span>
              <span style={{ color: '#666' }}>Configuración de perfil</span>
              
              {pathname.startsWith("/profile") && (
                <>
                  <span style={{ margin: '0 8px', color: '#999' }}>&gt;</span>
                  <span style={{ color: '#666' }}>Perfil</span>
                </>
              )}
              
              <span style={{ margin: '0 8px', color: '#999' }}>&gt;</span>
              <span style={{ fontWeight: 'bold', color: '#003087' }}>
                {pathname.includes("dashboard") ? "Dashboard" :
                 pathname.includes("proyectos") ? "Proyectos" :
                 pathname.includes("habilidades") ? "Habilidades" :
                 pathname.includes("experiencia") ? "Experiencia" :
                 pathname.includes("certificaciones") ? "Certificaciones" :
                 pathname.includes("links") ? "Enlaces y Privacidad" :
                 pathname.includes("portfolio") ? "Portafolio" :
                 "Datos Personales"}
              </span>
            </>
          ) : (
            pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              const displayName = routeLabels[name.toLowerCase()] ||
                name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
              return (
                <span key={name}>
                  <span style={{ margin: '0 8px', color: '#999' }}>&gt;</span>
                  {isLast ? (
                    <span style={{ fontWeight: 'bold', color: '#003087' }}>{displayName}</span>
                  ) : (
                    <Link to={routeTo} style={{ color: '#666', textDecoration: 'none' }}>{displayName}</Link>
                  )}
                </span>
              );
            })
          )}
        </>
      )}
    </div>
  );
};

// Rutas que NO usan el Navbar/Footer/Breadcrumbs del layout
// porque tienen sus propios componentes integrados.
const ROUTES_WITHOUT_LAYOUT = [
  "/",
  "/home",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/habilidades",
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  // toLowerCase() para que /Home, /home, /HOME etc. todos hagan match
  const lowerPath = pathname.toLowerCase();

  const hideLayout = ROUTES_WITHOUT_LAYOUT.some((route) =>
    route === "/"
      ? lowerPath === "/"
      : lowerPath === route || lowerPath.startsWith(route + "/")
  );

  if (hideLayout) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Breadcrumbs />
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* ── Página de inicio ─────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />  {/* ← AGREGADO: evita el breadcrumb */}

          {/* ── Rutas públicas ───────────────────────────────── */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/portfolio" element={
            <ProtectedRoute allowedRole="professional">
              <PortfolioView />
            </ProtectedRoute>
          } />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/proyectos" element={
            <ProtectedRoute allowedRole="professional">
              <ProjectsPage />
            </ProtectedRoute>
          } />

          {/* ── Rutas del admin ──────────────────────────────── */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <RolesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/roles" element={
            <ProtectedRoute allowedRole="admin">
              <RolesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRole="admin">
              <RolesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/usuarios" element={
            <ProtectedRoute allowedRole="admin">
              <AccountsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/auditoria" element={
            <ProtectedRoute allowedRole="admin">
              <AuditPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/categorias" element={
            <ProtectedRoute allowedRole="admin">
              <CategoriesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/backups" element={
            <ProtectedRoute allowedRole="admin">
              <BackupsPage />
            </ProtectedRoute>
          } />

          {/* ── Rutas del profesional ────────────────────────── */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRole="professional">
              <RolesPage />
            </ProtectedRoute>
          } />
          <Route path="/directorio" element={
            <ProtectedRoute allowedRole="professional">
              <HomeDirectory />
            </ProtectedRoute>
          } />
          <Route path="/directorio/perfil/:id" element={
            <ProtectedRoute allowedRole="professional">
              <PublicProfile />
            </ProtectedRoute>
          } />
          <Route path="/experiencia" element={
            <ProtectedRoute allowedRole="professional">
              <Experience />
            </ProtectedRoute>
          } />
          <Route path="/certificaciones" element={
            <ProtectedRoute allowedRole="professional">
              <Certifications />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={<Navigate to="/profile/personal-data" replace />} />
          <Route path="/profile/personal-data" element={
            <ProtectedRoute allowedRole="professional">
              <PersonalData />
            </ProtectedRoute>
          } />
          <Route path="/profile/links" element={
            <ProtectedRoute allowedRole="professional">
              <LinksPrivacy />
            </ProtectedRoute>
          } />
          <Route path="/profile/habilidades" element={
            <ProtectedRoute allowedRole="professional">
              <HabilidadesPage />
            </ProtectedRoute>
          } />

          {/* ── Ruta por defecto ─────────────────────────────── */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRouter;