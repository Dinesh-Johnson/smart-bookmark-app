# Deployment Guide

## Quick Deploy to Vercel

### Option 1: Using Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/smart-bookmark-app.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Click "Import"

3. **Add Environment Variables**
   - In the "Environment Variables" section, add:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://YOUR-PROJECT.vercel.app`

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from your project directory
vercel
```

Follow the prompts to:
- Link to your Vercel account
- Select or create a project
- Add environment variables
- Deploy

## Post-Deployment Setup

### 1. Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to "Credentials" → Your OAuth 2.0 Client ID
4. Add your Vercel URL to "Authorized redirect URIs":
   ```
   https://YOUR-PROJECT.vercel.app/auth/v1/callback?provider=google
   ```
5. Save changes

### 2. Update Supabase Site URL

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → General
4. Update "Site URL" to:
   ```
   https://YOUR-PROJECT.vercel.app
   ```
5. Save

### 3. Test the Live App

1. Visit `https://YOUR-PROJECT.vercel.app`
2. Sign in with Google
3. Add a bookmark
4. Open the app in another tab to verify real-time sync works

## Production Best Practices

1. **Enable HTTPS**: Vercel automatically enables HTTPS
2. **Monitor Environment**: Use Vercel Analytics and Monitoring
3. **Set Up Error Tracking**: Consider adding Sentry
4. **Backup Your Database**: Regular Supabase backups (in Supabase settings)
5. **Monitor Realtime Usage**: Check Supabase realtime connections in Analytics

## Troubleshooting Deployment

### Build fails with "Cannot find module"

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### OAuth not working after deployment

- Verify redirect URIs are correct in Google Console
- Confirm `NEXT_PUBLIC_SUPABASE_URL` env var is set correctly
- Check Supabase Site URL matches your Vercel URL

### Real-time updates not working

- Verify RLS policies are enabled in Supabase (see README.md)
- Check that Realtime is enabled for the bookmarks table

### 403 Forbidden errors

This usually means RLS policies are blocking access. Verify:
1. RLS is enabled on the bookmarks table
2. RLS policies allow the operation
3. User is authenticated

## Monitoring

### View Logs

```bash
# Using Vercel CLI
vercel logs YOUR-PROJECT-NAME
```

### Check Supabase Metrics

1. Go to Supabase Dashboard
2. Select your project
3. Go to Analytics to see:
   - Database usage
   - Realtime connections
   - API requests
   - Auth events

## Scaling

As your app grows:

1. **Database**: Monitor Supabase usage in Analytics
2. **API Rate Limits**: Supabase free tier has rate limits; upgrade if needed
3. **Realtime Connections**: Each user connection counts; optimize if needed
4. **Storage**: Add pagination if you have many bookmarks per user

## Domain Setup (Optional)

To use a custom domain:

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as shown by Vercel
4. Update Google OAuth redirect URIs and Supabase Site URL with your custom domain

## Rollback

To rollback to a previous deployment:

1. Go to your Vercel project
2. Click "Deployments"
3. Find the deployment you want to restore
4. Click "..."  → "Promote to Production"

## Performance Optimization

- Use Vercel Analytics to monitor Core Web Vitals
- Consider adding image optimization for favicons (future feature)
- Monitor database query performance in Supabase

For more help, see the [Vercel Documentation](https://vercel.com/docs).
