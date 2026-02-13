'use client'

import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function UserHeader({ email }) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
      alert('Failed to sign out')
    }
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
      <div className="flex items-center gap-4">
        {email && <span className="text-gray-600">{email}</span>}
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
