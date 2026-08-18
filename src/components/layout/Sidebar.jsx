import {
  FiActivity,
  FiClock,
  FiGrid,
  FiImage,
  FiLogOut,
  FiMessageSquare,
  FiSettings,
  FiShield,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

const navigation = [
  {
    label: 'Dashboard',
    path: '/',
    icon: FiGrid,
  },
  {
    label: 'Scan SMS',
    path: '/scan/sms',
    icon: FiMessageSquare,
  },
  {
    label: 'Upload Screenshot',
    path: '/scan/image',
    icon: FiImage,
  },
  {
    label: 'Scan History',
    path: '/history',
    icon: FiClock,
  },
]

const accountNavigation = [
  {
    label: 'Profile',
    path: '/profile',
    icon: FiUser,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: FiSettings,
  },
]

function SidebarLink({ item, onNavigate }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      end={item.path === '/'}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
          isActive
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
        ].join(' ')
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />

      <span>{item.label}</span>
    </NavLink>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950',
          isOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <FiShield className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                ScamShield
              </h1>

              <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                AI PROTECTION
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div>
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Protection
            </p>

            <nav className="space-y-1.5">
              {navigation.map((item) => (
                <SidebarLink
                  key={item.path}
                  item={item}
                  onNavigate={onClose}
                />
              ))}
            </nav>
          </div>

          <div className="mt-8">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Account
            </p>

            <nav className="space-y-1.5">
              {accountNavigation.map((item) => (
                <SidebarLink
                  key={item.path}
                  item={item}
                  onNavigate={onClose}
                />
              ))}
            </nav>
          </div>

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                <FiActivity className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                  AI Protection
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-300">
                  Analyze suspicious messages before you respond.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400"
          >
            <FiLogOut className="h-[18px] w-[18px]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}