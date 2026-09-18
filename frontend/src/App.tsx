import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/layout/AdminLayout'
import { AuthProvider } from './contexts/AuthProvider'
import { AuthGuard } from './guards/AuthGuard'
import { DashboardPage } from './pages/admin/DashboardPage'
import { LoginPage } from './pages/admin/LoginPage'
import { ProfilPage } from './pages/admin/ProfilPage'
import { ProjectPage } from './pages/admin/ProjectPage'
import { StrukturPage } from './pages/admin/StrukturPage'
import { KontakPage } from './pages/admin/KontakPage'
import { ChangePasswordPage } from './pages/admin/ChangePasswordPage'
import { DevicesPage } from './pages/admin/DevicesPage'
import { HomePage } from './pages/public/HomePage'
import { NotFoundPage } from './pages/public/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <AuthGuard>
                <AdminLayout />
              </AuthGuard>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="profil" element={<ProfilPage />} />
            <Route path="struktur" element={<StrukturPage />} />
            <Route path="project" element={<ProjectPage />} />
            <Route path="kontak" element={<KontakPage />} />
            <Route path="ganti-password" element={<ChangePasswordPage />} />
            <Route path="perangkat" element={<DevicesPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App