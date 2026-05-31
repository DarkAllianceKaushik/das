# Dark Alliance Script Store

A red-themed Roblox script storefront with a secure admin panel. List script names and uses on the store; link out via Pastebin, Linkvertise, or direct URLs. When deployed on Vercel with GitHub configured, every post/edit/delete commits `data/scripts.json` to your repository.

## Features

- **Public store** — Browse scripts with search, category, and free/paid filters
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
| `GITHUB_TOKEN` | [Personal Access Token](https://github.com/settings/tokens) with `repo` scope |
| `GITHUB_REPO` | `your-username/your-repo-name` |
| `GITHUB_BRANCH` | `main` (or your default branch) |
| `GITHUB_DATA_PATH` | `data/scripts.json` |

4. Deploy. The site reads/writes scripts through the GitHub API so data survives serverless restarts and each change creates a commit.

### GitHub token setup

1. GitHub → Settings → Developer settings → Personal access tokens
2. Create a token with **repo** access (classic token is fine)
3. Paste into Vercel as `GITHUB_TOKEN`
4. Set `GITHUB_REPO` to the same repo Vercel deploys from

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
