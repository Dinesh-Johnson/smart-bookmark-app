import { supabase } from './supabase'

export const addBookmark = async (title, url) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])
    .select()

  if (error) {
    console.error('Error adding bookmark:', error)
    throw error
  }

  return data[0]
}

export const getUserBookmarks = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookmarks:', error)
    throw error
  }

  return data || []
}

export const deleteBookmark = async (id) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting bookmark:', error)
    throw error
  }
}

export const subscribeToBookmarks = async (callback) => {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const subscription = supabase
    .channel(`bookmarks-${user.id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookmarks',
        filter: `user_id=eq.${user.id}`,
      },
      async () => {
        const bookmarks = await getUserBookmarks()
        callback(bookmarks)
      }
    )
    .subscribe()

  return subscription
}
