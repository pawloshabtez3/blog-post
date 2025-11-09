# Deployment Guide

This guide covers deploying the Inkflow blog platform to production using Vercel and Supabase.

## Prerequisites

- [Vercel account](https://vercel.com/signup)
- [Supabase account](https://supabase.com)
- [Google AI Studio account](https://aistudio.google.com/) for Gemini API key

## Step 1: Configure Supabase Production Instance

### 1.1 Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: inkflow-production (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the region closest to your users
4. Wait for the project to be created (takes ~2 minutes)

### 1.2 Set Up Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from your repository
3. Paste and execute the SQL to create:
   - `posts` table with proper columns
   - Indexes for performance
   - Row Level Security (RLS) policies
   - Triggers for automatic timestamp updates

### 1.3 Configure Authentication

1. Go to **Authentication** > **Providers** in Supabase dashboard
2. Enable **Email** provider (enabled by default)
3. Enable **Google** provider:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase
4. Configure **Site URL** and **Redirect URLs**:
   - Site URL: `https://yourdomain.com` (your production domain)
   - Redirect URLs: Add `https://yourdomain.com/auth/callback`

### 1.4 Get API Credentials

1. Go to **Settings** > **API** in Supabase dashboard
2. Copy the following values (you'll need them for Vercel):
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1.5 Verify RLS Policies

1. Go to **Authentication** > **Policies** in Supabase dashboard
2. Verify that the `posts` table has the following policies enabled:
   - ✅ Published posts are viewable by everyone
   - ✅ Users can view their own posts
   - ✅ Users can create their own posts
   - ✅ Users can update their own posts
   - ✅ Users can delete their own posts

## Step 2: Get Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select a Google Cloud project or create a new one
5. Copy the generated API key (you'll need it for Vercel)

## Step 3: Deploy to Vercel

### 3.1 Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Select the repository containing your Inkflow project

### 3.2 Configure Environment Variables

In the Vercel project configuration, add the following environment variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | From Supabase Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | From Supabase Settings > API |
| `NEXT_PUBLIC_SITE_URL` | Your production domain | e.g., `https://yourdomain.com` |
| `GEMINI_API_KEY` | Your Google Gemini API key | From Google AI Studio |

**Important**: Make sure to add these to the **Production** environment in Vercel.

### 3.3 Configure Build Settings

Vercel should auto-detect Next.js settings, but verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### 3.4 Deploy

1. Click "Deploy"
2. Wait for the build to complete (~2-5 minutes)
3. Once deployed, Vercel will provide a production URL

### 3.5 Configure Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS
4. Update `NEXT_PUBLIC_SITE_URL` environment variable to match your custom domain
5. Update Supabase authentication redirect URLs to use your custom domain

## Step 4: Post-Deployment Verification

### 4.1 Test Authentication Flow

1. Visit your production site
2. Click "Sign Up" and create a test account with email/password
3. Verify you receive a confirmation email (check spam folder)
4. Confirm your email and log in
5. Test Google OAuth sign-in
6. Verify you're redirected to the dashboard after login

### 4.2 Test Post Management

1. Create a new post from the dashboard
2. Save as draft and verify it appears in your dashboard
3. Edit the post and save changes
4. Publish the post
5. Verify the published post appears in the public blog feed at `/blog`
6. Click on the post to view the full content
7. Test unpublishing the post
8. Test deleting a post

### 4.3 Test AI Features

1. Create or edit a post
2. Add some content to the editor
3. Click "Improve Post" button
4. Verify AI enhancement returns suggestions
5. Click "Summarize" button
6. Verify AI summarization works

### 4.4 Verify Database Connections

1. Check Vercel deployment logs for any database connection errors
2. In Supabase dashboard, go to **Database** > **Logs**
3. Verify queries are being executed successfully
4. Check for any RLS policy violations or errors

### 4.5 Test RLS Policies

1. Create a post with User A
2. Log out and log in as User B
3. Verify User B cannot see User A's draft posts in the dashboard
4. Verify User B can see User A's published posts in the blog feed
5. Verify User B cannot edit or delete User A's posts

## Step 5: Monitoring and Maintenance

### 5.1 Set Up Error Monitoring

Consider integrating error monitoring tools:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- Vercel Analytics (built-in)

### 5.2 Monitor API Usage

- **Supabase**: Check database usage in Supabase dashboard
- **Gemini API**: Monitor API usage in Google Cloud Console
- Set up billing alerts to avoid unexpected charges

### 5.3 Regular Backups

1. In Supabase dashboard, go to **Database** > **Backups**
2. Enable automatic daily backups
3. Consider setting up point-in-time recovery (PITR) for production

### 5.4 Performance Optimization

- Enable Vercel Edge Caching for static pages
- Monitor Core Web Vitals in Vercel Analytics
- Optimize images using Next.js Image component
- Consider implementing Redis caching for frequently accessed posts

## Troubleshooting

### Authentication Issues

**Problem**: Users can't log in or OAuth fails

**Solutions**:
- Verify `NEXT_PUBLIC_SITE_URL` matches your production domain
- Check Supabase redirect URLs include your production domain
- Verify Google OAuth credentials are correct
- Check browser console for CORS errors

### Database Connection Errors

**Problem**: "Failed to fetch" or database timeout errors

**Solutions**:
- Verify Supabase credentials are correct in Vercel
- Check Supabase project is not paused (free tier pauses after inactivity)
- Verify RLS policies are not blocking legitimate queries
- Check Supabase logs for specific error messages

### AI Features Not Working

**Problem**: AI enhancement or summarization fails

**Solutions**:
- Verify `GEMINI_API_KEY` is set correctly in Vercel
- Check Google Cloud Console for API quota limits
- Verify Gemini API is enabled in your Google Cloud project
- Check Vercel function logs for specific error messages

### Build Failures

**Problem**: Deployment fails during build

**Solutions**:
- Check Vercel build logs for specific errors
- Verify all dependencies are in `package.json`
- Run `npm run build` locally to reproduce the error
- Check for TypeScript errors with `npm run lint`

## Environment Variables Reference

### Required Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Google Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key
```

### Optional Variables (Future Enhancements)

```bash
# Error Monitoring
SENTRY_DSN=your-sentry-dsn

# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Email Service (for custom emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
```

## Security Checklist

- [ ] All environment variables are set in Vercel (not in code)
- [ ] `.env.local` is in `.gitignore` (never commit secrets)
- [ ] Supabase RLS policies are enabled and tested
- [ ] Google OAuth credentials are restricted to production domain
- [ ] HTTPS is enforced (Vercel does this automatically)
- [ ] Supabase database password is strong and stored securely
- [ ] API keys have appropriate usage limits set
- [ ] Regular security updates are applied to dependencies

## Rollback Procedure

If you need to rollback a deployment:

1. Go to Vercel project dashboard
2. Click on **Deployments**
3. Find the last working deployment
4. Click the three dots menu
5. Select "Promote to Production"

For database rollbacks:
1. Go to Supabase dashboard > Database > Backups
2. Select the backup point to restore
3. Follow Supabase's restore procedure

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Inkflow GitHub Issues](https://github.com/yourusername/inkflow/issues)

## Next Steps

After successful deployment:

1. Set up custom domain and SSL certificate
2. Configure email templates in Supabase
3. Implement rate limiting for AI features
4. Add analytics and monitoring
5. Set up automated backups
6. Create a staging environment for testing
7. Document your deployment process for team members
