import { useState } from 'react'
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiLoader,
  FiMessageSquare,
  FiShield,
} from 'react-icons/fi'
import toast from 'react-hot-toast'

import { useAuth } from '../../context/AuthContext'
import { analyzeScan } from '../../services/scanService'

export default function ScanSMS() {
  const { user } = useAuth()

  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleScan = async () => {
    if (!message.trim()) {
      toast.error(
        'Please enter an SMS message first.',
      )
      return
    }

    try {
      setLoading(true)
      setResult(null)

      const analysis = await analyzeScan(
        user.uid,
        message,
      )

      setResult(analysis)

      toast.success(
        'Message analyzed successfully.',
      )
    } catch (error) {
      console.error(error)

      toast.error(
        error.message ||
          'Unable to analyze the message.',
      )
    } finally {
      setLoading(false)
    }
  }

  const clearScan = () => {
    setMessage('')
    setResult(null)
  }

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Scam Detection
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Scan an SMS
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Paste a suspicious SMS below and ScamShield
            will analyze common scam indicators.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <FiMessageSquare className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    SMS Message
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Paste the complete message.
                  </p>
                </div>
              </div>

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Example: Your bank account will be blocked. Verify your KYC immediately by clicking this link..."
                rows={11}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  {message.length} characters
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={clearScan}
                    disabled={loading}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={handleScan}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FiShield className="h-4 w-4" />
                        Scan Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!result ? (
              <EmptyResult />
            ) : (
              <ScanResult result={result} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function EmptyResult() {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <FiShield className="h-7 w-7" />
      </div>

      <h3 className="mt-5 font-semibold text-slate-900 dark:text-white">
        Ready to scan
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
        Your scam detection result will appear here
        after you analyze a message.
      </p>
    </div>
  )
}

function ScanResult({ result }) {
  const isCritical =
    result.riskLevel === 'Critical'

  const isHigh =
    result.riskLevel === 'High'

  const isMedium =
    result.riskLevel === 'Medium'

  const isDangerous =
    isCritical || isHigh

  const Icon = isDangerous
    ? FiAlertTriangle
    : FiCheckCircle

  const scoreText = isCritical
    ? 'Critical Risk'
    : isHigh
      ? 'High Risk'
      : isMedium
        ? 'Medium Risk'
        : 'Low Risk'

  const riskClass = isCritical
    ? 'border-red-500/40'
    : isHigh
      ? 'border-red-500/30'
      : isMedium
        ? 'border-amber-500/30'
        : 'border-emerald-500/30'

  const iconClass = isDangerous
    ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
    : isMedium
      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
      : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            AI Risk Assessment
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            {scoreText}
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {result.category}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <div
          className={`flex h-40 w-40 flex-col items-center justify-center rounded-full border-[12px] ${riskClass}`}
        >
          <span className="text-4xl font-bold text-slate-900 dark:text-white">
            {result.score}
          </span>

          <span className="text-xs text-slate-500">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-7">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            AI Confidence
          </h3>

          <span className="text-sm font-semibold text-blue-500">
            {result.confidence}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{
              width: `${result.confidence}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-7">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          AI Analysis
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {result.summary}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Detected indicators
        </h3>

        <div className="mt-3 space-y-2">
          {result.reasons.length > 0 ? (
            result.reasons.map(
              (reason, index) => (
                <div
                  key={`${reason}-${index}`}
                  className="flex gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      isDangerous
                        ? 'bg-red-500'
                        : isMedium
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }`}
                  />

                  <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
                    {reason}
                  </p>
                </div>
              ),
            )
          ) : (
            <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              No significant suspicious indicators
              were identified.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
          Recommended action
        </p>

        <p className="mt-1 text-xs leading-5 text-blue-600 dark:text-blue-400">
          {result.recommendedAction}
        </p>
      </div>
    </div>
  )
}