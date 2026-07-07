# Mini Roleplaying Game

A retro single-page RPG built with plain HTML, CSS, and JavaScript, now enhanced for production deployment on Vercel.

## New features

- Animated pixel sprites
  - Player state sprites (idle, attack, hurt)
  - Distinct monster art for slime, fanged beast, and dragon
  - Combat feedback effects (slash flash, hit particles, floating damage)
- Gameplay upgrades
  - Intro/title screen with quick instructions
  - Difficulty modes (Easy/Normal/Hard) that scale monster stats and rewards
  - Combo system for bonus damage on consecutive hits
  - Inventory and stats panel in the HUD
  - Health bars for player and monster
  - Improved shop preview text for items and next weapon upgrade
- UI/UX polish
  - Loading screen while remote audio is preloaded
  - Screen fade transitions between scenes
  - Settings panel for volume, difficulty, and visual effects
  - Keyboard shortcuts for actions (1/2/3), Inventory (I), Settings (S), and Escape to close panels
  - Better button hover/active/focus feedback
- Production readiness
  - Relative asset paths for Vercel/static hosting
  - Remote audio failure handling with non-blocking fallback messaging
  - Minified JavaScript bundle via esbuild
  - SEO/social metadata in `index.html` (`description`, `og:title`, `og:description`, `og:image`)
  - Removed debug window export

## Run locally

1. Clone the repository:
   ```bash
   git clone https://github.com/elshayeb0/Mini-Roleplaying-Game.git
   cd Mini-Roleplaying-Game
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build production files:
   ```bash
   npm run build
   ```
4. Serve `dist/`:
   ```bash
   npx http-server dist -c-1
   ```
5. Open `http://localhost:8080`.

## Deploy to Vercel

### Option A: Vercel dashboard (recommended)
1. Push your latest branch to GitHub.
2. Open [https://vercel.com/new](https://vercel.com/new) and import `elshayeb0/Mini-Roleplaying-Game`.
3. Use these build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy.

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel
vercel --prod
```

The repository already includes `vercel.json` SPA rewrite configuration.

## Audio attribution

- Background music (CC-BY): Eric Matyas — https://soundimage.org/
- SFX samples (OpenGameArt):
  - attack: https://opengameart.org/sites/default/files/Attack_2.mp3
  - hit: https://opengameart.org/sites/default/files/Hit_1.mp3
  - coin: https://opengameart.org/sites/default/files/Coin_2.mp3
  - victory: https://opengameart.org/sites/default/files/Victory_1.mp3
  - defeat: https://opengameart.org/sites/default/files/Defeat_1.mp3
  - dodge: https://opengameart.org/sites/default/files/Dodge_1.mp3

## Build command

- `npm run build` creates optimized production output in `dist/`.
