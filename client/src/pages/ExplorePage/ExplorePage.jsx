import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext.jsx'
import GuideCard from '../../components/GuideCard/GuideCard.jsx'
import ArticleCard from '../../components/ArticleCard/ArticleCard.jsx'
import styles from './ExplorePage.module.css'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

export default function ExplorePage() {
  const { state } = useAppContext()
  const { guides, communityAreas, rssArticles } = state

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return null
    const q = debouncedQuery.toLowerCase()
    return guides.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        (g.neighborhood && g.neighborhood.toLowerCase().includes(q))
    )
  }, [debouncedQuery, guides])

  const trendingGuides = useMemo(
    () => [...guides].sort((a, b) => b.likeCount - a.likeCount).slice(0, 8),
    [guides]
  )

  const newsroomItems = useMemo(() => {
    const newsroomGuides = guides.filter((g) => g.isNewsroom)
    const recentArticles = [...rssArticles]
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 5)
    // Interleave guides and articles
    const combined = []
    const maxLen = Math.max(newsroomGuides.length, recentArticles.length)
    for (let i = 0; i < maxLen; i++) {
      if (i < newsroomGuides.length) combined.push({ type: 'guide', data: newsroomGuides[i] })
      if (i < recentArticles.length) combined.push({ type: 'article', data: recentArticles[i] })
    }
    return combined
  }, [guides, rssArticles])

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>EXPLORE CHICAGO</h1>

      {/* Search bar */}
      <div className={styles.searchSection}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search guides by title or neighborhood…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search guides"
        />
        {searchResults !== null && (
          <div className={styles.searchResults}>
            {searchResults.length > 0 ? (
              <div className={styles.guideGrid}>
                {searchResults.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            ) : (
              <p className={styles.noResults}>Nothing matches "{debouncedQuery}".</p>
            )}
          </div>
        )}
      </div>

      {/* Browse by neighborhood */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Browse by Neighborhood</h2>
        <div className={styles.neighborhoodGrid}>
          {communityAreas.map((area) => (
            <Link
              key={area.id}
              to={`/neighborhood/${area.slug}`}
              className={styles.neighborhoodTile}
            >
              {area.name.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>

      {/* Trending guides */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Trending Guides</h2>
        <div className={styles.trendingRow}>
          {trendingGuides.map((guide) => (
            <div key={guide.id} className={styles.trendingCard}>
              <GuideCard guide={guide} />
            </div>
          ))}
        </div>
      </section>

      {/* From the newsroom */}
      {newsroomItems.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>From the Newsroom</h2>
          <div className={styles.newsroomGrid}>
            {newsroomItems.map((item, i) =>
              item.type === 'guide' ? (
                <GuideCard key={item.data.id} guide={item.data} />
              ) : (
                <ArticleCard key={item.data.url ?? i} article={item.data} />
              )
            )}
          </div>
        </section>
      )}
    </div>
  )
}
