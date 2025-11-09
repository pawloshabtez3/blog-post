# Supabase Setup Instructions

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- A Supabase project created

## Database Schema Setup

1. **Navigate to your Supabase project dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Execute the database schema**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"
   - Copy the contents of `supabase-schema.sql` file
   - Paste into the SQL editor
   - Click "Run" to execute the schema

3. **Verify the setup**
   - Go to "Table Editor" in the left sidebar
   - You should see the `posts` table with the following columns:
     - id (uuid, primary key)
     - user_id (uuid, foreign key to auth.users)
     - title (text)
     - slug (text, unique)
     - content (text, nullable)
     - status (text, default: 'draft')
     - created_at (timestamp with time zone)
     - updated_at (timestamp with time zone)

4. **Verify RLS policies**
   - In the Table Editor, click on the `posts` table
   - Click on "Policies" tab
   - You should see 5 policies:
     - Published posts are viewable by everyone (SELECT)
     - Users can view their own posts (SELECT)
     - Users can create their own posts (INSERT)
     - Users can update their own posts (UPDATE)
     - Users can delete their own posts (DELETE)

## Environment Variables Setup

1. **Get your Supabase credentials**
   - In your Supabase project dashboard
   - Go to "Settings" → "API"
   - Copy the "Project URL" and "anon public" key

2. **Create .env.local file**
   - Copy `.env.local.example` to `.env.local`
   - Replace the placeholder values:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_actual_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
     ```

## Testing RLS Policies

### Test 1: Unauthenticated users can view published posts
```sql
-- Run this in SQL Editor (without authentication)
SELECT * FROM posts WHERE status = 'published';
-- Should return published posts
```

### Test 2: Unauthenticated users cannot view draft posts
```sql
-- Run this in SQL Editor (without authentication)
SELECT * FROM posts WHERE status = 'draft';
-- Should return empty result
```

### Test 3: Authenticated users can view their own posts
- Sign up/login to the application
- Create a draft post
- Verify you can see it in your dashboard
- Verify it doesn't appear in the public blog feed

### Test 4: Users cannot edit others' posts
- Create a post with User A
- Try to edit it with User B
- Should fail with authorization error

## Client Utilities

The following Supabase client utilities have been created:

- **`lib/supabase/client.ts`**: Browser client for client-side operations
- **`lib/supabase/server.ts`**: Server client for server-side operations (Server Components, API Routes)

### Usage Examples

**Client-side (Client Components):**
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase.from('posts').select('*')
```

**Server-side (Server Components, API Routes):**
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data, error } = await supabase.from('posts').select('*')
```

## Type Definitions

TypeScript type definitions for the database schema are available in `lib/types/database.ts`:

- `Database`: Complete database schema type
- `Post`: Post table row type
- `CreatePostInput`: Type for inserting new posts
- `UpdatePostInput`: Type for updating posts
- `PostStatus`: Union type for post status ('draft' | 'published')

## Next Steps

After completing this setup:
1. Verify the database schema is created correctly
2. Test the RLS policies work as expected
3. Proceed to implement authentication (Task 3)
