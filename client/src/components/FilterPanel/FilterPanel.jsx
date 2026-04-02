import { useAppContext } from '../../context/AppContext.jsx'
import { BADGES } from '../../data/seed.js'
import styles from './FilterPanel.module.css'

const CONTENT_TYPES = [
  { value: 'place', label: 'Places' },
  { value: 'article', label: 'Articles' },
  { value: 'product', label: 'Products' },
  { value: 'event', label: 'Events' },
  { value: 'post', label: 'Posts' },
  { value: 'playlist', label: 'Playlists' },
]

export default function FilterPanel() {
  const { state, dispatch } = useAppContext()
  const { contentTypes, badges } = state.feed.filters

  const activeCount = contentTypes.length + badges.length

  function toggleContentType(type) {
    const next = contentTypes.includes(type)
      ? contentTypes.filter((t) => t !== type)
      : [...contentTypes, type]
    dispatch({ type: 'SET_FILTER_CONTENT_TYPES', payload: next })
  }

  function toggleBadge(badge) {
    const next = badges.includes(badge)
      ? badges.filter((b) => b !== badge)
      : [...badges, badge]
    dispatch({ type: 'SET_FILTER_BADGES', payload: next })
  }

  function clearAll() {
    dispatch({ type: 'SET_FILTER_CONTENT_TYPES', payload: [] })
    dispatch({ type: 'SET_FILTER_BADGES', payload: [] })
  }

  return (
    <aside id="filter-panel" className={styles.panel}>
      <h2 className={styles.panelTitle}>
        Filters {activeCount > 0 && <span className={styles.activeCount}>({activeCount})</span>}
      </h2>

      {/* Content type section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Filter by content
          {contentTypes.length > 0 && (
            <span className={styles.activeCount}> ({contentTypes.length})</span>
          )}
        </h3>
        <div className={styles.checkboxGroup}>
          {CONTENT_TYPES.map(({ value, label }) => (
            <label key={value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={contentTypes.includes(value)}
                onChange={() => toggleContentType(value)}
                className={styles.checkbox}
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      {/* Badge section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Filter by interest
          {badges.length > 0 && (
            <span className={styles.activeCount}> ({badges.length})</span>
          )}
        </h3>
        <div className={styles.badgeGroup}>
          {BADGES.map((badge) => (
            <button
              key={badge}
              className={`${styles.badgeChip} ${badges.includes(badge) ? styles.badgeActive : ''}`}
              onClick={() => toggleBadge(badge)}
              aria-pressed={badges.includes(badge)}
            >
              {badge}
            </button>
          ))}
        </div>
      </section>

      {/* Clear all */}
      {activeCount > 0 && (
        <button className={styles.clearAll} onClick={clearAll}>
          Clear all filters
        </button>
      )}
    </aside>
  )
}
