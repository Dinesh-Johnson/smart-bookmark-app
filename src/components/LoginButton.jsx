'use client'

import { signInWithGoogle } from '@/lib/auth'

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Login error:', error)
      alert('Failed to sign in with Google')
    }
  }

  return (
    <button
      onClick={handleLogin}
      className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
    >
      Sign in with Google
    </button>
  )
}
