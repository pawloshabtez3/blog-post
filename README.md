# Inkflow - AI-Powered Blog Platform

A modern blog platform built with Next.js 14+, TypeScript, Tailwind CSS, Supabase, and Google Gemini AI.

## Features

- User authentication (email/password and Google OAuth)
- Create, edit, and manage blog posts with Markdown
- Publish/unpublish workflow
- AI-powered content enhancement and summarization
- Public blog feed
- User dashboard

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Authentication & Database**: Supabase
- **AI Integration**: Google Gemini API
- **Markdown Rendering**: react-markdown

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run verify-env` - Verify environment variables are configured
- `npm run deploy:check` - Run all pre-deployment checks

## Project Structure

```
/app                    # Next.js App Router pages
/components             # React components
/lib                    # Utilities, types, and services
  /supabase            # Supabase client configuration
  /gemini              # Gemini AI integration
  /utils               # Helper functions
  /types               # TypeScript type definitions
/scripts               # Deployment and utility scripts
```

## Deployment

Ready to deploy to production? We've got you covered:

- 🚀 **Quick Start**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - 5-minute deployment guide
- 📖 **Detailed Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment documentation
- ✅ **Checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Step-by-step verification

### Quick Deploy to Vercel

1. Set up Supabase project and run `supabase-schema.sql`
2. Get Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Deploy to Vercel and add environment variables
4. Configure authentication redirects in Supabase

See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for detailed steps.

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NEXT_PUBLIC_SITE_URL` - Your site URL (for OAuth redirects)
- `GEMINI_API_KEY` - Your Google Gemini API key

See `.env.example` for a complete template.

## License

ISC
