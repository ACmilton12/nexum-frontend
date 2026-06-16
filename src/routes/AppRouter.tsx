import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import React, { Suspense, lazy, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import RouteFallback from '../components/ui/RouteFallback'
import ProtectedRoute from './ProtectedRoute'

const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const VerifyEmailRedirect = lazy(() => import('../pages/auth/VerifyEmailRedirect'))

const RolesPage = lazy(() => import('../pages/admin/RolesPage'))
const AccountsPage = lazy(() => import('../pages/admin/AccountsPage'))
const AuditPage = lazy(() => import('../pages/admin/AuditPage'))
const CategoriesPage = lazy(() => import('../pages/admin/CategoriesPage'))
const BackupsPage = lazy(() => import('../pages/admin/BackupsPage'))

const PersonalData = lazy(() => import('../pages/professional/profile-settings/PersonalData'))
const Links = lazy(() => import('../pages/professional/profile-settings/Links'))
const Privacy = lazy(() => import('../pages/professional/profile-settings/Privacy'))
const HabilidadesPage = lazy(() => import('../pages/professional/Habilidades'))
const Experience = lazy(() => import('../pages/professional/experience/Experience'))
const Certifications = lazy(() => import('../pages/professional/certifications/Certifications'))
const ProfileVisitorsPage = lazy(() => import('../pages/professional/visitors/ProfileVisitorsPage'))

const Home = lazy(() => import('../pages/Home'))
const BuscarProfesionales = lazy(() => import('../pages/BuscarProfesionales'))
const ProjectsPage = lazy(() => import('../pages/professional/projects/ProjectsPage'))
const HomeDirectory = lazy(() => import('../pages/professional/HomeDirectory'))
const PublicProfile = lazy(() => import('../pages/professional/PublicProfile'))
const PortfolioView = lazy(() => import('../pages/professional/portfolio/PortfolioView'))
const SearchPage = lazy(() => import('../pages/search/SearchPage'))
const PublicPortfolioPage = lazy(() => import('../pages/portfolio/PublicPortfolioPage'))
const PrintPortfolio = lazy(() => import('../pages/professional/PrintPortfolio'))
const GuidePage = lazy(() => import('../pages/resources/GuidePage'))
const PdfTipsPage = lazy(() => import('../pages/resources/PdfTipsPage'))
const FaqPage = lazy(() => import('../pages/resources/FaqPage'))
const RulesPage = lazy(() => import('../pages/resources/RulesPage'))

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const Breadcrumbs = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const pathnames = pathname.split('/').filter((x) => x)

  const routeLabels: { [key: string]: string } = {
    "profile": t('sidebar.profile', 'Perfil'),
    "admin": t('sidebar.admin', 'Administración'),
    "usuarios": t('sidebar.users_mgmt', 'Gestión de Usuarios'),
    "roles": t('sidebar.roles', 'Roles'),
    "dashboard": t('sidebar.dashboard', 'Dashboard'),
    "personal-data": t('sidebar.personal_data', 'Datos Personales'),
    "links": t('sidebar.links', 'Enlaces'),
    "privacy": t('sidebar.privacy', 'Privacidad'),
    "projects": t('sidebar.projects', 'Proyectos'),
    "proyectos": t('sidebar.projects', 'Proyectos'),
    "habilidades": t('sidebar.skills', 'Habilidades'),
    "experiencia": t('sidebar.experience', 'Experiencia'),
    "certificaciones": t('sidebar.certifications', 'Certificaciones'),
    "visitantes": t('sidebar.visitors', 'Visitantes'),
    "portfolio": t('sidebar.portfolio', 'Portafolio')
  }

  const isProfessionalRoute = ["/dashboard", "/proyectos", "/habilidades", "/experiencia", "/certificaciones", "/visitantes", "/portfolio"].includes(pathname) || pathname.startsWith("/profile")

  return (
    <div className="px-6 md:px-10 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-[13px] text-slate-500 dark:text-gray-400 transition-colors duration-300">
      {pathname === '/' ? (
        <span className="font-bold text-[#003087] dark:text-blue-400">{t('sidebar.main_menu', 'Menú principal')}</span>
      ) : (
        <>
          <Link
            to="/"
            className="text-slate-500 dark:text-gray-400 hover:text-[#003087] dark:hover:text-blue-400 no-underline transition-colors"
          >
            {t('sidebar.main_menu', 'Menú principal')}
          </Link>

          {isProfessionalRoute ? (
            <>
              <span className="mx-2 text-slate-300 dark:text-gray-600">&gt;</span>
              <span className="text-slate-500 dark:text-gray-400">{t('sidebar.profile_config', 'Configuración de perfil')}</span>

              {pathname.startsWith('/profile') && (
                <>
                  <span className="mx-2 text-slate-300 dark:text-gray-600">&gt;</span>
                  <span className="text-slate-500 dark:text-gray-400">{t('sidebar.profile', 'Perfil')}</span>
                </>
              )}

              <span className="mx-2 text-slate-300 dark:text-gray-600">&gt;</span>
              <span className="font-bold text-[#003087] dark:text-blue-400">
                {pathname.includes('dashboard') ? t('sidebar.dashboard', 'Dashboard')
                  : pathname.includes('proyectos') ? t('sidebar.projects', 'Proyectos')
                    : pathname.includes('habilidades') ? t('sidebar.skills', 'Habilidades')
                      : pathname.includes('experiencia') ? t('sidebar.experience', 'Experiencia')
                        : pathname.includes('certificaciones') ? t('sidebar.certifications', 'Certificaciones')
                          : pathname.includes('visitantes') ? t('sidebar.visitors', 'Visitantes')
                            : pathname.includes('links') ? t('sidebar.links', 'Enlaces')
                              : pathname.includes('privacy') ? t('sidebar.privacy', 'Privacidad')
                                : pathname.includes('portfolio') ? t('sidebar.portfolio', 'Portafolio')
                                  : t('sidebar.personal_data', 'Datos Personales')}
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
                  <span className="mx-2 text-slate-300 dark:text-gray-600">&gt;</span>
                  {isLast ? (
                    <span className="font-bold text-[#003087] dark:text-blue-400">
                      {displayName}
                    </span>
                  ) : (
                    <Link
                      to={routeTo}
                      className="text-slate-500 dark:text-gray-400 hover:text-[#003087] dark:hover:text-blue-400 no-underline transition-colors"
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
  '/auth/verify-email',
  '/forgot-password',
  '/reset-password',
  '/portfolio',
  '/search',
  '/habilidades',
  '/guia',
  '/formato-pdf',
  '/faq',
  '/normativa'
]

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation()
  const lowerPath = pathname.toLowerCase()

  const hideLayout = ROUTES_WITHOUT_LAYOUT.some((route) => {
    if (route === '/portfolio') {
      return lowerPath.startsWith('/portfolio/');
    }
    return route === '/' ? lowerPath === '/' : lowerPath === route || lowerPath.startsWith(route + '/')
  })

  if (hideLayout) return <>{children}</>

  const isWorkspaceRoute =
    lowerPath.startsWith('/admin') ||
    lowerPath.startsWith('/profile') ||
    lowerPath.startsWith('/directorio') ||
    ['/dashboard', '/proyectos', '/experiencia', '/certificaciones', '/visitantes', '/portfolio'].includes(lowerPath)

  if (isWorkspaceRoute) {
    return (
      <div className="h-screen max-h-screen flex flex-col overflow-hidden bg-background dark:bg-slate-900 transition-colors duration-300">
        <Navbar />
        <Breadcrumbs />
        <div className="flex-grow flex flex-col overflow-hidden">{children}</div>
      </div>
    )
  }

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
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<BuscarProfesionales />} />

            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/verify-email" element={<VerifyEmailRedirect />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/portfolio/:id" element={<PublicPortfolioPage />} />
            <Route path="/imprimir/:id?" element={<PrintPortfolio />} />
            <Route path="/guia" element={<GuidePage />} />
            <Route path="/formato-pdf" element={<PdfTipsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/normativa" element={<RulesPage />} />

            <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><RolesPage /></ProtectedRoute>} />
            <Route path="/admin/roles" element={<ProtectedRoute allowedRole="admin"><RolesPage /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><RolesPage /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute allowedRole="admin"><AccountsPage /></ProtectedRoute>} />
            <Route path="/admin/auditoria" element={<ProtectedRoute allowedRole="admin"><AuditPage /></ProtectedRoute>} />
            <Route path="/admin/categorias" element={<ProtectedRoute allowedRole="admin"><CategoriesPage /></ProtectedRoute>} />
            <Route path="/admin/backups" element={<ProtectedRoute allowedRole="admin"><BackupsPage /></ProtectedRoute>} />

            <Route path="/dashboard" element={<ProtectedRoute allowedRole="professional"><RolesPage /></ProtectedRoute>} />
            <Route path="/directorio" element={<ProtectedRoute allowedRoles={['admin', 'professional']}><HomeDirectory /></ProtectedRoute>} />
            <Route path="/directorio/perfil/:id" element={<ProtectedRoute allowedRoles={['admin', 'professional']}><PublicProfile /></ProtectedRoute>} />
            <Route path="/proyectos" element={<ProtectedRoute allowedRole="professional"><ProjectsPage /></ProtectedRoute>} />
            <Route path="/experiencia" element={<ProtectedRoute allowedRole="professional"><Experience /></ProtectedRoute>} />
            <Route path="/certificaciones" element={<ProtectedRoute allowedRole="professional"><Certifications /></ProtectedRoute>} />
            <Route path="/visitantes" element={<ProtectedRoute allowedRole="professional"><ProfileVisitorsPage /></ProtectedRoute>} />
            <Route path="/portfolio" element={<ProtectedRoute allowedRole="professional"><PortfolioView /></ProtectedRoute>} />

            <Route path="/profile" element={<Navigate to="/profile/personal-data" replace />} />
            <Route path="/profile/personal-data" element={<ProtectedRoute allowedRole="professional"><PersonalData /></ProtectedRoute>} />
            <Route path="/profile/links" element={<ProtectedRoute allowedRole="professional"><Links /></ProtectedRoute>} />
            <Route path="/profile/privacy" element={<ProtectedRoute allowedRole="professional"><Privacy /></ProtectedRoute>} />
            <Route path="/profile/habilidades" element={<ProtectedRoute allowedRole="professional"><HabilidadesPage /></ProtectedRoute>} />

            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}

export default AppRouter
