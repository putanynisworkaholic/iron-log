# IRON LOG — Setup Guide

## 1. Supabase Setup

1. Go to https://supabase.com → New project
2. Go to **Settings → API** → copy **Project URL** and **anon key**
3. Go to **SQL Editor** → paste all of `supabase-schema.sql` → **Run**
   - This creates all tables AND seeds your 23 exercises automatically

## 2. Local Development

```bash
cd workout-app
cp .env.example .env.local
# Edit .env.local:
#   VITE_SUPABASE_URL=https://xxx.supabase.co
#   VITE_SUPABASE_ANON_KEY=your-key
#   VITE_PASSCODE=your-4-digit-pin
npm install
npm run dev
# Opens at http://localhost:5173
```

## 3. Vercel Deployment

1. Push repo to GitHub (already done if you followed setup)
2. Go to https://vercel.com → Import your GitHub repo
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PASSCODE`
4. Deploy

## Notes

- **Passcode**: 4-digit PIN set in `VITE_PASSCODE` env var. Stored in localStorage on unlock.
- **Single user**: No accounts or email — just your personal passcode.
- **Data**: All workout data in Supabase (exercises, sets, sessions, cardio).
- **Lock**: Hit LOCK in the header to return to passcode screen.
