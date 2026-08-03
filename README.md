# Personal Website

A modern, responsive personal portfolio built with **Vue 3**, **TypeScript**, **Vite**, and plain **CSS**.

## ✨ Features

- ⚡️ **Vite** for instant dev server and lightning-fast builds
- 🧩 **Vue 3 `<script setup>`** single-file components
- 🔒 **Fully typed** with TypeScript (strict mode)
- 🎨 **Design-token system** in CSS custom properties (easy theming)
- 🌗 **Dark / light theme** toggle (persists to `localStorage`, respects OS preference)
- 📱 **Responsive** layout with a mobile menu
- ♿️ **Accessible** — semantic HTML, focus styles, reduced-motion support
- 📝 **Data-driven** — all content lives in [`src/data/portfolio.ts`](src/data/portfolio.ts)

## 🚀 Getting started

```bash
# install dependencies
npm install

# start the dev server (opens http://localhost:5173)
npm run dev

# type-check + build for production
npm run build

# preview the production build locally
npm run preview
```

## 🗂️ Project structure

```
.
├── index.html               # App entry HTML
├── vite.config.ts           # Vite config (with @ alias)
├── tsconfig.json            # TS config for the app
├── tsconfig.node.json       # TS config for vite.config.ts
├── public/
│   └── favicon.svg
└── src/
    ├── main.ts              # App bootstrap
    ├── App.vue              # Root component
    ├── assets/styles/
    │   ├── variables.css    # Design tokens (colors, spacing, type)
    │   └── main.css         # Reset + global styles + utilities
    ├── components/
    │   ├── TheHeader.vue
    │   ├── HeroSection.vue
    │   ├── AboutSection.vue
    │   ├── SkillsSection.vue
    │   ├── ProjectsSection.vue
    │   ├── ExperienceSection.vue
    │   ├── ContactSection.vue
    │   ├── TheFooter.vue
    │   └── AppIcon.vue      # Inline SVG icon set
    ├── composables/
    │   └── useTheme.ts      # Theme toggle logic
    └── data/
        └── portfolio.ts     # ← Edit your content here
```

## 🛠️ Customization

Everything shown on the site is driven by [`src/data/portfolio.ts`](src/data/portfolio.ts).
Update the `profile`, `skills`, `projects`, `experience`, and `socials` exports — no
component edits required.

To change colors, fonts, or spacing, edit the tokens in
[`src/assets/styles/variables.css`](src/assets/styles/variables.css).

## 🧰 Tech stack

| Tool         | Purpose                |
| ------------ | ---------------------- |
| Vue 3        | UI framework           |
| TypeScript   | Type safety            |
| Vite         | Build tool / dev server |
| CSS          | Styling (no framework) |

## 📄 License

MIT — free to use for your own personal site.
