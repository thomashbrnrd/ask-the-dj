# AskTheDJ

> Turn your phone into a message for the DJ.

A minimal, mobile-first PWA that lets you display a large scrolling text message on your phone screen — perfect for concert requests, festival communication, and crowd interaction.

## Features

- 📱 **Fullscreen scrolling banner** — huge animated text readable from far away
- 🎨 **5 text colors** — white, neon pink, neon green, yellow, electric blue
- ⚡ **3 scroll speeds** — slow, medium, fast
- 🔤 **3 text sizes** — L, XL, XXL
- 💾 **Persistent settings** — saves to localStorage automatically
- 📲 **PWA** — installable, works offline with last saved message
- 🚫 **No login, no backend** — instant usability

## Tech Stack

- [Nuxt 3](https://nuxt.com) (SSG / Static Site Generation)
- [Tailwind CSS](https://tailwindcss.com)
- [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt)
- [Umami Analytics](https://umami.is) (optional)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Generate static site
npm run generate
```

## Environment Variables

Configure Umami analytics by setting these environment variables (optional):

```env
NUXT_PUBLIC_UMAMI_SRC=https://your-umami-instance.com/script.js
NUXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

## GitHub Pages Deployment

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings → Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### 2. (Optional) Configure Umami Analytics

If you want analytics:

1. Go to **Settings → Secrets and variables → Actions → Variables**
2. Add the following repository variables:
   - `NUXT_PUBLIC_UMAMI_SRC` — your Umami script URL
   - `NUXT_PUBLIC_UMAMI_WEBSITE_ID` — your Umami website ID

### 3. Push to Main

Push to the `main` branch and GitHub Actions will automatically:
1. Install dependencies
2. Generate the static site with `nuxt generate`
3. Deploy to GitHub Pages

Your site will be available at `https://<username>.github.io/<repository>/`

### 4. Configure Base URL (if needed)

If deploying to a sub-path (e.g., `/<repo-name>/`), Nuxt's `github_pages` preset handles this automatically.

## Project Structure

```
.
├── composables/
│   ├── useSettings.ts    # Settings state + localStorage persistence
│   └── useDisplay.ts     # Display mode logic + fullscreen API
├── pages/
│   └── index.vue         # Main page (Edit Mode + Display Mode)
├── public/
│   └── icons/            # PWA icons
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions deployment
├── nuxt.config.ts        # Nuxt configuration (SSG, PWA, Tailwind)
└── tailwind.config.ts    # Tailwind configuration
```

## License

MIT
