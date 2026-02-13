# Smart Bookmark App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Sign in with Google OAuth, save bookmarks, and see updates in real-time across multiple tabs.

## Features

- ✅ Google OAuth authentication (no email/password)
- ✅ Add bookmarks with title and URL
- ✅ Private bookmarks (users only see their own)
- ✅ Real-time updates across tabs/windows
- ✅ Delete bookmarks
- ✅ Clean, responsive UI with Tailwind CSS
- ✅ Deployed on Vercel

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Realtime)
- **Deployment**: Vercel

## Prerequisites

Before you begin, you need:

1. A [Supabase](https://supabase.com) account
2. A [Google Cloud Console](https://console.cloud.google.com) project
3. A [Vercel](https://vercel.com) account (for deployment)

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Create a new project
3. Wait for the project to be ready
4. Go to **Settings → API** to find your credentials:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Create Database Tables

1. In Supabase, go to **SQL Editor** → **New Query**
2. Run this SQL to create the bookmarks table:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: users can only read their own bookmarks
CREATE POLICY "Users can read own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: users can only insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

3. Execute the query

#### Set Up Google OAuth

1. In Supabase Dashboard, go to **Authentication → Providers**
2. Find **Google** and enable it
3. You'll need Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials (OAuth consent screen → Create credentials → OAuth client ID → Web application)
   - Add authorized redirect URIs:
     - `https://YOUR_SUPABASE_URL/auth/v1/callback?provider=google` (production)
     - `http://localhost:3000/auth/v1/callback?provider=google` (development)
4. Copy your Google Client ID and Client Secret
5. Paste them into the Supabase Google provider settings
6. Click **Save**

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

You can copy `.env.local.example` as a starting point:

```bash
cp .env.local.example .env.local
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and sign in with Google.

### 5. Deploy to Vercel

#### Using Vercel CLI

```bash
npm install -g vercel
vercel
```

#### Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add the same environment variables from `.env.local`
5. Deploy

#### Set Up Google OAuth for Production

1. In Google Cloud Console, update the authorized redirect URIs:
   - Add: `https://YOUR_VERCEL_URL/auth/v1/callback?provider=google`
2. In Supabase, add the new site URL:
   - Go to **Settings → General** and update "Site URL" to your Vercel URL

## Testing

### Test Real-Time Updates

1. Open your app in two browser tabs
2. Add a bookmark in one tab
3. Watch it appear instantly in the other tab without refreshing

### Test User Isolation

1. Sign in as User A and add bookmarks
2. Open an incognito window and sign in as User B
3. Verify User B cannot see User A's bookmarks

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Global styles
│   ├── page.tsx            # Main dashboard
│   ├── login/
│   │   └── page.tsx        # Login page
│   └── auth/
│       └── callback/
│           └── page.tsx    # OAuth callback
├── components/
│   ├── AddBookmarkForm.tsx # Add bookmark form
│   ├── BookmarkList.tsx    # Display bookmarks
│   ├── LoginButton.tsx     # Login button
│   └── UserHeader.tsx      # User info & logout
└── lib/
    ├── auth.ts             # Authentication functions
    ├── bookmarks.ts        # Bookmark CRUD & realtime
    └── supabase.ts         # Supabase client
```

## API Documentation

### Authentication

- **signInWithGoogle()**: Redirects to Google OAuth
- **signOut()**: Signs out the user
- **getCurrentUser()**: Gets current user info

### Bookmarks

- **addBookmark(title, url)**: Adds a new bookmark
- **getUserBookmarks()**: Fetches user's bookmarks
- **deleteBookmark(id)**: Deletes a bookmark
- **subscribeToBookmarks(callback)**: Real-time updates

## Troubleshooting

### "Missing Supabase environment variables"

Make sure you've created `.env.local` with the correct keys from Supabase.

### OAuth redirect loop

1. Verify your redirect URIs are correct in Google Console
2. Check that `NEXT_PUBLIC_SUPABASE_URL` ends with `/` (if needed)
3. In Supabase, ensure Site URL matches your domain

### Real-time updates not working

1. Verify Row Level Security (RLS) policies are enabled on the bookmarks table
2. Check that `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;` was executed
3. Make sure the Realtime feature is enabled in Supabase

### Can see other users' bookmarks

This indicates RLS is not enabled. Re-run the SQL setup, especially:

```sql
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
```

## License

MIT
