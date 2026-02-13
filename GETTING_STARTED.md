# Smart Bookmark App - Getting Started

Your Smart Bookmark App is ready! Follow these steps to get it running locally and deploy to Vercel.

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

#### Step 1: Create Supabase Project
- Go to [https://supabase.com](https://supabase.com)
- Sign up or log in
- Click "New Project"
- Fill in project name and password
- Select a region closest to you
- Click "Create new project" and wait for it to be ready

#### Step 2: Get Your Credentials
- Once your project is ready, go to **Settings → API**
- Copy your `Project URL` and save it
- Copy the `anon public` key and save it

#### Step 3: Set Up Database Tables
1. Go to the Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Paste the following SQL code and click **Run**:

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

-- RLS Policy: Users can only read their own bookmarks
CREATE POLICY "Users can read own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

#### Step 4: Enable Google OAuth
1. In Supabase Dashboard, go to **Authentication → Providers**
2. Find **Google** and click it
3. You'll see a form to enter OAuth credentials
4. Leave this open for now - you'll configure it in the next step

#### Step 5: Set Up Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown at the top, then **New Project**
3. Enter "Smart Bookmarks" as the project name and click **Create**
4. Wait for the project to be created
5. Go to **APIs & Services → Enable APIs and Services**
6. Search for "Google+ API" and enable it
7. Go to **APIs & Services → OAuth consent screen**
8. Select **External** and click **Create**
9. Fill in the form:
   - **App name**: Smart Bookmarks
   - **User support email**: Your email
   - **Developer contact**: Your email
   - Click **Save and continue**
10. Skip the scopes section, click **Save and continue**
11. Click **Save and continue** again
12. Go to **APIs & Services → Credentials**
13. Click **+ Create Credentials → OAuth client ID**
14. Choose **Web application**
15. Under "Authorized redirect URIs", click **Add URI** and add:
    - `http://localhost:3000/auth/v1/callback?provider=google`
    - `https://YOUR_SUPABASE_URL/auth/v1/callback?provider=google` (replace YOUR_SUPABASE_URL)
16. Click **Create**
17. Copy your **Client ID** and **Client Secret**
18. Go back to Supabase → **Authentication → Providers → Google**
19. Paste your Client ID and Client Secret
20. Click **Save**

**Important**: Make sure to add BOTH redirect URIs in Google Console - one for localhost (development) and one for your Supabase URL (production).

### 3. Create Environment File

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace with your actual values from Supabase.

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and sign in with Google!

### 5. Test Real-Time Updates

- Open the app in two browser tabs
- Add a bookmark in one tab
- It should appear instantly in the other tab without refreshing

---

## Deploy to Vercel

### Prerequisites

- GitHub account (to push your code)
- Vercel account

### Deployment Steps

#### 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Smart Bookmark App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmark-app.git
git push -u origin main
```

#### 2. Deploy on Vercel

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to [https://vercel.com](https://vercel.com)
2. Click **Add New... → Project**
3. Select your GitHub repository
4. Click **Import**
5. In "Environment Variables", add:
   - Name: `NEXT_PUBLIC_SUPABASE_URL` → Value: Your Supabase URL
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: Your Supabase anon key
6. Click **Deploy**
7. Wait for deployment to complete

**Option B: Using Vercel CLI**

```bash
npm install -g vercel
vercel
```

Follow the CLI prompts to link your account and deploy.

#### 3. Update Google OAuth for Production

Once you have your Vercel URL (e.g., `https://smart-bookmark.vercel.app`):

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Go to **APIs & Services → Credentials**
3. Click your OAuth Client ID
4. Under "Authorized redirect URIs", click **Add URI** and add:
   - `https://your-vercel-url.vercel.app/auth/v1/callback?provider=google`
5. Click **Save**

#### 4. Update Supabase Site URL

1. Go to your Supabase Project Dashboard
2. Click **Settings → General**
3. Update "Site URL" to your Vercel URL: `https://your-vercel-url.vercel.app`
4. Click **Save**

#### 5. Test Production App

- Visit your Vercel URL
- Sign in with Google
- Add bookmarks and test real-time sync

---

## File Structure

```
smart-bookmark-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   ├── page.tsx            # Main dashboard
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── auth/
│   │       └── callback/
│   │           └── page.tsx    # OAuth callback handler
│   ├── components/
│   │   ├── AddBookmarkForm.tsx # Add bookmark form
│   │   ├── BookmarkList.tsx    # Display bookmarks
│   │   ├── LoginButton.tsx     # Login button
│   │   └── UserHeader.tsx      # User info & logout
│   └── lib/
│       ├── auth.ts             # Authentication functions
│       ├── bookmarks.ts        # Bookmark CRUD & realtime
│       └── supabase.ts         # Supabase client setup
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md
```

## Features

- ✅ Google OAuth login (no email/password)
- ✅ Add bookmarks with title and URL
- ✅ Private bookmarks (each user only sees their own)
- ✅ Real-time updates across tabs/windows
- ✅ Delete bookmarks
- ✅ Responsive design
- ✅ Production-ready Vercel deployment

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` file exists in the root directory
- Check that both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

### OAuth redirect not working
- Verify redirect URIs are correctly set in Google Cloud Console
- Check that `NEXT_PUBLIC_SUPABASE_URL` matches your Supabase project
- Make sure the URL ends without a trailing slash if needed

### Real-time updates not working
- Verify RLS (Row Level Security) is enabled on the bookmarks table
- Check that the SQL `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;` was executed
- Try refreshing the page

### Can see other users' bookmarks
- This means RLS policies aren't working
- Re-run the SQL setup, especially the RLS policy sections
- Make sure `ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;` was executed

## Support

For more details, see:
- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Advanced deployment guide
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

## Next Steps (Optional Enhancements)

- Add bookmark categories/tags
- Add search functionality
- Add bookmark editing
- Add dark mode
- Add import/export bookmarks
- Add bookmark sync to multiple devices
- Add social sharing

Happy bookmarking! 🎉
