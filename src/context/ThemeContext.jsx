import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const stored =
      localStorage.getItem('scamshield-theme')

    if (stored) {
      return stored === 'dark'
    }

    return window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
  })

  useEffect(() => {
    const root = document.documentElement

    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem(
        'scamshield-theme',
        'dark',
      )
    } else {
      root.classList.remove('dark')
      localStorage.setItem(
        'scamshield-theme',
        'light',
      )
    }
  }, [darkMode])

  const toggleTheme = () => {
    setDarkMode((current) => !current)
  }

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider',
    )
  }

  return context
}