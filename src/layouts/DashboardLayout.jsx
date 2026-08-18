import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-72">
        <Navbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="min-h-[calc(100vh-6rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}