import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useUserStore } from './store/useUserStore'
import { AuthGate } from './components/AuthGate'
import { Navigation } from './components/Navigation'
import { DashboardPage } from './pages/DashboardPage'
import { LogTrainingPage } from './pages/LogTrainingPage'
import { TeamPage } from './pages/TeamPage'
import { TeamManagementPage } from './pages/TeamManagementPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'

function App() {
  const initialize = useUserStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={
          <AuthGate>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/log" element={<LogTrainingPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/manage-team" element={<TeamManagementPage />} />
                </Routes>
              </main>
            </div>
          </AuthGate>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
