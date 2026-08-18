import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'

import {
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import {
  auth,
  db,
  googleProvider,
} from '../config/firebase'

const AuthContext = createContext(null)

function getFriendlyAuthError(error) {
  const errorCode = error?.code || ''

  const messages = {
    'auth/email-already-in-use':
      'An account already exists with this email address.',

    'auth/invalid-email':
      'Please enter a valid email address.',

    'auth/weak-password':
      'Password must be at least 6 characters long.',

    'auth/invalid-credential':
      'Invalid email or password.',

    'auth/user-not-found':
      'No account was found with this email address.',

    'auth/wrong-password':
      'Invalid email or password.',

    'auth/popup-closed-by-user':
      'Google sign-in was cancelled.',

    'auth/popup-blocked':
      'The Google sign-in popup was blocked by your browser.',

    'auth/network-request-failed':
      'Network error. Please check your internet connection.',

    'auth/too-many-requests':
      'Too many attempts. Please wait a moment and try again.',
  }

  return (
    messages[errorCode] ||
    error?.message ||
    'Something went wrong. Please try again.'
  )
}

async function createUserDocument(user, additionalData = {}) {
  if (!user) {
    return
  }

  const userRef = doc(db, 'users', user.uid)

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email || '',
      displayName:
        user.displayName ||
        additionalData.displayName ||
        '',
      photoURL: user.photoURL || '',
      provider:
        additionalData.provider ||
        'password',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  )
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe

    const initializeAuth = async () => {
      try {
        await setPersistence(
          auth,
          browserLocalPersistence,
        )

        unsubscribe = onAuthStateChanged(
          auth,
          async (currentUser) => {
            setUser(currentUser)
            setLoading(false)

            if (currentUser) {
              try {
                await createUserDocument(currentUser)
              } catch (error) {
                console.error(
                  'Unable to synchronize user profile:',
                  error,
                )
              }
            }
          },
        )
      } catch (error) {
        console.error(
          'Firebase authentication initialization failed:',
          error,
        )

        setLoading(false)
      }
    }

    initializeAuth()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const register = useCallback(
    async (name, email, password) => {
      try {
        const credential =
          await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password,
          )

        await updateProfile(credential.user, {
          displayName: name.trim(),
        })

        await createUserDocument(credential.user, {
          displayName: name.trim(),
          provider: 'password',
        })

        return credential.user
      } catch (error) {
        throw new Error(getFriendlyAuthError(error))
      }
    },
    [],
  )

  const login = useCallback(async (email, password) => {
    try {
      const credential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        )

      return credential.user
    } catch (error) {
      throw new Error(getFriendlyAuthError(error))
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    try {
      const credential =
        await signInWithPopup(
          auth,
          googleProvider,
        )

      await createUserDocument(credential.user, {
        provider: 'google',
      })

      return credential.user
    } catch (error) {
      throw new Error(getFriendlyAuthError(error))
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await signOut(auth)
    } catch (error) {
      throw new Error(getFriendlyAuthError(error))
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      register,
      login,
      loginWithGoogle,
      logout,
    }),
    [
      user,
      loading,
      register,
      login,
      loginWithGoogle,
      logout,
    ],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    )
  }

  return context
}