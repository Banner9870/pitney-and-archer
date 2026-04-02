import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext.jsx'
import GuideCard from '../../components/GuideCard/GuideCard.jsx'
import ArticleCard from '../../components/ArticleCard/ArticleCard.jsx'
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard.jsx'
import SkeletonArticleCard from '../../components/SkeletonArticleCard/SkeletonArticleCard.jsx'
import FilterPanel from '../../components/FilterPanel/FilterPanel.jsx'
import FeedInfoModal from '../../components/FeedInfoModal/FeedInfoModal.jsx'
import styles from './FeedPage.module.css'

// ---------------------------------------------------------------------------
// Feed ordering logic
// ---------------------------------------------------------------------------

/**
 * orderFeed — pure function, deterministic, no randomness.
 *
 * 1. Filter guides by active content type / badge filters
 * 2. Sort filtered guides: editor's picks → neighborhood-matched → badge-matched → citywide → remaining
 * 3. Interleave RSS article cards: insert 1 article after 4th guide, 2 articles after 8th, repeating
 *
 * Returns a mixed array of { kind: 'guide', data } | { kind: 'article', data } objects.
 */
export function orderFeed(guides, rssArticles, user, filters) {
  const { contentTypes, badges } = filters

  // Step 1 — filter
  let filtered = guides.filter((g) => {
    const moduleTypes = (g.modules ?? []).map((m) => m.type)
    const passesContentType =
      contentTypes.length === 0 ||
      contentTypes.some((ct) => moduleTypes.includes(ct))
    const passesBadge =
      badges.length === 0 ||
      badges.some((b) => (g.badges ?? []).includes(b))
    return passesContentType && passesBadge
  })

  // Step 2 — sort into tiers
  const userNeighborhoods = new Set([
    user?.neighborhood,
    ...(user?.neighborhoodHistory ?? []).map((h) => h.name),
  ].filter(Boolean))

  const userBadges = new Set(user?.badges ?? [])

  function tier(guide) {
    if (guide.isEditorsPick) return 0
    const guideNeighborhoods = [guide.neighborhood, ...(guide.additionalNeighborhoods ?? [])]
    if (guideNeighborhoods.some((n) => userNeighborhoods.has(n))) return 1
    if ((guide.badges ?? []).some((b) => userBadges.has(b))) return 2
    if (guide.isNewsroom) return 3
    return 4
  }

  filtered = [...filtered].sort((a, b) => {
    const tA = tier(a)
    const tB = tier(b)
    if (tA !== tB) return tA - tB
    // Within same tier: newer first
    return new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0)
  })

  // Step 3 — interleave articles
  // After every 4th guide: odd groups (0-indexed) get 1 article, even groups get 2 articles
  // Group 0 = after guides 1-4 → 1 article
  // Group 1 = after guides 5-8 → 2 articles
  // Group 2 = after guides 9-12 → 1 article … etc.
  const mixed = []
  let articleIdx = 0

  for (let i = 0; i < filtered.length; i++) {
    mixed.push({ kind: 'guide', data: filtered[i] })

    const isGroupEnd = (i + 1) % 4 === 0
    if (isGroupEnd && rssArticles.length > 0) {
      const groupNum = Math.floor(i / 4)
      const articlesToInsert = groupNum % 2 === 0 ? 1 : 2
      for (let j = 0; j < articlesToInsert && articleIdx < rssArticles.length; j++) {
        mixed.push({ kind: 'article', data: rssArticles[articleIdx++] })
      }
    }
  }

  return mixed
}

// ---------------------------------------------------------------------------
// FeedPage component
// ---------------------------------------------------------------------------

const INITIAL_VISIBLE = 12
const LOAD_MORE_COUNT = 10

export default function FeedPage() {
  const { state, dispatch } = useAppContext()
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  // Track RSS loading: show skeletons until rssArticles populate or 3s timeout
  const [rssReady, setRssReady] = useState(false)
  const rssLen = state.rssArticles.length

  useEffect(() => {
    if (rssLen > 0) {
      setRssReady(true)
      return
    }
    const timer = setTimeout(() => setRssReady(true), 3000)
    return () => clearTimeout(timer)
  }, [rssLen])

  const mixed = orderFeed(
    state.guides,
    state.rssArticles,
    state.user,
    state.feed.filters,
  )

  const visible = mixed.slice(0, visibleCount)
  const hasMore = visibleCount < mixed.length

  const activeFilterCount =
    state.feed.filters.contentTypes.length + state.feed.filters.badges.length
  const filteredGuideCount = mixed.filter((item) => item.kind === 'guide').length

  return (
    <>
      {/* Main feed column */}
      <div className={styles.feedMain}>
        {/* Hero strip */}
        <div className={styles.heroStrip}>
          <div className={styles.flagBars}>
            <div className={styles.flagBar} />
            <div className={styles.flagBar} />
          </div>
          <p className={styles.tagline}>Chicago, guided by the people who live here.</p>
        </div>

        {/* Feed header */}
        <div className={styles.feedHeader}>
          <h1 className={styles.feedTitle}>Explore Chicago</h1>
          <button
            className={styles.infoBtn}
            onClick={() => setShowInfoModal(true)}
            aria-label="How your feed works"
            title="How your feed works"
          >
            ⓘ
          </button>
        </div>

        {activeFilterCount > 0 && (
          <p className={styles.filterNote}>
            Showing {filteredGuideCount} guide{filteredGuideCount !== 1 ? 's' : ''} matching your
            filters.
          </p>
        )}

        {/* Feed items */}
        {!rssReady ? (
          /* Skeleton loading state */
          <div className={styles.feedGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
            <SkeletonArticleCard />
            <SkeletonArticleCard />
          </div>
        ) : mixed.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nothing matches your current filters.</p>
            <button
              className={styles.clearFiltersBtn}
              onClick={() => {
                dispatch({ type: 'SET_FILTER_CONTENT_TYPES', payload: [] })
                dispatch({ type: 'SET_FILTER_BADGES', payload: [] })
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className={styles.feedGrid}>
              {visible.map((item, i) =>
                item.kind === 'guide' ? (
                  <GuideCard key={item.data.id} guide={item.data} />
                ) : (
                  <ArticleCard key={`${item.data.id}-${i}`} article={item.data} />
                ),
              )}
            </div>

            {hasMore && (
              <div className={styles.loadMoreWrap}>
                <button
                  className={styles.loadMoreBtn}
                  onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      {/* Info modal — position:fixed, placed inside feedMain to avoid occupying a grid slot */}
      {showInfoModal && <FeedInfoModal onClose={() => setShowInfoModal(false)} />}
      </div>

      {/* Sidebar column */}
      <FilterPanel />
    </>
  )
}
