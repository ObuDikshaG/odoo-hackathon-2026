# AssetFlow

Enterprise Asset & Resource Management System built with modern web technologies.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui & Lucide React
- **Backend & Auth**: Supabase (PostgreSQL)

## Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- A Supabase account and project

### 2. Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the Supabase credentials from your project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Installation
Install the dependencies using npm:
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure
- `/src/app/(auth)`: Authentication routes (Login)
- `/src/app/(dashboard)`: Main application interface with Sidebar and Top Navigation
- `/src/components/layout`: Core layout components (Sidebar, Topbar)
- `/src/components/ui`: Reusable shadcn UI components
- `/src/lib/supabase`: Supabase SSR client configurations
