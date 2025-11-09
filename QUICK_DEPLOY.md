# Quick Deployment Guide

This is a condensed version of the deployment process. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Prerequisites

- Vercel account
- Supabase account  
- Google Gemini API key

## 5-Minute Deployment

### 1. Supabase Setup (2 minutes)

```bash
# 1. Create new project at https://app.supabase.com
# 2. Go to SQL Editor and run supabase-schema.sql
# 3. Go to Settings > API and copy:
#    - Project URL
#    - anon public key
```

### 2. Get Gemini API Key (1 minute)

```bash
# 1. Visit https://aistudio.google.com/app/apikey
# 2. Click "Create API Key"
# 3. Copy the key
```

### 3. Deploy to Vercel (2 minutes)

```bash
# 1. Go to https://vercel.com/new
# 2. Import your Git repository
# 3. Add environment variables:

NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_SITE_URL=<your-vercel-url>
GEMINI_API_KEY=<your-gemini-key>

# 4. Click Deploy
```

### 4. Configure Auth Redirects

```bash
# 1. After deployment, copy your Vercel URL
# 2. Go to Supabase > Authentication > URL Configuration
# 3. Set Site URL to your Vercel URL
# 4. Add Redirect URL: https://your-app.vercel.app/auth/callback
```

### 5. Test

```bash
# Visit your deployed site and test:
# ✅ Sign up with email
# ✅ Create a post
# ✅ Publish a post
# ✅ View post on /blog
# ✅ Test AI features
```

## Verification Commands

```bash
# Verify environment variables locally
npm run verify-env

# Test production build locally
npm run build
npm start

# Run full deployment check
npm run deploy:check
```

## Common Issues

### "Failed to fetch" errors
- Check Supabase URL and anon key are correct
- Verify Supabase project is not paused

### OAuth redirect errors
- Verify Site URL matches your domain
- Check redirect URLs include /auth/callback

### AI features not working
- Verify GEMINI_API_KEY is set in Vercel
- Check API quota in Google Cloud Console

## Need Help?

- 📖 Full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- ✅ Checklist: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- 🐛 Issues: Check Vercel logs and Supabase logs

## Environment Variables Quick Reference

| Variable | Where to Get It |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel deployment URL |
| `GEMINI_API_KEY` | Google AI Studio |

## Post-Deployment

After successful deployment:

1. ✅ Test authentication flow
2. ✅ Create and publish a test post
3. ✅ Test AI features
4. ✅ Set up custom domain (optional)
5. ✅ Enable Supabase backups
6. ✅ Set up monitoring (optional)

---

**Ready to deploy?** Follow the steps above or use the detailed [DEPLOYMENT.md](./DEPLOYMENT.md) guide.
