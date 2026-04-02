import { useEffect, useRef } from 'react'
import { useAppContext } from '../../context/AppContext.jsx'
import styles from './FeedInfoModal.module.css'

const TIERS = [
  {
    label: "Editor's Picks",
    desc: "Guides hand-selected by the chicago.com editorial team. These always appear first.",
  },
  {
    label: 'Neighborhood-matched',
    desc: "Guides tagged with your current neighborhood or any neighborhood in your history.",
  },
  {
    label: 'Badge-matched',
    desc: "Guides whose tags overlap with your interest badges.",
  },
  {
    label: 'Citywide news',
    desc: "Articles from Chicago newsrooms (WBEZ, Chicago Sun-Times) interleaved after every four guide cards.",
  },
  {
    label: 'Remaining guides',
    desc: "All other public guides, in reverse chronological order.",
  },
]

export default function FeedInfoModal({ onClose }) {
  const { state } = useAppContext()
  const dialogRef = useRef(null)
  const user = state.user

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Build dynamic intro parts
  const primaryNeighborhood = user.neighborhood
  const pastNeighborhoods = user.neighborhoodHistory
    ?.filter((h) => h.endYear)
    .map((h) => h.name) ?? []
  const badges = user.badges ?? []

  function buildIntro() {
    const parts = []
    if (primaryNeighborhood) {
      parts.push(
        <span key="near">
          guides near <strong>{primaryNeighborhood}</strong>
          {pastNeighborhoods.length > 0 && (
            <> (and your history: <strong>{pastNeighborhoods.join(', ')}</strong>)</>
          )}
        </span>
      )
    }
    if (badges.length > 0) {
      parts.push(
        <span key="badges">
          matching your interests: <strong>{badges.join(', ')}</strong>
        </span>
      )
    }
    if (parts.length === 0) return null
    return (
      <p className={styles.intro}>
        Your feed is prioritising{' '}
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 ? ' and ' : ''}
          </span>
        ))}.
      </p>
    )
  }

  function handleSettingsClick() {
    onClose()
    requestAnimationFrame(() => {
      document.getElementById('filter-panel')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feed-info-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 id="feed-info-title" className={styles.title}>How your feed works</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>How your feed is ordered</h3>

            {buildIntro()}

            <ol className={styles.tierList}>
              {TIERS.map((tier, i) => (
                <li key={tier.label} className={styles.tierItem}>
                  <span className={styles.tierBadge}>{i + 1}</span>
                  <span>
                    <strong>{tier.label}</strong> — {tier.desc}
                  </span>
                </li>
              ))}
            </ol>

            <p className={styles.noAlgorithm}>
              No algorithm. No engagement optimization. Just your neighborhoods and interests.
            </p>

            <p className={styles.note}>
              The ordering is deterministic — it's the same every time you load the feed and doesn't
              use any randomization.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Filtering your feed</h3>
            <p>
              Use the filter panel to narrow your feed by <strong>content type</strong> or{' '}
              <strong>interest badge</strong>.
            </p>
            <ul className={styles.filterList}>
              <li>
                <strong>Content type filter</strong> shows guides that contain at least one module
                of the selected type — for example, selecting "Playlists" shows only guides that
                include a playlist module.
              </li>
              <li>
                <strong>Interest badge filter</strong> shows guides tagged with the selected badge.
              </li>
            </ul>
            <p>
              Both filters use <strong>OR logic within each group</strong>: selecting "Coffee" and
              "Bars" shows guides tagged with Coffee <em>or</em> Bars. Selecting both "Places" and
              "Playlists" shows guides with a place module <em>or</em> a playlist module.
            </p>
            <p>
              When both content type and badge filters are active, a guide must satisfy both to
              appear in the feed.
            </p>
            <p className={styles.note}>
              Filter selections are preserved during your session. Use "Clear all filters" or hold
              Shift+R for two seconds to reset everything.
            </p>
          </section>

          <button className={styles.settingsBtn} onClick={handleSettingsClick}>
            Change your settings →
          </button>
        </div>
      </div>
    </div>
  )
}
