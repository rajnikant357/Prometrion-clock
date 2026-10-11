# ⏱️ Online clock — Prometrion

An ultra-refined, high-precision digital clock built with **modern web standards** and **Vercel's signature design system** (Geist typography, crisp monochrome palette, subtle glassmorphism, responsive dot matrix background), featuring the official **Prometrion** identity, **Universal App Branding & About System**, and full **SEO, OpenGraph, PWA, and GEO metadata**.

🌐 **Production Website**: [www.clock.prometrion.com](https://www.clock.prometrion.com/)  
🏢 **Parent Company**: [Prometrion](https://www.prometrion.com/)  
💻 **Developer**: [Rajnikant Gaurav](https://www.rajnikantg.in/)  

---

## 🏷️ App Identity (`AppInfo`)

```text
App Name:          Online clock
App Description:   A precision digital clock with dark and light theme toggle across global timezones.
Domain:            https://www.clock.prometrion.com/
Version:           1.0.0
Build Number:      1
Parent Company:    Prometrion (https://www.prometrion.com/)
Developer:         Rajnikant Gaurav (https://www.rajnikantg.in/)
Copyright:         © 2026 Prometrion. All rights reserved.
```

---

## ✨ Features

- **Automatic Device Timezone Detection**:
  - Automatically identifies client device timezone via `Intl.DateTimeFormat().resolvedOptions().timeZone` upon launch with zero manual setup.
  - Interactive selection across 6 global timezones:
    - **Coordinated Universal Time (UTC)**
    - **New York (EDT)** (`America/New_York`)
    - **London (BST)** (`Europe/London`)
    - **New Delhi / IST** (`Asia/Kolkata`)
    - **Tokyo (JST)** (`Asia/Tokyo`)
    - **Sydney (AEDT)** (`Australia/Sydney`)
- **2-Mode Icon-Only Theme Switcher**:
  - Clean bimodal segmented switch: **Sun (Light)** and **Moon (Dark)**.
  - Automatically respects system `prefers-color-scheme` preferences and listens for real-time OS theme changes.
  - Zero FOUC (Flash of Unstyled Content) via inline `<head>` color-scheme scripts.
  - Fluid transitions powered by the modern **View Transitions API**.
- **Precision Time Engine & Formatting**:
  - Sub-millisecond drift-free synchronization with `requestAnimationFrame`.
  - Tabular monospace numbers (`Geist Mono`) to prevent digit shaking/jitter.
  - 12-Hour format with matching **AM / PM** box separated by a pulsing colon.
  - 24-Hour format toggle.
  - Customizable seconds display (Show / Hide).
  - Real-time **Day Elapsed Progress Meter** with percentage breakdown.
- **Ambient Fullscreen Mode**:
  - Press <kbd>F</kbd> or click the corner icon to enter distraction-free fullscreen view.
  - Automatically isolates only the massive clock digits and current date while hiding all toolbars and metrics.
- **Synthesized Audio Chimes**:
  - Gentle dual sine-wave chord (D5 to A5) hourly chime synthesized directly via the Web Audio API with zero audio asset downloads.
- **Knowledge, FAQ & Privacy Screen**:
  - Revealed by scrolling down past the footer.
  - Technical architecture breakdown of the timing engine.
  - Interactive FAQ accordion with 6 comprehensive answers.
  - Privacy policy declaring **100% private, zero data collection, no cookies, no tracking scripts**.
- **Universal App Branding & About Modal**:
  - Modular `app-info.js` specification.
  - Accessible via footer link, knowledge screen buttons, or pressing <kbd>A</kbd>.

---

## 🔍 SEO, OpenGraph & PWA Specifications

- **Canonical URL**: `https://www.clock.prometrion.com/`
- **OpenGraph**: Complete `og:title`, `og:description`, `og:url`, `og:image`, `og:image:secure_url`, `og:image:width`, `og:image:height`, `og:locale`, and alternate locales.
- **Twitter Cards**: `summary_large_image` with domain verification.
- **PWA Web App Manifest**: [`manifest.json`](manifest.json) configured for standalone mobile and desktop installation.
- **Robots & Sitemap**:
  - [`robots.txt`](robots.txt)
  - [`sitemap.xml`](sitemap.xml)
- **Structured Data (Schema.org JSON-LD)**:
  - `WebSite`
  - `WebApplication`
  - `Organization` (Prometrion)
  - `Person` (Rajnikant Gaurav)
  - `BreadcrumbList`
  - `FAQPage` (Google rich snippet accordions in search results)
- **Geo Meta Tags**:
  - `geo.region`: `US-NY;GB-LND;IN-DL;JP-13;AU-NSW`
  - `geo.placename`: `Global World Clock (UTC, New York, London, New Delhi, Tokyo, Sydney)`

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>F</kbd> | Toggle Fullscreen Mode |
| <kbd>T</kbd> | Toggle Theme (Light ↔ Dark) |
| <kbd>Space</kbd> | Toggle 12-Hour / 24-Hour Format |
| <kbd>S</kbd> | Show / Hide Seconds Display |
| <kbd>A</kbd> | Open / Close About Screen Modal |
| <kbd>Esc</kbd> | Exit Fullscreen or Close Modal |

---

## 🚀 Building & Running Locally

```bash
# Development server (serves root)
npm run dev

# Production build (compiles and packages into dist/)
npm run build

# Preview production build from dist/
npm run preview
# or
npm start
```

---

## ☁️ Deploying to Vercel

Online clock is configured for automated, high-performance deployment on [Vercel](https://vercel.com/):

### Option 1: Vercel Git Integration (Recommended)
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the project in your [Vercel Dashboard](https://vercel.com/new).
3. Vercel automatically detects the build configuration in [`vercel.json`](vercel.json):
   - **Build Command**: `node build.js` (or `npm run build`)
   - **Output Directory**: `dist`
4. Click **Deploy**. Vercel will build the `dist/` directory and deploy it with production headers, HTTP/3, and edge CDN distribution.

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy directly
vercel

# Deploy to production domain (www.clock.prometrion.com)
vercel --prod
```

### 📁 Production `dist/` Directory Structure
```text
dist/
├── index.html                    # SEO & OpenGraph optimized application shell
├── styles.css                    # Vercel monochrome design tokens & fluid layouts
├── app.js                        # Drift-free RAF clock engine & user controls
├── app-info.js                   # Universal Prometrion AppInfo branding system
├── manifest.json                 # PWA standalone web app manifest
├── robots.txt                    # Search crawler instructions & sitemap link
├── sitemap.xml                   # Canonical XML sitemap
├── favicon.ico                   # Browser favicon
├── prometrion-logo.png           # 500x500 high-resolution brand asset
├── prometrion-logo.svg           # Scalable theme-aware vector asset
├── vercel.json                   # Edge headers & caching rules
└── public/                       # Static public assets (icons & logos)
    ├── Prometrion logo2.png
    ├── prometrion-logo.png
    └── prometrion-logo.svg
```
