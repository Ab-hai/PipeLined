# Pipelined

A job application tracker with AI resume scoring and interview prep — built with Next.js, Groq, and Neon Postgres.

**Live → [https://pipe-lined-ab-hais-projects.vercel.app](https://pipe-lined-ab-hais-projects.vercel.app)**

---

## Features

- **Application Tracking** — Add and manage job applications across statuses: Bookmarked → Applied → Interview → Offer / Rejected
- **AI Resume Scoring** — Paste a job description and your resume, get a match score with strengths and gaps powered by Llama 3.3 70B via Groq
- **Interview Prep** — Auto-generates 6 targeted interview questions per role based on the job description, streamed in real time
- **Dashboard Stats** — Total applied, interview count, and average AI score at a glance
- **OAuth Auth** — Sign in with GitHub or Google, no passwords

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Auth | NextAuth v5 (JWT) |
| Database | Neon Postgres + Prisma ORM |
| AI | Groq SDK — `llama-3.3-70b-versatile` |
| Styling | Tailwind CSS + DaisyUI |
| Animations | Framer Motion |
| Icons | Lucide React + React Icons |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/yourname/pipelined.git
cd pipelined
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your `.env` — here's where to get each value:

**`DATABASE_URL`**
- Go to [neon.tech](https://neon.tech) → create a project → copy the connection string from the dashboard

**`AUTH_SECRET`**
- Run this in your terminal and paste the output:
  ```bash
  openssl rand -base64 32
  ```

**`AUTH_URL`**
- Use `http://localhost:3000` for local dev, your Vercel URL in production

**`GITHUB_ID` + `GITHUB_SECRET`**
- Go to github.com → Settings → Developer settings → OAuth Apps → New OAuth App
- Homepage URL: `http://localhost:3000`
- Callback URL: `http://localhost:3000/api/auth/callback/github`
- Copy the Client ID and generate a Client Secret

**`GOOGLE_ID` + `GOOGLE_SECRET`**
- Go to [console.cloud.google.com](https://console.cloud.google.com) → Create project → APIs & Services → Credentials → Create OAuth 2.0 Client ID
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- Copy the Client ID and Client Secret

**`GROQ_API_KEY`**
- Go to [console.groq.com](https://console.groq.com) → API Keys → Create API Key

```env
DATABASE_URL=             # Neon Postgres connection string
AUTH_SECRET=              # openssl rand -base64 32
AUTH_URL=                 # http://localhost:3000

GITHUB_ID=                # GitHub OAuth client ID
GITHUB_SECRET=            # GitHub OAuth client secret

GOOGLE_ID=                # Google OAuth client ID
GOOGLE_SECRET=            # Google OAuth client secret

GROQ_API_KEY=             # Groq API key
```

### 3. Run migrations and start

```bash
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── actions/           # Server actions (CRUD + AI scoring)
│   ├── api/
│   │   └── ai/
│   │       └── stream-questions/  # Streaming interview questions route
│   ├── dashboard/
│   │   ├── page.tsx               # Dashboard home
│   │   ├── layout.tsx             # Dashboard layout + background
│   │   └── applications/
│   │       ├── new/               # Create application
│   │       └── [id]/              # Detail, edit, interview pages
│   └── page.tsx                   # Landing page
├── components/
│   ├── ui/                        # Reusable UI (spotlight, status badge, dropdown)
│   ├── AISection.tsx              # Resume scoring UI
│   ├── ApplicationCard.tsx        # Application list item
│   ├── ApplicationForm.tsx        # Create / edit form
│   └── InterviewSection.tsx       # Streaming interview questions
└── lib/
    ├── groq.ts                    # Groq client
    └── prisma.ts                  # Prisma singleton
```

---

## Deploying to Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all env vars from `.env` (update `AUTH_URL` to your Vercel URL)
4. Set build command to:
   ```
   prisma migrate deploy && next build
   ```
5. Add OAuth callback URLs in GitHub and Google:
   ```
   https://your-app.vercel.app/api/auth/callback/github
   https://your-app.vercel.app/api/auth/callback/google
   ```
6. Redeploy

---

## Database Schema

```
User
 └── Application
      ├── aiScore (JSON)        # { score, summary, strengths[], gaps[] }
      └── InterviewQuestion[]   # Generated questions per application
```

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `AUTH_SECRET` | Random secret for NextAuth |
| `AUTH_URL` | App URL (localhost or production) |
| `GITHUB_ID` | GitHub OAuth client ID |
| `GITHUB_SECRET` | GitHub OAuth client secret |
| `GOOGLE_ID` | Google OAuth client ID |
| `GOOGLE_SECRET` | Google OAuth client secret |
| `GROQ_API_KEY` | Groq API key for LLM inference |
