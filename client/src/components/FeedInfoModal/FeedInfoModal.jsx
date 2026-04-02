import { useEffect, useRef } from 'react'
import styles from './FeedInfoModal.module.css'

export default function FeedInfoModal({ onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

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
            <p className={styles.intro}>
              Your feed is sorted into five tiers, in this order:
            </p>
            <ol className={styles.tierList}>
              <li>
                <strong>Editor's Picks</strong> — guides hand-selected by the chicago.com editorial
                team. These always appear first.
              </li>
              <li>
                <strong>Neighborhood-matched</strong> — guides tagged with your current neighborhood
                (Lincoln Square) or any neighborhood in your history (Pilsen, Logan Square).
              </li>
              <li>
                <strong>Badge-matched</strong> — guides whose tags overlap with your interest badges
                (Food & Drink, Live Music, Parks & Outdoors, Coffee).
              </li>
              <li>
                <strong>Citywide news</strong> — articles from Chicago newsrooms (WBEZ, Chicago
                Sun-Times) that are relevant to the whole city. These are interleaved after every
                four guide cards.
              </li>
              <li>
                <strong>Remaining guides</strong> — all other public guides, in reverse
                chronological order.
              </li>
            </ol>
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
        </div>
      </div>
    </div>
  )
}
