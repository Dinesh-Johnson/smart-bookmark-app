'use client'

import { useState } from 'react'
import { deleteBookmark } from '@/lib/bookmarks'

export default function BookmarkList({ bookmarks, onBookmarkDeleted }) {
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return
    }

    setDeleting(id)
    try {
      await deleteBookmark(id)
      onBookmarkDeleted()
    } catch (error) {
      console.error('Failed to delete bookmark:', error)
      alert('Failed to delete bookmark')
    } finally {
      setDeleting(null)
    }
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No bookmarks yet. Add your first bookmark!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {bookmark.title}
              </h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm truncate block"
                title={bookmark.url}
              >
                {bookmark.url}
              </a>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(bookmark.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(bookmark.id)}
              disabled={deleting === bookmark.id}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 whitespace-nowrap"
            >
              {deleting === bookmark.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
