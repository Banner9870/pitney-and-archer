import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext.jsx'
import GuideCard from '../../components/GuideCard/GuideCard.jsx'
import HingePromptCard from '../../components/HingePromptCard/HingePromptCard.jsx'
import styles from './ProfilePage.module.css'

const PUBLICATION_NAMES = {
  suntimes: 'Chicago Sun-Times',
  wbez: 'WBEZ',
}

const TABS = ['Guides', 'Remixes', 'Saved', 'Collaborations']

function formatNeighborhoodHistory(history) {
  if (!history || history.length === 0) return null
  return history
    .map((entry) => `${entry.name} (${entry.startYear}–${entry.endYear ?? 'present'})`)
    .join(' → ')
}

export default function ProfilePage() {
  const { handle } = useParams()
  const { state } = useAppContext()
  const [activeTab, setActiveTab] = useState('Guides')

  const user = state.users.find((u) => u.slug === handle)

  if (!user) {
    return (
      <div className={styles.notFound}>
        <h2>User not found</h2>
        <Link to="/feed">← Back to feed</Link>
      </div>
    )
  }

  const isAlex = user.id === 'user-alex'

  // Guide tab data
  const allGuides = state.guides

  const ownGuides = allGuides.filter(
    (g) => g.authorId === user.id && !g.remixOf
  )
  const remixGuides = allGuides.filter(
    (g) => g.authorId === user.id && g.remixOf !== undefined
  )
  const collaborationGuides = allGuides.filter(
    (g) => g.collaborators?.includes(user.id) && g.authorId !== user.id
  )

  // Saved: Alex uses session state; others use seed data
  const savedIds = isAlex ? state.savedGuideIds : (user.savedGuideIds ?? [])
  const savedGuides = allGuides.filter((g) => savedIds.includes(g.id))

  function getTabGuides() {
    switch (activeTab) {
      case 'Guides': return ownGuides
      case 'Remixes': return remixGuides
      case 'Saved': return savedGuides
      case 'Collaborations': return collaborationGuides
      default: return []
    }
  }

  const tabGuides = getTabGuides()

  return (
    <div className={styles.page}>
      {/* Profile header */}
      <header className={styles.profileHeader}>
        <div className={styles.headerMain}>
          <h1 className={styles.displayName}>{user.displayName}</h1>
          <p className={styles.handle}>@{user.handle}</p>

          {user.isJournalist ? (
            <p className={styles.newsroomBadge}>
              <span className={styles.star}>★</span>
              {' '}
              <span className={styles.newsroomText}>
                From the newsroom · {PUBLICATION_NAMES[user.publication] ?? user.publication}
              </span>
            </p>
          ) : (
            <>
              {user.yearsInChicago && (
                <div className={styles.tenureBadge}>
                  {user.yearsInChicago} years in Chicago
                </div>
              )}

              {user.neighborhoodHistory && user.neighborhoodHistory.length > 0 && (
                <p className={styles.neighborhoodHistory}>
                  {formatNeighborhoodHistory(user.neighborhoodHistory)}
                </p>
              )}

              {user.badges && user.badges.length > 0 && (
                <div className={styles.badges}>
                  {user.badges.map((badge) => (
                    <span key={badge} className={styles.badge}>{badge}</span>
                  ))}
                </div>
              )}
            </>
          )}

          <button className={styles.followBtn}>Follow</button>
        </div>
      </header>

      {/* Hinge prompts */}
      {!user.isJournalist && user.hingePrompts && user.hingePrompts.length > 0 && (
        <section className={styles.hingeSection}>
          <h2 className={styles.sectionTitle}>About {user.displayName}</h2>
          <div className={styles.hingeGrid}>
            {user.hingePrompts.map((hp, i) => (
              <HingePromptCard key={i} prompt={hp.prompt} answer={hp.answer} />
            ))}
          </div>
        </section>
      )}

      {/* Guide tabs */}
      <section className={styles.guidesSection}>
        <div className={styles.tabBar}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {tabGuides.length === 0 ? (
          <div className={styles.emptyState}>
            {activeTab === 'Guides' && isAlex ? (
              <>
                <p>No guides yet.</p>
                <Link to="/guide/new" className={styles.createCta}>+ Create a guide</Link>
              </>
            ) : (
              <p>Nothing here yet.</p>
            )}
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {tabGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
