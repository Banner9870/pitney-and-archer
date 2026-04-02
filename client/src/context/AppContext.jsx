import { createContext, useContext, useReducer, useEffect } from 'react'
import { SEED_GUIDES, SEED_USERS } from '../data/seed.js'

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const alexRivera = SEED_USERS.find((u) => u.id === 'user-alex')

const initialState = {
  user: alexRivera,
  guides: SEED_GUIDES,
  users: SEED_USERS,
  communityAreas: [],   // populated from Socrata on mount; falls back to static JSON
  rssArticles: [],      // populated from Express RSS proxy on mount
  feed: {
    filters: {
      contentTypes: [],
      badges: [],
    },
  },
  likedGuideIds: [],
  helpfulGuideIds: [],
  savedGuideIds: [],
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_GUIDE':
      return { ...state, guides: [...state.guides, action.payload] }

    case 'LIKE_GUIDE':
      return {
        ...state,
        likedGuideIds: state.likedGuideIds.includes(action.payload)
          ? state.likedGuideIds.filter((id) => id !== action.payload)
          : [...state.likedGuideIds, action.payload],
      }

    case 'HELPFUL_GUIDE':
      return {
        ...state,
        helpfulGuideIds: state.helpfulGuideIds.includes(action.payload)
          ? state.helpfulGuideIds.filter((id) => id !== action.payload)
          : [...state.helpfulGuideIds, action.payload],
      }

    case 'SAVE_GUIDE':
      return {
        ...state,
        savedGuideIds: state.savedGuideIds.includes(action.payload)
          ? state.savedGuideIds.filter((id) => id !== action.payload)
          : [...state.savedGuideIds, action.payload],
      }

    case 'SET_FILTER_CONTENT_TYPES':
      return {
        ...state,
        feed: { ...state.feed, filters: { ...state.feed.filters, contentTypes: action.payload } },
      }

    case 'SET_FILTER_BADGES':
      return {
        ...state,
        feed: { ...state.feed, filters: { ...state.feed.filters, badges: action.payload } },
      }

    case 'SET_RSS_ARTICLES':
      return { ...state, rssArticles: action.payload }

    case 'SET_COMMUNITY_AREAS':
      return { ...state, communityAreas: action.payload }

    case 'RESET_SESSION':
      return {
        ...state,
        guides: state.guides.filter((g) => !g.isSessionCreated),
        feed: { filters: { contentTypes: [], badges: [] } },
        likedGuideIds: [],
        helpfulGuideIds: [],
        savedGuideIds: [],
      }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Session reset via URL parameter: /?reset=true
  useEffect(() => {
    if (window.location.search.includes('reset=true')) {
      dispatch({ type: 'RESET_SESSION' })
      window.history.replaceState({}, '', '/feed')
    }
  }, [])

  // Load community areas from bundled static JSON (no Socrata call needed)
  useEffect(() => {
    fetch('/fallback-community-areas.json')
      .then((r) => r.json())
      .then((data) => dispatch({ type: 'SET_COMMUNITY_AREAS', payload: data }))
      .catch(() => {
        // Silently fail — community areas are non-critical for initial render
      })
  }, [])

  // Fetch RSS articles from Express proxy
  useEffect(() => {
    async function fetchRSS() {
      try {
        const res = await fetch('/api/rss')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        dispatch({ type: 'SET_RSS_ARTICLES', payload: data })
      } catch {
        // RSS failure is non-critical — feed renders without articles
      }
    }
    fetchRSS()
  }, [])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

