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

## Project Structure

```
/app                    # Next.js App Router pages
/components             # React components
/lib                    # Utilities, types, and services
  /supabase            # Supabase client configuration
  /gemini              # Gemini AI integration
  /utils               # Helper functions
  /types               # TypeScript type definitions
```

## License

ISC
