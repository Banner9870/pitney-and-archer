// All TypeScript type definitions for the chicago.com prototype.
// This file is the source of truth for all data shapes used across the app.

export type RSSArticle = {
  id: string                 // e.g. 'rss-suntimes-0'
  title: string
  url: string
  summary: string            // first 200 chars, HTML stripped
  source: 'suntimes' | 'wbez'
  publishedAt: string        // ISO 8601
  isCitywide: boolean        // always true for RSS articles
}

export type CommunityArea = {
  id: string                       // community area number as string, e.g. '23'
  name: string                     // title case, e.g. 'Humboldt Park'
  slug: string                     // URL-safe, e.g. 'humboldt-park'
  population?: number              // from Socrata tabular data; may be absent
  adjacentNeighborhoods?: string[] // optional — not available from Socrata
}

export type NeighborhoodHistoryEntry = {
  name: string
  startYear: number
  endYear?: number // omit if current
}

export type HingePrompt = {
  prompt: string
  answer: string
}

export type User = {
  id: string
  handle: string         // full ATProto-style, e.g. 'alexrivera.chicago.com'
  slug: string           // URL-safe portion used in routes, e.g. 'alexrivera'
  displayName: string
  neighborhood?: string  // primary neighborhood; absent for journalist accounts
  yearsInChicago?: number
  neighborhoodHistory?: NeighborhoodHistoryEntry[]
  badges?: string[]
  isJournalist: boolean
  publication?: 'suntimes' | 'wbez'
  hingePrompts: HingePrompt[]
  savedGuideIds: string[] // for display on Saved tab; [] for Alex (governed by session state)
}

// Module types — discriminated union on `type` field

export type PlaceModule = {
  type: 'place'
  placeId: string
  name: string
  address: string
  neighborhood: string
  category: string
  rating?: number
  reviewCount?: number
  coverImage?: string
  editorNote?: string
}

export type ArticleModule = {
  type: 'article'
  title: string
  url: string
  source: string
  publishedAt?: string
  summary?: string
  editorNote?: string
}

export type ProductModule = {
  type: 'product'
  name: string
  description?: string
  price?: string
  where?: string
  coverImage?: string
  isMemberDeal?: boolean
  dealDescription?: string
  editorNote?: string
}

export type EventModule = {
  type: 'event'
  name: string
  venue?: string
  address?: string
  date?: string        // ISO 8601 or human-readable
  time?: string
  url?: string
  coverImage?: string
  editorNote?: string
}

export type PostModule = {
  type: 'post'
  body: string
  images?: string[]
  isLong?: boolean     // true if body > 300 chars; triggers Read more collapse
  editorNote?: string
}

export type PlaylistModule = {
  type: 'playlist'
  platform: 'spotify' | 'bandcamp'
  embedUrl: string
  title?: string
  description?: string
  editorNote?: string
}

export type GuideModule =
  | PlaceModule
  | ArticleModule
  | ProductModule
  | EventModule
  | PostModule
  | PlaylistModule

export type Guide = {
  id: string
  title: string
  description?: string
  authorId: string
  collaborators?: string[]          // user IDs
  neighborhood: string
  additionalNeighborhoods?: string[]
  badges?: string[]
  modules: GuideModule[]
  coverImage?: string
  privacy: 'public' | 'unlisted' | 'private'
  isEditorsPick?: boolean
  isReviewed?: boolean
  isSponsored?: boolean
  sponsorName?: string
  isNewsroom?: boolean
  newsroomSource?: 'suntimes' | 'wbez'
  remixOf?: string                  // guide ID this was remixed from
  likeCount: number
  helpfulCount: number
  remixCount: number
  createdAt: string                 // ISO 8601
  isSessionCreated?: boolean        // true for guides created in the current session
}

export type Place = {
  id: string
  name: string
  address: string
  neighborhood: string
  category: string
  rating?: number
  reviewCount?: number
  coverImage?: string
}

export type FeedFilters = {
  contentTypes: string[]
  badges: string[]
}

export type AppState = {
  user: User | Record<string, never>
  guides: Guide[]
  users: User[]
  communityAreas: CommunityArea[]
  rssArticles: RSSArticle[]
  feed: {
    filters: FeedFilters
  }
  likedGuideIds: string[]
  helpfulGuideIds: string[]
  savedGuideIds: string[]
}

export type AppAction =
  | { type: 'ADD_GUIDE'; payload: Guide }
  | { type: 'LIKE_GUIDE'; payload: string }
  | { type: 'HELPFUL_GUIDE'; payload: string }
  | { type: 'SAVE_GUIDE'; payload: string }
  | { type: 'SET_FILTER_CONTENT_TYPES'; payload: string[] }
  | { type: 'SET_FILTER_BADGES'; payload: string[] }
  | { type: 'SET_RSS_ARTICLES'; payload: RSSArticle[] }
  | { type: 'SET_COMMUNITY_AREAS'; payload: CommunityArea[] }
  | { type: 'RESET_SESSION' }
