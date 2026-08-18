import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSun,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate()

  const {
    user,
    logout,
  } = useAuth()

  const {
    darkMode,
    toggleTheme,
  } = useTheme()

  const handleLogout = async () => {
    try {
      await logout()

      toast.success('You have been logged out.')

      navigate('/login', {
        replace: true,
      })
    } catch (error) {
      toast.error(
        error.message || 'Unable to log out.',
      )
    }
  }

  const displayName =
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'User'

  const initial =
    displayName.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-slate-800/80 bg-slate-950/95 px-4 backdrop-blur-md sm:px-6 lg:px-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-slate-700 p-2.5 text-slate-300 transition hover:bg-slate-800 lg:hidden"
          aria-label="Open navigation"
        >
          <FiMenu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Dashboard
          </h1>

          <p className="hidden text-sm text-slate-400 sm:block">
            Stay protected from digital scams.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <FiSun className="h-5 w-5" />
          ) : (
            <FiMoon className="h-5 w-5" />
          )}
        </button>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          aria-label="Notifications"
        >
          <FiBell className="h-5 w-5" />

          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-slate-950" />
        </button>

        <div className="hidden h-8 w-px bg-slate-800 sm:block" />

        <div className="group relative">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-900"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-sm font-bold text-blue-400">
                {initial}
              </div>
            )}

            <div className="hidden text-left md:block">
              <p className="max-w-28 truncate text-sm font-semibold text-white">
                {displayName}
              </p>

              <p className="text-xs text-slate-500">
                Protected
              </p>
            </div>

            <FiChevronDown className="hidden h-4 w-4 text-slate-500 md:block" />
          </button>

          <div className="invisible absolute right-0 top-full mt-2 w-56 translate-y-2 rounded-xl border border-slate-800 bg-slate-900 p-2 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div className="border-b border-slate-800 px-3 py-3">
              <p className="truncate text-sm font-semibold text-white">
                {displayName}
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                {user?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="mt-2 flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              My Profile
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
            >
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}