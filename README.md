# Orbital Command

Browser-based orbital strategy games. Static site, no build step.

## Structure

```
orbital-command/
├── index.html            # intro page and mode selector
├── defence.html          # Planetary Defence: 3D globe with stage-driven HUD panels
├── solar-sandbox.html    # Solar Sandbox
├── manifest.webmanifest  # PWA manifest (install to home screen)
├── sw.js                 # service worker: offline play and caching
├── icons/                # app icons
├── js/
│   ├── sim.js            # deterministic orbit simulation and level data (no DOM)
│   └── globe.js          # realistic Earth (CDN textures, generated fallback)
└── README.md
```

## Deploy on GitHub Pages

1. Commit all files to the repository root on `main`.
2. Settings > Pages > Source: **Deploy from a branch** > `main` / `(root)`.
3. The game is served at `https://<your-username>.github.io/orbital-command/`.

## Notes

- Links between pages and scripts are relative, so keep the folder layout above.
- Three.js loads from cdnjs. The menu globe loads NASA Earth textures from jsDelivr (three.js examples) and falls back to a generated globe if they cannot load.
- Earth imagery credit: NASA, as distributed with the three.js examples. Check the terms before store release.
- Progress and the Solar Sandbox fleet are saved in the browser (localStorage).
- **Offline / install:** after one online visit the pages, Three.js, fonts and Earth textures are cached, so the game runs offline and can be added to the home screen. Bump `CACHE` in `sw.js` (for example `oc-v2`) on each release so players get updates.
- **Daily Challenge:** `defence.html?daily=1` generates a seeded puzzle from the UTC date (same for everyone, no server). It unlocks in the menu after the three training levels. Progress, attempts and streak are stored in `localStorage` (`od2d`).
