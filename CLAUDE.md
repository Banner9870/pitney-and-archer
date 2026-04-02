# CLAUDE.md — Standing rules for all agent sessions

This file is read automatically at the start of every Claude Code session.
All rules below apply to every task in this project unless Ellery explicitly overrides them in the session prompt.

---

## Project context

This is the **chicago.com prototype (iteration 2)** — a React + Vite web app and Express backend for Chicago Public Media. It is a user testing prototype, not a production build. It is the successor to the keeley-and-archer prototype.

- **Requirements:** `product-requirements.md` — source of truth for all feature decisions
- **Development plan:** `dev-plan.md` — sequenced build phases, task specs, component inventory, API specs (produced by the dev planning agent)
- **Repository:** https://github.com/Banner9870/pitney-and-archer
- **Deployment:** Railway — two services (`chicago-com-frontend` and `chicago-com-server`) in the `pitney-and-archer` project

---

## Rules

### Before starting any task
1. Read `dev-plan.md` and `product-requirements.md` before writing or modifying any code.
2. Read every file you intend to edit before editing it — never modify a file you haven't read in this session.
3. Confirm the current phase and task numbers match what Ellery asked for before proceeding.

### Scope
4. Complete only the tasks explicitly named in the session prompt. Do not start the next phase or task.
5. Do not modify files outside the scope of the current task. If a fix requires touching something out of scope, flag it and ask.
6. Do not add features, refactor code, or make improvements beyond what the task specifies.

### When blocked or uncertain
7. If a task is blocked by a missing decision, missing API key, or incomplete dependency — stop and surface the blocker. Do not invent a workaround.
8. If a task spec is ambiguous, state your interpretation and ask for confirmation before writing code.
9. If a design question arises mid-task, flag it to Ellery rather than deciding independently.

### Code quality
10. All client-side environment variables must use the `VITE_` prefix — never `REACT_APP_`.
11. Always start both services together: `npm run dev` from the repo root (uses `concurrently`). Never start the client alone.
12. The route `/guide/new` must be declared before `/guide/:id` in the React Router route table — do not reorder routes.
13. Leaflet maps require `import 'leaflet/dist/leaflet.css'` and manual marker icon imports for Vite compatibility. Always include these.
14. Never commit `.env` — it is in `.gitignore`. Use `.env.example` for documenting required variable names.

### Git
15. Commit message format: `Phase N: [short description]` (e.g. `Phase 1: scaffold and design system`)
16. Push to `main` after every phase commit: `git push origin main`
17. If `git push` is rejected, run `git pull --rebase origin main` before pushing again.

### End of session
18. When a phase or task is complete, summarize: which files were changed, what each change does, and any issues or open questions Ellery should review before the next session.
19. Do not start the next phase after completing a summary — wait for Ellery's confirmation.

---

## Key technical decisions (do not re-litigate these)

| Decision | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite | Not Create React App |
| Routing | React Router v6 | See route order note above |
| Styling | CSS Modules | Full control over bold/assertive design system |
| State | React Context + useReducer | One AppContext; shape defined in dev-plan Section 4 |
| Maps (interactive) | react-leaflet + Leaflet.js | Lighter than Google Maps JS API for polygon display |
| Maps (thumbnails) | Google Maps Static API | Simple `<img>` tag, same API key as Places |
| RSS parsing | fast-xml-parser on Express server | rss-to-json is Node-only; can't run in browser |
| Module reordering | Up/down arrow buttons on mobile; drag handles on desktop | No drag-and-drop on mobile |
| Playlist embeds | Standard iframe (no API key) | Spotify embed + Bandcamp embed — no backend required |
| Auth | None | App pre-loads as Alex Rivera (@alexrivera.chicago.com) |
| Cover photos | Unsplash Source URLs + curated picker (~20 photos) | No file upload, no media hosting, no cost |
| Search indexing | Blocked | robots.txt + noindex meta tag both required |

---

## Architect's notes for agents

- The `AppContext` state shape is the contract between all components. Do not add fields to it during component work without updating the spec in `dev-plan.md` first.
- `seed.js` must be complete and smoke-tested before any page component renders real content. Seed data is the foundation — do not skip or stub it.
- The Express server uses an `ALLOWED_ORIGIN` environment variable for CORS — not a hardcoded domain. During local dev, `localhost:5173` is the default. Never use `*` in production.
- `client/Caddyfile` is required for Railway to serve the SPA correctly. Without it, every non-root URL returns 404 in production.
- Guide cards and article cards have **intentionally different visual anatomy** — guides are taller (cover photo required), articles are compact (no cover photo). Do not make them structurally similar.

---

## The module system (new in v2 — read carefully)

Guides are no longer lists of places. A guide is an ordered array of typed **modules**. This is the central concept of v2.

**Six module types:** `place` · `article` · `product` · `event` · `post` · `playlist`

Each module is a discriminated union on the `type` field. The guide detail page renders modules in array order using a type-specific component per module. Do not build a single generic module component — each type has distinct visual treatment (see `product-requirements.md` Section 3.2).

**Module system rules:**
- Every module type has an optional `editorNote` field — this is the guide author's voice attached to each item. It is optional everywhere but encouraged.
- Place modules are the only type that contribute pins to the Leaflet map. The map renders once, below all modules, grouping all place pins together — not one map per place.
- Post modules with body text over 300 characters must collapse to 3 lines with a `Read more` toggle that expands inline. No navigation — expand in place.
- Playlist modules use iframe embeds. For Spotify: convert share URL (`open.spotify.com/playlist/...`) to embed URL (`open.spotify.com/embed/playlist/...`). For Bandcamp: construct embed from the album/track URL. Render a skeleton rectangle while the iframe loads.
- Product modules with `isMemberDeal: true` display a `★ CPM Member Deal` callout in `--gold` with the deal description text. The callout has no link and no action — it is purely cosmetic.

**Seed playlist (Spotify):** `https://open.spotify.com/embed/playlist/37i9dQZF1DWSXBu5naYCM9`

---

## Design system (inherited from keeley-and-archer — do not change)

### Colors
| Token | Value | Usage |
|---|---|---|
| `--red` | `#EF002B` | Primary action, CTAs, active states, Chicago star |
| `--blue` | `#41B6E6` | Secondary accent, neighborhood tags, newsroom content |
| `--white` | `#FFFFFF` | Backgrounds, text on dark |
| `--black` | `#161616` | Primary text, header backgrounds |
| `--gray-100` | `#F5F5F5` | Page background |
| `--gray-200` | `#E0E0E0` | Card borders, dividers |
| `--gray-500` | `#757575` | Secondary text, metadata |
| `--gray-900` | `#212121` | Dark card backgrounds, footer |
| `--gold` | `#C9A84C` | Sponsored guides, CPM member deal callouts |

### Typography
| Role | Font | Weight |
|---|---|---|
| Display headings | Big Shoulders Display | 900 |
| UI headings | Big Shoulders Text | 700 |
| Body text | Inter | 400 / 500 |
| Article / post body | Source Serif 4 | 400 |

**Rules:**
- Neighborhood names and page section titles: uppercase in Big Shoulders Display
- Guide titles: title-case in Big Shoulders Text (not all-caps)
- Metadata (timestamps, handles, counts): Inter 0.8rem, `--gray-500`

### Identity
- Every community member: `@handle.chicago.com`
- Journalists: `@reporter.suntimes.com` or `@reporter.wbez.org`
- Journalist content: ★ badge + "From the newsroom" label
- Sponsored content: gold "Sponsored" pill on cover image

---

## Environment variables

```
VITE_GOOGLE_PLACES_API_KEY=       # Required for guide creation place search
```

This value is available from the v1 project at `../keeley-and-archer/client/.env`. Do not copy that file — transcribe the value into this project's `.env` manually. Do not commit `.env`.

Note: `VITE_CHICAGO_DATA_PORTAL_TOKEN` was removed. Community areas are now loaded from the bundled `public/fallback-community-areas.json` — no Socrata API call is made.

Restrict the Google Places API key in Google Cloud Console to the new Railway domain once it is known. Add `localhost` to the allowlist for local development.

---

## Pre-loaded user

The app launches already signed in as **Alex Rivera**. No authentication, no sign-in screen, no prototype banner.

| Field | Value |
|---|---|
| Display name | Alex Rivera |
| Handle | `@alexrivera.chicago.com` |
| Primary neighborhood | Lincoln Square |
| Years in Chicago | 7 |
| Neighborhood history | Pilsen (2019–2022) → Logan Square (2022–2024) → Lincoln Square (2024–present) |
| Interest badges | Food & Drink · Live Music · Parks & Outdoors · Coffee |

Session reset between test participants: `/?reset=true` or `Shift+R` held 2 seconds — clears session-created guides and resets filter state to seed defaults.
