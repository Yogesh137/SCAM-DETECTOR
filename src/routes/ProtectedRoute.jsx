import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FiLoader } from 'react-icons/fi'

import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const {
    user,
    loading,
  } = useAuth()

  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <FiLoader className="h-5 w-5 animate-spin" />
          </div>

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading ScamShield...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    )
  }

  return <Outlet />
}