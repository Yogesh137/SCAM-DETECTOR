import { useEffect, useState } from 'react'
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiLoader,
  FiShield,
} from 'react-icons/fi'

import { useAuth } from '../../context/AuthContext'
import { getScanHistory } from '../../services/scanService'

export default function ScanHistory() {
  const { user } = useAuth()

  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadHistory() {
      try {
        setLoading(true)
        setError('')

        const data = await getScanHistory(
          user.uid,
        )

        if (mounted) {
          setScans(data)
        }
      } catch (err) {
        console.error(err)

        if (mounted) {
          setError(
            'Unable to load your scan history.',
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    if (user?.uid) {
      loadHistory()
    }

    return () => {
      mounted = false
    }
  }, [user?.uid])

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Security Activity
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            Scan History
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Review messages you've previously analyzed.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <FiLoader className="h-7 w-7 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        ) : scans.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => (
              <HistoryCard
                key={scan.id}
                scan={scan}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function EmptyHistory() {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <FiShield className="h-7 w-7" />
      </div>

      <h2 className="mt-5 font-semibold text-slate-900 dark:text-white">
        No scans yet
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        Messages you scan will automatically appear
        here.
      </p>
    </div>
  )
}

function HistoryCard({ scan }) {
  const isHigh = scan.riskLevel === 'High'
  const isMedium =
    scan.riskLevel === 'Medium'

  const Icon = isHigh
    ? FiAlertTriangle
    : FiCheckCircle

  const date = scan.createdAt
    ? new Date(scan.createdAt).toLocaleString(
        'en-IN',
        {
          dateStyle: 'medium',
          timeStyle: 'short',
        },
      )
    : 'Just now'
  {scan.category && (
    <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        {scan.category}
    </span>
  )}  

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isHigh
                ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                : isMedium
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="line-clamp-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {scan.text}
            </p>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <FiClock className="h-3.5 w-3.5" />
              {date}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              isHigh
                ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                : isMedium
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
            }`}
          >
            {scan.riskLevel}
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {scan.score}
            </p>

            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              Risk
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}