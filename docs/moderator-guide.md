# chicago.com Prototype — Moderator Guide

This guide is for the chicago.com editorial team running user testing sessions with the prototype.

---

## What this prototype is

**chicago.com (pitney-and-archer)** is a clickable prototype built for user testing only. It is:

- **Not production software.** There is no real data persistence, no real authentication, and no live back-end moderation queue.
- **Pre-populated with seed data.** All guides, users, and content are faked to represent plausible Chicago content. No real user data is collected.
- **Signed in as Alex Rivera by default.** The app launches already signed in — there is no sign-in screen.

---

## How to share it with participants

1. Give participants the Railway URL directly (e.g. `https://chicago-com-frontend.up.railway.app`).
2. **Do not share via search engines or social media.** The prototype has `robots.txt` and a `noindex` meta tag, but it should still be treated as private.
3. Open the URL in a fresh browser window or private/incognito tab for each participant to avoid session pollution.

---

## How to reset between participants

Two mechanisms are available:

### Option 1 — URL reset
Append `?reset=true` to any URL and navigate to it:

```
https://chicago-com-frontend.up.railway.app/?reset=true
```

The URL automatically redirects to `/feed` after resetting.

### Option 2 — Keyboard shortcut
Hold `Shift+R` for **2 seconds** on any page. A "Session reset" toast will appear at the bottom of the screen.

### What reset clears

| Cleared | Not cleared |
|---|---|
| Guides created during the session | Seeded guide data (guide-001 through guide-017) |
| Feed filter selections (badges, content types) | Seeded user profiles |
| Likes (♥), helpful (✓), and saved (★) counts | Neighborhood and article data |

---

## Map of the 5 key user flows

### Flow 1 — Browse the feed and use filters
**Entry:** `/feed`

The home screen. Participants can scroll the feed, click badges in the filter panel (right sidebar on desktop, top panel on mobile) to filter by interest, and use content type checkboxes. "Clear all filters" resets filters without a full session reset.

### Flow 2 — Open a guide and view all module types
**Entry:** Click any guide card, or go directly to `/guide/guide-001`

Guide detail page shows all 6 module types: Place, Article, Product, Event, Post, Playlist. The Spotify embed loads as an iframe after a skeleton placeholder. Long post text collapses with a "Read more" toggle. An interactive map at the bottom shows place module pins.

### Flow 3 — Remix a guide
**Entry:** Click "Remix this guide →" on any guide detail page, or navigate to `/guide/guide-001/remix`

The remix flow pre-populates with the original guide's modules. Participants can add, remove, and reorder modules, then publish. The published remix shows attribution back to the original.

### Flow 4 — Create a new guide (3-step wizard)
**Entry:** Click "+ Create Guide" in the header, or navigate to `/guide/new`

Three-step wizard:
1. **Step 1 — Basics:** Title, description, neighborhood, interest badges, cover photo, privacy setting
2. **Step 2 — Modules:** Add modules by type (Place, Article, Product, Event, Post, Playlist). "Review guide →" is disabled until at least one module is added.
3. **Step 3 — Review:** Preview the full guide before publishing. Publishing dispatches two toasts and redirects to the new guide detail page.

### Flow 5 — View a user profile
**Entry:** Click an author's name on any guide card, or navigate to `/profile/alexrivera`

Profile page shows tenure badge, neighborhood history, interest badges, and hinge-style prompts. Four tabs: Guides, Remixes, Saved, Collaborations.

---

## Guide creation flow walkthrough

| Step | What it shows |
|---|---|
| **Step 1: Basics** | Title (required), optional description, neighborhood picker (required), interest badge chips (multi-select), cover photo picker (~20 curated Unsplash images), privacy toggle (Private / Friends only / Public) |
| **Step 2: Add modules** | Six module type buttons. Each opens an inline form. Place search uses Google Places API with seeded fallback. Modules appear in the right panel with up/down reorder arrows and a remove button. "Review guide →" is disabled with a tooltip until at least one module is added. |
| **Step 3: Review and publish** | Full guide preview using the same module components as the live detail page. "Publish guide" button triggers two toasts and navigates to the new guide detail page, which shows a success banner. |

---

## What is non-functional (cosmetic only)

These elements are visible but do not do anything:

- **Follow buttons** — on guide detail pages and profile pages
- **Share buttons** — the "↗ Share" action copies a fake URL and shows a "Link copied!" toast, but nothing is actually copied
- **Real-time like/helpful/saved persistence** — counts increment during the session but are reset when the page is refreshed or the session is reset
- **Real moderation queue** — published guides appear in the feed immediately; there is no actual review process
- **Authentication** — the app is always signed in as Alex Rivera

---

## Navigation guide

Use these URLs to reach specific content directly:

| Destination | URL |
|---|---|
| Home feed | `/feed` |
| Humboldt Park reference guide (all 6 module types) | `/guide/guide-001` |
| Logan Square food guide | `/guide/guide-002` |
| Wicker Park music guide (Alex as collaborator) | `/guide/guide-003` |
| Andersonville guide | `/guide/guide-008` |
| Alex Rivera's profile | `/profile/alexrivera` |
| Yuki Sato's profile (Saved tab has guide-008 and guide-010) | `/profile/yukis` |
| Al Keefe's profile (journalist / WBEZ) | `/profile/alkeefe` |
| Humboldt Park neighborhood page | `/neighborhood/humboldt-park` |
| Logan Square neighborhood page | `/neighborhood/logan-square` |
| Andersonville neighborhood page | `/neighborhood/andersonville` |
| Explore / search neighborhoods | `/explore` |
| Create a new guide | `/guide/new` |
| Session reset | `/?reset=true` |

---

## The pre-loaded user: Alex Rivera

Alex Rivera is the default signed-in user for all test sessions.

| Field | Value |
|---|---|
| Display name | Alex Rivera |
| Handle | `@alexrivera.chicago.com` |
| Primary neighborhood | Lincoln Square |
| Years in Chicago | 7 |
| Neighborhood history | Pilsen (2019–2022) → Logan Square (2022–2024) → Lincoln Square (2024–present) |
| Interest badges | Food & Drink · Live Music · Parks & Outdoors · Coffee |

Alex has authored several seed guides and is a collaborator on guide-003 (Wicker Park music). His profile's **Collaborations** tab shows guide-003.

---

## Content flags explained

| Flag | Visual treatment | Meaning |
|---|---|---|
| `isEditorsPick` | "★ Editor's Pick" label on guide card | Prioritised in tier 1 of feed ordering |
| `isReviewed` | "Reviewed" label on guide card | Community-reviewed content |
| `isSponsored` | Gold "Sponsored" pill on cover image | Created in partnership with a sponsor; shows sponsor attribution on detail page |
| `isNewsroom` | "★ From the newsroom" label | Content from WBEZ or Chicago Sun-Times |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| White screen on load | Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5) |
| Guide detail shows blank / redirects to feed | The guide ID no longer exists — use `/?reset=true` to clear session guides |
| RSS article cards not appearing | The Express server may not be running. RSS articles are non-critical; the feed works without them. |
| Map doesn't render on neighborhood page | The GeoJSON file may still be loading; wait 2–3 seconds and try again |
| Filter panel shows no results | Filters are too narrow — click "Clear all filters" or use `/?reset=true` |
