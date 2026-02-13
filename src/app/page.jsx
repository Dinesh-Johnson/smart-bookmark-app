'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserBookmarks } from '@/lib/bookmarks'
import UserHeader from '@/components/UserHeader'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import BookmarkList from '@/components/BookmarkList'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)
      
      // Load bookmarks
      const userBookmarks = await getUserBookmarks()
      setBookmarks(userBookmarks)
      
      // Subscribe to real-time updates
      const subscription = supabase
        .channel(`bookmarks-${session.user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${session.user.id}`,
          },
          async () => {
            const updated = await getUserBookmarks()
            setBookmarks(updated)
          }
        )
        .subscribe()

      setLoading(false)

      return () => {
        subscription.unsubscribe()
      }
    }

    checkAuth()
  }, [router])

  const handleBookmarkAdded = async () => {
    const updated = await getUserBookmarks()
    setBookmarks(updated)
  }

  const handleBookmarkDeleted = async () => {
    const updated = await getUserBookmarks()
    setBookmarks(updated)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <UserHeader email={user?.email} />
        <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} />
        <BookmarkList bookmarks={bookmarks} onBookmarkDeleted={handleBookmarkDeleted} />
      </div>
    </main>
  )
}
