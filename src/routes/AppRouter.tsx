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
import PersonalData from "../pages/professional/profile-settings/PersonalData";
import LinksPrivacy from "../pages/professional/profile-settings/LinksPrivacy";
import ProtectedRoute from "./ProtectedRoute";
import { SidebarProvider } from "../contexts/SidebarContext";

const HomePage = () => (
  <div style={{ textAlign: "center", padding: "50px" }}>
    <h1>Bienvenido a Nexum Frontend</h1>
    <p>Este es la página de inicio.</p>
    <nav style={{ marginTop: "20px" }}>
      <Link
        to="/profile/personal-data"
        style={{
          padding: "10px 20px",
          border: "1px solid blue",
          borderRadius: "5px",
          textDecoration: "none",
          color: "blue",
        }}
      >
        Ir a Datos Personales
      </Link>
    </nav>
  </div>
);

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const pathnames = pathname.split("/").filter((x) => x);

  const routeLabels: { [key: string]: string } = {
    "profile": "Perfil",
    "admin": "Administración",
    "usuarios": "Gestión de Usuarios",
    "roles": "Roles",
    "dashboard": "Panel de Control",
    "personal-data": "Datos Personales",
    "links": "Enlaces y Privacidad"
  };

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
          {pathname.startsWith("/profile") ? (
            <>
              <span style={{ margin: '0 8px', color: '#999' }}>&gt;</span>
              <span style={{ color: '#666' }}>Configuración de perfil</span>
              <span style={{ margin: '0 8px', color: '#999' }}>&gt;</span>
              <span style={{ color: '#666' }}>Perfil</span>
              <span style={{ margin: '0 8px', color: '#999' }}>&gt;</span>
              <span style={{ fontWeight: 'bold', color: '#003087' }}>
                {pathname === "/profile/links" ? "Enlaces y Privacidad" : "Datos Personales"}
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

const ROUTES_WITHOUT_LAYOUT = [
  "/login", "/register", "/forgot-password", "/reset-password", 
  "/proyectos", "/habilidades", "/experiencia", "/dashboard",
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const hideLayout = ROUTES_WITHOUT_LAYOUT.some((route) => pathname.startsWith(route));

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
      <SidebarProvider>
      <Layout>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas del admin */}
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

          {/* Rutas del profesional */}
          <Route path="/portfolio" element={
            <ProtectedRoute allowedRole="professional">
              <RolesPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRole="professional">
              <RolesPage />
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

          {/* Ruta por defecto */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default AppRouter;