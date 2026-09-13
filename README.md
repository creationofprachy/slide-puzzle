# slide-puzzle
A dependency-free sliding number puzzle game built with vanilla HTML, CSS &amp; JS — 3×3 to 5×5 grids, move counter, timer, and best-score trackingSlide — a number sliding puzzle
A small, dependency-free browser puzzle game. Arrange the tiles from 1 to
15 (or 8, or 24) by sliding them into the empty space. Built with plain
HTML, CSS, and JavaScript — no build step, no frameworks.
Play it live — replace this link with your GitHub Pages URL once deployed (see below).
Features
3×3, 4×4, and 5×5 grid sizes
Move counter and timer
Best-score tracking per grid size (saved in your browser)
Keyboard support (arrow keys) and click/tap controls
Every shuffle is guaranteed solvable
Fully responsive, works on mobile
Running locally
No installation needed. Clone the repo and open `index.html` in a browser:
```bash
git clone https://github.com/<your-username>/slide-puzzle.git
cd slide-puzzle
open index.html   # or just double-click the file
```
Or serve it locally with any static server, e.g.:
```bash
python3 -m http.server 8000
```
then visit `http://localhost:8000`.
Deploying to GitHub Pages
Push this repo to GitHub.
In the repo, go to Settings → Pages.
Under Build and deployment, set Source to `Deploy from a branch`,
pick the `main` branch and `/ (root)` folder, then save.
Your game will be live at `https://<your-username>.github.io/slide-puzzle/`
after a minute or two.
Project structure
```
slide-puzzle/
├── index.html      # markup
├── style.css        # styling and layout
├── script.js         # game logic
├── README.md
└── LICENSE
```
How it works
The board is shuffled by making a long sequence of random valid moves
starting from the solved position, which guarantees every puzzle handed
to the player can actually be solved. Tile positions are driven purely
by CSS (`left`/`top` with a transition), so moves animate smoothly
without any animation library.
License
MIT — see LICENSE..
