import { useEffect, useState } from 'react'
import {
  Navigate,
  Route,
  Routes,
  Link,
} from 'react-router-dom'
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRight,
  FiCheckCircle,
  FiImage,
  FiLoader,
  FiMessageSquare,
  FiShield,
} from 'react-icons/fi'

import Profile from './pages/profile/Profile'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import ScanSMS from './pages/scan/ScanSMS'
import ScanHistory from './pages/history/ScanHistory'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import UploadScreenshot from './pages/scan/UploadScreenshot'

import { useAuth } from './context/AuthContext'
import { getScanAnalytics } from './services/scanService'


function Dashboard() {
  const { user } = useAuth()

  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadAnalytics() {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const data = await getScanAnalytics(user.uid)

        if (mounted) {
          setAnalytics(data)
        }
      } catch (err) {
        console.error(
          'Dashboard analytics error:',
          err,
        )

        if (mounted) {
          setError(
            'Unable to load dashboard analytics.',
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadAnalytics()

    return () => {
      mounted = false
    }
  }, [user?.uid])

  if (loading) {
    return (
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <FiLoader className="h-5 w-5 animate-spin text-blue-500" />
            Loading your security dashboard...
          </div>
        </div>
      </section>
    )
  }

  const stats = [
    {
      label: 'Total Scans',
      value: analytics?.totalScans ?? 0,
      icon: FiShield,
      description: 'Messages analyzed',
    },
    {
      label: 'Threats Detected',
      value: analytics?.scamsDetected ?? 0,
      icon: FiAlertTriangle,
      description: 'High & critical risks',
    },
    {
      label: 'Safe Messages',
      value: analytics?.safeScans ?? 0,
      icon: FiCheckCircle,
      description: 'Low-risk scans',
    },
    {
      label: 'Average Risk',
      value: `${analytics?.averageRiskScore ?? 0}/100`,
      icon: FiActivity,
      description: 'Across all scans',
    },
  ]

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            Welcome to ScamShield AI
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your digital safety dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Detect suspicious messages, analyze screenshots,
            and stay protected with AI-powered scam detection.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {stat.description}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Scan Actions + Protection */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Start a security scan
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Choose how you want to check suspicious content.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <Link
                to="/scan/sms"
                className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:hover:border-blue-700"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-950/40">
                  💬
                </div>

                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Scan SMS
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Analyze a suspicious SMS or message with AI.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Start scan →
                </span>
              </Link>

              <Link
                to="/scan/image"
                className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:hover:border-blue-700"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-950/40">
                  🖼️
                </div>

                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Upload Screenshot
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Extract text from a screenshot and analyze it.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Upload image →
                </span>
              </Link>

            </div>
          </div>

          {/* Protection */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg dark:bg-emerald-900/30">
                🛡️
              </div>

              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Protection Status
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time security
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Protection Active
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-emerald-700/80 dark:text-emerald-300/80">
                ScamShield AI is ready to analyze suspicious content.
              </p>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <StatusItem label="AI Detection" />
              <StatusItem label="OCR Analysis" />
              <StatusItem label="Scan History" />
            </div>

          </div>
        </div>

        {/* Analytics */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <RiskDistribution
            analytics={analytics}
          />

          <ScanMethods
            analytics={analytics}
          />

        </div>

        {/* Recent Scans */}
        <div className="mt-8">
          <RecentScans
            scans={analytics?.recentScans || []}
          />
        </div>

      </div>
    </section>
  )
}


/* -------------------------------- */
/* Risk Distribution */
/* -------------------------------- */

function RiskDistribution({ analytics }) {
  const total = analytics?.totalScans || 0

  const levels = [
    {
      label: 'Critical',
      value: analytics?.criticalScans || 0,
    },
    {
      label: 'High',
      value: analytics?.highRiskScans || 0,
    },
    {
      label: 'Medium',
      value: analytics?.mediumRiskScans || 0,
    },
    {
      label: 'Low',
      value: analytics?.lowRiskScans || 0,
    },
  ]

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">
          Risk Distribution
        </h2>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Breakdown of your analyzed messages.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {levels.map((level) => {
          const percentage =
            total > 0
              ? Math.round(
                  (level.value / total) * 100,
                )
              : 0

          return (
            <div key={level.label}>

              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${getRiskDot(level.label)}`}
                  />

                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {level.label}
                  </span>
                </div>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {level.value} ({percentage}%)
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${getRiskBar(level.label)}`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}


/* -------------------------------- */
/* Scan Methods */
/* -------------------------------- */

function ScanMethods({ analytics }) {
  const total = analytics?.totalScans || 0

  const sms = analytics?.smsScans || 0
  const screenshots =
    analytics?.screenshotScans || 0

  const smsPercentage =
    total > 0
      ? Math.round((sms / total) * 100)
      : 0

  const screenshotPercentage =
    total > 0
      ? Math.round(
          (screenshots / total) * 100,
        )
      : 0

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <h2 className="font-semibold text-slate-900 dark:text-white">
        Scan Methods
      </h2>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        How you're using ScamShield.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-950">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <FiMessageSquare />
          </div>

          <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            {sms}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            SMS scans
          </p>

          <p className="mt-2 text-xs font-medium text-blue-500">
            {smsPercentage}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-950">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
            <FiImage />
          </div>

          <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            {screenshots}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Screenshot scans
          </p>

          <p className="mt-2 text-xs font-medium text-violet-500">
            {screenshotPercentage}%
          </p>
        </div>

      </div>
    </div>
  )
}


/* -------------------------------- */
/* Recent Scans */
/* -------------------------------- */

function RecentScans({ scans }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">

        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Recent Scans
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Your latest security checks.
          </p>
        </div>

        <Link
          to="/history"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          View all
          <FiArrowRight className="h-3.5 w-3.5" />
        </Link>

      </div>

      {scans.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <FiShield className="h-6 w-6" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
            No scans yet
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500 dark:text-slate-400">
            Scan an SMS or upload a screenshot to
            start building your security history.
          </p>

          <Link
            to="/scan/sms"
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
          >
            Scan a Message
          </Link>

        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">

          {scans.map((scan) => (
            <RecentScanItem
              key={scan.id}
              scan={scan}
            />
          ))}

        </div>
      )}
    </div>
  )
}


/* -------------------------------- */
/* Recent Scan Item */
/* -------------------------------- */

function RecentScanItem({ scan }) {
  const dangerous =
    scan.riskLevel === 'High' ||
    scan.riskLevel === 'Critical'

  const riskClass =
    scan.riskLevel === 'Critical'
      ? 'text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400'
      : scan.riskLevel === 'High'
        ? 'text-orange-600 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400'
        : scan.riskLevel === 'Medium'
          ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400'
          : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400'

  return (
    <div className="flex items-center gap-4 px-6 py-4">

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          dangerous
            ? 'bg-red-50 text-red-500 dark:bg-red-950/30'
            : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30'
        }`}
      >
        {scan.source === 'screenshot' ? (
          <FiImage className="h-4 w-4" />
        ) : (
          <FiMessageSquare className="h-4 w-4" />
        )}
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
          {scan.text || 'Scanned message'}
        </p>

        <div className="mt-1 flex items-center gap-2">

          <span className="text-[11px] text-slate-400">
            {scan.source === 'screenshot'
              ? 'Screenshot'
              : 'SMS'}
          </span>

          {scan.category && (
            <>
              <span className="text-slate-300">
                •
              </span>

              <span className="text-[11px] text-slate-400">
                {scan.category}
              </span>
            </>
          )}

        </div>
      </div>

      <div className="hidden text-right sm:block">

        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${riskClass}`}
        >
          {scan.riskLevel || 'Unknown'}
        </span>

        <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {scan.score ?? 0}/100
        </p>

      </div>
    </div>
  )
}


/* -------------------------------- */
/* Helpers */
/* -------------------------------- */

function getRiskDot(level) {
  switch (level) {
    case 'Critical':
      return 'bg-red-600'

    case 'High':
      return 'bg-orange-500'

    case 'Medium':
      return 'bg-amber-500'

    default:
      return 'bg-emerald-500'
  }
}

function getRiskBar(level) {
  switch (level) {
    case 'Critical':
      return 'bg-red-600'

    case 'High':
      return 'bg-orange-500'

    case 'Medium':
      return 'bg-amber-500'

    default:
      return 'bg-emerald-500'
  }
}


function StatusItem({ label }) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Ready
      </span>

    </div>
  )
}


function Placeholder({ title }) {
  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This feature will be implemented in the next module.
          </p>

        </div>
      </div>
    </section>
  )
}


/* -------------------------------- */
/* Routes */
/* -------------------------------- */

export default function App() {
  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route element={<ProtectedRoute />}>

        <Route element={<DashboardLayout />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/scan/sms"
            element={<ScanSMS />}
          />

          <Route
            path="/scan/image"
            element={<UploadScreenshot />}
          />

          <Route
            path="/history"
            element={<ScanHistory />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/settings"
            element={
              <Placeholder title="Settings" />
            }
          />

        </Route>

      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  )
}