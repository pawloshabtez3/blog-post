# Deployment Quick Reference Card

Quick reference for deploying Inkflow to production.

## 📋 Pre-Deployment Checklist

- [ ] Real Gemini API key in `.env.local`
- [ ] Code builds successfully: `npm run build`
- [ ] No linting errors: `npm run lint`
- [ ] Environment variables verified: `npm run verify-env`

## 🚀 Deployment Steps

### 1. Supabase (5 min)
```
1. Create project at https://app.supabase.com
2. SQL Editor → Run supabase-schema.sql
3. Settings → API → Copy URL and anon key
4. Authentication → URL Configuration → Set Site URL
```

### 2. Gemini API (2 min)
```
1. Visit https://aistudio.google.com/app/apikey
2. Create API Key
3. Copy key
```

### 3. Vercel (5 min)
```
1. Go to https://vercel.com/new
2. Import Git repository
3. Add environment variables (see below)
4. Deploy
```

### 4. Post-Deploy (5 min)
```
1. Update Supabase redirect URLs
2. Test authentication
3. Create and publish test post
4. Test AI features
```

## 🔑 Environment Variables

Copy these to Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
GEMINI_API_KEY=AIzaSy...
```

## 🧪 Verification Commands

```bash
# Check environment
npm run verify-env

# Test build
npm run build

# Full check
npm run deploy:check
```

## 📚 Documentation

| Guide | Use Case |
|-------|----------|
| `QUICK_DEPLOY.md` | 5-minute deployment |
| `DEPLOYMENT.md` | Detailed instructions |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |
| `TROUBLESHOOTING.md` | Problem solving |
| `PRODUCTION_READINESS.md` | Pre-launch assessment |

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check `npm run lint` and fix errors |
| Auth fails | Verify Supabase URL and redirect URLs |
| AI fails | Check Gemini API key and quota |
| DB errors | Verify RLS policies in Supabase |

## 📞 Support Links

- [Supabase Dashboard](https://app.supabase.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Google AI Studio](https://aistudio.google.com)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

---

**Print this page for quick reference during deployment!**
