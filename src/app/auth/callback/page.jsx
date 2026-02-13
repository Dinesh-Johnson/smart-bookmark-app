'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The session should be set after OAuth redirect
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          router.push('/')
        } else {
          // If no session, redirect back to login
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login')
      }
    }

    // Add a small delay to ensure auth state is updated
    const timer = setTimeout(handleCallback, 1000)
    
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Completing sign in...</p>
    </div>
  )
}
