import { useState } from 'react'
import {
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
} from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import {
  Link,
  useNavigate,
} from 'react-router-dom'
import toast from 'react-hot-toast'

import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()

  const {
    register,
    loginWithGoogle,
  } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [googleLoading, setGoogleLoading] =
    useState(false)

  const passwordValid = password.length >= 6
  const passwordsMatch =
    password.length > 0 &&
    password === confirmPassword

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!name.trim()) {
      toast.error('Please enter your name.')
      return
    }

    if (!email.trim()) {
      toast.error('Please enter your email.')
      return
    }

    if (!passwordValid) {
      toast.error(
        'Password must contain at least 6 characters.',
      )
      return
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await register(
        name,
        email,
        password,
      )

      toast.success(
        'Account created successfully!',
      )

      navigate('/', {
        replace: true,
      })
    } catch (error) {
      toast.error(
        error.message ||
          'Unable to create your account.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setGoogleLoading(true)

    try {
      await loginWithGoogle()

      toast.success(
        'Your Google account is connected.',
      )

      navigate('/', {
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative">
            <Link
              to="/register"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <FiShield className="h-6 w-6" />
              </div>

              <div>
                <p className="text-lg font-bold text-white">
                  ScamShield
                </p>

                <p className="text-[10px] font-semibold tracking-wider text-blue-400">
                  AI PROTECTION
                </p>
              </div>
            </Link>
          </div>

          <div className="relative max-w-lg">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-800/50 bg-blue-950/40 px-4 py-2 text-xs font-semibold text-blue-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              AI-powered security
            </div>

            <h2 className="text-5xl font-bold leading-tight tracking-tight text-white">
              Think twice before you click.
            </h2>

            <p className="mt-6 text-base leading-7 text-slate-400">
              ScamShield analyzes suspicious content and
              highlights the signals that could indicate
              fraud, phishing, or social engineering.
            </p>

            <div className="mt-8 space-y-4">
              <Benefit text="AI-powered scam detection" />
              <Benefit text="Screenshot text extraction with OCR" />
              <Benefit text="Risk scoring and scan history" />
            </div>
          </div>

          <p className="relative text-xs text-slate-500">
            ScamShield AI · Security awareness platform
          </p>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <FiShield className="h-6 w-6" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Start analyzing suspicious messages with
                ScamShield AI.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
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
              className="space-y-4"
            >
              <Field
                id="name"
                label="Full name"
                icon={FiUser}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={setName}
                autoComplete="name"
                disabled={loading}
              />

              <Field
                id="register-email"
                label="Email address"
                icon={FiMail}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                disabled={loading}
              />

              <PasswordField
                id="register-password"
                label="Password"
                value={password}
                onChange={setPassword}
                show={showPassword}
                onToggle={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                placeholder="At least 6 characters"
                autoComplete="new-password"
                disabled={loading}
              />

              <PasswordField
                id="confirm-password"
                label="Confirm password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showConfirmPassword}
                onToggle={() =>
                  setShowConfirmPassword(
                    (current) => !current,
                  )
                }
                placeholder="Repeat your password"
                autoComplete="new-password"
                disabled={loading}
              />

              <div className="space-y-2 pt-1">
                <PasswordRequirement
                  valid={passwordValid}
                  text="At least 6 characters"
                />

                <PasswordRequirement
                  valid={passwordsMatch}
                  text="Passwords match"
                />
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  googleLoading
                }
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'Creating account...'
                  : 'Create account'}

                {!loading && (
                  <FiArrowRight className="h-4 w-4" />
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">
              By creating an account, you agree to use
              ScamShield responsibly as a security
              awareness tool.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

function Field({
  id,
  label,
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  disabled,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          autoComplete={autoComplete}
          disabled={disabled}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>
    </div>
  )
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  autoComplete,
  disabled,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>

      <div className="relative">
        <FiLock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          autoComplete={autoComplete}
          disabled={disabled}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label={
            show
              ? 'Hide password'
              : 'Show password'
          }
        >
          {show ? (
            <FiEyeOff className="h-4 w-4" />
          ) : (
            <FiEye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}

function PasswordRequirement({
  valid,
  text,
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          'flex h-4 w-4 items-center justify-center rounded-full',
          valid
            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-slate-100 text-slate-400 dark:bg-slate-800',
        ].join(' ')}
      >
        <FiCheck className="h-2.5 w-2.5" />
      </span>

      <span className="text-xs text-slate-500 dark:text-slate-400">
        {text}
      </span>
    </div>
  )
}

function Benefit({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
        <FiCheck className="h-4 w-4" />
      </div>

      <span className="text-sm text-slate-300">
        {text}
      </span>
    </div>
  )
}