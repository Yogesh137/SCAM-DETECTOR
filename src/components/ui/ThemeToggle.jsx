import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
      }
      className="
        flex h-10 w-10 items-center justify-center
        rounded-xl
        border border-slate-200
        bg-white
        text-slate-600
        transition
        hover:bg-slate-100
        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-300
        dark:hover:bg-slate-800
      "
    >
      {isDark ? (
        <FiSun className="text-lg" />
      ) : (
        <FiMoon className="text-lg" />
      )}
    </button>
  )
}