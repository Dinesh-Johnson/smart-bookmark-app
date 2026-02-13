'use client'

import { useState } from 'react'
import { addBookmark } from '@/lib/bookmarks'

export default function AddBookmarkForm({ onBookmarkAdded }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !url.trim()) {
      setError('Please fill in all fields')
      return
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    try {
      await addBookmark(title, url)
      setTitle('')
      setUrl('')
      onBookmarkAdded()
    } catch (err) {
      setError('Failed to add bookmark')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Add New Bookmark</h2>
      {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </div>
    </form>
  )
}
