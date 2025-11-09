## Inkflow — MVP Prompt (Next.js + Supabase + Google Gemini)

### 🎯 Goal:
Build a **modern blog platform** where users can sign up, write posts in Markdown, and publish them publicly. Integrate **Google Gemini** to help users generate content ideas, improve writing, and create summaries.

---

### 🧩 Core MVP Features

#### 1. User Authentication
- Implement **Supabase Auth** (email/password or Google sign-in).
- Each user manages their own posts.

#### 2. Blog Post Management
- **Create / Edit / Delete** blog posts.
- **Markdown Editor:** Simple `<textarea>` for MVP.
- **Fields:** title, slug, content, status (draft/published).

#### 3. Public Blog Feed
- `/blog` route: Lists all published posts.
- `/blog/[slug]`: Displays individual posts.
- Use `react-markdown` for content rendering.

#### 4. User Dashboard
- `/dashboard`: Manage posts (CRUD).
- Buttons for publishing or unpublishing posts.
- Option to generate AI-enhanced suggestions using **Gemini**.

#### 5. AI Writing Assistant (via Google Gemini)
Add a "✨ Improve Post" or "💡 Get Ideas" button to the editor.

##### Example Prompt for Gemini:
```
You are a professional blog editor and writing coach.
Given this user's draft:

${userDraft}

Please provide:
1. A clearer and more engaging rewritten version.
2. A catchy and SEO-friendly title.
3. 3 relevant keyword tags.
4. A one-sentence meta description for SEO.

Keep the tone professional yet conversational.
```

#### 6. AI Summary Generation (Optional)
Allow users to click a "🧠 Summarize" button for a concise summary.

##### Example Prompt for Summary:
```
Summarize this blog post in 2-3 sentences that capture its main idea and tone:
${postContent}
```

---

### 🏗️ Tech Stack
- **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS)
- **Backend / DB:** Supabase (Auth, Database, Storage)
- **AI:** Google Gemini API
- **Markdown Rendering:** `react-markdown`

---

### 💾 Database Schema (Supabase)
```sql
create table posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  title text not null,
  slug text unique not null,
  content text,
  status text default 'draft',
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

---

### 📁 Suggested Folder Structure
```
/app
 ├─ /blog
 │   ├─ page.tsx           -> public feed
 │   └─ [slug]/page.tsx    -> single post
 ├─ /dashboard
 │   ├─ page.tsx           -> manage posts
 │   ├─ new/page.tsx       -> create post
 │   └─ edit/[id]/page.tsx -> edit post
 ├─ layout.tsx
 └─ page.tsx               -> landing page
/lib
 ├─ supabaseClient.ts
 └─ gemini.ts
```

---

### ⚙️ Gemini API Integration (lib/gemini.ts)
```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function enhancePost(draft: string) {
  const prompt = `You are a blog editor. Improve the following draft: ${draft}\n\nReturn a refined version, catchy title, three keyword tags, and a meta description.`;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function summarizePost(content: string) {
  const prompt = `Summarize this blog post in 2-3 sentences:\n${content}`;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

---

### 🌱 Stretch Goals
- Image uploads (Supabase Storage).
- Comment system with moderation.
- AI-assisted SEO suggestions.
- Tag-based post filtering.
- Public author profiles (`/@username`).

---

This MVP can be deployed on **Vercel (Next.js)** and **Supabase** for hosting. **Google Gemini** powers intelligent writing assistance, making the platform feel like a personal AI co-writer.

