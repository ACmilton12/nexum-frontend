import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../../pages/admin/components/Sidebar'
import RightWidgets from '../ui/RightWidgets'
import Breadcrumb from '../ui/Breadcrumb'

const MainLayout = () => {
  const location = useLocation()

  const pathnames = location.pathname.split('/').filter((x) => x)
  const breadcrumbSteps = [
    { label: 'Home', path: '/' },
    ...pathnames.map((value, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`
      return { label: value.charAt(0).toUpperCase() + value.slice(1), path }
    })
  ]

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#e9eef5',
        overflow: 'hidden'
      }}
    >
      {/* Columna 1: Sidebar Fijo */}
      <Sidebar activeItem={pathnames[0] || 'Dashboard'} />

      {/* Columna 2: Centro (Scrollable) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <Breadcrumb steps={breadcrumbSteps} />
        <main style={{ padding: '20px', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      {/* Columna 3: Widgets fijos o scrollable */}
      <RightWidgets />
    </div>
  )
}

export default MainLayout
