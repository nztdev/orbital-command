# Orbital Command: Roadmap

Static web game (GitHub Pages), installable as a PWA, with a native iOS and Android wrap planned after v1.0.
This replaces the earlier "Orbit Breach" roadmap, which was dropped.

## Where we are: v0.6

| Area | Status |
|---|---|
| Deterministic orbit simulation (`js/sim.js`) | Done: Keplerian rails, several threats at once, nearest-target defenders |
| Menu with realistic globe, HUD style | Done |
| Solar Sandbox | Done (first mode; fleet saved locally) |
| Planetary Defence, levels 1 to 3 | Done: tutorial with Jarvis briefings, live feed, holographic deploy cards, aiming handle |
| Planetary Defence, level 4 (Twin Strike) | Done: first mixed wave, no recommended layout |
| Daily Challenge | Done: seeded by UTC date, solvable by construction, single and mixed-threat days, par scoring, streak, share |
| Effects and sound | Done: per-defender beams, explosions, impact, synthesized siren and sfx, Jarvis voice |
| PWA | Done: install, offline cache (bump `CACHE` in `sw.js` each release) |
| Android testing | Not yet done (iPhone tested) |

## Design decisions so far

- Defenders fire automatically at the nearest living threat in range.
- A level is lost if any threat reaches Earth; it is won when all are destroyed.
- Daily: unlimited retries, best result counts. Unlocks after the three training levels.
- After the tutorial there are no recommended layouts and Jarvis gives less help.
- Orbits are planar and on rails. Tilted orbits and n-body physics are out of scope.

## Milestones

### v0.7: Levels 5 to 8 (no hand-holding)
- Scout satellites and detection: threats are only visible once a scout sees them.
- Larger mixed waves, tighter launch budgets, new defender types.
- Data-only Jarvis briefings. Per-level star targets from solver par.
- Daily history calendar.

### v0.8: Conquest foundation
- Multi-planet map; claim planets to gain launch sites and resources.
- Economy and tech; planet-local orbits.
- Local campaign save and resume, with export and import of the save file.

### v0.9: Polish and beta
- Music, full settings screen (sound, reduced motion, text size), achievements.
- Android and low-end phone performance pass; accessibility pass.
- Closed playtest and balance using headless solver runs.

### v1.0: Release
- Bug bash, privacy policy, credits and asset license audit (NASA Earth imagery attribution).
- Final save-format freeze.
- Native wrap (Capacitor) for iOS and Android, store listings and review.

### After v1.0
- Orbit Duel (PvP): needs a server, accounts and moderation, so it is kept out of the first release.

## Risks

| Risk | Plan |
|---|---|
| Scope of the Conquest campaign | Ship it in slices; each slice must be playable |
| Balance across mixed waves | Use the headless solver to measure random-play win rates per level |
| Solver par differs slightly between devices | Par is a benchmark only; 3 stars never depends on an exact minimum |
| Audio and speech limits on mobile browsers | Tap-to-engage gate; mute and stop-voice controls |
| Store review for a wrapped web app | Keep it app-like: offline, installable, native haptics and lifecycle in the wrapper |

## Definition of done (every version)

- Deployed to GitHub Pages and playable on a phone.
- Simulation checks pass, including solvability of every shipped level.
- `sw.js` cache version bumped; changelog updated.
- At least one outside playtest note recorded.