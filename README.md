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
- This repo is ready to deploy as a static site. I added vercel.json to ensure the single-page app (SPA) always serves index.html for any route.
- To deploy with Vercel via the web UI: New Project → Import Git Repository → select this repo → Framework Preset: None / Static Site → Deploy.
- Or via CLI: npm i -g vercel && vercel --prod

Suggested enhancements (I can implement any of these):
- Add a high-score / save system using localStorage
- Mobile layout improvements / responsive UI
- Add sound effects and background music with an on/off toggle
- Add keyboard controls and accessibility improvements (aria labels, focus management)
- Add screenshots/GIF and demo video in README
- Add unit/integration tests for core game logic
- Add a build script (bundle/minify) and a package.json if you want to use modern tooling

Files added
- README.md — project overview, run and deploy instructions, features, and enhancement ideas
- vercel.json — configuration to rewrite all routes to index.html for SPA behavior on Vercel

Contributing
- Feel free to open PRs or request changes. Tell me which enhancement(s) you'd like and I can implement them and open a pull request.

License
- Add a license file (e.g., MIT) if you want this project to be explicitly licensed.

Credits
- Built by @elshayeb0
