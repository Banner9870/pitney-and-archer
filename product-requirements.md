# chicago.com Prototype — Product Requirements Document

**Version:** 2.0
**Date:** 2026-04-01
**Author:** Ellery Jones, Chicago Public Media
**Purpose:** User testing prototype — validate multi-module guides concept, guide creation flow, and profile design. Successor to the keeley-and-archer prototype.
**Repo:** To be created as a new GitHub repo (pitney-and-archer or similar), deployed to Railway.

---

## 1. Project Overview

### Context

This is the second rapid-prototype iteration for chicago.com, a hyperlocal engagement platform from Chicago Public Media (home to the Chicago Sun-Times and WBEZ). The platform is being co-developed with New Public's Roundabout — a nonprofit, AT Protocol-based community product built for neighborhood-level trust.

The first prototype (keeley-and-archer) tested the core browse/create/remix flow with guides defined as **lists of places**. This prototype tests the evolution of that concept: **guides as multi-module containers** that can include places, articles, products, events, posts, and playlists in any combination.

### What We're Testing

- Does the multi-module guide concept make sense to users?
- Would users create or remix a guide if they could include their own posts, a playlist, or products alongside places?
- How do users respond to a profile that centers personality and neighborhood history over guide counts?
- Does the sponsored guide + member deal model feel natural?

### What This Is Not

- A production build
- An authenticated system (pre-loaded user account, no sign-up flow)
- A real ATProto implementation (handles are cosmetic)
- A Roundabout integration (Roundabout informs design language; no API calls to it)

### Prototype Success Criteria

- Users can browse a realistic explore feed with at least a dozen guides spanning multiple neighborhoods and content types
- Users can open a guide and see a working multi-module layout (places, posts, playlists, etc.)
- Users can **create a new guide** through the full multi-module creation flow (functional — persists in session state)
- Users can **remix an existing guide** and produce a new guide with attribution (functional)
- Users can browse a profile page that feels like a real person, not just a guide list
- All other interactions (likes, helpful counts, follows, share) are clickable and feel real but do not persist beyond session state
- Session can be reset between participants via `/?reset=true`

---

## 2. Design System

### Continuity with Iteration 1

The keeley-and-archer design system is retained in full. No redesign. The visual identity — bold, assertive, Chicago flag-inspired — was validated and should carry forward.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--red` | `#EF002B` | Primary action, CTA buttons, active states, Chicago star accent |
| `--blue` | `#41B6E6` | Secondary accent, neighborhood tags, decorative stripes, newsroom content |
| `--white` | `#FFFFFF` | Backgrounds, text on dark surfaces |
| `--black` | `#161616` | Primary text, header backgrounds |
| `--gray-100` | `#F5F5F5` | Page background |
| `--gray-200` | `#E0E0E0` | Card borders, dividers |
| `--gray-500` | `#757575` | Secondary text, metadata |
| `--gray-900` | `#212121` | Dark card background, footer |
| `--gold` | `#C9A84C` | Sponsored guide accent (new in v2) |

### Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display headings | **Big Shoulders Display** | 900 | Google Fonts. Condensed, bold, uppercase. Page titles, hero text, neighborhood names. |
| UI headings | **Big Shoulders Text** | 700 | Card titles, section headings. |
| Body text | **Inter** | 400/500 | Summaries, descriptions, metadata. |
| Article / post body | **Source Serif 4** | 400 | Reading-length content. |

**Typography rules (unchanged from v1):**
- Neighborhood names and page section titles: uppercase in Big Shoulders Display
- Guide titles: title-case in Big Shoulders Text (not all-caps)
- Metadata (timestamps, handles, counts): Inter 0.8rem, `--gray-500`

### Identity & ATProto-Inspired Design (unchanged from v1)

- Every user has a `@handle.chicago.com` identity displayed below their display name
- Journalist handles: `@reporter.suntimes.com` or `@reporter.wbez.org`
- Journalist content carries a ★ (Chicago star) badge + "From the newsroom" label
- Sponsored content carries a gold "Sponsored" badge (see Section 3.6)

### Layout Grid

- Max content width: `1200px`, centered
- Two-column on desktop (main content + sidebar), single-column on mobile
- Mobile breakpoint: `768px`
- Base spacing unit: `8px`

### Card Design

Two base card variants (guide card and article card) from v1 are retained. A new **guide card v2** adds a module-type icon strip to signal the content mix without requiring the user to open the guide.

**Guide Card v2**
- White background, `4px` top border in `--red`
- `2px` border-radius
- Cover photo (full-width, 16:9) — required; falls back to Google Maps Static API thumbnail of first place if absent
- `★ GUIDE` pill badge overlaid top-left of cover image
- Card body: guide title (Big Shoulders Text 700), author identity block (display name + `@handle`), neighborhood tag
- **Module type icon strip** (new): small icon row showing which content types are in the guide — e.g., 📍 Places · 🎵 Playlist · 📰 Article · 🎟️ Events. Icons are displayed in `--gray-500`, max 4 shown, overflow truncated with a `+N more` label.
- Engagement row: ♥ Like count · ✓ Helpful count · `Remix →` CTA in `--red`
- Sponsored variant: gold left border stripe + "Sponsored" pill in `--gold`

**Article Card (unchanged from v1)**
- `4px` top border in `--blue`, no cover image, text-only, compact

### Session State Badge

A persistent "★ Editor's Pick" label on flagged guide cards. A persistent "Reviewed" label on guides that have been through moderation. Both are seeded data flags — not user-interactive in the prototype.

---

## 3. Content Architecture

### 3.1 Guides

A guide is a named, attributed collection of **modules** in a user-defined order. A guide must have at least one module to be saved. Guides can include any mix of module types.

**Guide metadata:**
```
type Guide = {
  id: string
  title: string
  description: string             // max 280 chars
  authorId: string
  collaborators: string[]         // array of user IDs
  neighborhood: string            // primary neighborhood (one of 77 community areas)
  additionalNeighborhoods: string[] // populated by dummy algorithm in prototype
  badges: string[]                // interest tags (see Section 3.5)
  modules: Module[]               // ordered array — the guide body
  coverImage: string              // Unsplash URL or user-selected photo
  privacy: 'public' | 'friends' | 'private'
  isEditorsPick: boolean
  isReviewed: boolean             // editorially reviewed; shown in feed
  isSponsored: boolean
  sponsorName?: string
  likeCount: number
  helpfulCount: number
  remixCount: number
  remixOf?: string                // guide ID if this is a remix
  isNewsroom: boolean
  newsroomSource?: 'suntimes' | 'wbez'
  createdAt: string               // ISO 8601
  isSessionCreated: boolean       // true if created during this prototype session
}
```

### 3.2 Module Types

Each module in a guide is a typed object. The guide detail page renders modules in order using a module-type-specific component.

#### Place Module
```
type PlaceModule = {
  type: 'place'
  placeId: string               // Google Places ID or seeded ID
  name: string
  address: string
  neighborhood: string
  category: PlaceCategory       // see enum below
  rating?: number
  reviewCount?: number
  editorNote: string            // required; 1–3 sentences
  coverImage?: string           // Google Places photo or seeded URL
}

type PlaceCategory = 'restaurant' | 'cafe' | 'bar' | 'music_venue' | 'park' |
                     'cultural_institution' | 'shop' | 'other'
```

**Rendered in guide:** Full-width card with photo, place name, address, category icon, rating, editor note. Map pin added to the guide's Leaflet map.

#### Article Module
```
type ArticleModule = {
  type: 'article'
  title: string
  url: string
  summary: string               // RSS description or user-written pullquote
  source: 'suntimes' | 'wbez'
  publishedAt: string
  editorNote?: string           // optional — why the guide author included this
}
```

**Rendered in guide:** Compact card with publication logo, headline, summary, optional editor note, `Read →` link (new tab).

#### Product Module
```
type ProductModule = {
  type: 'product'
  name: string                  // e.g. "The Latte" or "Signed copy of Parakeet"
  description: string
  price?: string                // formatted string, e.g. "$14"
  where: string                 // business name or address
  coverImage?: string
  isMemberDeal: boolean         // if true, shows Chicago Public Media member badge
  dealDescription?: string      // e.g. "10% off with CPM membership"
  editorNote?: string
}
```

**Rendered in guide:** Product card with photo, name, price, location, optional member deal callout in `--gold` with CPM logo.

#### Event Module
```
type EventModule = {
  type: 'event'
  name: string
  date: string                  // ISO 8601; can be a recurring string like "Every Sunday"
  location: string
  neighborhood: string
  description: string
  url?: string
  coverImage?: string
  editorNote?: string
}
```

**Rendered in guide:** Event card with date badge (prominent, red), event name, location, description, optional link.

#### Post Module
```
type PostModule = {
  type: 'post'
  body: string                  // user-written text; supports line breaks
  images: string[]              // array of Unsplash URLs (up to 3)
  isLong: boolean               // if body > 300 chars, truncate with "Read more" toggle
  editorNote?: string
}
```

**Rendered in guide:** Photo(s) in a simple gallery above the post body. Long posts collapse to 3 lines with a `Read more` toggle that expands inline (no navigation).

#### Playlist Module
```
type PlaylistModule = {
  type: 'playlist'
  platform: 'spotify' | 'bandcamp'
  embedUrl: string              // Spotify embed URL or Bandcamp album/track URL
  title: string                 // playlist or album name
  description?: string
  editorNote?: string
}
```

**Rendered in guide:** For Spotify — an iframe embed using the standard Spotify embed player. For Bandcamp — an iframe embed using the Bandcamp embed player. Both are standard embeds; no API key required. Above the embed: platform icon + title + optional description + editor note.

### 3.3 The Neighborhood Algorithm (Dummy Version)

In production, an algorithm will determine which neighborhoods a guide is relevant to beyond its declared primary neighborhood. For the prototype:

- The guide's `neighborhood` field is set by the author at creation time (one of 77 community areas).
- `additionalNeighborhoods` is set in seed data manually for pre-built guides (e.g., a guide about the 606 Trail might also tag Wicker Park, Logan Square, and Humboldt Park).
- For session-created guides, `additionalNeighborhoods` is left empty — the dummy algorithm produces a toast: `"Your guide has been matched to [primaryNeighborhood]. Neighborhood matching is still being refined."` This communicates the concept without requiring real logic.

### 3.4 Guide Privacy & Moderation

Guides have three privacy settings:
- **Private** — visible only to the author (in their profile)
- **Friends** — shareable via link, not in public feed
- **Public** — submitted for moderation before appearing in the explore feed

In the prototype, moderation is cosmetic: selecting "Public" shows a confirmation banner — `"Your guide has been submitted for review. Public guides are reviewed by the chicago.com team before appearing in the feed."` — and the guide appears in the session feed immediately (with an `isSessionCreated` flag). No actual review queue exists.

### 3.5 Badges

Badges are interest/topic tags attached to guides and user profiles. They are not algorithmically generated — authors select them at guide creation, and users select them at profile setup (pre-selected for the prototype's dummy user).

**Suggested badge set (minimum 16 for prototype):**
Coffee · Bars · Restaurants · Live Music · Books · Art · Film · Parks & Outdoors · History · Architecture · Shopping · Sports · Family-Friendly · LGBTQ+ · Food & Drink · Community

Badges render as small pill chips in `--blue` on guide cards and `--gray-200` on profile pages.

### 3.6 Sponsored Guides

Businesses can create sponsored guides that include product modules with Chicago Public Media member deals. In the prototype, 1–2 seed guides carry the sponsored flag. Sponsored treatment:

- Gold left border on guide card (instead of `--red`)
- "Sponsored" pill in `--gold` overlaid on the cover image (replacing or alongside the `★ GUIDE` badge)
- Sponsor name displayed in guide metadata: "Created by [Business Name]"
- Product modules with `isMemberDeal: true` show a `★ CPM Member Deal` callout in `--gold` with the deal description

No business-facing creation flow is needed in the prototype.

---

## 4. Pages and Views

### 4.1 Explore Feed — `/feed`

The primary landing page and the main user testing surface. This serves as the "explore" experience — a mix of guides from across the city.

**Layout**
- Full-width hero strip with Chicago flag stripes (two `--blue` horizontal bars)
- Below hero: mixed feed of guide cards
- Right sidebar (desktop): filter panel — content type filter + badge filter
- Below feed: `Load more` button loading 10 more items

**Feed Content**
- Minimum 12 seeded guide cards spanning at least 6 neighborhoods
- At least 2 newsroom-authored guides (Sun-Times and WBEZ reporters)
- At least 2 guides with 3+ module types (demonstrating the multi-module concept)
- At least 1 sponsored guide
- At least 2 guides marked `isEditorsPick`
- At least 3 guides marked `isReviewed`
- Live RSS article cards from Sun-Times and WBEZ mixed into the feed (same as v1)

**Feed ordering (same transparent non-algorithmic logic as v1):**
1. Editor's Picks (flagged guides, sorted by recency)
2. Neighborhood-matched (user's selected neighborhoods)
3. Badge-matched (user's selected interest badges)
4. Citywide news (RSS articles flagged isCitywide)
5. Remaining (all other seeded content, by recency)

**Filter panel (sidebar) — new in v2**
- **Content type filter:** Checkbox group — Places · Articles · Products · Events · Posts · Playlists. Selecting a type shows only guides that contain at least one module of that type. Multi-select additive (OR logic — a guide matching any selected type is shown).
- **Badge filter:** Badge chips (same 16-badge set). Selecting a badge shows guides with that badge. Multi-select additive.
- Both filter selections persist for the duration of the session (React state).
- A `Clear all filters` link resets both panels.
- Active selection count shown in panel header: e.g., `Badges (3)`.

**Engagement row on cards:**
- ♥ Like — increments local count, toggles active state
- ✓ Helpful — same behavior (new in v2; separate from likes)
- `Remix →` — navigates to remix flow
- ↗ Share — opens mock share sheet (non-functional, same as v1)

**"How your feed works" disclosure:** Same modal pattern as v1, updated to also describe the content type and badge filters.

### 4.2 Guide Detail — `/guide/:id`

Full view of a single guide, rendered module-by-module.

**Layout**
- Hero: full-width cover photo, guide title overlaid (Big Shoulders Display, dark gradient scrim), author identity block beneath image
- Guide description (2–4 sentences) below hero
- **Neighborhood chips:** primary neighborhood + any additional neighborhoods, each linking to `/neighborhood/:slug`
- **Badge chips:** guide's interest badges
- **Module list:** ordered modules rendered in sequence using type-specific components (see Section 3.2 for each module's rendered treatment)
- **Place modules only:** After all place modules are rendered, a single Leaflet map appears showing all place pins grouped together (not one map per place). Map is collapsible on mobile.
- Collaborators block (if `collaborators` is non-empty): "Also contributed by:" + avatar chips with handles
- Remix attribution block (if `remixOf` is set): "Remixed from [Original Guide Title] by @originalauthor.chicago.com" — links to original guide
- Sponsored attribution (if `isSponsored`): "Created in partnership with [Sponsor Name]" in `--gold`

**Functional elements**
- `Remix this guide →` button — navigates to `/guide/:id/remix`

**Non-functional elements**
- ♥ Like / ✓ Helpful / ★ Save / ↗ Share — session state only
- `Follow [Author]` — no persistence

### 4.3 Neighborhood Page — `/neighborhood/:slug`

One page per Chicago community area (all 77 supported).

**Layout (unchanged from v1):**
- Neighborhood name (Big Shoulders Display, all caps), community area number badge
- Leaflet map of neighborhood boundary (GeoJSON from Chicago Data Portal)
- `Guides about [Neighborhood]` — filtered feed of guide cards for this neighborhood
- `From the newsroom` rail — RSS article cards keyword-matched to this neighborhood
- Neighborhood stats strip (population, adjacent neighborhoods from Socrata dataset)

**Non-functional:** `Follow this neighborhood` button

### 4.4 Guide Creation Flow — `/guide/new` *(FUNCTIONAL)*

A three-step flow. All data persists in session state. The completed guide appears in the feed immediately with an `isSessionCreated` flag.

---

**Step 1 — Guide Basics**

Fields:
- Title (required, text input)
- Description (optional, textarea, max 280 characters with live counter)
- Primary neighborhood (required, dropdown of all 77 community areas)
- Badges (multi-select chip group from the 16-badge set; required, min 1)
- Cover photo (required — a curated gallery of ~20 Chicago-themed Unsplash photos, same picker approach as v1. User selects one. No file upload.)
- Privacy: `Private` / `Friends` / `Public` (radio group; default: Public)

Navigation: `Continue to modules →`

---

**Step 2 — Add Modules**

The main creative step. Users build the guide body by adding modules in any order.

**Layout:**
- Left/top: module type selector — 6 buttons in a grid, each labeled with icon + type name: 📍 Place · 📰 Article · 🛒 Product · 🎟️ Event · ✏️ Post · 🎵 Playlist
- Right/below: "Your guide" panel — the running list of added modules, draggable to reorder, each with a remove (×) button
- Minimum 1 module required to proceed

**Module entry forms (appear inline below the type selector when a type is selected):**

*Place:* Search bar → Google Places Text Search (Chicago bounding box) → result list → `Add to guide` → editor note field (required). Falls back to seeded place list if API unavailable.

*Article:* Two tabs — "Recent articles" (list of last ~10 RSS items from Sun-Times and WBEZ) or "Paste a URL" (accepts chicago.suntimes.com or wbez.org URLs). Optional editor note field.

*Product:* Form fields: Name · Description · Price (optional) · Where to get it · Member deal toggle (if toggled: deal description field appears). Optional Unsplash photo picker (same 20-photo gallery). Optional editor note.

*Event:* Form fields: Event name · Date (text field, e.g. "Saturday April 4" or "Every Sunday") · Location · Neighborhood (dropdown) · Description · URL (optional). Optional Unsplash photo picker. Optional editor note.

*Post:* Rich textarea for body text (no formatting controls — plain text with line breaks). Up to 3 photos selectable from the Unsplash gallery. Optional editor note.

*Playlist:* Platform selector (Spotify / Bandcamp). Embed URL paste field. Title field. Optional description + editor note. A preview of the embed iframe appears inline once a valid URL is pasted.

**Module list panel:**
- Each added module shows: type icon + abbreviated preview (title or first line of content) + editor note indicator + drag handle + remove button
- Modules can be dragged to reorder
- No limit on module count for prototype

Navigation: `← Back to basics` / `Review guide →`

---

**Step 3 — Review & Publish**

- Read-only preview of the guide as it will appear on the detail page
- Summary line: `[N] modules · [Primary Neighborhood] · [Privacy setting]`
- Badges display as chips
- `Edit` link returns to Step 2
- `Publish guide` button:
  - Saves guide to session state (React context)
  - If privacy is Public: shows moderation confirmation toast — `"Your guide has been submitted for review. It will appear in the feed shortly."`
  - Navigates to the new guide's detail page (`/guide/:sessionGeneratedId`)
  - Success banner at top of guide detail: `"Your guide is live! Share it with friends."` with a mock share button

### 4.5 Guide Remix Flow — `/guide/:id/remix` *(FUNCTIONAL)*

Creates a copy of an existing guide that the user modifies and saves as their own.

**Entry:** `Remix this guide →` button on guide detail page.

**Flow:**
1. All original guide modules are loaded into a pre-populated Step 2 editor
2. Persistent attribution banner: `"Remixing '[Original Guide Title]' by @originalauthor.chicago.com"` — always visible
3. User can: rename the guide, edit description, change cover photo, change badges, add/remove/reorder modules, edit editor notes
4. Step 1 (basics) is also accessible — title defaults to `"My remix of [Original Title]"` (editable)
5. Privacy defaults to Public
6. `Save remix` → saves to session state, navigates to new guide detail
7. Remixed guide detail shows attribution block: `"Remixed from [Original Guide Title] by @originalauthor.chicago.com"` with a link to the original

The original guide is never modified. The remix is a new `Guide` object with a `remixOf` field.

### 4.6 User Profile — `/profile/:handle`

Pre-populated profile for the session user (Alex Rivera) and all seeded users. No sign-up flow.

**Profile header:**
- Display name (Big Shoulders Text, large)
- `@handle.chicago.com`
- **Chicago tenure badge:** "X years in Chicago" (prominent — this is a trust signal)
- **Neighborhood history:** An ordered list or timeline of neighborhoods lived in, e.g., "Pilsen (2017–2020) → Logan Square (2020–2023) → Lincoln Square (2023–present)". For journalist accounts, this is replaced by "★ From the newsroom · Chicago Sun-Times" with the publication handle.
- Interest badge chips (the user's selected badges)
- `Follow` button (non-functional)

**Hinge-style prompts section:**

Users fill out 3–5 prompts from a list. For the prototype, the pre-loaded user has 4 prompts filled in. Each prompt is displayed as a styled card: the prompt question in `--gray-500` above the user's answer in larger text.

**Suggested prompt set (12 options; users pick 3–5 during sign-up — for prototype, pre-selected):**

| Prompt | Notes |
|---|---|
| Two loves and a loathe about Chicago | Original from requirements |
| The best way to spend $10 in Chicago | Original from requirements |
| My go-to neighborhood for a Sunday morning | Inspires guide recommendations |
| The Chicago dish I'd eat every day for a year | Food-focused |
| The local business I'd be heartbroken to lose | Community attachment |
| My most controversial Chicago opinion | Personality signal |
| The neighborhood I grew up in vs. where I live now | Ties to neighborhood history feature |
| What I wish people knew about [my neighborhood] | Hyperlocal |
| The Chicago artist / musician / chef you need to know | Cultural |
| A place in Chicago I haven't told anyone about yet | Hidden gems |
| My perfect $0 day in Chicago | Accessibility-conscious |
| The Chicago thing that never gets old | Nostalgia / attachment |

**Alex Rivera's pre-populated prompts (4 of the above):**
1. *Two loves and a loathe about Chicago* → "Love: The energy on the lakefront in July. Love: The fact that every neighborhood has a distinct vibe. Loathe: The wind in February — I've accepted it but I will not celebrate it."
2. *My go-to neighborhood for a Sunday morning* → "Lincoln Square. Coffee at Café Selmarie, a lap around the farmers market, and then nothing."
3. *The Chicago dish I'd eat every day for a year* → "The jibarito from Borinquen Restaurant. Don't argue with me."
4. *A place in Chicago I haven't told anyone about yet* → "Not saying."

**Guide tabs:**
- `Guides` / `Remixes` / `Saved` — all populated with seeded data in a card grid
- Session-created guides appear in the `Guides` tab immediately after creation

**Collaborations tab (optional, if time allows):** shows guides Alex is listed as a collaborator on.

### 4.7 Explore / Browse — `/explore`

A secondary discovery surface. Less prominent than the feed but linked from the nav.

**Layout:**
- Search bar at top (local filter on seeded guide titles and neighborhoods — not a full-text search)
- `Browse by neighborhood` — visual grid of all 77 Chicago community areas, each as a tile with the neighborhood name; clicking navigates to `/neighborhood/:slug`
- `Trending guides` — 6–8 seeded guide cards with the highest `likeCount`
- `From the newsroom` — journalist-authored guide cards + RSS article cards

---

## 5. Pre-Loaded Account

No authentication. The app launches already signed in as Alex Rivera.

| Field | Value |
|---|---|
| Display name | Alex Rivera |
| Handle | `@alexrivera.chicago.com` |
| Primary neighborhood | Lincoln Square |
| Chicago tenure | 7 years |
| Neighborhood history | Pilsen (2019–2022) → Logan Square (2022–2024) → Lincoln Square (2024–present) |
| Interest badges | Food & Drink · Live Music · Parks & Outdoors · Coffee |
| Hinge prompts | See Section 4.6 above |

No prototype label, no disclaimer, no sign-in banner anywhere in the UI.

**Session reset:** `/?reset=true` or `Shift+R` held 2 seconds — clears all session-created guides and resets feed filter selections to default. Same mechanism as v1.

---

## 6. Seed Data

### Guides (minimum 12, target 16)

Required neighborhood coverage (at least 2 guides per neighborhood):
- Lincoln Square (Alex Rivera's home)
- Logan Square
- Humboldt Park
- Hyde Park
- Pilsen
- Bronzeville
- Wicker Park
- Andersonville

Required variety:
- At least 4 guides with 3+ module types (places + playlist + post, places + article + product, etc.)
- At least 2 journalist-authored guides (one Sun-Times, one WBEZ)
- At least 2 sponsored guides (with product modules carrying member deals)
- At least 3 guides that are remixes of other seeded guides (to demonstrate remix chains)
- At least 2 guides marked `isEditorsPick`
- At least 3 guides marked `isReviewed`
- At least 1 guide with a Spotify playlist module
- At least 1 guide with a Bandcamp playlist module
- At least 1 guide with an event module
- At least 1 guide with a post module (long post, demonstrating the "read more" collapse)

**Example seed guide — "My Perfect Day in Humboldt Park" by @alexrivera.chicago.com:**
- Place module: Café Colao (coffee shop), editor note: "The cortado here is non-negotiable."
- Product module: "The cortado" ($4.50) — member deal: "Free pastry with CPM membership on weekends"
- Place module: Humboldt Park Natural Area, editor note: "Find the hammocks near the lagoon."
- Post module: "How to find the perfect hammock spot" (long post, collapses)
- Playlist module: Spotify — "Humboldt Sunday Morning" playlist
- Place module: a wine bar
- Badges: Coffee · Parks & Outdoors · Community

### Users (minimum 8 seeded accounts)

- **Alex Rivera** — `@alexrivera.chicago.com` (pre-loaded session user)
- **2 journalist accounts:**
  - Ellery Jones — `@ellery.suntimes.com` — Chicago Sun-Times — ★ From the newsroom
  - Al Keefe — `@alkeefe.wbez.org` — WBEZ — ★ From the newsroom
- **5 community members** with varied neighborhoods, tenures (2–22 years), and badge selections

### Places (minimum 80 across all guides)

Real Chicago places by name and neighborhood. Same category enum as v1 plus: `product_location` (for places referenced in product modules without being standalone place modules). Each place: `id`, `name`, `address`, `neighborhood`, `category`, `rating`, `coverImage`.

### Cover Images

Same Unsplash Source URL approach as v1. Creation flow uses a curated gallery of ~20 Chicago-themed photos. Seeded guides have hardcoded Unsplash URLs matched to their neighborhood and content type.

### Seed Data Schema (TypeScript-style)

```typescript
type PlaceModule   = { type: 'place', placeId, name, address, neighborhood, category, rating?, reviewCount?, editorNote, coverImage? }
type ArticleModule = { type: 'article', title, url, summary, source, publishedAt, editorNote? }
type ProductModule = { type: 'product', name, description, price?, where, coverImage?, isMemberDeal, dealDescription?, editorNote? }
type EventModule   = { type: 'event', name, date, location, neighborhood, description, url?, coverImage?, editorNote? }
type PostModule    = { type: 'post', body, images: string[], isLong, editorNote? }
type PlaylistModule= { type: 'playlist', platform, embedUrl, title, description?, editorNote? }

type Module = PlaceModule | ArticleModule | ProductModule | EventModule | PostModule | PlaylistModule

type User = {
  id, handle, displayName, neighborhood, yearsInChicago,
  neighborhoodHistory: { name, startYear, endYear? }[],
  badges: string[], isJournalist, publication?, hingePrompts: { prompt, answer }[]
}

type Guide = {
  id, title, description, authorId, collaborators: string[],
  neighborhood, additionalNeighborhoods: string[], badges: string[],
  modules: Module[], coverImage, privacy,
  isEditorsPick, isReviewed, isSponsored, sponsorName?,
  likeCount, helpfulCount, remixCount, remixOf?,
  isNewsroom, newsroomSource?,
  createdAt, isSessionCreated
}
```

---

## 7. Data Sources & Integration

### Chicago Community Areas
- **Source:** City of Chicago Data Portal (Socrata)
- **Dataset ID:** `igwz-8jzy`
- Tabular: `https://data.cityofchicago.org/resource/igwz-8jzy.json`
- GeoJSON: `https://data.cityofchicago.org/resource/igwz-8jzy.geojson`
- Same implementation as v1: fetch on init, store in context, normalize to title case for display

### Google Places API
- `POST https://places.googleapis.com/v1/places:searchText` — guide creation place search
- Field mask: `places.id,places.displayName,places.formattedAddress,places.types,places.rating,places.userRatingCount,places.photos`
- Fallback: seeded place list (per v1 approach)
- Key in `.env` as `VITE_GOOGLE_PLACES_API_KEY`

### RSS Feeds
- Sun-Times: `https://chicago.suntimes.com/rss/index.xml`
- WBEZ: `https://www.wbez.org/rss/index.xml`
- Same Express proxy pattern as v1 (`/api/rss?source=suntimes`, `/api/rss?source=wbez`)
- RSS articles used in the feed as article cards AND available as selectable items in the Article module creator

### Spotify Embeds
- No API key required — standard Spotify embed iframe: `https://open.spotify.com/embed/playlist/{id}`
- Users paste a Spotify share link; the app converts it to an embed URL
- The iframe is sandboxed and responsive

### Bandcamp Embeds
- Standard Bandcamp embed code — album or track. User pastes a Bandcamp URL; the app constructs a basic `<iframe>` using Bandcamp's embed URL pattern.
- No API key required.

---

## 8. Navigation & App Shell

### Route Table

| Path | Component | Notes |
|---|---|---|
| `/` | Redirect → `/feed` | |
| `/feed` | FeedPage | Primary landing / explore feed |
| `/explore` | ExplorePage | Browse by neighborhood + search |
| `/guide/new` | GuideCreatePage | **Must be declared before `/guide/:id`** |
| `/guide/:id` | GuideDetailPage | |
| `/guide/:id/remix` | GuideRemixPage | |
| `/neighborhood/:slug` | NeighborhoodPage | |
| `/profile/:handle` | ProfilePage | Pre-loaded user: `/profile/alexrivera` |
| `*` | NotFoundPage | |

### Header

- Left: chicago.com wordmark (Big Shoulders Display, bold, ★ motif)
- Center (desktop): Feed · Explore · Neighborhoods (dropdown of all 77 areas)
- Right: `+ Create Guide` button · account avatar + "Alex Rivera" + `@alexrivera` (opens profile dropdown)
- Mobile: hamburger menu with all nav items inline

### Footer

- Chicago flag stripe decoration
- Links: About chicago.com · How guides work · How the feed is ordered · Chicago Public Media
- Tagline: "Made in Chicago, for Chicago."

---

## 9. Non-Functional Requirements

### Performance
- Initial page load under 3 seconds on standard broadband
- RSS content within 2 seconds of page load
- Places search results within 1.5 seconds
- Playlist embeds load independently (not blocking page render)

### Accessibility
- All interactive elements: visible focus states
- WCAG AA color contrast for body text
- Meaningful alt text on all images (including seeded)
- Touch targets minimum 44px

### Responsive Design
- Desktop + mobile responsive (breakpoint: 768px)
- Full guide creation flow completable on mobile
- Drag-to-reorder modules: on mobile, replace drag handles with `↑ ↓` tap buttons

### Browser Support
- Chrome (latest) · Safari (latest) · Firefox (latest)

### Loading States

| Async operation | Treatment |
|---|---|
| Feed initial load | 6 skeleton guide cards |
| RSS article fetch | Skeleton article cards mixed into feed |
| Neighborhood page | Skeleton map + skeleton card grid |
| Places search | Inline spinner below search bar |
| GeoJSON boundary | Skeleton rectangle |
| Playlist embed | Skeleton rectangle in guide body while iframe loads |

### Error States

| Failure | Behavior |
|---|---|
| RSS fetch fails | Article cards silently omitted; feed shows guides only |
| Places API error | "Search unavailable — try a different term" inline |
| Socrata API down | Bundled static fallback JSON of all 77 community areas |
| Guide ID not found | Redirect to `/feed` |
| Invalid playlist URL | "Paste a valid Spotify or Bandcamp URL" inline error |
| Uncaught error | React error boundary → "Something went wrong — go back to the feed" |

### Empty States

| Empty scenario | Behavior |
|---|---|
| Neighborhood with no guides | "No guides yet for [Neighborhood]. Be the first to create one." + Create Guide CTA |
| Profile with no guides | "No guides yet." + Create Guide CTA |
| Feed filter returns nothing | "Nothing matches your current filters." + `Clear filters` link |
| No module added in creation | `Review guide →` is disabled with tooltip: "Add at least one module to continue" |

### Search Discoverability
- `robots.txt` at root: `User-agent: * / Disallow: /`
- `<meta name="robots" content="noindex, nofollow">` in HTML head
- URL shared directly only by Ellery with test participants

---

## 10. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 18 + Vite | Not CRA |
| Routing | React Router v6 | `/guide/new` declared before `/guide/:id` |
| Styling | CSS Modules | Continues v1 design system |
| State | React Context + useReducer | One top-level AppContext |
| Maps (interactive) | react-leaflet + Leaflet.js | Neighborhood boundaries + place pins |
| Maps (static thumbnails) | Google Maps Static API | Guide card fallback thumbnail |
| RSS parsing | fast-xml-parser | Runs on Express server |
| Backend / RSS proxy | Express on Railway | `/server` directory; handles CORS + RSS |
| Data Portal | Fetch API | Direct Socrata calls from React client |
| Places API | Direct REST (fetch) | Key restricted to Railway domain + localhost |
| Playlist embeds | iframe (no API key) | Spotify embed + Bandcamp embed patterns |
| Deployment | Railway | Two services: Vite frontend + Express proxy |
| Version control | Git / GitHub | New repo (pitney-and-archer or similar) |

### Environment Variables

```
VITE_GOOGLE_PLACES_API_KEY=
VITE_CHICAGO_DATA_PORTAL_TOKEN=
```

---

## 11. Documentation Deliverables

Two docs to be produced alongside the build (same as v1 pattern):

### `docs/moderator-guide.md`

Audience: Ellery and any session moderator. No technical knowledge assumed.

Must cover:
- What the prototype is and isn't (one paragraph)
- How to open and share the URL with a participant
- How to reset between participants (`/?reset=true`)
- Map of key flows: browse the feed · view a guide · create a guide · remix a guide · view a profile
- The creation flow step by step (what to expect at each module type)
- What's intentionally non-functional (likes, helpful, follows, share) and suggested moderator language: "That's something we're still designing — what would you expect to happen there?"
- How to navigate to specific guides or neighborhoods during the session
- Troubleshooting (blank page, search no results, page won't load)

### `docs/technical-guide.md`

Audience: Engineers and product team receiving the handoff.

Must cover:
- What the prototype demonstrates vs. what was deferred
- Repo structure (top-level directory map)
- Local setup: clone, .env, install, dev server, Express proxy
- Environment variables: full list, what each does, where to get values
- Architecture decisions: Vite, react-leaflet, Express CORS proxy, Context+useReducer, Unsplash over media hosting, iframe embeds for playlists
- Seed data: where it lives, schema, how to add guides/users/places/modules
- Module system: how the Module union type works, how to add a new module type
- Deployment: Railway two-service structure, env vars in dashboard, redeploy from GitHub
- Google Places key restriction: step-by-step
- Known limitations and next steps toward production (auth, real database, Cloudinary, ATProto, real Roundabout integration)

---

## 12. Out of Scope for Prototype

### Roundabout Integration
- No API calls to New Public's Roundabout platform
- Roundabout informs design language; it is not a technical dependency of this build

### ATProto / Social Infrastructure
- Real ATProto DID/handle registration and authentication
- PDS-hosted guide or module records
- Feed generator service
- Follows, likes, helpful votes that persist to a backend

### Full User System
- Sign-up / sign-in flow
- Email/password or OAuth authentication
- User settings persistence

### Advanced Guide Features
- Comments on guides or modules
- Real public/private visibility enforcement
- Real guide sharing to external platforms
- Collaboration flow (collaborators are seeded data only)

### Content
- Google Places reviews (cost; deferred)
- Full article text (RSS summaries only)
- Video content from WBEZ
- Scraped events (events are seeded data only; no scraping in prototype)

### Infrastructure
- Backend API / database
- Content moderation queue
- Analytics and instrumentation
- Business-facing guide creation portal (sponsored guides are seeded only)

---

## 13. Decisions Log

| # | Question | Decision |
|---|---|---|
| 1 | GitHub repo name | **pitney-and-archer** |
| 2 | Spotify seed playlist | Use `https://open.spotify.com/playlist/37i9dQZF1DWSXBu5naYCM9` — convert to embed URL `https://open.spotify.com/embed/playlist/37i9dQZF1DWSXBu5naYCM9` in seed data |
| 3 | Bandcamp embed | No specific artist required — use a placeholder Chicago-themed Bandcamp embed URL in seed data |
| 4 | Socrata App Token | Reuse v1 token — available at `/Users/ejones/Documents/keeley-and-archer/client/.env` (do not commit this file; copy value into Railway env vars and local `.env`) |
| 5 | Google Places API key | Reuse v1 key — same file as above. Restrict key in Google Cloud Console to new Railway domain once known. |
| 6 | Session-created guides in feed | Appear in explore feed immediately with `isSessionCreated: true` flag; no visual distinction from seeded guides |
| 7 | Alex Rivera as collaborator | List Alex Rivera as a collaborator on 1 seeded guide |
| 8 | CPM membership deal CTA | Completely cosmetic — member deal callout displays the deal text but the CTA link does nothing (no toast, no navigation) |
