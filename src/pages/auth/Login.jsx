import { useState } from 'react'
import {
  FiAlertTriangle,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
} from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    login,
    loginWithGoogle,
  } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [googleLoading, setGoogleLoading] =
    useState(false)

  const redirectPath =
    location.state?.from?.pathname || '/'

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim() || !password) {
      toast.error(
        'Please enter your email and password.',
      )
      return
    }

    setLoading(true)

    try {
      await login(email, password)

      toast.success('Welcome back to ScamShield!')

      navigate(redirectPath, {
        replace: true,
      })
    } catch (error) {
      toast.error(
        error.message ||
          'Unable to sign in. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)

    try {
      await loginWithGoogle()

      toast.success('Signed in with Google.')

      navigate(redirectPath, {
        replace: true,
      })
    } catch (error) {
      toast.error(
        error.message ||
          'Google sign-in failed.',
      )
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue protecting yourself from scams."
    >
      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <FiShield className="h-6 w-6" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign in
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Access your ScamShield security dashboard.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading || loading}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <FcGoogle className="h-5 w-5" />

        {googleLoading
          ? 'Connecting...'
          : 'Continue with Google'}
      </button>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

        <span className="text-xs font-medium text-slate-400">
          OR
        </span>

        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Email address
          </label>

          <div className="relative">
            <FiMail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={loading}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>

            <button
              type="button"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              onClick={() =>
                toast('Password reset will be added next.')
              }
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <FiLock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="password"
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              disabled={loading}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? (
                <FiEyeOff className="h-4 w-4" />
              ) : (
                <FiEye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? 'Signing in...'
            : 'Sign in'}

          {!loading && (
            <FiArrowRight className="h-4 w-4" />
          )}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Create one
        </Link>
      </p>

      <div className="mt-8 flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />

        <p className="text-xs leading-5 text-amber-700 dark:text-amber-300">
          ScamShield helps identify potential scams.
          Always verify important requests through
          official channels.
        </p>
      </div>
    </AuthShell>
  )
}

function AuthShell({
  title,
  subtitle,
  children,
}) {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-blue-600 p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/40 blur-3xl" />

          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-blue-800/50 blur-3xl" />

          <div className="relative">
            <Link
              to="/login"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600">
                <FiShield className="h-6 w-6" />
              </div>

              <div>
                <p className="text-lg font-bold text-white">
                  ScamShield
                </p>

                <p className="text-[10px] font-semibold tracking-wider text-blue-100">
                  AI PROTECTION
                </p>
              </div>
            </Link>
          </div>

          <div className="relative max-w-lg">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-100">
              Your digital safety layer
            </p>

            <h2 className="text-5xl font-bold leading-tight tracking-tight text-white">
              Stop. Check. Stay safe.
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-blue-100">
              Use AI-powered analysis to identify
              suspicious messages, phishing attempts,
              fake offers, and other common scam patterns.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <SecurityFeature
                value="AI"
                label="Detection"
              />

              <SecurityFeature
                value="OCR"
                label="Screenshots"
              />

              <SecurityFeature
                value="24/7"
                label="Protection"
              />
            </div>
          </div>

          <p className="relative text-xs text-blue-200">
            ScamShield AI · Security awareness platform
          </p>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <FiShield className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    ScamShield
                  </p>

                  <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                    AI PROTECTION
                  </p>
                </div>
              </div>
            </div>

            {children}
          </div>
        </div>
      </div>
    </main>
  )
}

function SecurityFeature({
  value,
  label,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
      <p className="text-lg font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-blue-100">
        {label}
      </p>
    </div>
  )
}