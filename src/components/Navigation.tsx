import { Link, useLocation } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'

export function Navigation() {
  const { profile, signOut } = useUserStore()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-white">
              HYROX Tracker
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/log"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/log')
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                Log Training
              </Link>
              <Link
                to="/team"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/team')
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                Team
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {profile?.full_name && (
              <span className="text-gray-300 text-sm hidden sm:block">
                {profile.full_name}
              </span>
            )}
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden pb-3 flex space-x-2">
          <Link
            to="/"
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium text-center transition-colors ${
              isActive('/')
                ? 'bg-white/20 text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/log"
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium text-center transition-colors ${
              isActive('/log')
                ? 'bg-white/20 text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            Log
          </Link>
          <Link
            to="/team"
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium text-center transition-colors ${
              isActive('/team')
                ? 'bg-white/20 text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            Team
          </Link>
        </div>
      </div>
    </nav>
  )
}
