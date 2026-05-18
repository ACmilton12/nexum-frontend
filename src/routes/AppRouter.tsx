import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import LoginPage from '../pages/auth/LoginPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'
import RegisterPage from '../pages/auth/RegisterPage'
import RolesPage from '../pages/admin/RolesPage'
import AccountsPage from '../pages/admin/AccountsPage'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import AuditPage from '../pages/admin/AuditPage'
import CategoriesPage from '../pages/admin/CategoriesPage'
import BackupsPage from '../pages/admin/BackupsPage'
import PersonalData from '../pages/professional/profile-settings/PersonalData'
import Links from '../pages/professional/profile-settings/Links'
import Privacy from '../pages/professional/profile-settings/Privacy'
import HabilidadesPage from '../pages/professional/Habilidades'
import Experience from '../pages/professional/experience/Experience'
import Certifications from '../pages/professional/certifications/Certifications'
import ProfileVisitorsPage from '../pages/professional/visitors/ProfileVisitorsPage'
import ProtectedRoute from './ProtectedRoute'
import Home from '../pages/Home'
import BuscarProfesionales from '../pages/BuscarProfesionales'
import ProjectsPage from '../pages/professional/projects/ProjectsPage'
import HomeDirectory from '../pages/professional/HomeDirectory'
import PublicProfile from '../pages/professional/PublicProfile'
import PortfolioView from '../pages/professional/portfolio/PortfolioView'
import SearchPage from '../pages/search/SearchPage'
import PublicPortfolioPage from '../pages/portfolio/PublicPortfolioPage'
import PrintPortfolio from '../pages/professional/PrintPortfolio'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const Breadcrumbs = () => {
  const { pathname } = useLocation()
  const pathnames = pathname.split('/').filter((x) => x)

  const routeLabels: { [key: string]: string } = {
    "profile": "Perfil",
    "admin": "Administración",
    "usuarios": "Gestión de Usuarios",
    "roles": "Roles",
    "dashboard": "Dashboard",
    "personal-data": "Datos Personales",
    "links": "Enlaces",
    "privacy": "Privacidad",
    "projects": "Proyectos",
    "proyectos": "Proyectos",
    "habilidades": "Habilidades",
    "experiencia": "Experiencia",
    "certificaciones": "Certificaciones",
    "visitantes": "Visitantes",
    "portfolio": "Portafolio"
  }

  const isProfessionalRoute = ["/dashboard", "/proyectos", "/habilidades", "/experiencia", "/certificaciones", "/visitantes", "/portfolio"].includes(pathname) || pathname.startsWith("/profile")

  return (
    <div className="px-6 md:px-10 py-3 bg-[#eef3f8] dark:bg-slate-900 border-b border-[#ddd] dark:border-slate-800 text-[13px] text-[#666] dark:text-gray-400 transition-colors duration-300">
      {pathname === '/' ? (
        <span className="font-bold text-[#003087] dark:text-blue-400">Menú principal</span>
      ) : (
        <>
          <Link
            to="/"
            className="text-[#666] dark:text-gray-400 hover:text-[#003087] dark:hover:text-blue-400 no-underline transition-colors"
          >
            Menú principal
          </Link>

          {isProfessionalRoute ? (
            <>
              <span className="mx-2 text-[#999] dark:text-gray-600">&gt;</span>
              <span className="text-[#666] dark:text-gray-400">Configuración de perfil</span>

              {pathname.startsWith('/profile') && (
                <>
                  <span className="mx-2 text-[#999] dark:text-gray-600">&gt;</span>
                  <span className="text-[#666] dark:text-gray-400">Perfil</span>
                </>
              )}

              {/* Conflicto 1 resuelto: HEAD tiene dark mode, tu rama tiene más rutas */}
              <span className="mx-2 text-[#999] dark:text-gray-600">&gt;</span>
              <span className="font-bold text-[#003087] dark:text-blue-400">
                {pathname.includes('dashboard') ? 'Dashboard'
                  : pathname.includes('proyectos') ? 'Proyectos'
                    : pathname.includes('habilidades') ? 'Habilidades'
                      : pathname.includes('experiencia') ? 'Experiencia'
                        : pathname.includes('certificaciones') ? 'Certificaciones'
                          : pathname.includes('visitantes') ? 'Visitantes'
                            : pathname.includes('links') ? 'Enlaces'
                              : pathname.includes('privacy') ? 'Privacidad'
                                : pathname.includes('portfolio') ? 'Portafolio'
                                  : 'Datos Personales'}
              </span>
            </>
          ) : (
            pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
              const isLast = index === pathnames.length - 1
              const displayName =
                routeLabels[name.toLowerCase()] ||
                name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
              return (
                <span key={name}>
                  <span className="mx-2 text-[#999] dark:text-gray-600">&gt;</span>
                  {isLast ? (
                    <span className="font-bold text-[#003087] dark:text-blue-400">
                      {displayName}
                    </span>
                  ) : (
                    <Link
                      to={routeTo}
                      className="text-[#666] dark:text-gray-400 hover:text-[#003087] dark:hover:text-blue-400 no-underline transition-colors"
                    >
                      {displayName}
                    </Link>
                  )}
                </span>
              )
            })
          )}
        </>
      )}
    </div>
  )
}

const ROUTES_WITHOUT_LAYOUT = [
  '/',
  '/home',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/portfolio',
  '/search',
  '/habilidades'
]

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation()
  const lowerPath = pathname.toLowerCase()

  const hideLayout = ROUTES_WITHOUT_LAYOUT.some((route) =>
    route === '/' ? lowerPath === '/' : lowerPath === route || lowerPath.startsWith(route + '/')
  )

  if (hideLayout) return <>{children}</>

  /* Conflicto 2 resuelto: HEAD tiene dark mode y Footer */
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      <Breadcrumbs />
      <div className="flex-grow flex flex-col">{children}</div>
      <Footer />
    </div>
  )
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* ── Página de inicio ─────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<BuscarProfesionales />} />

          {/* ── Rutas públicas ───────────────────────────────── */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/portfolio/:id" element={<PublicPortfolioPage />} />
          <Route path="/imprimir/:id?" element={<PrintPortfolio />} />

          {/* ── Rutas del admin ──────────────────────────────── */}
          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><RolesPage /></ProtectedRoute>} />
          <Route path="/admin/roles" element={<ProtectedRoute allowedRole="admin"><RolesPage /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><RolesPage /></ProtectedRoute>} />
          <Route path="/admin/usuarios" element={<ProtectedRoute allowedRole="admin"><AccountsPage /></ProtectedRoute>} />
          <Route path="/admin/auditoria" element={<ProtectedRoute allowedRole="admin"><AuditPage /></ProtectedRoute>} />
          <Route path="/admin/categorias" element={<ProtectedRoute allowedRole="admin"><CategoriesPage /></ProtectedRoute>} />
          <Route path="/admin/backups" element={<ProtectedRoute allowedRole="admin"><BackupsPage /></ProtectedRoute>} />

          {/* ── Rutas del profesional ────────────────────────── */}
          {/* Conflicto 3 resuelto: combinamos rutas de ambas versiones */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRole="professional"><RolesPage /></ProtectedRoute>} />
          <Route path="/directorio" element={<ProtectedRoute allowedRole="professional"><HomeDirectory /></ProtectedRoute>} />
          <Route path="/directorio/perfil/:id" element={<ProtectedRoute allowedRole="professional"><PublicProfile /></ProtectedRoute>} />
          <Route path="/proyectos" element={<ProtectedRoute allowedRole="professional"><ProjectsPage /></ProtectedRoute>} />
          <Route path="/experiencia" element={<ProtectedRoute allowedRole="professional"><Experience /></ProtectedRoute>} />
          <Route path="/certificaciones" element={<ProtectedRoute allowedRole="professional"><Certifications /></ProtectedRoute>} />
          <Route path="/visitantes" element={<ProtectedRoute allowedRole="professional"><ProfileVisitorsPage /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute allowedRole="professional"><PortfolioView /></ProtectedRoute>} />

          {/* ── Perfil del profesional ────────────────────────── */}
          <Route path="/profile" element={<Navigate to="/profile/personal-data" replace />} />
          <Route path="/profile/personal-data" element={<ProtectedRoute allowedRole="professional"><PersonalData /></ProtectedRoute>} />
          <Route path="/profile/links" element={<ProtectedRoute allowedRole="professional"><Links /></ProtectedRoute>} />
          <Route path="/profile/privacy" element={<ProtectedRoute allowedRole="professional"><Privacy /></ProtectedRoute>} />
          <Route path="/profile/habilidades" element={<ProtectedRoute allowedRole="professional"><HabilidadesPage /></ProtectedRoute>} />

          {/* ── Ruta por defecto ─────────────────────────────── */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default AppRouter