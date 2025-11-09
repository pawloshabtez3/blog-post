# Troubleshooting Guide

Common issues and solutions for deploying and running Inkflow.

## Table of Contents

- [Build and Deployment Issues](#build-and-deployment-issues)
- [Authentication Issues](#authentication-issues)
- [Database Issues](#database-issues)
- [AI Features Issues](#ai-features-issues)
- [Performance Issues](#performance-issues)
- [Environment Variables Issues](#environment-variables-issues)

---

## Build and Deployment Issues

### Build Fails with "Module not found"

**Symptoms**: Build fails with error like `Module not found: Can't resolve 'X'`

**Causes**:
- Missing dependency in package.json
- Incorrect import path
- Case-sensitive file path issue

**Solutions**:
1. Install missing dependency:
   ```bash
   npm install <missing-package>
   ```

2. Check import paths are correct and match file names exactly

3. Verify file extensions are included in imports where needed

### Build Fails with TypeScript Errors

**Symptoms**: Build fails with TypeScript compilation errors

**Solutions**:
1. Run type check locally:
   ```bash
   npx tsc --noEmit
   ```

2. Fix type errors in your code

3. If using strict mode, ensure all types are properly defined

4. Check `tsconfig.json` is properly configured

### Vercel Deployment Fails

**Symptoms**: Deployment fails in Vercel dashboard

**Solutions**:
1. Check Vercel build logs for specific error

2. Verify environment variables are set in Vercel

3. Try building locally:
   ```bash
   npm run build
   ```

4. Check Node.js version matches Vercel (18+)

5. Verify all dependencies are in `package.json`

### "Cannot find module" in Production

**Symptoms**: App works locally but fails in production with module errors

**Solutions**:
1. Ensure dependency is in `dependencies`, not `devDependencies`

2. Clear Vercel cache and redeploy

3. Check import paths use correct casing

---

## Authentication Issues

### "Failed to fetch" on Login/Signup

**Symptoms**: Authentication fails with network error

**Causes**:
- Incorrect Supabase URL or key
- CORS issues
- Supabase project paused

**Solutions**:
1. Verify environment variables:
   ```bash
   npm run verify-env
   ```

2. Check Supabase project is active (not paused)

3. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

4. Check browser console for specific error messages

### OAuth Redirect Fails

**Symptoms**: Google sign-in redirects to error page

**Causes**:
- Incorrect redirect URLs
- Site URL mismatch
- OAuth credentials incorrect

**Solutions**:
1. In Supabase, go to Authentication > URL Configuration

2. Verify Site URL matches your domain:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

3. Add redirect URL: `https://yourdomain.com/auth/callback`

4. In Google Cloud Console, verify authorized redirect URIs include:
   - `https://your-project-ref.supabase.co/auth/v1/callback`

5. Check OAuth credentials (Client ID and Secret) are correct in Supabase

### Session Not Persisting

**Symptoms**: User gets logged out on page refresh

**Causes**:
- Cookie issues
- Incorrect Supabase client setup
- Browser blocking cookies

**Solutions**:
1. Verify Supabase client is using SSR package (`@supabase/ssr`)

2. Check middleware is properly configured

3. Verify cookies are not being blocked by browser

4. Check `NEXT_PUBLIC_SITE_URL` matches your domain

### "Email not confirmed" Error

**Symptoms**: User can't log in after signup

**Solutions**:
1. Check spam folder for confirmation email

2. In Supabase, go to Authentication > Settings

3. Disable email confirmation for testing (not recommended for production):
   - Set "Enable email confirmations" to OFF

4. Or manually confirm user in Supabase dashboard:
   - Go to Authentication > Users
   - Find user and click "Confirm email"

---

## Database Issues

### "Permission denied" or RLS Policy Errors

**Symptoms**: Queries fail with permission errors

**Causes**:
- RLS policies not configured correctly
- User not authenticated
- Policy conditions not met

**Solutions**:
1. Verify RLS policies are enabled:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'posts';
   ```

2. Check user is authenticated before making queries

3. Verify policy conditions match your use case

4. Test policies in Supabase SQL Editor:
   ```sql
   -- Test as authenticated user
   SELECT * FROM posts WHERE user_id = auth.uid();
   ```

5. Review RLS policies in `supabase-schema.sql`

### "Duplicate key value violates unique constraint"

**Symptoms**: Creating/updating post fails with duplicate slug error

**Causes**:
- Slug already exists
- Slug uniqueness validation not working

**Solutions**:
1. This is expected behavior - slugs must be unique

2. Implement slug validation in your form:
   ```typescript
   // Check if slug exists before saving
   const { data } = await supabase
     .from('posts')
     .select('id')
     .eq('slug', slug)
     .single();
   
   if (data) {
     // Slug exists, show error
   }
   ```

3. Add suffix to make slug unique:
   ```typescript
   let uniqueSlug = slug;
   let counter = 1;
   while (await slugExists(uniqueSlug)) {
     uniqueSlug = `${slug}-${counter}`;
     counter++;
   }
   ```

### Database Connection Timeout

**Symptoms**: Queries timeout or fail to connect

**Solutions**:
1. Check Supabase project status (not paused)

2. Verify network connectivity

3. Check Supabase status page: https://status.supabase.com

4. Verify connection pooling settings (for high traffic)

### Posts Not Appearing in Blog Feed

**Symptoms**: Published posts don't show in `/blog`

**Causes**:
- Post status is 'draft'
- RLS policy blocking access
- Query filtering incorrectly

**Solutions**:
1. Verify post status is 'published':
   ```sql
   SELECT id, title, status FROM posts WHERE slug = 'your-slug';
   ```

2. Check RLS policy allows public access to published posts

3. Verify query includes status filter:
   ```typescript
   const { data } = await supabase
     .from('posts')
     .select('*')
     .eq('status', 'published')
     .order('created_at', { ascending: false });
   ```

---

## AI Features Issues

### "AI features are temporarily unavailable"

**Symptoms**: AI enhancement or summarization fails

**Causes**:
- Invalid Gemini API key
- API quota exceeded
- Network issues
- Gemini API not enabled

**Solutions**:
1. Verify `GEMINI_API_KEY` is set correctly in Vercel

2. Check API key is valid at https://aistudio.google.com/app/apikey

3. Verify Gemini API is enabled in Google Cloud Console

4. Check API quota and billing:
   - Go to Google Cloud Console
   - Navigate to APIs & Services > Enabled APIs
   - Check Gemini API quotas

5. Check Vercel function logs for specific error:
   ```bash
   # In Vercel dashboard
   Project > Deployments > [Latest] > Functions
   ```

### AI Returns Malformed Response

**Symptoms**: AI enhancement returns incomplete or invalid data

**Causes**:
- Gemini response not in expected JSON format
- Prompt needs adjustment
- Content too long

**Solutions**:
1. Check Vercel function logs for raw response

2. Verify prompt in `lib/gemini/prompts.ts` is clear

3. Add error handling for JSON parsing:
   ```typescript
   try {
     const enhancement = JSON.parse(responseText);
   } catch (error) {
     console.error('Failed to parse AI response:', responseText);
     // Return error to user
   }
   ```

4. Limit content length before sending to API:
   ```typescript
   const maxLength = 10000; // characters
   const truncatedContent = content.substring(0, maxLength);
   ```

### AI Requests Timeout

**Symptoms**: AI features take too long and timeout

**Solutions**:
1. Increase Vercel function timeout (Pro plan required)

2. Reduce content length before sending

3. Use a faster Gemini model (e.g., `gemini-1.5-flash` instead of `gemini-1.5-pro`)

4. Implement client-side timeout and retry logic

---

## Performance Issues

### Slow Page Load Times

**Symptoms**: Pages take >3 seconds to load

**Solutions**:
1. Enable Vercel Analytics to identify bottlenecks

2. Optimize database queries:
   - Add indexes on frequently queried columns
   - Limit number of posts fetched
   - Use pagination

3. Implement caching:
   ```typescript
   // Cache published posts for 60 seconds
   export const revalidate = 60;
   ```

4. Optimize images with Next.js Image component

5. Reduce bundle size:
   ```bash
   npm run build
   # Check bundle size in output
   ```

### High Database Usage

**Symptoms**: Supabase shows high database usage

**Solutions**:
1. Review slow queries in Supabase dashboard

2. Add missing indexes:
   ```sql
   CREATE INDEX idx_posts_status ON posts(status);
   CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
   ```

3. Implement pagination to reduce data fetched

4. Use `select()` to fetch only needed columns:
   ```typescript
   .select('id, title, slug, created_at')
   ```

### Vercel Function Timeout

**Symptoms**: API routes timeout (10s limit on Hobby plan)

**Solutions**:
1. Optimize function code

2. Reduce AI content length

3. Upgrade to Vercel Pro for 60s timeout

4. Move long-running tasks to background jobs

---

## Environment Variables Issues

### "Environment variable not found"

**Symptoms**: App fails with missing environment variable error

**Solutions**:
1. Run verification script:
   ```bash
   npm run verify-env
   ```

2. In Vercel, verify all variables are set:
   - Go to Project Settings > Environment Variables
   - Check all required variables are present
   - Verify no typos in variable names

3. Redeploy after adding variables:
   - Environment changes require redeployment

4. Check variable names match exactly:
   - `NEXT_PUBLIC_SUPABASE_URL` (not `SUPABASE_URL`)
   - Case-sensitive

### Environment Variables Not Loading Locally

**Symptoms**: App works in production but not locally

**Solutions**:
1. Verify `.env.local` file exists in project root

2. Restart development server after changing `.env.local`

3. Check `.env.local` is not in `.gitignore` (it should be)

4. Verify variable names start with `NEXT_PUBLIC_` for client-side access

### Different Behavior in Development vs Production

**Symptoms**: App works locally but fails in production

**Solutions**:
1. Check environment-specific variables:
   - Development uses `.env.local`
   - Production uses Vercel environment variables

2. Verify URLs are correct for each environment:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

3. Test production build locally:
   ```bash
   npm run build
   npm start
   ```

4. Check for hardcoded values that should be environment variables

---

## Getting Help

If you're still experiencing issues:

1. **Check Logs**:
   - Vercel: Project > Deployments > [Latest] > Functions
   - Supabase: Project > Logs
   - Browser: Developer Console (F12)

2. **Search Documentation**:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [Gemini API Docs](https://ai.google.dev/docs)

3. **Community Support**:
   - Next.js Discord
   - Supabase Discord
   - Stack Overflow

4. **Create an Issue**:
   - Include error messages
   - Include relevant logs
   - Include steps to reproduce
   - Include environment details

## Debugging Tips

### Enable Verbose Logging

Add console.log statements to track execution:

```typescript
console.log('Fetching posts...');
const { data, error } = await supabase.from('posts').select('*');
console.log('Posts fetched:', data?.length, 'Error:', error);
```

### Use Browser DevTools

1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Check Application tab for cookies/storage

### Test API Routes Directly

Use curl or Postman to test API routes:

```bash
curl -X POST https://yourdomain.com/api/posts/enhance \
  -H "Content-Type: application/json" \
  -d '{"content":"Test content"}'
```

### Check Supabase Logs

1. Go to Supabase dashboard
2. Navigate to Logs
3. Filter by service (API, Auth, Database)
4. Look for errors or slow queries

### Verify RLS Policies

Test policies in SQL Editor:

```sql
-- Test as specific user
SELECT auth.uid(); -- Should return user ID
SELECT * FROM posts WHERE user_id = auth.uid();
```

---

**Last Updated**: November 9, 2025

For more help, see [DEPLOYMENT.md](./DEPLOYMENT.md) or [PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md).
