# Mini Roleplaying Game

A mini Dragon Quest–style browser game built with plain HTML, CSS, and JavaScript.

Live demo
- Deploy this repository to a static host such as Vercel (recommended) or GitHub Pages.

About
- Simple single-page RPG with battles, inventory, basic progression, save/load, audio, and a pixel-like GUI.

How to run locally
1. Clone the repo:
   git clone https://github.com/elshayeb0/Mini-Roleplaying-Game.git
2. Change into the directory:
   cd Mini-Roleplaying-Game
3. Install dev dependencies and build:
   npm install
   npm run build
4. Serve the `dist/` folder:
   npx http-server dist -c-1
5. Visit http://localhost:8080 in your browser.

Audio (remote assets)
- Background music (CC-BY, attribution required):
  - "8-Bit Perplexion" by Eric Matyas — http://soundimage.org/wp-content/uploads/2017/10/8-Bit-Perplexion.mp3
  Attribution note: Music from Soundimage.org should be credited. See https://soundimage.org/ for terms.

- SFX (OpenGameArt public domain / CC0 samples):
  - attack: https://opengameart.org/sites/default/files/Attack_2.mp3
  - hit: https://opengameart.org/sites/default/files/Hit_1.mp3
  - coin: https://opengameart.org/sites/default/files/Coin_2.mp3
  - victory: https://opengameart.org/sites/default/files/Victory_1.mp3
  - defeat: https://opengameart.org/sites/default/files/Defeat_1.mp3
  - dodge: https://opengameart.org/sites/default/files/Dodge_1.mp3

The game links to these remote files by default. If you prefer local assets, place files into `assets/sounds/` with the same filenames and the local copies will be used instead.

Pixel GUI & Screenshots
- A retro pixel font (Press Start 2P) and pixel-like UI styling were added.
- Two example screenshots were added in `assets/screenshots/`.

Licenses & Attribution
- Background music is from Soundimage (Eric Matyas) — please credit: "Music by Eric Matyas, www.soundimage.org" where you showcase the project.
- SFX used are from OpenGameArt; verify licenses on the source pages if you plan to redistribute.

Contributing
- Feel free to open PRs or request changes. If you provide audio files or screenshots, I can add them directly and update the README.

Credits
- Built by @elshayeb0
