# Mini Roleplaying Game

A mini Dragon Quest–style browser game built with plain HTML, CSS, and JavaScript.

Live demo
- Deploy this repository to a static host such as Vercel (recommended) or GitHub Pages. See the Vercel section below for a one-click deployment guide.

About
- Simple single-page RPG with battles, inventory, and basic progression. Built as a small showcase project.

How to run locally
1. Clone the repo:
   git clone https://github.com/elshayeb0/Mini-Roleplaying-Game.git
2. Change into the directory:
   cd Mini-Roleplaying-Game
3. Open index.html in your browser (double-click or serve with a static server):
   - Python 3: python -m http.server 8000
   - Node (http-server): npx http-server -c-1
4. Visit http://localhost:8000 in your browser.

Deployment (Vercel)
- This repo is ready to deploy as a static site. vercel.json is included to ensure the single-page app (SPA) always serves index.html for any route.
- To deploy with Vercel via the web UI: New Project → Import Git Repository → select this repo → Framework Preset: None / Static Site → Deploy.
- Or via CLI: npm i -g vercel && vercel --prod

New features added in this update
- Save / load / reset using localStorage (buttons added to the toolbar).
- Auto-save on page unload.
- Responsive/mobile-friendly layout and larger touch targets for small screens.
- Audio: background music and sound effects (SFX) support with on/off toggles. Place audio files in assets/sounds with these filenames: background.mp3, attack.mp3, hit.mp3, victory.mp3, defeat.mp3, coin.mp3, dodge.mp3. The game will work without audio files; sounds are optional.
- Accessibility improvements: skip link, aria-labels, live regions, focus outlines, and screen-reader status updates.

Build / production bundle
This project includes a minimal esbuild-based bundler.

1. Install dependencies:
   npm install
2. Build production bundle:
   npm run build
3. The production-ready static site will be in the `dist/` folder. You can serve it with a static server:
   npx http-server dist -c-1

Package.json and build script added. The build copies index.html and style.css to `dist/` and bundles the JS into `dist/main.js`.

Screenshots
- To add screenshots to this README, create a folder `assets/screenshots/` and add images, for example `assets/screenshots/screen1.png`.
- Then add Markdown like:

  ![Gameplay screenshot 1](assets/screenshots/screen1.png)

- If you'd like, upload screenshots here and I will add them to the README for you.

Contributing
- Feel free to open PRs or request changes. Tell me which enhancement(s) you'd like and I can implement them and open a pull request.

License
- Add a license file (e.g., MIT) if you want this project to be explicitly licensed.

Credits
- Built by @elshayeb0
