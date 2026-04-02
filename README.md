# chicago.com prototype (pitney-and-archer)

**A user-testing prototype for Chicago Public Media.** Built to answer one central question: does the idea of a "multi-module guide" — a mix of places, articles, playlists, events, posts, and products in a single shareable container — make sense to people, and would they want to make one?

This is the second prototype iteration. The first (keeley-and-archer) tested guides as simple lists of places. This one tests the evolution of that concept.

**Live (Railway):** [chicago-com-frontend.up.railway.app](https://chicago-com-frontend.up.railway.app)
**Repo:** [github.com/Banner9870/pitney-and-archer](https://github.com/Banner9870/pitney-and-archer)

---

## What it is

chicago.com is a hyperlocal engagement platform being developed by [Chicago Public Media](https://www.chicagopublicmedia.org) — home to the Chicago Sun-Times and WBEZ. The platform is being co-developed with [New Public's Roundabout](https://newpublic.org/roundabout), an AT Protocol-based community product built for neighborhood-level trust.

This prototype is **not** a production build. There is no login, no database, and nothing persists between browser refreshes. It is designed to be loaded in front of real users in a moderated research session so that the design team can observe how people respond to the interface.

### What users can do in the prototype

- **Browse a realistic feed** — 17 seeded guides spanning multiple Chicago neighborhoods and content types, mixed with live RSS headlines from the Chicago Sun-Times and WBEZ
- **Open a guide** and read a multi-module layout: places, editorial posts, playlists (Spotify and Bandcamp embeds), events, products, and linked articles — in any combination
- **Create a new guide** — a full three-step wizard: basics → add modules → review and publish. The new guide persists for the rest of the session
- **Remix an existing guide** — copy a guide with attribution, then make it your own
- **Browse a profile** — personality-forward, centered on neighborhood history and "hinge prompt"-style answers rather than a guide count
- **Explore by neighborhood** — all 77 Chicago community areas, each with a boundary map, guide cards, and newsroom content

### What is intentionally non-functional

- Follow buttons, share buttons (except a "Link copied!" toast), and like/helpful counts persist only within the session
- The app always loads pre-signed-in as **Alex Rivera** (`@alexrivera.chicago.com`) — there is no sign-in screen
- AT Protocol handles (`@alexrivera.chicago.com`) are cosmetic — there is no real ATProto integration
- There is no moderation queue — guides "publish" immediately to the session feed

### Session reset

Between test participants, reset the prototype via:
- **URL param:** append `/?reset=true` to any URL
- **Keyboard:** hold Shift+R for 2 seconds

This clears session-created guides, filter selections, and engagement counts. It does not reset seeded data.

See [docs/moderator-guide.md](docs/moderator-guide.md) for a full guide to running user testing sessions.

---

## How I built this with Claude

This prototype was built almost entirely by AI coding agents — specifically Claude (Anthropic), accessed through the Claude Code CLI. I wrote the requirements and design decisions; Claude wrote the code.

### The approach

The build was organized into 10 sequential phases, each designed to be completable in a single Claude Code session. Before any code was written, two documents were created:

- **`product-requirements.md`** — the source of truth for all feature decisions, written from a product perspective
- **`dev-plan.md`** — an agent-facing build guide with phase-by-phase task specs, component inventories, API specs, and smoke tests. This was produced by a planning agent session before any code was written.

Each coding session followed a strict discipline: read the dev plan and product requirements, complete only the named phase, stop and surface blockers rather than inventing workarounds, and commit with a consistent format (`Phase N: description`).

### What worked well

- **Front-loading the planning.** Investing time in `dev-plan.md` before writing any code meant each coding session had precise enough specs that the agent rarely needed to make design decisions independently. When it did, the rules in `CLAUDE.md` governed what to do.
- **Phase-by-phase scope discipline.** Each phase built on a working foundation. There was no mid-build refactoring spiral because the agent was explicitly forbidden from "improving" things outside the named task.
- **Seeded data as the foundation.** `seed.js` — 17 complete guides, 8 users, 80+ places — was built in Phase 2 before any pages were rendered. This meant every page immediately had realistic content to work with.
- **CLAUDE.md as a persistent ruleset.** This file is read at the start of every session and contains standing rules: never use `REACT_APP_` prefixes, always start both services together, the CHISTAR ligature implementation, the `/guide/new` must-come-before-`/guide/:id` routing rule. It prevented repeating the same corrections across sessions.

### What was harder

- **Visual work.** CSS was the area where the most back-and-forth occurred. The agent followed specs accurately but visual judgment — "this feels cluttered" — required human review and a dedicated cleanup phase (Phase 10).
- **Incremental bugs.** A few issues accumulated across phases (a broken Unsplash URL, a missing Socrata fallback) that required dedicated fix commits. Small things that don't show up in a spec.
- **Bandcamp embed IDs.** The Bandcamp embed for guide-002 required fetching a page and extracting a numeric album ID from the HTML — a good example of a step that required explicit disambiguation in the dev plan before the agent could proceed without inventing a workaround.

### The agent session rules

The full ruleset is in [CLAUDE.md](CLAUDE.md). Key principles:
- Read the plan and requirements before writing code
- Complete only the explicitly named phase
- Don't add features, refactor, or improve beyond the spec
- Stop and surface blockers rather than inventing solutions
- Commit format: `Phase N: short description`

---

## Technical overview

**Stack:** React 18 + Vite (frontend) · Express (backend) · CSS Modules · React Context + useReducer (state) · react-leaflet (neighborhood maps) · Deployed on Railway

### Prerequisites

- Node.js 18+
- npm 9+
- A Google Places API key (for place search in guide creation — falls back to seeded data if absent)

### Running locally

```bash
git clone https://github.com/Banner9870/pitney-and-archer.git
cd pitney-and-archer

# Install dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Set environment variables
cp client/.env.example client/.env
# Add your VITE_GOOGLE_PLACES_API_KEY

# Start both services
npm run dev
```

`npm run dev` uses `concurrently` to start:
- Vite dev server at `http://localhost:5173`
- Express server at `http://localhost:3001` (RSS proxy + API routes)

**Always start both together.** The feed requires the Express RSS proxy.

### Key directories

```
client/src/
  data/seed.js          ← All guides, users, places — start here
  context/AppContext.jsx ← All state, reducer, actions
  components/modules/   ← One component per guide module type
  pages/                ← One directory per route
server/
  index.js              ← Express entry point
  routes/rss.js         ← RSS proxy with in-memory cache
```

### Deployment (Railway)

Two Railway services in the `pitney-and-archer` project:

| Service | Notes |
|---|---|
| `chicago-com-frontend` | Vite build served by Caddy. **Requires `client/Caddyfile`** for SPA routing — without it, all non-root URLs return 404. |
| `chicago-com-server` | Express. Set `ALLOWED_ORIGIN` env var to the frontend's Railway URL. |

### Environment variables

```
# client/.env (not committed)
VITE_GOOGLE_PLACES_API_KEY=   # Places search in guide creation
VITE_API_BASE_URL=            # Leave blank locally; set to Express Railway URL in production

# server (Railway env vars)
ALLOWED_ORIGIN=               # Frontend Railway URL
PORT=                         # Set by Railway automatically
```

### Architecture notes

- **State:** A single `AppContext` (React Context + `useReducer`) holds all application state. The shape is the contract between all components — do not add fields without updating `dev-plan.md` Section 3 first.
- **Routing:** `/guide/new` must be declared before `/guide/:id` in `App.jsx`. React Router matches in order; `new` would be treated as an `:id` parameter otherwise.
- **Module system:** A guide is an ordered array of typed modules. Six types: `place` · `article` · `product` · `event` · `post` · `playlist`. Each type has its own display component in `components/modules/`.
- **Neighborhood data:** Community area boundaries come from a bundled GeoJSON file (`client/public/chicago-community-areas.geojson`) — no live API call. Tabular data (names, IDs, populations) falls back to `client/public/fallback-community-areas.json`.
- **Search indexing blocked:** `client/public/robots.txt` and a `<meta name="robots" content="noindex, nofollow">` tag in `index.html` prevent search engines from indexing the prototype.

For full technical documentation see [docs/technical-guide.md](docs/technical-guide.md).
For user testing operations see [docs/moderator-guide.md](docs/moderator-guide.md).

---

## Project context

This is **iteration 2** of the chicago.com prototype. The design system (colors, typography, card anatomy) is inherited from iteration 1 (keeley-and-archer) and was validated in that round of user testing.

**What's new in iteration 2:**
- Guides as multi-module containers (vs. place lists in v1)
- Sponsored guide + CPM Member Deal model
- Remix flow with attribution
- Personality-forward profile page with neighborhood history and hinge prompts
- Newsroom content integration (Sun-Times + WBEZ bylines and RSS articles in the feed)

---

*Made in Chicago, for Chicago.*
