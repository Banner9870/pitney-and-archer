# chicago.com Prototype — Development Plan

**Version:** 1.0  
**Date:** 2026-04-01  
**Project:** pitney-and-archer (successor to keeley-and-archer)  
**Purpose:** Agent-facing build guide. Each coding agent session must read this document plus `product-requirements.md` before writing any code. Complete only the phase(s) explicitly named in the session prompt.

---

## Section 1: Project Overview

This is the **chicago.com prototype (iteration 2)** — a React 18 + Vite frontend with an Express backend, deployed on Railway. It is a user-testing prototype for Chicago Public Media to validate the multi-module guides concept.

The repository is empty at project start (only markdown docs exist). Agents will build it phase by phase. Each phase is designed to be completable in a single session.

**Not in scope:** authentication, real ATProto, real Roundabout integration, persistent storage beyond session state, production hardening, file uploads, real moderation queues.

**Known PRD internal inconsistency (do not re-litigate):** PRD Section 4.1 says "at least 2 guides with 3+ module types" but PRD Section 6 says "at least 4." The dev plan targets 4+ (the higher requirement). All 17 seeded guides have 3+ module types, so this is overmet regardless.

---

## Section 2: Repository Structure

```
pitney-and-archer/
├── package.json                    # root — concurrently dev script
├── .gitignore
├── .env.example
├── CLAUDE.md
├── dev-plan.md
├── product-requirements.md
├── prototype-requirements.md       # source document from Ellery; read-only reference
├── docs/
│   ├── moderator-guide.md          # created in Phase 9
│   └── technical-guide.md          # created in Phase 9
│
├── client/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html                  # Google Fonts, noindex meta
│   ├── public/
│   │   ├── robots.txt
│   │   ├── fallback-community-areas.json   # static fallback for Socrata tabular data
│   │   └── chicago-community-areas.geojson # bundled GeoJSON for all 77 boundaries
│   ├── Caddyfile                   # Railway SPA routing (required)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # React Router route table
│       ├── styles/
│       │   └── globals.css         # CSS custom properties + resets
│       ├── types/
│       │   └── index.ts            # all TypeScript type definitions
│       ├── context/
│       │   └── AppContext.jsx      # context, reducer, provider, hook
│       ├── data/
│       │   └── seed.js             # all guides, users, places, badges, photos
│       ├── components/
│       │   ├── Header/
│       │   │   ├── Header.jsx
│       │   │   └── Header.module.css
│       │   ├── Footer/
│       │   │   ├── Footer.jsx
│       │   │   └── Footer.module.css
│       │   ├── Layout/
│       │   │   ├── Layout.jsx
│       │   │   └── Layout.module.css
│       │   ├── GuideCard/
│       │   │   ├── GuideCard.jsx
│       │   │   └── GuideCard.module.css
│       │   ├── ArticleCard/
│       │   │   ├── ArticleCard.jsx
│       │   │   └── ArticleCard.module.css
│       │   ├── FilterPanel/
│       │   │   ├── FilterPanel.jsx
│       │   │   └── FilterPanel.module.css
│       │   ├── SkeletonCard/
│       │   │   ├── SkeletonCard.jsx
│       │   │   └── SkeletonCard.module.css
│       │   ├── SkeletonArticleCard/
│       │   │   ├── SkeletonArticleCard.jsx
│       │   │   └── SkeletonArticleCard.module.css
│       │   ├── Toast/
│       │   │   ├── Toast.jsx
│       │   │   ├── Toast.module.css
│       │   │   └── useToast.js     # hook: { showToast } — used by all phases
│       │   ├── FeedInfoModal/
│       │   │   ├── FeedInfoModal.jsx
│       │   │   └── FeedInfoModal.module.css
│       │   ├── modules/
│       │   │   ├── PlaceModuleCard.jsx
│       │   │   ├── PlaceModuleCard.module.css
│       │   │   ├── ArticleModuleCard.jsx
│       │   │   ├── ArticleModuleCard.module.css
│       │   │   ├── ProductModuleCard.jsx
│       │   │   ├── ProductModuleCard.module.css
│       │   │   ├── EventModuleCard.jsx
│       │   │   ├── EventModuleCard.module.css
│       │   │   ├── PostModuleCard.jsx
│       │   │   ├── PostModuleCard.module.css
│       │   │   ├── PlaylistModuleCard.jsx
│       │   │   └── PlaylistModuleCard.module.css
│       │   ├── GuideMap/
│       │   │   ├── GuideMap.jsx
│       │   │   └── GuideMap.module.css
│       │   ├── HingePromptCard/
│       │   │   ├── HingePromptCard.jsx
│       │   │   └── HingePromptCard.module.css
│       │   └── ErrorBoundary/
│       │       └── ErrorBoundary.jsx
│       └── pages/
│           ├── FeedPage/
│           │   ├── FeedPage.jsx
│           │   └── FeedPage.module.css
│           ├── GuideDetailPage/
│           │   ├── GuideDetailPage.jsx
│           │   └── GuideDetailPage.module.css
│           ├── GuideCreatePage/
│           │   ├── GuideCreatePage.jsx
│           │   ├── GuideCreatePage.module.css
│           │   ├── StepBasics.jsx
│           │   ├── StepBasics.module.css
│           │   ├── StepModules.jsx
│           │   ├── StepModules.module.css
│           │   ├── StepReview.jsx
│           │   ├── StepReview.module.css
│           │   ├── ModuleListPanel.jsx
│           │   ├── ModuleListPanel.module.css
│           │   └── forms/
│           │       ├── PlaceSearchForm.jsx
│           │       ├── PlaceSearchForm.module.css
│           │       ├── ArticlePickerForm.jsx
│           │       ├── ArticlePickerForm.module.css
│           │       ├── ProductForm.jsx
│           │       ├── ProductForm.module.css
│           │       ├── EventForm.jsx
│           │       ├── EventForm.module.css
│           │       ├── PostForm.jsx
│           │       ├── PostForm.module.css
│           │       ├── PlaylistForm.jsx
│           │       └── PlaylistForm.module.css
│           ├── GuideRemixPage/
│           │   ├── GuideRemixPage.jsx
│           │   └── GuideRemixPage.module.css
│           ├── NeighborhoodPage/
│           │   ├── NeighborhoodPage.jsx
│           │   └── NeighborhoodPage.module.css
│           ├── ProfilePage/
│           │   ├── ProfilePage.jsx
│           │   └── ProfilePage.module.css
│           ├── ExplorePage/
│           │   ├── ExplorePage.jsx
│           │   └── ExplorePage.module.css
│           └── NotFoundPage.jsx
│
└── server/
    ├── package.json
    ├── index.js                    # Express entry point
    └── routes/
        └── rss.js                  # RSS proxy route
```

---

## Section 3: Architecture

### AppContext State Shape

This is the **contract between all components**. Do not add fields without updating this spec first.

```javascript
// client/src/context/AppContext.jsx

const initialState = {
  user: {}, // pre-loaded Alex Rivera (see Section 5 Users)

  guides: [], // seeded guides + session-created guides (ADD_GUIDE appends)

  users: [], // all seeded users (8 minimum). User shape includes `slug` (URL-safe id, e.g. 'alexrivera') and `savedGuideIds: string[]` (for display on non-Alex profiles)

  communityAreas: [], // array of { id, name, slug, population, adjacentNeighborhoods }
                      // populated from Socrata on init; falls back to static JSON

  rssArticles: [], // array of { id, title, url, summary, source, publishedAt, isCitywide }
                   // populated from Express RSS proxy on init

  feed: {
    filters: {
      contentTypes: [], // [] = no filter; values: 'place','article','product','event','post','playlist'
      badges: []        // [] = no filter; values from BADGES constant
    }
  },

  likedGuideIds: [],   // guide IDs the session user has liked
  helpfulGuideIds: [], // guide IDs the session user has marked helpful
  savedGuideIds: []    // guide IDs the session user has saved
}
```

**Actions:**
```javascript
{ type: 'ADD_GUIDE', payload: Guide }
{ type: 'LIKE_GUIDE', payload: guideId }          // toggles like
{ type: 'HELPFUL_GUIDE', payload: guideId }        // toggles helpful
{ type: 'SAVE_GUIDE', payload: guideId }           // toggles saved
{ type: 'SET_FILTER_CONTENT_TYPES', payload: string[] }
{ type: 'SET_FILTER_BADGES', payload: string[] }
{ type: 'SET_RSS_ARTICLES', payload: RSSArticle[] }
{ type: 'SET_COMMUNITY_AREAS', payload: CommunityArea[] }
{ type: 'RESET_SESSION' }  // clears session guides + filter state
```

**RESET_SESSION behavior:** removes all guides where `isSessionCreated === true` from `guides`, resets `feed.filters` to `{ contentTypes: [], badges: [] }`, clears `likedGuideIds`, `helpfulGuideIds`, `savedGuideIds`.

### Supporting Types (define in `types/index.ts`)

```typescript
type RSSArticle = {
  id: string                  // e.g. 'rss-suntimes-0'
  title: string
  url: string
  summary: string             // first 200 chars, HTML stripped
  source: 'suntimes' | 'wbez'
  publishedAt: string         // ISO 8601
  isCitywide: boolean         // always true for RSS articles
}

type CommunityArea = {
  id: string                          // community area number as string, e.g. '23'
  name: string                        // title case, e.g. 'Humboldt Park'
  slug: string                        // URL-safe, e.g. 'humboldt-park'
  population?: number                 // from Socrata tabular data; may be absent
  adjacentNeighborhoods?: string[]    // optional — not available from Socrata; omit if unknown
}
```

`adjacentNeighborhoods` is intentionally optional — the Socrata community areas dataset does not include adjacency data. Omit it from `fallback-community-areas.json` and the Socrata fetch. The NeighborhoodPage stats strip renders this field only if it is non-empty.

### Data Flow

```
seed.js ──────────────────────────────────► AppContext (initialState)
                                                │
Express /api/rss ──── fetch on App mount ──────► SET_RSS_ARTICLES
Socrata API ──────── fetch on App mount ───────► SET_COMMUNITY_AREAS
                     (+ static fallback)
                                                │
React components ◄── useAppContext() ───────────┘
                          │
                     dispatch actions
                          │
                     reducer updates state
                          │
                     all subscribers re-render
```

### Component Inventory

**Shell components**
- `Header` — wordmark, nav (Feed, Explore, Neighborhoods dropdown), Create Guide button, Alex Rivera account chip
- `Footer` — flag decoration, links, tagline
- `Layout` — max-width wrapper, two-column grid (main + sidebar) with mobile collapse

**Feed components**
- `GuideCard` — props: `guide: Guide, showBadges?: boolean`. Renders all visual states.
- `ArticleCard` — props: `article: RSSArticle`
- `FilterPanel` — reads/writes feed.filters via context dispatch
- `SkeletonCard` — guide skeleton (6 shown on initial load)
- `FeedInfoModal` — "How your feed works" modal

**Module components** (used in GuideDetailPage and StepReview)
- `PlaceModuleCard` — props: `module: PlaceModule`
- `ArticleModuleCard` — props: `module: ArticleModule`
- `ProductModuleCard` — props: `module: ProductModule`
- `EventModuleCard` — props: `module: EventModule`
- `PostModuleCard` — props: `module: PostModule` — includes read-more collapse
- `PlaylistModuleCard` — props: `module: PlaylistModule` — includes iframe skeleton

**Map component**
- `GuideMap` — props: `placeModules: PlaceModule[], collapsible?: boolean`. Renders react-leaflet map with all place pins. Must import `'leaflet/dist/leaflet.css'` and fix Leaflet default marker icon.

**Profile components**
- `HingePromptCard` — props: `prompt: string, answer: string`

**Creation components**
- `StepBasics` — step 1 form
- `StepModules` — step 2 module builder
- `StepReview` — step 3 read-only preview
- `ModuleListPanel` — ordered list of added modules with reorder + remove
- `PlaceSearchForm`, `ArticlePickerForm`, `ProductForm`, `EventForm`, `PostForm`, `PlaylistForm`

**Utility**
- `ErrorBoundary` — wraps entire app
- `Toast` / `useToast` — shared toast notification system. Built in Phase 1. Used by all subsequent phases. Props: `message: string, duration?: number (default 4000)`. Renders a fixed bottom-center banner that auto-dismisses. `useToast()` hook returns `{ showToast(message, duration?) }`. Do not build ad-hoc toasts in individual phases — always import `useToast`.
- `SkeletonArticleCard` — animated shimmer card matching ArticleCard dimensions. Built in Phase 3 alongside `SkeletonCard`.

---

## Section 4: API Specs

### RSS Proxy (Express server)

```
GET /api/rss?source=suntimes
GET /api/rss?source=wbez
```

Response shape (array):
```json
[
  {
    "id": "rss-suntimes-abc123",
    "title": "Article headline",
    "url": "https://chicago.suntimes.com/...",
    "summary": "First 200 chars of description",
    "source": "suntimes",
    "publishedAt": "2026-03-28T14:00:00Z",
    "isCitywide": true
  }
]
```

Feed URLs:
- Sun-Times: `https://chicago.suntimes.com/rss/index.xml`
- WBEZ: `https://www.wbez.org/rss/index.xml`

Parse with `fast-xml-parser`. Extract: `item.title`, `item.link`, `item.description` (strip HTML tags), `item.pubDate`. Generate `id` from source + MD5/hash of URL or just `${source}-${index}`.

CORS: set `Access-Control-Allow-Origin` to `process.env.ALLOWED_ORIGIN` (default: `http://localhost:5173`).

### Google Places API

```
POST https://places.googleapis.com/v1/places:searchText
Headers:
  X-Goog-Api-Key: process.env.VITE_GOOGLE_PLACES_API_KEY
  X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress,places.types,places.rating,places.userRatingCount,places.photos
Body: {
  "textQuery": "[search term] Chicago",
  "locationBias": {
    "rectangle": {
      "low": { "latitude": 41.644, "longitude": -87.940 },
      "high": { "latitude": 42.023, "longitude": -87.524 }
    }
  }
}
```

This runs **client-side** (Vite app, key in `VITE_GOOGLE_PLACES_API_KEY`). If the API call fails or key is missing, fall back to filtering the seeded places array by matching the search term against `name` and `neighborhood` fields.

### Socrata — Chicago Community Areas

```
GET https://data.cityofchicago.org/resource/igwz-8jzy.json
  ?$limit=100
  &$$app_token=process.env.VITE_CHICAGO_DATA_PORTAL_TOKEN  (optional)

GET https://data.cityofchicago.org/resource/igwz-8jzy.geojson
  (for neighborhood boundary GeoJSON per neighborhood page)
```

Normalize community area names to title case for display. Generate `slug` by lowercasing and replacing spaces with hyphens (e.g. `"Humboldt Park"` → `"humboldt-park"`). Store in context via `SET_COMMUNITY_AREAS`.

If Socrata is unavailable, load `public/fallback-community-areas.json` (bundled static file containing all 77 community areas).

### Google Maps Static API (guide card cover image fallback)

When a guide has no `coverImage` set, the guide card must fall back to a Google Maps Static API thumbnail showing the location of the first place module.

```
GET https://maps.googleapis.com/maps/api/staticmap
  ?center=[encoded address of first place module]
  &zoom=15
  &size=800x450
  &maptype=roadmap
  &markers=color:red|[encoded address]
  &key=VITE_GOOGLE_PLACES_API_KEY
```

Render as a standard `<img>` tag (same API key as Places; no additional key needed). `alt` text: `"Map of [placeName]"`.

**Fallback chain:** `guide.coverImage` (Unsplash URL) → Google Maps Static thumbnail of first place module's address → a solid `var(--gray-200)` placeholder div if no place modules exist and no cover image is set.

This is implemented in `GuideCard` in Phase 3, and applies only when `guide.coverImage` is falsy.

### Spotify Embed URLs

Transform share URL → embed URL:
- Input: `https://open.spotify.com/playlist/37i9dQZF1DWSXBu5naYCM9`
- Output: `https://open.spotify.com/embed/playlist/37i9dQZF1DWSXBu5naYCM9`
- Pattern: replace `open.spotify.com/` with `open.spotify.com/embed/`
- Iframe attributes: `width="100%" height="352" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"`

Validation: URL must match `open.spotify.com/(playlist|album|track)/[A-Za-z0-9]+`

### Bandcamp Embed URLs

The seed data uses one specific Bandcamp album:
- **Light Blue Lines — *Perimeter*** — `https://lightbluelines.bandcamp.com/album/perimeter`
- Used in guide-002 (A Jazz Lover's Night in Hyde Park)

Bandcamp embed iframes require a **numeric album ID** that is not visible in the share URL. The agent building Phase 2 seed data must:
1. Fetch the page source of `https://lightbluelines.bandcamp.com/album/perimeter`
2. Locate `data-item-id` in the page HTML (it appears on the `<div id="pgBd">` element or nearby script tags)
3. Use that numeric ID to construct the embed URL:
   ```
   https://bandcamp.com/EmbeddedPlayer/album=[NUMERIC_ID]/size=large/bgcol=ffffff/linkcol=EF002B/tracklist=false/transparent=true/
   ```
4. Hardcode the resulting embed URL in `seed.js` as the `embedUrl` for guide-002's playlist module.

**Iframe attributes for Bandcamp:** `style="border: 0; width: 100%; height: 120px;" seamless`

**For the playlist creation form (user-pasted URLs):** Accept any `*.bandcamp.com/album/*` or `*.bandcamp.com/track/*` URL. Since the numeric ID lookup requires a server-side fetch, in the creation flow show a message: "Bandcamp embed saved — preview will appear in your published guide." Store the share URL as-is in `embedUrl`. In `PlaylistModuleCard`, if the embedUrl contains `bandcamp.com` but does not match the embed pattern, render a fallback card with the album title, platform icon, and a "Listen on Bandcamp →" link instead of an iframe.

---

## Section 5: Seed Data Spec

### Constants

```javascript
export const BADGES = [
  'Coffee', 'Bars', 'Restaurants', 'Live Music', 'Books', 'Art',
  'Film', 'Parks & Outdoors', 'History', 'Architecture',
  'Shopping', 'Sports', 'Family-Friendly', 'LGBTQ+', 'Food & Drink', 'Community'
]

export const COVER_PHOTOS = [
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800', // Chicago skyline
  'https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800', // Chicago river
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800', // coffee shop
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', // restaurant interior
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', // live music
  'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800', // farmers market
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', // bar/restaurant
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', // park/nature
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', // coffee
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', // people/community
  'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800', // bookstore
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', // food
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', // concert
  'https://images.unsplash.com/photo-1541692641319-981cc79ee10a?w=800', // Chicago architecture
  'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800', // autumn park
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', // wine bar
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', // food platter
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', // diverse group
  'https://images.unsplash.com/photo-1571104508999-893933ded431?w=800', // neighborhood street
  'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=800', // Chicago street
  'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800', // Chicago winter/snow
]
// Exactly 20 photos. The creation flow picker grid shows all 20.
```

### Users (8 seeded)

**Handle vs. slug — CRITICAL:**
- `handle` is the full ATProto-style display handle shown in the UI with `@` prefix (e.g. `alexrivera.chicago.com` displays as `@alexrivera.chicago.com`).
- `slug` is the URL-safe portion used in routes (e.g. `alexrivera` for `/profile/alexrivera`).
- `ProfilePage` looks up users by `user.slug === params.handle`. **Never match on `user.handle` directly.**
- `Header` account chip links to `/profile/${user.slug}`. All guide card author links use `slug`.

| id | handle (display) | slug (URL) | displayName | neighborhood | yearsInChicago | isJournalist | publication |
|---|---|---|---|---|---|---|---|
| `user-alex` | `alexrivera.chicago.com` | `alexrivera` | Alex Rivera | Lincoln Square | 7 | false | — |
| `user-ellery` | `ellery.suntimes.com` | `ellery` | Ellery Jones | — | — | true | suntimes |
| `user-alkeefe` | `alkeefe.wbez.org` | `alkeefe` | Al Keefe | — | — | true | wbez |
| `user-maria` | `mariam.chicago.com` | `mariam` | Maria Morales | Pilsen | 12 | false | — |
| `user-deon` | `deonw.chicago.com` | `deonw` | Deon Washington | Bronzeville | 22 | false | — |
| `user-priya` | `priyak.chicago.com` | `priyak` | Priya Kapoor | Hyde Park | 5 | false | — |
| `user-james` | `jamesob.chicago.com` | `jamesob` | James O'Brien | Wicker Park | 9 | false | — |
| `user-yuki` | `yukis.chicago.com` | `yukis` | Yuki Sato | Andersonville | 3 | false | — |

**`savedGuideIds` for non-Alex seeded users** (used for the "Saved" tab on their profiles — display only, no session state):
- user-maria: `['guide-005', 'guide-006']`
- user-deon: `['guide-002', 'guide-007']`
- user-priya: `['guide-001', 'guide-014']`
- user-james: `['guide-001', 'guide-016']` (guide-003 is his own guide — users don't save their own work)
- user-yuki: `['guide-008', 'guide-010']`
- Journalist accounts: `[]`
- Alex Rivera: `[]` (his saved guides come from AppContext session state, not the User object)

Journalist accounts (`user-ellery`, `user-alkeefe`) have no `hingePrompts` (empty array) and no `neighborhoodHistory`. All community member accounts have `hingePrompts` as follows:

**user-maria (Maria Morales, Pilsen, 12 years):**
- neighborhoodHistory: `[{ name: 'Bridgeport', startYear: 2014, endYear: 2018 }, { name: 'Pilsen', startYear: 2018 }]`
- badges: `['Art', 'Restaurants', 'Community', 'LGBTQ+']`
- hingePrompts:
  1. `"Two loves and a loathe about Chicago"` → `"Love: The murals on 18th Street — they're never the same twice. Love: The tamales at the Christmas market in Pilsen. Loathe: The closing of every restaurant I get attached to."`
  2. `"The local business I'd be heartbroken to lose"` → `"Pilsen Community Books. It's part community center, part archive, part hangout. There's no replacing it."`
  3. `"My most controversial Chicago opinion"` → `"Deep dish is not pizza. It's a casserole and we should stop arguing about it."`

**user-deon (Deon Washington, Bronzeville, 22 years):**
- neighborhoodHistory: `[{ name: 'Bronzeville', startYear: 2004 }]`
- badges: `['Live Music', 'History', 'Food & Drink', 'Architecture']`
- hingePrompts:
  1. `"The neighborhood I grew up in vs. where I live now"` → `"Grew up in Bronzeville, live in Bronzeville. I've watched it change more than any place should in 22 years. Still home."`
  2. `"The Chicago artist / musician / chef you need to know"` → `"Makaya McCraven. He's been recording the city's jazz scene for years and nobody outside Hyde Park gives him enough credit."`
  3. `"The Chicago thing that never gets old"` → `"Driving south on Lake Shore Drive at night when the skyline is lit. I've done it a thousand times and it still does something."`

**user-priya (Priya Kapoor, Hyde Park, 5 years):**
- neighborhoodHistory: `[{ name: 'Lincoln Park', startYear: 2021, endYear: 2023 }, { name: 'Hyde Park', startYear: 2023 }]`
- badges: `['Books', 'Coffee', 'Parks & Outdoors', 'Film']`
- hingePrompts:
  1. `"My go-to neighborhood for a Sunday morning"` → `"Hyde Park, obviously — but specifically the strip on 57th Street. Powells, Valois, a bench in the park. That's the whole day."`
  2. `"What I wish people knew about my neighborhood"` → `"Hyde Park is not just the university. It has some of the best independent bookshops, vintage stores, and food in the city. It just doesn't market itself."`
  3. `"My perfect $0 day in Chicago"` → `"MCA free days on Tuesdays, the lakefront path from North Ave to Montrose, a sandwich from Jewel eaten on the rocks. Done."`

**user-james (James O'Brien, Wicker Park, 9 years):**
- neighborhoodHistory: `[{ name: 'Lakeview', startYear: 2017, endYear: 2020 }, { name: 'Ukrainian Village', startYear: 2020, endYear: 2022 }, { name: 'Wicker Park', startYear: 2022 }]`
- badges: `['Bars', 'Live Music', 'Shopping', 'Restaurants']`
- hingePrompts:
  1. `"The best way to spend $10 in Chicago"` → `"A slice and a beer at Piece. End of list."`
  2. `"A place in Chicago I haven't told anyone about yet"` → `"There's a courtyard behind a building on Damen that has the best graffiti in the city and absolutely no foot traffic. I'm not saying which building."`
  3. `"My most controversial Chicago opinion"` → `"Wicker Park peaked about four years before I moved here and I still wouldn't live anywhere else."`

**user-yuki (Yuki Sato, Andersonville, 3 years):**
- neighborhoodHistory: `[{ name: 'Rogers Park', startYear: 2022, endYear: 2024 }, { name: 'Andersonville', startYear: 2024 }]`
- badges: `['Coffee', 'Books', 'LGBTQ+', 'Shopping']`
- hingePrompts:
  1. `"The Chicago dish I'd eat every day for a year"` → `"The Swedish pancakes at The Bongo Room. I know that's a Wicker Park place and I live in Andersonville. I'll make the trip."`
  2. `"My go-to neighborhood for a Sunday morning"` → `"Andersonville. The coffee on Clark Street, the used bookshops, the complete lack of urgency. I moved here for this."`
  3. `"What I wish people knew about my neighborhood"` → `"Andersonville has one of the most genuine small-town feels in a major American city. Every business owner knows your name within two visits."`

**Alex Rivera full profile:**
```javascript
{
  id: 'user-alex',
  handle: 'alexrivera.chicago.com',
  displayName: 'Alex Rivera',
  neighborhood: 'Lincoln Square',
  yearsInChicago: 7,
  neighborhoodHistory: [
    { name: 'Pilsen', startYear: 2019, endYear: 2022 },
    { name: 'Logan Square', startYear: 2022, endYear: 2024 },
    { name: 'Lincoln Square', startYear: 2024 }
  ],
  badges: ['Food & Drink', 'Live Music', 'Parks & Outdoors', 'Coffee'],
  isJournalist: false,
  hingePrompts: [
    {
      prompt: 'Two loves and a loathe about Chicago',
      answer: 'Love: The energy on the lakefront in July. Love: The fact that every neighborhood has a distinct vibe. Loathe: The wind in February — I\'ve accepted it but I will not celebrate it.'
    },
    {
      prompt: 'My go-to neighborhood for a Sunday morning',
      answer: 'Lincoln Square. Coffee at Café Selmarie, a lap around the farmers market, and then nothing.'
    },
    {
      prompt: 'The Chicago dish I\'d eat every day for a year',
      answer: 'The jibarito from Borinquen Restaurant. Don\'t argue with me.'
    },
    {
      prompt: 'A place in Chicago I haven\'t told anyone about yet',
      answer: 'Not saying.'
    }
  ]
}
```

### Guides (16 seeded)

All guides must have realistic `likeCount` (10–100), `helpfulCount` (5–100), and `remixCount` (0–10). `createdAt` values should span the last 6 months.

| id | title | neighborhood | authorId | modules summary | flags |
|---|---|---|---|---|---|
| `guide-001` | My Perfect Day in Humboldt Park | Humboldt Park | user-alex | place+product+place+post(long)+playlist(spotify)+place | isEditorsPick, isReviewed |
| `guide-002` | A Jazz Lover's Night in Hyde Park | Hyde Park | user-deon | place+place+event+playlist(bandcamp) | isReviewed — playlist module uses Light Blue Lines *Perimeter* (see Section 4 Bandcamp spec) |
| `guide-003` | The 606 Trail Guide | Wicker Park | user-james | place+place+place+post+article | additionalNeighborhoods: [Logan Square, Humboldt Park] · **collaborators: ['user-alex']** (demonstrates collaborators block on detail page) |
| `guide-004` | Morning Rituals in Lincoln Square | Lincoln Square | user-alex | place+product+post | isEditorsPick |
| `guide-005` | Pilsen Art Walk | Pilsen | user-maria | place+place+place+article+event | isReviewed |
| `guide-006` | Bronzeville Rising: Where to Eat Now | Bronzeville | user-ellery | place+place+article+place | isNewsroom, newsroomSource: suntimes, isReviewed |
| `guide-007` | WBEZ's Guide to Live Music in Logan Square | Logan Square | user-alkeefe | place+place+playlist(spotify)+event | isNewsroom, newsroomSource: wbez |
| `guide-008` | Andersonville Fika: A Swedish-American Coffee Trail | Andersonville | user-yuki | place+place+place+product | isReviewed |
| `guide-009` | [Sponsored] Intelligentsia Coffee: A Lincoln Square Member Guide | Lincoln Square | user-alex | product+product+place+post | isSponsored, sponsorName: 'Intelligentsia Coffee' — place modules must use Lincoln Square locations (Damen Ave corridor), not Lincoln Park |
| `guide-010` | [Sponsored] Volumes Bookcafe: The Logan Square Book Lover's Guide | Logan Square | user-james | product+place+article+event | isSponsored, sponsorName: 'Volumes Bookcafe' |
| `guide-011` | My remix of My Perfect Day in Humboldt Park | Humboldt Park | user-priya | place+place+playlist(spotify)+post | remixOf: 'guide-001' |
| `guide-012` | My remix of Pilsen Art Walk | Pilsen | user-yuki | place+place+event+post | remixOf: 'guide-005' |
| `guide-013` | My remix of Bronzeville Rising | Bronzeville | user-james | place+place+article | remixOf: 'guide-006' |
| `guide-014` | Hyde Park: An Academic's Weekend | Hyde Park | user-priya | place+place+post+article | — |
| `guide-015` | Family Saturday in Lincoln Square | Lincoln Square | user-maria | place+place+event+product | badges: [Family-Friendly, Food & Drink] |
| `guide-016` | Wicker Park Record Store Day | Wicker Park | user-deon | place+place+product+event+playlist(spotify) | isEditorsPick — playlist module uses a Whitney (Chicago band) Spotify playlist; title: "Whitney — Light Upon the Lake"; embedUrl: `https://open.spotify.com/embed/album/4iUZGbhZSFaMimKBFcDyBX` |
| `guide-017` | Sunday Mornings on Clark Street | Andersonville | user-yuki | place+place+product+post | isReviewed — second Andersonville guide; required for minimum 2-guides-per-neighborhood rule |

**Full spec for guide-001 (reference implementation — all agents should read this):**
```javascript
{
  id: 'guide-001',
  title: 'My Perfect Day in Humboldt Park',
  description: 'A slow, intentional day in one of Chicago\'s most vibrant neighborhoods. Coffee, hammocks, good wine, and a playlist to hold it all together.',
  authorId: 'user-alex',
  collaborators: [],
  neighborhood: 'Humboldt Park',
  additionalNeighborhoods: [],
  badges: ['Coffee', 'Parks & Outdoors', 'Community'],
  modules: [
    {
      type: 'place',
      placeId: 'place-cafe-colao',
      name: 'Café Colao',
      address: '2638 W Division St, Chicago, IL 60622',
      neighborhood: 'Humboldt Park',
      category: 'cafe',
      rating: 4.7,
      reviewCount: 312,
      editorNote: 'The cortado here is non-negotiable. Get there before 9am on weekends or you\'ll wait.',
      coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'
    },
    {
      type: 'product',
      name: 'The Cortado',
      description: 'Double shot of their house espresso blend with a splash of oat milk. Perfect balance.',
      price: '$4.50',
      where: 'Café Colao',
      coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800',
      isMemberDeal: true,
      dealDescription: 'Free pastry with CPM membership on weekends',
      editorNote: undefined
    },
    {
      type: 'place',
      placeId: 'place-humboldt-natural',
      name: 'Humboldt Park Natural Area',
      address: 'N Sacramento Ave & W North Ave, Chicago, IL 60647',
      neighborhood: 'Humboldt Park',
      category: 'park',
      rating: 4.8,
      reviewCount: 890,
      editorNote: 'Find the hammocks near the lagoon. The morning light through the trees is worth the walk in.',
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
    },
    {
      type: 'post',
      body: 'How to find the perfect hammock spot in Humboldt Park Natural Area:\n\nFrom the Sacramento entrance, walk north along the lagoon path for about 8 minutes. You\'ll pass the boat launch on your left. Keep going until you see the cluster of old oaks just past the footbridge — that\'s your spot.\n\nThe canopy here is dense enough to block direct sun but still lets in the breeze off the water. The ground is flat and the anchor trees are about 15 feet apart, which is ideal for a standard hammock.\n\nBring bug spray in June and July. A tarp is useful but not essential. Go on a Tuesday morning and you may have the whole clearing to yourself.\n\nThere is no bad time of year for this, including winter if you have the right sleeping bag. The park looks completely different with snow on the ground.',
      images: [
        'https://images.unsplash.com/photo-1477415348463-c0eb7f1359b6?w=800'
      ],
      isLong: true,
      editorNote: undefined
    },
    {
      type: 'playlist',
      platform: 'spotify',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWSXBu5naYCM9',
      title: 'Humboldt Sunday Morning',
      description: 'Latin soul, soft jazz, and a few curveballs. The right pace for a hammock in the park.',
      editorNote: 'This is what I had playing when I wrote most of this guide.'
    },
    {
      type: 'place',
      placeId: 'place-ca-wine-bar',
      name: 'CA Wine Bar',
      address: '2723 W Division St, Chicago, IL 60622',
      neighborhood: 'Humboldt Park',
      category: 'bar',
      rating: 4.5,
      reviewCount: 187,
      editorNote: 'The natural wine list changes weekly and the staff actually know what they\'re talking about. Order the charcuterie.',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    }
  ],
  coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  privacy: 'public',
  isEditorsPick: true,
  isReviewed: true,
  isSponsored: false,
  likeCount: 247,
  helpfulCount: 189,
  remixCount: 3,
  isNewsroom: false,
  createdAt: '2026-03-01T10:00:00Z',
  isSessionCreated: false
}
```

### SEED_PLACES — purpose and structure

`SEED_PLACES` is a **flat lookup pool** used exclusively by `PlaceSearchForm` as a fallback when the Google Places API is unavailable. It is **not** a normalized data table — guide modules are fully denormalized and embed all place data inline (name, address, category, rating, etc. are stored directly on each `PlaceModule` object, not referenced by ID).

The `placeId` field on a `PlaceModule` references an entry in `SEED_PLACES` only for the fallback search UI. When the API is available, `placeId` is the Google Places ID returned by the API.

Each entry in `SEED_PLACES`:
```javascript
{
  id: 'place-cafe-colao',           // matches placeId in PlaceModule
  name: 'Café Colao',
  address: '2638 W Division St, Chicago, IL 60622',
  neighborhood: 'Humboldt Park',
  category: 'cafe',
  rating: 4.7,
  reviewCount: 312,
  coverImage: 'https://images.unsplash.com/...'
}
```

The minimum 80 places should include every place referenced across all 17 guides, plus enough additional entries in each of the 8 required neighborhoods to make the fallback search feel populated (aim for 8–12 places per neighborhood).

### Place IDs reference (minimum 80 total places across all guides)

Each place should have: `id`, `name`, `address`, `neighborhood`, `category`, `rating`, `reviewCount`, `coverImage`. Use real Chicago business names and real addresses. All 17 guides combined should reference at least 80 distinct places spanning all 8 required neighborhoods. Guides should contain 2–5 place modules each. The agents building the seed data should populate these fully.

---

## Section 6: Build Phases

> **Agent instructions:** Read only your assigned phase section. Complete all tasks in that phase. Run the smoke test before summarizing. Do not start the next phase.

---

### Phase 0: Scaffold & Dev Infrastructure

**Goal:** A runnable monorepo with both services starting on `npm run dev`. No UI yet.

**Files to create:**
- `package.json` (root)
- `.gitignore`
- `.env.example`
- `client/package.json`
- `client/vite.config.js`
- `client/index.html`
- `client/Caddyfile`
- `client/public/robots.txt`
- `client/src/main.jsx`
- `client/src/App.jsx` (placeholder — all routes render `<div>Page name</div>`)
- `server/package.json`
- `server/index.js`

**Tasks:**

1. **Root `package.json`** — workspaces not required; use concurrently:
   ```json
   {
     "name": "pitney-and-archer",
     "private": true,
     "scripts": {
       "dev": "concurrently \"npm run dev --prefix client\" \"npm run dev --prefix server\"",
       "build": "npm run build --prefix client"
     },
     "devDependencies": {
       "concurrently": "^8.0.0"
     }
   }
   ```

2. **`.gitignore`** — include: `node_modules`, `.env`, `dist`, `.DS_Store`, `client/dist`

3. **`.env.example`**:
   ```
   VITE_GOOGLE_PLACES_API_KEY=
   VITE_CHICAGO_DATA_PORTAL_TOKEN=
   ALLOWED_ORIGIN=http://localhost:5173
   ```

4. **`client/package.json`** — dependencies: `react@^18`, `react-dom@^18`, `react-router-dom@^6`, `react-leaflet@^4`, `leaflet@^1.9`. Dev deps: `vite@^5`, `@vitejs/plugin-react`.

5. **`client/vite.config.js`**:
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 5173,
       proxy: {
         '/api': {
           target: 'http://localhost:3001',
           changeOrigin: true
         }
       }
     }
   })
   ```
   The `proxy` entry is **required** — it forwards all `/api/*` requests from the Vite dev server to the Express server on port 3001. Without it, RSS fetches and any future API calls will 404 in local development. In production (Railway), the frontend calls the Express server's Railway URL directly; the `VITE_API_BASE_URL` env var handles this:
   - Local dev: leave `VITE_API_BASE_URL` unset — Vite proxy intercepts `/api/*`
   - Production: set `VITE_API_BASE_URL=https://chicago-com-server.up.railway.app` in Railway frontend env vars; `AppContext` prepends this to all `/api/*` fetch calls
   - AppContext fetch pattern: `` `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/rss?source=suntimes` ``

   Add `VITE_API_BASE_URL=` (empty, intentionally blank) to `.env.example` with a comment: `# Leave blank for local dev (Vite proxy handles /api). Set to Express Railway URL in production.`

6. **`client/index.html`** — include in `<head>`:
   - Google Fonts link: Big Shoulders Display (900), Big Shoulders Text (700), Inter (400, 500), Source Serif 4 (400)
   - `<meta name="robots" content="noindex, nofollow">`
   - Title: `chicago.com`

7. **`client/Caddyfile`** — for Railway SPA routing:
   ```
   :80 {
     root * /srv
     encode gzip
     try_files {path} /index.html
     file_server
   }
   ```

8. **`client/public/robots.txt`**:
   ```
   User-agent: *
   Disallow: /
   ```

9. **`client/src/main.jsx`** — standard React 18 root render with `<BrowserRouter>`.

10. **`client/src/App.jsx`** — import all page components as stubs; declare full route table in order:
    ```jsx
    // CRITICAL: /guide/new MUST come before /guide/:id
    <Routes>
      <Route path="/" element={<Navigate to="/feed" replace />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/guide/new" element={<GuideCreatePage />} />
      <Route path="/guide/:id" element={<GuideDetailPage />} />
      <Route path="/guide/:id/remix" element={<GuideRemixPage />} />
      <Route path="/neighborhood/:slug" element={<NeighborhoodPage />} />
      <Route path="/profile/:handle" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    ```

11. **`server/package.json`** — dependencies: `express@^4`, `cors@^2`, `dotenv@^16`, `fast-xml-parser@^4`, `node-fetch@^3` (or use native fetch). Script: `"dev": "node --watch index.js"`.

12. **`server/index.js`** — Express app with CORS, dotenv, and a placeholder `/api/health` route returning `{ status: 'ok' }`. Import and mount RSS router. Listen on `PORT` env var (default 3001).

**Smoke test:** `npm run dev` from root starts both services. `curl http://localhost:3001/api/health` returns `{"status":"ok"}`. Visiting `http://localhost:5173` shows placeholder text. Visiting `http://localhost:5173/guide/new` shows a different placeholder than `http://localhost:5173/guide/abc`.

**Dependencies:** None. This is the first phase.

---

### Phase 1: Design System & App Shell

**Goal:** All pages have a working Header, Footer, and layout. Design tokens are established. No real content yet.

**Files to create/modify:**
- `client/src/styles/globals.css`
- `client/src/components/Header/Header.jsx` + `Header.module.css`
- `client/src/components/Footer/Footer.jsx` + `Footer.module.css`
- `client/src/components/Layout/Layout.jsx` + `Layout.module.css`
- `client/src/components/Toast/Toast.jsx` + `Toast.module.css` + `useToast.js`
- `client/src/components/ErrorBoundary/ErrorBoundary.jsx` (no CSS file needed — plain JSX)
- `client/src/pages/NotFoundPage.jsx` (no `.module.css` — intentionally minimal, inline styles acceptable)
- `client/src/App.jsx` (route table, Layout wrapper, Shift+R listener)

**Tasks:**

1. **`globals.css`** — define all CSS custom properties and base resets. Import in `main.jsx`.
   ```css
   :root {
     --red: #EF002B;
     --blue: #41B6E6;
     --white: #FFFFFF;
     --black: #161616;
     --gray-100: #F5F5F5;
     --gray-200: #E0E0E0;
     --gray-500: #757575;
     --gray-900: #212121;
     --gold: #C9A84C;
     --font-display: 'Big Shoulders Display', sans-serif;
     --font-ui: 'Big Shoulders Text', sans-serif;
     --font-body: 'Inter', sans-serif;
     --font-article: 'Source Serif 4', serif;
     --max-width: 1200px;
     --spacing: 8px;
   }
   * { box-sizing: border-box; margin: 0; padding: 0; }
   body { font-family: var(--font-body); background: var(--gray-100); color: var(--black); }
   ```

2. **`Header`** — fixed top bar, `var(--black)` background, `var(--white)` text.
   - Left: chicago.com wordmark using Big Shoulders Display, bold. Include a red ★ before the wordmark.
   - Center (desktop only, hidden on mobile): `<nav>` with links to `/feed`, `/explore`, and a Neighborhoods dropdown (hardcode 5–6 neighborhood names for now; Phase 8 will wire up all 77).
   - Right: `<Link to="/guide/new">+ Create Guide</Link>` styled as a red button, then an account chip showing "Alex Rivera / @alexrivera" (non-interactive for now — full dropdown not required).
   - Mobile: hamburger icon button that toggles an inline drawer with all nav links.
   - Height: 64px desktop, 56px mobile.

3. **`Footer`** — dark background (`var(--gray-900)`), white text.
   - Two horizontal blue stripes at top (Chicago flag decoration): two `4px` bars in `var(--blue)` with gap between.
   - Links: About chicago.com · How guides work · How the feed is ordered · Chicago Public Media
   - Tagline: "Made in Chicago, for Chicago." in Big Shoulders Display.

4. **`Layout`** — wrapper component: constrains content to `var(--max-width)`, centered. Accepts `sidebar` prop (boolean). When sidebar is true, renders two-column grid (main area + sidebar); when false, single column. Collapses to single column at `768px`.

5. **Update `App.jsx`** — wrap all routes in `<Layout>`. Feed and Explore pages get `sidebar={true}`; all others get `sidebar={false}`. Header and Footer render outside routes (always visible).

6. **`ErrorBoundary`** — wraps everything inside `<BrowserRouter>`. On error, renders a centered message: "Something went wrong — [go back to the feed]" where the link goes to `/feed`.

7. **`Toast` + `useToast`** — shared notification system used by all subsequent phases. Implement now so later phases can import it without re-building.
   - `Toast.jsx`: a fixed-position banner at bottom center of viewport. Props: `message: string, visible: boolean, onDismiss: () => void`. Background `var(--black)`, white text, 16px padding, `border-radius: 4px`, `z-index: 1000`. Auto-dismiss after 4 seconds (clear timeout on unmount).
   - `useToast.js`: custom hook that manages `{ message, visible }` state. Returns `{ showToast(message, duration?) }`. Duration defaults to 4000ms. Calling `showToast` sets `visible: true` and schedules `visible: false` after `duration` ms.
   - Usage pattern: component calls `const { showToast } = useToast()`, renders `<Toast message={...} visible={...} />`, and calls `showToast('Link copied!')` on user action.
   - Render `<Toast>` in the component that owns the `useToast` state — not as a global singleton.

8. **`NotFoundPage`** — simple centered page: "404 — Page not found" heading, subtext "The page you're looking for doesn't exist.", `<Link to="/feed">Go back to the feed →</Link>` in `var(--red)`. No `.module.css` needed — use inline styles or a minimal style block. This is intentional.

9. **`Shift+R` session reset listener** — add to `App.jsx` (not `AppContext`) so that `useToast()` can be called legally as a React hook:
   ```jsx
   // In App.jsx component body:
   const { showToast } = useToast()
   const { dispatch } = useAppContext()
   useEffect(() => {
     let shiftDownAt = null
     const onKeyDown = (e) => { if (e.key === 'R' && e.shiftKey) shiftDownAt = Date.now() }
     const onKeyUp = (e) => {
       if (e.key === 'R' && shiftDownAt && Date.now() - shiftDownAt >= 2000) {
         dispatch({ type: 'RESET_SESSION' })
         showToast('Session reset')
       }
       shiftDownAt = null
     }
     window.addEventListener('keydown', onKeyDown)
     window.addEventListener('keyup', onKeyUp)
     return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp) }
   }, [dispatch, showToast])
   ```
   `App.jsx` also renders `<Toast>` driven by the `useToast` state so the toast is visible globally.

**Smoke test:** All 8 routes render without console errors. Header and Footer visible on every page. Mobile viewport shows hamburger menu. Visit an unknown URL — NotFoundPage renders with "404" heading. To test the toast: add a temporary `useEffect(() => showToast('Toast test'), [])` call at the top of `NotFoundPage`, visit `/unknown`, confirm toast appears and auto-dismisses after 4s — then **remove this test call before committing**. Do not leave test code in committed files.

**Dependencies:** Phase 0 complete.

---

### Phase 2: AppContext + Types + Seed Data

**Goal:** The full data layer is in place. All 17 guides, 8 users, and all places are defined. Context is wired up. Pages can import `useAppContext()` to access data.

**Files to create:**
- `client/src/types/index.ts`
- `client/src/context/AppContext.jsx`
- `client/src/data/seed.js`
- `client/public/fallback-community-areas.json`

**Tasks:**

1. **`types/index.ts`** — define all TypeScript types exactly as specified in Section 3 of this document. Export all types. The `User` type must include:
   - `slug: string` — URL-safe profile identifier (e.g. `'alexrivera'`). Used in `/profile/:handle` route matching.
   - `savedGuideIds: string[]` — guide IDs for display on the Saved tab. For Alex Rivera this is `[]` (his session state governs); for other users it is hardcoded in seed data.

2. **`seed.js`** — define and export:
   - `BADGES` array (16 items — see Section 5)
   - `COVER_PHOTOS` array (20 Unsplash URLs — see Section 5)
   - `SEED_USERS` array (8 users — see Section 5; include full hinge prompts and neighborhood histories for all 7 community member accounts as specified in Section 5)
   - `SEED_PLACES` array (minimum 80 places — real Chicago business names, real addresses, all 8 required neighborhoods represented)
   - `SEED_GUIDES` array (17 guides — guide-001 through guide-017 per Section 5 table. guide-001 must be implemented exactly as the full spec in Section 5. The other 16 should be built out with real content matching their titles and neighborhoods.)

   Key requirements for seed guides:
   - guide-001: 6 modules (exact spec in Section 5)
   - guide-003: must have `collaborators: ['user-alex']` set (demonstrates the collaborators block on the detail page)
   - Guides with `remixOf` (guide-011, guide-012, guide-013) must reference valid guide IDs
   - Sponsored guides (guide-009, guide-010) must have `isMemberDeal: true` on at least one product module
   - Journalist guides (guide-006, guide-007) must set `isNewsroom: true` and `newsroomSource`
   - At least one guide must have a `post` module with `isLong: true` (body > 300 chars)
   - guide-002 must have a Bandcamp playlist module using Light Blue Lines *Perimeter* (see Section 4 Bandcamp spec for how to extract the numeric album ID)
   - All guides should have realistic `likeCount`, `helpfulCount`, `remixCount`
   - All 8 required neighborhoods must have at least 2 guides (Andersonville is covered by guide-008 + guide-017)

   **Bandcamp album ID — blocker for guide-002:** The agent must fetch `https://lightbluelines.bandcamp.com/album/perimeter`, search the page HTML for `data-item-id="[NUMBER]"`, and use that number in the embed URL. If the fetch fails (sandbox/network restriction), stop and surface this as a blocker for Ellery to provide the numeric ID manually. Do not invent a placeholder ID.

3. **`fallback-community-areas.json`** — all 77 Chicago community areas as a JSON array (tabular fallback for AppContext). Each entry:
   ```json
   { "id": "1", "name": "Rogers Park", "slug": "rogers-park", "population": 54991 }
   ```
   Include all 77 official community areas with correct IDs and slugs.

4. **`chicago-community-areas.geojson`** (in `client/public/`) — full GeoJSON FeatureCollection with polygon boundaries for all 77 community areas. Source: City of Chicago Data Portal dataset `igwz-8jzy`. The agent building this phase should fetch `https://data.cityofchicago.org/resource/igwz-8jzy.geojson?$limit=100` and save the result as this file. `$limit=100` is sufficient — there are exactly 77 community areas and this endpoint returns all of them at that limit. Each Feature's `properties` must include `community` (name in all caps, e.g. `"HUMBOLDT PARK"`) and `area_numbe` (string, e.g. `"23"`). This file is bundled in `public/` so it is available offline without any API calls — this is the **only** source used for neighborhood boundary maps.

5. **`AppContext.jsx`** — implement context, reducer, and provider:
   - Import `SEED_GUIDES`, `SEED_USERS`, `BADGES` from `seed.js`
   - Import Alex Rivera as the pre-loaded user
   - `initialState` shaped exactly as Section 3
   - Reducer handles all 9 action types (see Section 3)
   - `AppProvider` component: wraps children, on mount fetches RSS (via Express proxy) and community areas (via Socrata, falling back to static JSON), dispatches results
   - Export `useAppContext` hook (uses `useContext(AppContext)`)
   - Export `AppProvider`

6. **Update `main.jsx`** — wrap `<App>` in `<AppProvider>`.

7. **Session reset (URL-based only)** — in `AppProvider`, on mount, check `window.location.search.includes('reset=true')`. If true, dispatch `RESET_SESSION`, then call `window.history.replaceState({}, '', '/feed')`. **The `Shift+R` keydown listener is NOT implemented here** — it lives in `App.jsx` (Phase 1) where `useToast()` can be called legally as a React hook. See Phase 1 task 9 for the `Shift+R` implementation.

**Smoke test:** Open browser devtools. In any component, call `window._ctx = useAppContext()` (temporarily). Verify `guides.length >= 17`, `users.length >= 8`, `user.displayName === 'Alex Rivera'`. Confirm `users` array includes entries with `slug` fields (e.g. `users[0].slug === 'alexrivera'`). Visit `/?reset=true` and confirm `likedGuideIds` is empty. Undo the devtools hack before finalizing.

**Dependencies:** Phase 0 and Phase 1 complete.

---

### Phase 3: Feed Page + Guide Cards

**Goal:** The `/feed` page renders real seeded guide cards, RSS article cards, filter panel, and skeleton loading states. Likes and helpful counts are interactive.

**Files to create:**
- `client/src/pages/FeedPage/FeedPage.jsx` + `FeedPage.module.css`
- `client/src/components/GuideCard/GuideCard.jsx` + `GuideCard.module.css`
- `client/src/components/ArticleCard/ArticleCard.jsx` + `ArticleCard.module.css`
- `client/src/components/FilterPanel/FilterPanel.jsx` + `FilterPanel.module.css`
- `client/src/components/SkeletonCard/SkeletonCard.jsx` + `SkeletonCard.module.css`
- `client/src/components/SkeletonArticleCard/SkeletonArticleCard.jsx` + `SkeletonArticleCard.module.css`
- `client/src/components/FeedInfoModal/FeedInfoModal.jsx` + `FeedInfoModal.module.css`
- `server/routes/rss.js`

**Tasks:**

1. **RSS route (`server/routes/rss.js`)**:
   - `GET /api/rss?source=suntimes|wbez`
   - Fetch the appropriate RSS feed URL (see Section 4)
   - Parse XML with `fast-xml-parser` (`XMLParser` with `ignoreAttributes: false`)
   - Extract `channel.item` array. For each item, return: `id`, `title`, `url` (from `link`), `summary` (from `description`, strip HTML tags with a simple regex), `source`, `publishedAt` (from `pubDate`), `isCitywide: true`
   - Return array as JSON
   - On fetch/parse error, return `[]` with status 200 (feed silently omits article cards on failure)
   - Mount in `server/index.js`: `app.use('/api/rss', rssRouter)`

2. **`GuideCard`** — accepts `guide: Guide` prop. Renders:
   - White background card, `4px solid var(--red)` top border (sponsored: `4px solid var(--gold)` left border instead)
   - Cover image (16:9, `object-fit: cover`). **Fallback chain:** if `guide.coverImage` is falsy, use Google Maps Static API thumbnail of the first place module's address (see Section 4 Google Maps Static API spec). If no place modules exist, render a solid `var(--gray-200)` placeholder div. The `<img>` must have meaningful `alt` text.
   - Overlay badges on cover image: `★ GUIDE` pill (top-left). If sponsored: `Sponsored` pill in `var(--gold)`. If isEditorsPick: `★ Editor's Pick` label. If isReviewed: `Reviewed` label. If isNewsroom: `★ From the newsroom` label.
   - Card body: guide title (Big Shoulders Text 700, title-case), author row (`displayName + @handle`, Inter 0.8rem `var(--gray-500)`), neighborhood tag pill in `var(--blue)`
   - **Module type icon strip**: compute unique module types from `guide.modules`, show up to 4 icons with text labels (e.g. `📍 Places · 🎵 Playlist`). If more than 4, show `+N more`. Icons in `var(--gray-500)`.
   - Engagement row: `♥ [likeCount]` (toggles liked state via LIKE_GUIDE dispatch — active state: red filled heart), `✓ [helpfulCount]` (toggles via HELPFUL_GUIDE dispatch — active state: green), `Remix →` (navigates to `/guide/:id/remix`), `↗ Share` (no-op, calls `showToast('Link copied!')` via `useToast`)
   - Click on the card body (not engagement row) navigates to `/guide/:id`
   - On hover: subtle box-shadow

3. **`ArticleCard`** — accepts `article: RSSArticle` prop. Compact card:
   - `4px solid var(--blue)` top border, no cover image
   - Publication logo text (WBEZ or Chicago Sun-Times) in `var(--blue)`, small
   - Headline in Big Shoulders Text
   - Summary text (2 lines max, ellipsis)
   - Timestamp in `var(--gray-500)`
   - Entire card is a link (`target="_blank"`)

4. **`FilterPanel`** — reads/writes from AppContext:
   - Section title "Filter by content" with active count `(N)` if any selected
   - Checkbox group: Places · Articles · Products · Events · Posts · Playlists. On change: dispatch `SET_FILTER_CONTENT_TYPES`
   - Section title "Filter by interest" with active count `(N)` if any selected
   - Badge chip group (all 16 badges). Selected chips highlighted in `var(--blue)`. On click: dispatch `SET_FILTER_BADGES`
   - `Clear all filters` link at bottom (only shown if any filter active)
   - Renders as sidebar on desktop (`Layout` sidebar slot), as collapsible panel above feed on mobile

5. **`SkeletonCard`** — animated shimmer card (CSS `@keyframes shimmer`) matching GuideCard dimensions. Use `background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%)` animated.

6. **`SkeletonArticleCard`** — animated shimmer card matching ArticleCard dimensions (compact, no cover image, two lines of text-width bars). Uses the same shimmer animation as `SkeletonCard`. Rendered in the feed while RSS fetch is pending, interleaved where article cards will appear.

7. **`FeedInfoModal`** — triggered by an `(i)` icon button in the feed header ("How your feed works"). Modal overlay with:
   - **Section 1 — "How your feed is ordered"**: explain all 5 tiers (Editor's Picks → Neighborhood-matched → Badge-matched → Citywide news → Remaining). Must be honest and specific.
   - **Section 2 — "Filtering your feed"**: explain content type filter (shows guides containing at least one module of the selected type) and badge filter (shows guides tagged with the selected badge). Explain multi-select OR logic. Explain persistence.
   - Close button (keyboard accessible, closes on Escape)

8. **`FeedPage`** — main feed logic:
   - Hero strip: full-width block with two horizontal `var(--blue)` bars (Chicago flag), app tagline below
   - Feed header: "Explore Chicago" heading + `(i)` button for FeedInfoModal
   - **Feed ordering logic** (pure function `orderFeed(guides, rssArticles, user, filters)`):
     1. If content type or badge filters active: filter guides to those matching any selected type/badge
     2. Sort remaining guides: editor's picks → neighborhood-matched → badge-matched → remaining
     3. Interleave RSS article cards (after every 4th guide card, insert 1-2 article cards)
   - Initial render: show 6 `SkeletonCard` components while RSS fetch is in progress
   - Once loaded: render mixed array of `GuideCard` and `ArticleCard` components
   - `Load more` button: reveal 10 more items. Managed with local `visibleCount` state (initial: 12)
   - Sidebar slot: `<FilterPanel />`

**Smoke test:** `/feed` loads. 17 guide cards are visible. Clicking ♥ on a card increments the count and turns the heart red. Clicking a badge in FilterPanel hides cards that don't match. "Clear all filters" restores the feed. Article cards appear mixed in. Clicking a guide card navigates to `/guide/:id` — the Phase 0 stub page renders (full detail page is Phase 4; do not treat a stub render as a failure here).

**Dependencies:** Phases 0, 1, 2 complete.

---

### Phase 4: Guide Detail Page + Module Components

**Goal:** `/guide/:id` renders all 6 module types correctly. The Leaflet map shows place pins. The long post collapses and expands. Playlist iframes load with skeleton states.

**Files to create:**
- `client/src/pages/GuideDetailPage/GuideDetailPage.jsx` + `GuideDetailPage.module.css`
- `client/src/components/modules/PlaceModuleCard.jsx` + `.module.css`
- `client/src/components/modules/ArticleModuleCard.jsx` + `.module.css`
- `client/src/components/modules/ProductModuleCard.jsx` + `.module.css`
- `client/src/components/modules/EventModuleCard.jsx` + `.module.css`
- `client/src/components/modules/PostModuleCard.jsx` + `.module.css`
- `client/src/components/modules/PlaylistModuleCard.jsx` + `.module.css`
- `client/src/components/GuideMap/GuideMap.jsx` + `GuideMap.module.css`

**Tasks:**

1. **`GuideMap`** — react-leaflet map component:
   - **CRITICAL:** Must include `import 'leaflet/dist/leaflet.css'` at top of file
   - **CRITICAL:** Must fix Leaflet default marker icon for Vite:
     ```javascript
     import L from 'leaflet'
     import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
     import markerIcon from 'leaflet/dist/images/marker-icon.png'
     import markerShadow from 'leaflet/dist/images/marker-shadow.png'
     delete L.Icon.Default.prototype._getIconUrl
     L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow })
     ```
   - Props: `placeModules: PlaceModule[]`, `collapsible?: boolean`
   - If no place modules: render nothing
   - Map center: compute from average lat/lng of places (approximate from address strings using a hardcoded neighborhood→coordinate map for the 8 required neighborhoods, or a simple mapping utility)
   - Markers: one per place module. Popup on click shows place name + editor note snippet.
   - Zoom level: 13 default
   - On mobile (collapsible=true): render with a "Map" toggle button above it; collapsed by default
   - Height: 300px

2. **Module components** — render in a consistent card style (white bg, subtle border, 16px padding). Each has optional `editorNote` displayed at bottom in italics, `var(--gray-500)`.

   **`PlaceModuleCard`**: Cover image (16:9 if available), place name (Big Shoulders Text), address (small, gray), category icon + category label, star rating + review count, editor note.

   **`ArticleModuleCard`**: Publication logo badge (color-coded: suntimes=red, wbez=blue), headline (Big Shoulders Text), summary text (Source Serif 4), published date, optional editor note, full-width `Read →` link button (opens new tab).

   **`ProductModuleCard`**: Cover image if available, product name (Big Shoulders Text), price badge (red), "Where to get it" text. If `isMemberDeal`: prominent callout box in `var(--gold)`: `★ CPM Member Deal — [dealDescription]`. Editor note.

   **`EventModuleCard`**: Prominent date badge (large, `var(--red)` background, white text, left-aligned), event name (Big Shoulders Text), location + neighborhood (small gray), description (body), optional URL as "Get tickets / More info →" link. Editor note.

   **`PostModuleCard`**: Photo gallery (up to 3 images, displayed as a horizontal row or single image; `object-fit: cover`). Body text in Source Serif 4. **If `isLong`: render only first 3 lines of body using CSS line-clamp (`-webkit-line-clamp: 3`), with "Read more →" button below. Clicking "Read more" expands to full body inline (toggle state). "Read less" button collapses again. No navigation — in-place toggle only.** Editor note.

   **`PlaylistModuleCard`**: Platform icon + title + optional description + editor note above the iframe. Spotify: render `<iframe>` with embed URL, 352px height. Bandcamp: render `<iframe>` with Bandcamp embed URL. Both: show a skeleton rectangle (`var(--gray-200)`, same dimensions as iframe) until iframe `onLoad` fires. Mark iframe with `loading="lazy"`.

3. **`GuideDetailPage`** — layout:
   - **Hero**: full-width cover image, min-height 320px. Dark gradient scrim (`linear-gradient(to top, rgba(0,0,0,0.8), transparent)`) overlaid. Guide title (Big Shoulders Display, white, large) positioned at bottom of hero. Author identity block below image (not overlaid): display name + `@handle` + "X years in Chicago" badge.
   - Guide description (2-4 lines, body text, below hero).
   - Neighborhood chips row: primary neighborhood + `additionalNeighborhoods`. Each chip links to `/neighborhood/:slug`.
   - Badge chips row: `guide.badges`. Small pills in `var(--blue)`.
   - **Module list**: iterate `guide.modules` in order, render the appropriate module component by `module.type`.
   - **After rendering all modules**: if any module is type `'place'`, render `<GuideMap placeModules={placeModules} collapsible={true} />`.
   - If `guide.collaborators.length > 0`: "Also contributed by:" block with avatar chips (initials, @handle).
   - If `guide.remixOf`: "Remixed from [original guide title] by @originalauthor.chicago.com" — link to original guide. Look up original guide from context by `guide.remixOf` ID.
   - If `guide.isSponsored`: "Created in partnership with [sponsorName]" in `var(--gold)`, small text.
   - CTA: `Remix this guide →` button (red, navigates to `/guide/:id/remix`).
   - Non-functional engagement buttons: ♥ Like · ✓ Helpful · ★ Save · ↗ Share (session state only — wire up to context dispatch same as GuideCard). Share calls `showToast('Link copied!')`.
   - Non-functional: `Follow [Author]` button.
   - If guide ID not found in context: navigate to `/feed`.
   - **Success banner after creation/remix:** on mount, read `location.state?.isNew` from React Router (passed by `navigate` in Phase 5/6). If `location.state?.isNew === true`, render a dismissible green banner at the top of the page: `"Your guide is live! Share it with friends."` with a mock share button that calls `showToast('Link copied!')`. The banner auto-dismisses after 8 seconds or when the user clicks ×. Use `window.history.replaceState` to clear the state after reading it so a page refresh doesn't re-show the banner.

**Smoke test:** Navigate to `/guide/guide-001`. Verify all 6 module types from guide-001 render correctly (place cards, product with gold member deal callout, post with collapsed long text, Spotify playlist with skeleton then iframe, and map with 3 pins). Click "Read more" on the post — it expands. Navigate to guide-011 (`remixOf` set) — remix attribution block shows with link to guide-001. Navigate to guide-003 — "Also contributed by:" block shows Alex Rivera's chip. Navigate to guide-009 (sponsored) — gold partnership attribution shows. Manually test success banner: navigate to `/guide/guide-001` with `history.pushState({ isNew: true }, '')` in devtools — banner appears and dismisses.

**Dependencies:** Phases 0–3 complete.

---

### Phase 5: Guide Creation Flow

**Goal:** `/guide/new` is fully functional. Users can complete all 3 steps, create a guide with any module combination, and see it in the feed.

**Files to create:**
- `client/src/pages/GuideCreatePage/GuideCreatePage.jsx` + `GuideCreatePage.module.css`
- `client/src/pages/GuideCreatePage/StepBasics.jsx` + `StepBasics.module.css`
- `client/src/pages/GuideCreatePage/StepModules.jsx` + `StepModules.module.css`
- `client/src/pages/GuideCreatePage/StepReview.jsx` + `StepReview.module.css`
- `client/src/pages/GuideCreatePage/ModuleListPanel.jsx` + `ModuleListPanel.module.css`
- `client/src/pages/GuideCreatePage/forms/PlaceSearchForm.jsx` + `PlaceSearchForm.module.css`
- `client/src/pages/GuideCreatePage/forms/ArticlePickerForm.jsx` + `ArticlePickerForm.module.css`
- `client/src/pages/GuideCreatePage/forms/ProductForm.jsx` + `ProductForm.module.css`
- `client/src/pages/GuideCreatePage/forms/EventForm.jsx` + `EventForm.module.css`
- `client/src/pages/GuideCreatePage/forms/PostForm.jsx` + `PostForm.module.css`
- `client/src/pages/GuideCreatePage/forms/PlaylistForm.jsx` + `PlaylistForm.module.css`

**Tasks:**

1. **`GuideCreatePage`** — top-level wizard state. Manages:
   - `currentStep`: 1 | 2 | 3
   - `guideData`: partial Guide object built across steps
   - Progress indicator at top (step 1 / 2 / 3, with labels: Basics · Modules · Review)
   - Renders `<StepBasics>`, `<StepModules>`, or `<StepReview>` based on `currentStep`
   - Passes `guideData`, `setGuideData`, `onNext`, `onBack` props to each step

2. **`StepBasics`** — controlled form:
   - Title input (required, `maxLength={100}`)
   - Description textarea (optional, `maxLength={280}`, live character counter shown below: `"X / 280"`)
   - Neighborhood dropdown: `<select>` with all 77 community areas. Read from `communityAreas` in AppContext. If not yet loaded, fall back to the 8 required neighborhoods hardcoded.
   - Badges: chip group (16 badges). Multi-select. Selected = filled, unselected = outlined. At least 1 required to proceed.
   - Cover photo picker: grid of 20 thumbnail images from `COVER_PHOTOS`. Selected image gets a red border/checkmark. Required.
   - Privacy: three radio buttons with labels and descriptions:
     - Private: "Only you can see this"
     - Friends: "Shareable via link"
     - Public: "Submitted for review before appearing in feed" (default)
   - "Continue to modules →" button: disabled until title + neighborhood + 1+ badge + cover photo selected. Show tooltip on hover if disabled: "Fill in required fields to continue"
   - On submit: update `guideData`, call `onNext`

3. **`StepModules`** — module builder:
   - Module type selector: 6 square buttons in a 2×3 or 3×2 grid. Each: icon + type name. Clicking a type sets `activeFormType` state and shows the corresponding form below.
   - `activeFormType` null by default (no form shown until user clicks a type)
   - Module forms appear in a panel below the type selector. Submitting a form adds the module to a local `modules` array and resets `activeFormType`.
   - `ModuleListPanel` (right/below on desktop, below form on mobile): shows modules in order. Each item: type icon + abbreviated preview (name/title or first 40 chars). Drag handle (desktop: `cursor: grab`, uses HTML5 drag-and-drop API). ↑/↓ buttons (mobile, shown at ≤768px). Remove × button.
   - "← Back to basics" link: calls `onBack`
   - "Review guide →" button: disabled if `modules.length === 0` with tooltip "Add at least one module to continue". Calls `onNext` when enabled, passing modules to `guideData`.

4. **Module forms:**

   **`PlaceSearchForm`**:
   - Text input for search query
   - On submit/enter: call Google Places API (see Section 4). If `VITE_GOOGLE_PLACES_API_KEY` is not set or request fails, filter `SEED_PLACES` by name/neighborhood match.
   - Results list: each result shows name + address + category. "Add to guide" button.
   - After clicking "Add": show editor note textarea (required) + "Add to guide" confirm button.
   - Editor note `placeholder`: "Why did you include this place? (required)"
   - On confirm: construct `PlaceModule` object and pass to parent via `onAddModule(module)` callback.

   **`ArticlePickerForm`**:
   - Two tabs: "Recent articles" / "Paste a URL"
   - Recent articles tab: list of `rssArticles` from context (from both sources). Each shows headline + source + date + "Add to guide" button. On add: optional editor note → `onAddModule`.
   - Paste URL tab: text input. Validate that URL contains `chicago.suntimes.com` or `wbez.org` (show inline error if not). On "Add": search `rssArticles` in context for a matching URL. If found, use that article's `title` and `summary`. If not found in cache, construct a minimal `ArticleModule` with `title: 'Article from [source]'`, `summary: ''`, `source` inferred from the domain, `publishedAt: new Date().toISOString()`, and the pasted URL. Optional editor note.

   **`ProductForm`**: Controlled form — Name, Description, Price (optional), "Where to get it", Member deal toggle (on: shows deal description field), Unsplash photo picker (same 20 photos as COVER_PHOTOS), editor note (optional). "Add to guide" button → `onAddModule`.

   **`EventForm`**: Controlled form — Event name, Date (text input, e.g. "Saturday April 4" or "Every Sunday"), Location, Neighborhood dropdown, Description, URL (optional), Unsplash photo picker, editor note. "Add to guide" → `onAddModule`.

   **`PostForm`**: Large textarea (body, plain text, no formatting). Photo picker (up to 3, multi-select from 20-photo gallery). Editor note. Auto-set `isLong: body.length > 300`. "Add to guide" → `onAddModule`.

   **`PlaylistForm`**: Platform toggle (Spotify / Bandcamp). Embed URL paste field. Real-time validation: Spotify URLs must match `open.spotify.com/(playlist|album|track)/[A-Za-z0-9]+`; Bandcamp must contain `bandcamp.com`. On valid Spotify URL: convert to embed URL and show live iframe preview. Title field. Optional description + editor note. If invalid URL submitted: show inline error "Paste a valid Spotify or Bandcamp URL". "Add to guide" → `onAddModule`.

5. **`StepReview`** — read-only preview:
   - Read-only rendering of all modules using the same module components from Phase 4.
   - Summary line at top: `[N] modules · [Primary Neighborhood] · [Privacy setting]`
   - Badge chips
   - Cover photo thumbnail
   - "← Edit modules" link → `onBack`
   - "Publish guide" button:
     - Generate `id: 'session-' + Date.now()`
     - Construct full `Guide` object from `guideData` + author = Alex Rivera + `isSessionCreated: true` + `createdAt: new Date().toISOString()`
     - Dispatch `ADD_GUIDE`
     - If `privacy === 'public'`: call `showToast('Your guide has been submitted for review. It will appear in the feed shortly.')`
     - Always (regardless of privacy): call `showToast('Your guide has been matched to [neighborhood]. Neighborhood matching is still being refined.')` after a 1.5s delay (so the two toasts don't overlap)
     - Navigate to `/guide/[newId]` using `navigate('/guide/'+newId, { state: { isNew: true } })` — this passes the flag that triggers the success banner in `GuideDetailPage` (built in Phase 4)

**Smoke test:** Complete the full creation flow: fill in step 1, add at least 3 different module types in step 2 (including a playlist with a Spotify URL — use `https://open.spotify.com/playlist/37i9dQZF1DWSXBu5naYCM9`), review in step 3, publish. Verify the new guide appears in `/feed` and at its `/guide/:id` page with all modules rendered correctly. Visit `/?reset=true` — the session guide should disappear from the feed.

**Dependencies:** Phases 0–4 complete.

---

### Phase 6: Guide Remix Flow

**Goal:** `/guide/:id/remix` allows users to remix any seeded guide, modify it, and save it as their own with proper attribution.

**Files to create:**
- `client/src/pages/GuideRemixPage/GuideRemixPage.jsx` + `GuideRemixPage.module.css`

**Tasks:**

1. **`GuideRemixPage`** — wraps the same 3-step creation wizard with modifications:
   - On mount: read `params.id` → look up original guide in context → if not found, navigate to `/feed`.
   - Pre-populate `guideData`:
     - `title`: `"My remix of [original.title]"` (editable)
     - `description`: empty (not copied)
     - `neighborhood`: same as original (but editable)
     - `badges`: same as original (but editable)
     - `coverImage`: same as original (but editable)
     - `privacy`: `'public'` (default)
     - `modules`: deep copy of `original.modules` (user can add/remove/reorder)
   - **Persistent attribution banner**: sticky bar below header, always visible throughout all 3 steps. Background `var(--gray-900)`, white text: `"Remixing '[original.title]' by @[originalAuthorHandle]"`. Not dismissible.
   - Step 1 defaults to original's neighborhood/badges/cover but all fields editable.
   - Step 2 pre-populated with original's modules. User can add/remove/reorder.
   - Step 3 review shows attribution notice at bottom.
   - On "Save remix":
     - Construct `Guide` with `remixOf: original.id`, `isSessionCreated: true`, `authorId: 'user-alex'`, new `id: 'session-' + Date.now()`
     - Dispatch `ADD_GUIDE`
     - Navigate to `/guide/[newId]`
   - On the resulting guide detail page: remix attribution block shows automatically (guideDetailPage already handles `remixOf`).

**Smoke test:** Navigate to `/guide/guide-001`, click "Remix this guide →". Attribution banner is visible. Remove one module, add a new post module. Proceed to step 3 and save. Verify the new guide detail page shows the remix attribution block linking back to guide-001. Guide-001 is unmodified.

**Dependencies:** Phases 0–5 complete.

---

### Phase 7: Profile Page

**Goal:** `/profile/:handle` renders the full profile for Alex Rivera and all seeded users. Journalist profiles show the newsroom variant.

**Files to create:**
- `client/src/pages/ProfilePage/ProfilePage.jsx` + `ProfilePage.module.css`
- `client/src/components/HingePromptCard/HingePromptCard.jsx` + `HingePromptCard.module.css`

**Tasks:**

1. **`ProfilePage`** — look up user from context by `user.slug === params.handle`. **Do not match on `user.handle`** — the handle includes the domain suffix (e.g. `alexrivera.chicago.com`) but the route param is slug-only (e.g. `alexrivera`). If not found, render "User not found" with link to `/feed`.

2. **Profile header** (for community members):
   - Display name: Big Shoulders Text, large (36px+)
   - `@handle.chicago.com` in Inter, `var(--gray-500)`, below display name
   - **Chicago tenure badge**: large, prominent. E.g.: `"7 years in Chicago"` — styled as a pill or badge in `var(--red)` or a bordered block. This is a trust signal — make it visually prominent.
   - **Neighborhood history timeline**: render `neighborhoodHistory` as an ordered list: `"Pilsen (2019–2022) → Logan Square (2022–2024) → Lincoln Square (2024–present)"`. Most recent neighborhood at end. Use `→` separator. Current neighborhood (no `endYear`) shows "–present".
   - Interest badge chips (user's `badges`) in `var(--gray-200)` pills
   - `Follow` button — non-functional (renders but does nothing)

3. **Profile header** (for journalist accounts — `user.isJournalist === true`):
   - Display name + handle as above
   - **Instead of tenure/neighborhood history**: show `"★ From the newsroom · [publication display name]"` where publication display name maps: `suntimes` → "Chicago Sun-Times", `wbez` → "WBEZ". Style the ★ in `var(--red)` and the text in `var(--blue)`.
   - No interest badges or neighborhood history for journalist accounts.

4. **`HingePromptCard`** — props: `prompt: string, answer: string`. Style:
   - Card with white background, subtle border
   - Prompt question in Inter, small, `var(--gray-500)`, above answer
   - Answer in Inter or Big Shoulders Text, larger, `var(--black)`
   - Comfortable padding

5. **Hinge prompts section** — labeled "About [displayName]". Render user's `hingePrompts` as a grid (2 columns desktop, 1 column mobile) of `HingePromptCard` components. Alex Rivera has 4 prompts (see Section 5). Other seeded users should have 2–3 prompts defined in `seed.js` — add these when building Phase 2 seed data.

6. **Guide tabs** — four tabs: `Guides` / `Remixes` / `Saved` / `Collaborations` (optional)
   - `Guides` tab: all guides from context where `guide.authorId === user.id && !guide.remixOf`. For Alex Rivera: session-created guides also appear here.
   - `Remixes` tab: all guides where `guide.authorId === user.id && guide.remixOf !== undefined`.
   - `Saved` tab:
     - For Alex Rivera: guides where id is in `savedGuideIds` from AppContext state (session-managed).
     - For other users: guides where id is in `user.savedGuideIds` (seeded in `seed.js` — see Section 5 Users for the per-user lists).
   - `Collaborations` tab: guides where `guide.collaborators.includes(user.id)` and `guide.authorId !== user.id`. Alex Rivera is a collaborator on guide-003, so his Collaborations tab shows guide-003. This tab is **required** — the Phase 9 smoke test verifies it.
   - Each tab renders a card grid of `GuideCard` components (2 columns desktop, 1 column mobile).
   - Empty state for each tab: "No guides yet." with Create Guide CTA (for Alex Rivera's Guides tab only; other empty tabs show plain "Nothing here yet.").

7. **Header nav** — ensure the account chip in the Header navigates to `/profile/alexrivera` on click.

**Smoke test:** Navigate to `/profile/alexrivera`. Tenure badge shows "7 years in Chicago". Neighborhood history shows Pilsen → Logan Square → Lincoln Square. 4 hinge prompt cards are visible. Guides tab shows Alex's seeded guides (guide-001, guide-004, guide-009 authored by Alex). Collaborations tab shows guide-003. Saved tab is empty (no seeded saves for Alex). Navigate to `/profile/alkeefe` — newsroom header shows, no neighborhood history. Navigate to `/profile/mariam` — community member profile with their neighborhoods and 3 hinge prompts. Navigate to `/profile/yukis` — Saved tab shows guide-008 and guide-010. Navigate to a non-existent handle `/profile/nobody` — "User not found" page.

**Dependencies:** Phases 0–4 complete. The profile page can be built before Phase 5/6, but the "session-created guides appear in the Guides tab" behavior (task 6) is only testable after Phase 5 is complete — note this in the session summary if Phase 7 is built before Phase 5.

---

### Phase 8: Neighborhood Page + Explore Page

**Goal:** All 77 neighborhood pages are functional. The Explore page provides a secondary discovery surface.

**Files to create:**
- `client/src/pages/NeighborhoodPage/NeighborhoodPage.jsx` + `NeighborhoodPage.module.css`
- `client/src/pages/ExplorePage/ExplorePage.jsx` + `ExplorePage.module.css`

**Tasks:**

1. **`NeighborhoodPage`** — params: `:slug` (e.g. `humboldt-park`). On mount: find matching community area from context by `slug` field. If not found: show "Neighborhood not found" with `/feed` link.

   Layout:
   - Neighborhood name: Big Shoulders Display, all caps, large. Below: community area number badge (e.g. `Community Area #23`).
   - **Leaflet boundary map**: `<MapContainer>` with GeoJSON layer. Load boundary from the **bundled static file** `chicago-community-areas.geojson` (at `/chicago-community-areas.geojson`). Do not fetch from Socrata — the file is bundled in `public/` and available without a network call.
     - On mount: `fetch('/chicago-community-areas.geojson')` → parse JSON → find the feature where `properties.community === area.name.toUpperCase()` or `properties.area_numbe === area.id` (match on community area number is most reliable).
     - Render: `<GeoJSON data={matchedFeature} style={{ color: 'var(--red)', weight: 2, fillOpacity: 0.1 }} />`
     - Center the map on the feature's bounding box using `map.fitBounds(layer.getBounds())`
     - While the JSON fetch is in progress: show skeleton rectangle (same height as map). Must include Leaflet CSS and marker icon fix (same as GuideMap in Phase 4).
   - Neighborhood stats strip: population from community areas data. Adjacent neighborhoods (if available from Socrata data). Render as a horizontal list of stats.
   - **"Guides about [Neighborhood]"** section: filter context guides by `guide.neighborhood === neighborhood.name || guide.additionalNeighborhoods.includes(neighborhood.name)`. Render as card grid. **Empty state**: "No guides yet for [Neighborhood]. Be the first to create one." + `<Link to="/guide/new">Create a guide</Link>`.
   - **"From the newsroom"** section: filter `rssArticles` by checking if the article title or summary contains the neighborhood name (simple string match). Display as ArticleCard components.
   - `Follow this neighborhood` button — non-functional.

2. **Neighborhoods dropdown in Header** — update Header to populate the Neighborhoods dropdown from `communityAreas` in context (all 77). Each item links to `/neighborhood/:slug`. Group alphabetically or by area ID. Add a search/filter input to the dropdown for usability (optional but recommended).

3. **`ExplorePage`** — layout:
   - Search bar: text input. On input: filter context guides by `guide.title.toLowerCase().includes(query)` or `guide.neighborhood.toLowerCase().includes(query)`. Show results below. If no results: "Nothing matches '[query]'.". Debounce by 300ms.
   - **Browse by neighborhood**: grid of all 77 community areas as tiles. Each tile: neighborhood name in Big Shoulders Text (uppercase), background in `var(--gray-200)`, hover state in `var(--blue)` with white text. Links to `/neighborhood/:slug`. Responsive grid: 4 columns desktop → 2 columns mobile.
   - **Trending guides**: sort context guides by `likeCount` descending, show top 8 as `GuideCard` row (horizontal scroll on mobile).
   - **From the newsroom**: journalist-authored guides (`isNewsroom: true`) + the 5 most recent RSS articles sorted by `publishedAt` descending. Render as a 2-column grid of mixed `GuideCard` and `ArticleCard` components.

**Smoke test:** Navigate to `/neighborhood/humboldt-park` — name, map boundary, and filtered guide cards appear. Navigate to a neighborhood with no guides — empty state CTA shows. Navigate to `/explore` — search "Pilsen" filters guide cards. Neighborhood grid shows 77 tiles. Trending guides show the highest-liked guides.

**Dependencies:** Phases 0–4 complete. Phase 3 for RSS articles in context.

---

### Phase 9: Polish, Error States & Session Reset

**Goal:** All error states, empty states, loading skeletons, accessibility improvements, and session reset are working. Final smoke test passes.

**Files to modify:**
- `client/src/context/AppContext.jsx` (verify `/?reset=true` logic from Phase 2)
- `client/src/App.jsx` (verify Shift+R listener from Phase 1)
- `client/src/components/ErrorBoundary/ErrorBoundary.jsx` (finalize content)
- Various page components (add remaining error/empty states)
- `docs/moderator-guide.md` (create)
- `docs/technical-guide.md` (create)

**Tasks:**

1. **Session reset** (verify both mechanisms are working):
   - `/?reset=true` — URL param check lives in `AppProvider` (`AppContext.jsx`, Phase 2 task 7). `App.jsx` is **not** modified for this feature.
   - `Shift+R` held 2 seconds — keydown listener lives in `App.jsx` (`App.jsx`, Phase 1 task 9). `AppContext.jsx` is **not** modified for this feature. **Do not move this to `AppContext` — hooks cannot be called outside the React component tree.**
   - These are two separate features in two separate files. Phase 9 only verifies they still work end-to-end — it does not re-implement them.
   - `RESET_SESSION` removes all `isSessionCreated` guides from `guides`, resets `feed.filters` to `{ contentTypes: [], badges: [] }`, clears `likedGuideIds`, `helpfulGuideIds`, `savedGuideIds`.

2. **Error states** — implement the following (per product-requirements Section 9):
   - RSS fetch fails → return `[]`, feed shows guides only (already handled in Phase 3 RSS route)
   - Places API error → PlaceSearchForm shows inline "Search unavailable — try a different term"; fall back to seeded places search
   - Socrata API down → AppContext loads `fallback-community-areas.json` instead
   - Guide ID not found → GuideDetailPage navigates to `/feed`
   - Invalid playlist URL → PlaylistForm shows inline "Paste a valid Spotify or Bandcamp URL"
   - Uncaught error → ErrorBoundary renders "Something went wrong — [go back to the feed]"

3. **Empty states** — verify all empty states are implemented:
   - Neighborhood with no guides: "No guides yet for [Neighborhood]. Be the first to create one." + Create Guide CTA
   - Profile with no guides: "No guides yet." + Create Guide CTA (Alex Rivera only)
   - Feed filter returns nothing: "Nothing matches your current filters." + `Clear filters` link
   - No module added in creation: "Review guide →" disabled with tooltip "Add at least one module to continue"

4. **Loading states** — verify all skeleton/loading states:
   - Feed initial load: 6 `SkeletonCard` components render while RSS fetch is pending
   - RSS article fetch: skeleton article cards mixed into feed
   - Neighborhood page map: skeleton rectangle while GeoJSON loads
   - Places search: inline spinner below search bar while API call is in progress
   - Playlist embed: skeleton rectangle in guide body while iframe loads

5. **Accessibility pass**:
   - All `<img>` tags have descriptive `alt` attributes
   - All interactive elements have visible focus states (`:focus-visible` outline in `var(--red)` or `var(--blue)`)
   - WCAG AA contrast verified for: body text on white, white text on `var(--red)` buttons, `var(--gray-500)` on white, and **`var(--gold)` (#C9A84C) on white** (this is borderline at 2.8:1 — does not meet AA for normal body text; acceptable only for large text ≥18px or bold ≥14px. The CPM Member Deal callout text must be at least 14px bold to be compliant. Verify this.)
   - All touch targets ≥ 44×44px (check mobile nav, card engagement buttons, badge chips)
   - `<button>` elements used for interactive elements (not `<div>` with onClick)

6. **Performance verification** (lightweight — no build tooling required):
   - Open Chrome DevTools → Network tab → disable cache → hard reload `/feed`. Confirm the page is interactive within 3 seconds on a simulated Fast 3G connection (DevTools throttling).
   - Confirm RSS article cards appear within 2 seconds of page load (check Network tab for `/api/rss` response time).
   - Test Places search in the guide creation flow: type a query, confirm results appear within 1.5 seconds (or the seeded fallback results appear instantly).
   - If any of these fail, note it in the session summary for Ellery — do not block the phase on performance, but surface it.

7. **Final routing verification**:
   - Confirm `/guide/new` is declared before `/guide/:id` in route table
   - Confirm `/?reset=true` redirects to `/feed` after reset (URL cleanup)
   - Confirm `*` catch-all renders `NotFoundPage` (built in Phase 1) — it should show "404 — Page not found" with a link to `/feed`

8. **robots.txt and noindex** — verify both are in place:
   - `client/public/robots.txt`: `User-agent: *\nDisallow: /`
   - `client/index.html` `<head>`: `<meta name="robots" content="noindex, nofollow">`

9. **Documentation deliverables** — create the following files:

   **`docs/moderator-guide.md`** — for the chicago.com editorial team running user testing sessions. Must cover all of the following:
   - **What this prototype is**: a clickable prototype for user testing only — not production, no real data persistence, no real authentication
   - **How to share it with participants**: give them the Railway URL directly; do not share via search or social (it is noindexed)
   - **How to reset between participants**: `/?reset=true` (append to any URL) or hold Shift+R for 2 seconds. Clears: session-created guides, feed filter selections, likes/helpful/saved counts. Does NOT reset: seeded guide data
   - **Map of the 5 key user flows** the prototype demonstrates:
     1. Browse the feed and use filters
     2. Open a guide and view all module types
     3. Remix a guide
     4. Create a new guide (full 3-step wizard)
     5. View a user profile
   - **Guide creation flow walkthrough**: step-by-step with what each step shows (Step 1: basics, Step 2: add modules by type, Step 3: review and publish)
   - **What is non-functional** (cosmetic only): Follow buttons, Share buttons (except "Link copied!" toast), real-time like persistence beyond session, real moderation queue, authentication
   - **Navigation guide**: how to reach specific guides/neighborhoods by URL — e.g. `/guide/guide-001` for the Humboldt Park reference guide, `/neighborhood/logan-square` for a neighborhood page
   - **The pre-loaded user**: Alex Rivera (`@alexrivera.chicago.com`) — his profile, guides, and neighborhood history are all seeded
   - **The `isEditorsPick`, `isReviewed`, `isSponsored` flags** and what each means visually
   - **Troubleshooting**: white screen → hard refresh; guide not found → use `/?reset=true`; RSS cards not appearing → Express server may not be running

   **`docs/technical-guide.md`** — for the next engineer. Cover:
   - Repo structure (reference Section 2 of dev-plan)
   - How to run locally (`npm run dev` from root)
   - Environment variables and where to get the values
   - Railway deployment — two services, Caddyfile requirement
   - AppContext state shape and how to add new actions
   - Seed data location and how to add new guides/users
   - Known limitations and prototype-specific simplifications (no auth, no persistence, cosmetic ATProto handles, dummy neighborhood algorithm)

**Final smoke test (full user-testing walkthrough):**
1. Open `/feed` — skeleton cards appear briefly, then 17 guide cards load. RSS article cards are mixed in. SkeletonArticleCards visible briefly.
2. Click a badge in FilterPanel — feed updates. Click a content type — filters further. Click "Clear all filters" — feed resets. Open "How your feed works" modal — both ordering and filter sections are present.
3. Click guide-001 — all 6 module types render. Long post collapses. Spotify iframe loads (skeleton → iframe). Map shows 3 pins.
4. Click guide-003 — "Also contributed by: Alex Rivera" block appears.
5. Click ♥ on guide-001 — count increments and heart goes red. Navigate away and back — like is remembered.
6. Click "Remix this guide →" on guide-001 — attribution banner visible. Add a module, remove a module, save. New guide detail shows success banner + remix attribution.
7. Click "+ Create Guide" — complete full 3-step flow with 3+ module types. Publish (Public). Two toasts appear in sequence. Navigate to new guide detail — success banner shows. Guide appears in `/feed` and `/profile/alexrivera` Guides tab.
8. Navigate to `/neighborhood/humboldt-park` — boundary map renders, guide-001 card visible. Navigate to `/neighborhood/andersonville` — guide-008 and guide-017 both appear.
9. Navigate to `/explore` — search "Pilsen" filters to Pilsen guides. Neighborhood grid shows 77 tiles.
10. Navigate to `/profile/alexrivera` — tenure badge, neighborhood history, 4 hinge prompts, Collaborations tab shows guide-003. Navigate to `/profile/alkeefe` — newsroom header. Navigate to `/profile/yukis` — Saved tab shows guide-008 and guide-010.
11. Press Shift+R for 2 seconds — "Session reset" toast. Session guides gone. Likes cleared.
12. Visit `/?reset=true` — same reset, URL becomes `/feed`.
13. Visit `/profile/nobody` — "User not found" page. Visit `/this-does-not-exist` — 404 NotFoundPage.

**Dependencies:** All previous phases complete.

---

## Section 7: Deployment Notes

### Railway Configuration

Two services:
1. **chicago-com-frontend**: Build command: `npm run build --prefix client`. Output: `client/dist`. Served by Caddy using `client/Caddyfile`. The Caddyfile is required for SPA routing — without it, all non-root URLs return 404.
2. **chicago-com-server**: Start command: `node server/index.js`. Environment variables: `ALLOWED_ORIGIN` (set to frontend Railway domain), `PORT` (Railway sets this automatically).

### Environment Variables

Frontend (`client/.env`, not committed):
```
VITE_GOOGLE_PLACES_API_KEY=<from keeley-and-archer project>
VITE_CHICAGO_DATA_PORTAL_TOKEN=<from keeley-and-archer project>
VITE_API_BASE_URL=   # leave blank locally; Vite proxy handles /api — set to Express Railway URL in production
```

Server (Railway env vars):
```
ALLOWED_ORIGIN=https://chicago-com-frontend.up.railway.app
PORT=<set by Railway>
```

Local development: Vite proxy forwards `/api/*` to `http://localhost:3001` (configured in `vite.config.js` — see Phase 0 task 5). `VITE_API_BASE_URL` should be left blank locally. In production, set `VITE_API_BASE_URL` on the Railway frontend service to the Express server's Railway URL.

Add `localhost` to Google Cloud Console allowlist for the Places API key. Restrict the key to the Railway domain once deployed.

### Commit Format

Per CLAUDE.md: `Phase N: [short description]`  
Example: `Phase 3: feed page, guide cards, and filter panel`

Push to `main` after each phase commit. If push is rejected: `git pull --rebase origin main` first.

---

## Section 8: Resolved Decisions

1. **Bandcamp embed IDs**: Use the specific album **Light Blue Lines — *Perimeter*** (`https://lightbluelines.bandcamp.com/album/perimeter`) for guide-002. The agent building Phase 2 must extract the numeric album ID from the page source and hardcode the embed URL in `seed.js`. See Section 4 Bandcamp spec for full instructions. For user-pasted Bandcamp URLs in the creation flow, show a fallback link card rather than an iframe. ✓ Resolved.

2. **Neighborhood boundary GeoJSON**: Bundle a static GeoJSON file at `client/public/chicago-community-areas.geojson`. Fetch from Socrata once during Phase 2 build and save as a static asset. No runtime Socrata GeoJSON fetches. ✓ Resolved.

3. **Google Places API key restriction**: The key is unrestricted. Add `localhost:5173` to the API key's HTTP referrer allowlist in Google Cloud Console for local development. Add the Railway frontend domain to the allowlist once it is known after first deployment. No action needed before Phase 5. ✓ Resolved.

4. **Hinge prompts for seeded users**: All 5 community member accounts have full hinge prompt data in Section 5. Journalist accounts have no prompts. ✓ Resolved.

5. **Representative Chicago Bandcamp artist**: Light Blue Lines (*Perimeter*) for guide-002. Whitney (Chicago indie rock, *Light Upon the Lake* on Spotify) for guide-016. ✓ Resolved.
