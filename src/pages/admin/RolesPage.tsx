import useAuth from '../../hooks/useAuth'
import DashboardAdmin from './DashboardAdmin'
import DashboardProfessional from './DashboardProfessional'

const RolesPage = () => {
  const { isAdmin } = useAuth()

  if (isAdmin) {
    return <DashboardAdmin />
  }

  return <DashboardProfessional />
}

export default RolesPage
