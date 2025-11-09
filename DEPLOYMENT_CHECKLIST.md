# Deployment Checklist

Use this checklist to ensure all deployment steps are completed correctly.

## Pre-Deployment

### Supabase Configuration
- [ ] Created Supabase production project
- [ ] Executed `supabase-schema.sql` in production database
- [ ] Verified all tables are created correctly
- [ ] Verified all indexes are in place
- [ ] Enabled Row Level Security (RLS) on `posts` table
- [ ] Verified all 5 RLS policies are active:
  - [ ] Published posts are viewable by everyone
  - [ ] Users can view their own posts
  - [ ] Users can create their own posts
  - [ ] Users can update their own posts
  - [ ] Users can delete their own posts
- [ ] Configured email authentication provider
- [ ] Configured Google OAuth provider (if using)
- [ ] Set Site URL to production domain
- [ ] Added production domain to redirect URLs
- [ ] Copied Project URL for Vercel
- [ ] Copied anon/public key for Vercel

### Google Gemini API
- [ ] Created Google Cloud project (or selected existing)
- [ ] Enabled Gemini API
- [ ] Generated API key
- [ ] Set usage quotas/limits (optional)
- [ ] Copied API key for Vercel

### Code Repository
- [ ] All code changes committed to main branch
- [ ] `.env.local` is NOT committed (verify with `git status`)
- [ ] `.env.example` is committed for reference
- [ ] `DEPLOYMENT.md` is committed
- [ ] All tests passing locally (if applicable)
- [ ] No TypeScript errors (`npm run lint`)
- [ ] Production build succeeds locally (`npm run build`)

## Vercel Deployment

### Initial Setup
- [ ] Connected Git repository to Vercel
- [ ] Selected correct branch for production (usually `main`)
- [ ] Verified framework preset is Next.js
- [ ] Verified build command is `npm run build`

### Environment Variables
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` to Production environment
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Production environment
- [ ] Added `NEXT_PUBLIC_SITE_URL` to Production environment
- [ ] Added `GEMINI_API_KEY` to Production environment
- [ ] Verified no typos in variable names
- [ ] Verified no extra spaces in variable values

### Deployment
- [ ] Triggered initial deployment
- [ ] Deployment completed successfully (no build errors)
- [ ] Copied production URL from Vercel

### Domain Configuration (if using custom domain)
- [ ] Added custom domain in Vercel
- [ ] Configured DNS records
- [ ] SSL certificate provisioned automatically
- [ ] Updated `NEXT_PUBLIC_SITE_URL` to custom domain
- [ ] Redeployed after URL change

## Post-Deployment Verification

### Authentication Testing
- [ ] Visited production site
- [ ] Sign up page loads correctly
- [ ] Created test account with email/password
- [ ] Received confirmation email
- [ ] Confirmed email successfully
- [ ] Logged in with test account
- [ ] Redirected to dashboard after login
- [ ] Tested Google OAuth sign-in (if enabled)
- [ ] Tested logout functionality
- [ ] Tested login with existing account

### Post Management Testing
- [ ] Dashboard loads correctly
- [ ] "Create New Post" button works
- [ ] Created a new draft post
- [ ] Draft post appears in dashboard
- [ ] Edited existing post
- [ ] Changes saved successfully
- [ ] Published a post
- [ ] Published post appears in blog feed
- [ ] Unpublished a post
- [ ] Unpublished post removed from blog feed
- [ ] Deleted a post
- [ ] Deleted post removed from dashboard

### Public Blog Testing
- [ ] Blog feed page loads at `/blog`
- [ ] Published posts are visible
- [ ] Draft posts are NOT visible
- [ ] Post cards display correctly
- [ ] Clicked on a post
- [ ] Individual post page loads correctly
- [ ] Markdown content renders properly
- [ ] Post metadata displays correctly
- [ ] Attempted to access draft post by slug (should fail)
- [ ] Attempted to access non-existent slug (should show 404)

### AI Features Testing
- [ ] Opened post editor
- [ ] Added content to editor
- [ ] Clicked "Improve Post" button
- [ ] AI enhancement request completed
- [ ] Received refined content
- [ ] Received suggested title
- [ ] Received keywords
- [ ] Received meta description
- [ ] Clicked "Summarize" button
- [ ] AI summarization completed
- [ ] Received 2-3 sentence summary

### Security Testing
- [ ] Created post with User A
- [ ] Logged out
- [ ] Created User B account
- [ ] Logged in as User B
- [ ] Verified User B cannot see User A's drafts
- [ ] Verified User B can see User A's published posts
- [ ] Attempted to edit User A's post as User B (should fail)
- [ ] Attempted to delete User A's post as User B (should fail)
- [ ] Verified dashboard requires authentication
- [ ] Attempted to access `/dashboard` while logged out (should redirect)

### Database Verification
- [ ] Checked Vercel deployment logs (no database errors)
- [ ] Checked Supabase logs (queries executing successfully)
- [ ] Verified RLS policies are working (no policy violations)
- [ ] Verified timestamps update correctly on post edits
- [ ] Verified slug uniqueness constraint works

### Performance Testing
- [ ] Page load times are acceptable (<3 seconds)
- [ ] Images load properly (if any)
- [ ] No console errors in browser
- [ ] Mobile responsive design works
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari)

## Monitoring Setup

### Error Monitoring
- [ ] Configured error tracking (Sentry, LogRocket, etc.)
- [ ] Verified errors are being captured
- [ ] Set up error notifications

### Analytics
- [ ] Configured analytics (Vercel Analytics, Google Analytics, etc.)
- [ ] Verified page views are being tracked
- [ ] Set up conversion tracking (if applicable)

### API Usage Monitoring
- [ ] Checked Supabase usage dashboard
- [ ] Checked Gemini API usage in Google Cloud Console
- [ ] Set up billing alerts for both services
- [ ] Documented current usage baseline

### Backups
- [ ] Enabled automatic daily backups in Supabase
- [ ] Verified backup schedule
- [ ] Documented backup retention policy
- [ ] Tested backup restoration process (optional but recommended)

## Documentation

- [ ] Updated README.md with production URL
- [ ] Documented environment variables in team wiki/docs
- [ ] Shared deployment guide with team
- [ ] Documented rollback procedure
- [ ] Created runbook for common issues
- [ ] Documented monitoring and alerting setup

## Post-Launch

- [ ] Announced launch to stakeholders
- [ ] Monitored error rates for first 24 hours
- [ ] Monitored performance metrics
- [ ] Collected user feedback
- [ ] Created backlog for improvements
- [ ] Scheduled first maintenance window

## Rollback Plan (if needed)

If critical issues are discovered:

1. [ ] Identify the issue and severity
2. [ ] Decide if rollback is necessary
3. [ ] Go to Vercel Deployments tab
4. [ ] Find last working deployment
5. [ ] Promote to Production
6. [ ] Verify rollback successful
7. [ ] Communicate status to users
8. [ ] Document issue for post-mortem
9. [ ] Fix issue in development
10. [ ] Test thoroughly before redeploying

## Notes

**Deployment Date**: _______________

**Deployed By**: _______________

**Production URL**: _______________

**Issues Encountered**: 
_______________________________________________
_______________________________________________
_______________________________________________

**Resolution Notes**:
_______________________________________________
_______________________________________________
_______________________________________________

**Sign-off**: _______________
