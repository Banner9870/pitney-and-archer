# chicago.com Prototype — Technical Guide

For the next engineer picking up this project.

---

## What this is

**chicago.com (pitney-and-archer)** is a React 18 + Vite frontend with an Express backend, deployed on Railway as two separate services. It is a **user-testing prototype** for Chicago Public Media — not production software. There is no real authentication, no persistent database, and no real data storage beyond browser session state.

Repository: https://github.com/Banner9870/pitney-and-archer

---

## Repo structure

```
pitney-and-archer/
├── package.json                    # root — concurrently dev script
├── .gitignore
├── .env.example                    # documents required env var names
├── CLAUDE.md                       # standing rules for AI coding agents
├── dev-plan.md                     # full build plan, all phases
├── product-requirements.md         # source of truth for feature decisions
├── docs/
│   ├── moderator-guide.md          # user testing operations guide
│   └── technical-guide.md          # this file
│
├── client/                         # React + Vite frontend
│   ├── package.json
│   ├── vite.config.js              # proxies /api/* to localhost:3001
│   ├── index.html                  # Google Fonts, noindex meta
│   ├── Caddyfile                   # Railway SPA routing (required — see deployment)
│   ├── public/
│   │   ├── robots.txt              # Disallow: /
│   │   ├── fallback-community-areas.json   # tabular data for all 77 community areas
│   │   └── chicago-community-areas.geojson # boundary polygons for neighborhood map
│   └── src/
│       ├── main.jsx                # ReactDOM.createRoot, wraps with AppProvider + Router
│       ├── App.jsx                 # Route table + Shift+R reset listener
│       ├── styles/globals.css      # CSS custom properties, resets, focus-visible
│       ├── context/AppContext.jsx  # single AppContext + useReducer
│       ├── data/seed.js            # all seeded guides, users, places, badges, photos
│       ├── components/             # shared components (see list below)
│       └── pages/                  # page-level components, one per route
│
└── server/
    └── index.js                    # Express — RSS proxy, CORS
```

---

## How to run locally

### Prerequisites
- Node.js 18+
- npm 9+

### Steps

```bash
# Clone
git clone https://github.com/Banner9870/pitney-and-archer.git
cd pitney-and-archer

# Install all dependencies (root + client + server)
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Copy env vars
cp client/.env.example client/.env
# Fill in VITE_GOOGLE_PLACES_API_KEY and VITE_CHICAGO_DATA_PORTAL_TOKEN
# (see Environment variables section below)

# Start both services together
npm run dev
```

`npm run dev` uses `concurrently` to start:
- Vite dev server at `http://localhost:5173`
- Express server at `http://localhost:3001`

**Never start the client alone** — the RSS proxy and any other API routes live in the Express server.

---

## Environment variables

### Frontend (`client/.env`, not committed)

```
VITE_GOOGLE_PLACES_API_KEY=       # Required for guide creation place search
VITE_CHICAGO_DATA_PORTAL_TOKEN=   # Socrata App Token — optional locally, prevents rate limiting
VITE_API_BASE_URL=                # Leave blank locally; Vite proxy handles /api/* automatically
```

Values for `VITE_GOOGLE_PLACES_API_KEY` and `VITE_CHICAGO_DATA_PORTAL_TOKEN` are available from the v1 project (`../keeley-and-archer/client/.env`). Transcribe them manually — do not copy the file.

### Server (Railway env vars, not in the repo)

```
ALLOWED_ORIGIN=https://chicago-com-frontend.up.railway.app
PORT=<set by Railway automatically>
```

Locally, the Express server defaults to `ALLOWED_ORIGIN=http://localhost:5173` and `PORT=3001`.

---

## Railway deployment

Two services in the `pitney-and-archer` Railway project:

| Service | Build command | Start command | Notes |
|---|---|---|---|
| `chicago-com-frontend` | `npm run build --prefix client` | *(Caddy serves static files)* | **Caddyfile required** — see below |
| `chicago-com-server` | *(none)* | `node server/index.js` | Set `ALLOWED_ORIGIN` and `PORT` env vars |

### The Caddyfile (critical)

`client/Caddyfile` configures Caddy (Railway's default static file server) to serve `index.html` for all non-asset routes. Without it, every non-root URL (e.g. `/guide/guide-001`) returns a 404 in production because there is no actual file at that path — it is a client-side route.

If you see 404s on all pages except `/`, check that the Caddyfile is committed and present in the `client/` directory.

---

## AppContext state shape

The single `AppContext` holds all application state. It is defined in `client/src/context/AppContext.jsx`.

```js
{
  user: User,              // pre-loaded Alex Rivera — never changes
  guides: Guide[],         // seed guides + any session-created guides
  users: User[],           // all seed users
  communityAreas: Area[],  // loaded from /fallback-community-areas.json on mount
  rssArticles: Article[],  // fetched from /api/rss on mount
  feed: {
    filters: {
      contentTypes: string[],   // e.g. ['place', 'playlist']
      badges: string[],          // e.g. ['Food & Drink', 'Coffee']
    }
  },
  likedGuideIds: string[],
  helpfulGuideIds: string[],
  savedGuideIds: string[],
}
```

### Available actions (dispatch types)

| Action type | Payload | Effect |
|---|---|---|
| `ADD_GUIDE` | `Guide` object | Appends to `guides` |
| `LIKE_GUIDE` | guide ID string | Toggles ID in `likedGuideIds` |
| `HELPFUL_GUIDE` | guide ID string | Toggles ID in `helpfulGuideIds` |
| `SAVE_GUIDE` | guide ID string | Toggles ID in `savedGuideIds` |
| `SET_FILTER_CONTENT_TYPES` | `string[]` | Replaces `feed.filters.contentTypes` |
| `SET_FILTER_BADGES` | `string[]` | Replaces `feed.filters.badges` |
| `SET_RSS_ARTICLES` | `Article[]` | Replaces `rssArticles` |
| `SET_COMMUNITY_AREAS` | `Area[]` | Replaces `communityAreas` |
| `RESET_SESSION` | *(none)* | Removes session guides, clears filters + engagement IDs |

### Adding a new action

1. Add a new `case` to `appReducer` in `AppContext.jsx`
2. Do **not** add new fields to the state shape without updating `dev-plan.md` Section 4 first

---

## Seed data

Everything lives in `client/src/data/seed.js`. This is the foundation of the prototype.

### What's in seed.js

- `SEED_GUIDES` — 17 guide objects (guide-001 through guide-017)
- `SEED_USERS` — 9 user objects (5 community members + 4 journalists)
- `SEED_PLACES` — fallback places for the guide creation search
- `BADGES` — the full list of interest badge strings
- `COVER_PHOTOS` — curated Unsplash URLs for the cover photo picker

### Adding a new guide

Add an object to `SEED_GUIDES` following this shape:

```js
{
  id: 'guide-018',              // unique string
  title: 'My Guide Title',
  description: 'Optional description',
  neighborhood: 'Logan Square', // must match a communityAreas name
  additionalNeighborhoods: [],
  badges: ['Food & Drink'],     // must be from the BADGES array
  coverImage: 'https://...',    // Unsplash URL recommended
  authorId: 'user-alex',        // must match a SEED_USERS id
  isEditorsPick: false,
  isReviewed: false,
  isSponsored: false,
  isNewsroom: false,
  createdAt: '2026-01-15T10:00:00Z',
  likeCount: 0,
  helpfulCount: 0,
  collaborators: [],            // array of user IDs
  modules: [ /* see module types below */ ],
}
```

### Adding a new user

Add an object to `SEED_USERS`:

```js
{
  id: 'user-newperson',
  displayName: 'Full Name',
  handle: 'newperson.chicago.com',
  slug: 'newperson',            // used in profile URL: /profile/newperson
  neighborhood: 'Wicker Park',
  yearsInChicago: 3,
  neighborhoodHistory: [
    { name: 'Pilsen', startYear: 2022, endYear: 2024 },
  ],
  badges: ['Coffee'],
  hingePrompts: [
    { prompt: 'My favourite Chicago meal', answer: 'Deep dish at Lou Malnati\'s' },
  ],
  savedGuideIds: ['guide-001'],
  isJournalist: false,
}
```

---

## Module types

A guide is an ordered array of typed modules. The `type` field is a discriminated union.

| Type | Required fields |
|---|---|
| `place` | `placeId`, `name`, `address`, `neighborhood`, `category`, `editorNote` |
| `article` | `title`, `url`, `publication`, `summary` |
| `product` | `name`, `description`, `price`, `where` |
| `event` | `name`, `date`, `venue`, `address` |
| `post` | `body` (>300 chars collapses with Read more toggle) |
| `playlist` | `title`, `platform` (`spotify`\|`bandcamp`), `embedUrl` |

All module types support an optional `editorNote` field.

---

## Key technical decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite | Not Create React App |
| Routing | React Router v6 | `/guide/new` must be declared before `/guide/:id` |
| Styling | CSS Modules | Full control, no runtime cost |
| State | React Context + useReducer | One AppContext; no Redux needed for a prototype |
| Maps (interactive) | react-leaflet + Leaflet.js | Lighter than Google Maps JS API |
| Maps (thumbnails) | Google Maps Static API | Simple `<img>` tag |
| RSS parsing | fast-xml-parser on Express server | rss-to-json is Node-only; can't run in browser |
| Playlist embeds | Standard iframe (no API key) | Spotify + Bandcamp — no backend required |
| Auth | None | App pre-loads as Alex Rivera |
| Cover photos | Unsplash Source URLs | No file upload, no media hosting |
| Search indexing | Blocked | `robots.txt` + `noindex` meta tag |

---

## Known limitations and prototype-specific simplifications

- **No authentication.** The app always loads as Alex Rivera. `@handle.chicago.com` addresses are cosmetic — there is no ATProto integration.
- **No persistent storage.** All state lives in `useReducer`. Refreshing the page resets session-created guides and engagement counts.
- **Dummy feed algorithm.** The feed ordering (Editor's Picks → neighborhood-matched → badge-matched → newsroom → remaining) is deterministic and computed on every render. It is not a real recommendation system.
- **RSS articles are non-critical.** If the Express server is unreachable, the feed renders without article cards. No error is shown to the user.
- **Google Places API is optional.** If `VITE_GOOGLE_PLACES_API_KEY` is missing or the API call fails, place search falls back to `SEED_PLACES` instantly.
- **Bandcamp embeds are limited.** The guide creation flow shows a link card for Bandcamp URLs rather than a live embed, because Bandcamp embed IDs must be extracted server-side. The seeded Bandcamp module in guide-002 uses a hardcoded embed ID.
- **No real follow/share/moderation.** Follow buttons are cosmetic. Share shows a toast. Guide publishing skips an actual review queue.
- **Session reset** clears session state only — it does not reload the page or re-fetch seed data.

---

## Routing rules

1. `/guide/new` **must** be declared before `/guide/:id` in the route table (`App.jsx`). React Router matches routes in order, and `new` would be interpreted as an `:id` parameter otherwise.
2. The `*` catch-all route renders `NotFoundPage` for all unmatched URLs.
3. `/?reset=true` is handled in `AppContext.jsx` on mount — it dispatches `RESET_SESSION` and replaces the URL with `/feed`.

---

## Commit format

Per `CLAUDE.md`:

```
Phase N: short description
```

Example: `Phase 9: polish, error states, and session reset`

Push to `main` after each phase. If push is rejected: `git pull --rebase origin main` first.
