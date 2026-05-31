# Dark Alliance Script Store

A red-themed Roblox script storefront with a secure admin panel. List script names and uses on the store; link out via Pastebin, Linkvertise, or direct URLs. When deployed on Vercel with GitHub configured, every post/edit/delete commits `data/scripts.json` to your repository.

## Features

- **Public store** — Two modes: **Dark Alliance Scripts** (your curated list) and **Online Scripts** (live ScriptBlox + RScripts API search)
- **Filters** — Search, category, and free/paid on Alliance scripts; source filter (Both / ScriptBlox / RScripts) on online mode
- **Script cards** — Name, description (uses), tags, category, pricing badge, featured highlight
- **Download links** — Pastebin, Linkvertise, direct, or other
- **Admin panel** (`/admin`) — Single owner login; post, edit, delete scripts
- **Custom fields** — Categories, tags, free/paid, featured, link type
- **GitHub sync** — Production changes persist via GitHub API commits

## Quick start (local)

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=at-least-32-random-characters-long!!
```

Run locally (uses `data/scripts.json` on disk):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — Admin at [http://localhost:3000/admin](http://localhost:3000/admin).

## Deploy to Vercel

1. Push this project to a **GitHub repository**.
2. Import the repo in [Vercel](https://vercel.com).
3. Add **Environment Variables** (Project → Settings → Environment Variables):

| Variable | Description |
|----------|-------------|
| `ADMIN_USERNAME` | Your admin login username |
| `ADMIN_PASSWORD` | Your admin login password |
| `SESSION_SECRET` | Random string, 32+ characters |
| `GITHUB_TOKEN` | [Classic PAT](https://github.com/settings/tokens) with **repo** scope (not expired; no extra spaces) |
| `GITHUB_REPO` | `DarkAllianceKaushik/das` |
| `GITHUB_BRANCH` | `main` (or your default branch) |
| `GITHUB_DATA_PATH` | `data/scripts.json` |

4. Deploy. The site reads/writes scripts through the GitHub API so data survives serverless restarts and each change creates a commit.

### GitHub token setup (fixes 401 Bad credentials)

1. Open [GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. **Generate new token (classic)** — not fine-grained unless you grant Contents read/write on `das`
3. Check the **repo** scope (full control of private repositories)
4. Copy the token once (`ghp_...`) — paste into Vercel as `GITHUB_TOKEN` with **no spaces** before/after
5. Set `GITHUB_REPO` to `DarkAllianceKaushik/das` and `GITHUB_BRANCH` to `main`
6. **Redeploy** Vercel after changing env vars (Deployments → ⋯ → Redeploy)

If you see **401 Bad credentials**, the token is wrong, expired, or revoked — create a new one and redeploy.

## Project structure

```
app/              # Pages and API routes
components/       # UI (store + admin)
lib/              # Auth, GitHub, scripts data layer
data/scripts.json # Script database (committed to GitHub)
```

## Admin usage

1. Go to `/admin` and sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`
2. **New Script** — Fill name, uses/description, category, tags, free/paid, link type, and URL
3. **Edit / Delete** — Manage existing listings from the dashboard
4. **Categories** — Add preset categories for the dropdown

## Security notes

- Never commit `.env` or `.env.local`
- Use a strong `ADMIN_PASSWORD` and long `SESSION_SECRET`
- Rotate `GITHUB_TOKEN` if exposed
- Admin API routes require an authenticated session cookie

## License

Private use — Dark Alliance Script Store.
