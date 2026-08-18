import {
  FiMail,
  FiShield,
  FiUser,
} from 'react-icons/fi'

import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  const displayName =
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'User'

  const initial =
    displayName.charAt(0).toUpperCase()

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your ScamShield account information.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-5">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
                  {initial}
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {displayName}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  ScamShield protected account
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Account active
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <InfoCard
              icon={FiUser}
              label="Full name"
              value={displayName}
            />

            <InfoCard
              icon={FiMail}
              label="Email address"
              value={user?.email || 'Not available'}
            />

            <InfoCard
              icon={FiShield}
              label="Authentication"
              value={
                user?.providerData?.[0]?.providerId ===
                'google.com'
                  ? 'Google'
                  : 'Email & Password'
              }
            />

            <InfoCard
              icon={FiShield}
              label="Security status"
              value="Protected"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}