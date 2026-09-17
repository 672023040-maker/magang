import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/layout/AdminLayout'
import { AuthProvider } from './contexts/AuthProvider'
import { AuthGuard } from './guards/AuthGuard'
import { DashboardPage } from './pages/admin/DashboardPage'
import { InformasiPage } from './pages/admin/InformasiPage'
import { KontakPage } from './pages/admin/KontakPage'
import { LoginPage } from './pages/admin/LoginPage'
import { PesanMasukPage } from './pages/admin/PesanMasukPage'
import { ProfilPage } from './pages/admin/ProfilPage'
import { ProjectPage } from './pages/admin/ProjectPage'
import { StrukturPage } from './pages/admin/StrukturPage'
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
            <Route path="informasi" element={<InformasiPage />} />
            <Route path="project" element={<ProjectPage />} />
            <Route path="kontak" element={<KontakPage />} />
            <Route path="pesan" element={<PesanMasukPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App