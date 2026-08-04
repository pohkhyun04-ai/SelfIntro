# Personal Website

A full-stack personal portfolio — **Vue 3** + **TypeScript** frontend, **Express** + **PostgreSQL** backend, deployed on **Render** with a **Gemini AI** chatbot.

## ✨ Features

- ⚡️ **Vite** for instant dev server and lightning-fast builds
- 🧩 **Vue 3 `<script setup>`** single-file components
- 🔒 **Fully typed** with TypeScript (strict mode)
- 🎨 **Design-token system** in CSS custom properties (easy theming)
- 🌗 **Dark / light theme** toggle (persists to `localStorage`, respects OS preference)
- 📱 **Responsive** layout with a mobile menu
- ♿️ **Accessible** — semantic HTML, focus styles, reduced-motion support
- 📝 **Data-driven** — all content lives in [`src/data/portfolio.ts`](src/data/portfolio.ts)
- 🤖 **Gemini AI chatbot** — answers FAQ about the portfolio owner
- 📬 **Contact form** — submissions stored in PostgreSQL
- 👍 **Like & visit counters** — persisted in PostgreSQL, deduplicated by IP hash
- 🖼️ **Custom chatbot avatar** — admin can upload via dashboard
- 🔐 **JWT-protected admin dashboard** — view contacts, upload avatar
- 🐘 **PostgreSQL database** — Render free tier (1 GB), survives redeploys

## 🚀 Getting started

```bash
# install frontend dependencies
npm install

# start the frontend dev server (opens http://localhost:5173)
npm run dev

# install backend dependencies (separate terminal)
cd server && npm install

# start the backend dev server (http://localhost:3001)
npm run dev
```

### Environment variables

Create `server/.env` for local development:

```env
PORT=3001
DATABASE_URL=postgresql://localhost:5432/portfolio
JWT_SECRET=your-secret-here
ADMIN_USER=qia
ADMIN_PASSWORD=123123
GEMINI_API_KEY=your-gemini-api-key
```

## 🗂️ Project structure

```
.
├── index.html                  # App entry HTML
├── vite.config.ts              # Vite config (with @ alias)
├── tsconfig.json               # TS config for the app
├── render.yaml                 # Render Blueprint (Infrastructure as Code)
├── public/
│   └── favicon.svg
├── server/                     # Express backend
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts            # Express server entry
│       ├── db.ts               # PostgreSQL connection pool + schema
│       ├── db/schema.sql       # Reference schema
│       ├── middleware/
│       │   └── auth.ts         # JWT auth middleware
│       └── routes/
│           ├── auth.ts         # POST /api/login
│           ├── chat.ts         # POST /api/chat (Gemini AI)
│           ├── contact.ts      # POST /api/contact
│           ├── contacts.ts     # GET  /api/contacts (protected)
│           ├── stats.ts        # POST /api/like, /api/visit, GET /api/stats
│           └── assets.ts       # POST /api/assets/avatar, GET /api/avatar
└── src/                        # Vue 3 frontend
    ├── main.ts                 # App bootstrap
    ├── App.vue                 # Root component
    ├── assets/styles/
    │   ├── variables.css       # Design tokens (colors, spacing, type)
    │   └── main.css            # Reset + global styles + utilities
    ├── components/
    │   ├── TheHeader.vue
    │   ├── HeroSection.vue
    │   ├── AboutSection.vue
    │   ├── SkillsSection.vue
    │   ├── ProjectsSection.vue
    │   ├── ExperienceSection.vue
    │   ├── ContactSection.vue
    │   ├── ChatBot.vue         # Gemini AI chatbot widget
    │   ├── TheFooter.vue
    │   ├── AdminLogin.vue      # Admin login page
    │   ├── AdminDashboard.vue  # Admin dashboard (contacts, avatar)
    │   └── AppIcon.vue         # Inline SVG icon set
    ├── composables/
    │   ├── useTheme.ts         # Theme toggle logic
    │   └── useAdmin.ts         # Admin auth state
    └── data/
        └── portfolio.ts        # ← Edit your content here
```

## 🛠️ Customization

Everything shown on the site is driven by [`src/data/portfolio.ts`](src/data/portfolio.ts).
Update the `profile`, `skills`, `projects`, `experience`, and `socials` exports — no
component edits required.

To change colors, fonts, or spacing, edit the tokens in
[`src/assets/styles/variables.css`](src/assets/styles/variables.css).

## 🧰 Tech stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | Vue 3, TypeScript, Vite, CSS        |
| Backend    | Node.js, Express, TypeScript        |
| Database   | PostgreSQL (Render free tier, 1 GB) |
| AI         | Google Gemini (flash-latest)        |
| Auth       | JWT (jsonwebtoken)                  |
| Deployment | Render (Blueprint, auto-provision)  |

## 🚢 Deployment

This project deploys via [Render Blueprint](https://render.com/docs/blueprint-spec). Push to your Git repo and Render auto-provisions:

- **Web service** — Node.js on free tier (512 MB RAM)
- **PostgreSQL** — free tier (1 GB storage, persists across deploys)
- **DATABASE_URL** — auto-injected via `render.yaml`

```bash
git push origin main   # Render picks it up and deploys
```

## 📄 License

MIT — free to use for your own personal site.
