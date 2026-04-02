import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext.jsx'
import useToast from '../../components/Toast/useToast.js'
import Toast from '../../components/Toast/Toast.jsx'
import PlaceModuleCard from '../../components/modules/PlaceModuleCard.jsx'
import ArticleModuleCard from '../../components/modules/ArticleModuleCard.jsx'
import ProductModuleCard from '../../components/modules/ProductModuleCard.jsx'
import EventModuleCard from '../../components/modules/EventModuleCard.jsx'
import PostModuleCard from '../../components/modules/PostModuleCard.jsx'
import PlaylistModuleCard from '../../components/modules/PlaylistModuleCard.jsx'
import GuideMap from '../../components/GuideMap/GuideMap.jsx'
import styles from './GuideDetailPage.module.css'

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
}

const MODULE_COMPONENTS = {
  place: PlaceModuleCard,
  article: ArticleModuleCard,
  product: ProductModuleCard,
  event: EventModuleCard,
  post: PostModuleCard,
  playlist: PlaylistModuleCard,
}

export default function GuideDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { state, dispatch } = useAppContext()
  const { message, visible, showToast, dismiss } = useToast()

  // Success banner state — read location.state?.isNew on mount
  const [showBanner, setShowBanner] = useState(false)
  const bannerTimerRef = useRef(null)

  useEffect(() => {
    if (location.state?.isNew) {
      setShowBanner(true)
      // Clear the state so refresh doesn't re-show it
      window.history.replaceState({}, '')
      bannerTimerRef.current = setTimeout(() => setShowBanner(false), 8000)
    }
    return () => clearTimeout(bannerTimerRef.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const guide = state.guides.find((g) => g.id === id)

  useEffect(() => {
    if (!guide) navigate('/feed', { replace: true })
  }, [guide, navigate])

  if (!guide) return null

  const author = state.users.find((u) => u.id === guide.authorId)

  // Collaborators
  const collaborators = (guide.collaborators ?? [])
    .map((cid) => state.users.find((u) => u.id === cid))
    .filter(Boolean)

  // Remix source
  const remixSource = guide.remixOf
    ? state.guides.find((g) => g.id === guide.remixOf)
    : null
  const remixAuthor = remixSource
    ? state.users.find((u) => u.id === remixSource.authorId)
    : null

  // Collect place modules for GuideMap
  const placeModules = (guide.modules ?? []).filter((m) => m.type === 'place')

  // Engagement state
  const isLiked = state.likedGuideIds.includes(guide.id)
  const isHelpful = state.helpfulGuideIds.includes(guide.id)
  const isSaved = state.savedGuideIds.includes(guide.id)
  const likeCount = guide.likeCount + (isLiked ? 1 : 0)
  const helpfulCount = guide.helpfulCount + (isHelpful ? 1 : 0)

  function handleLike() { dispatch({ type: 'LIKE_GUIDE', payload: guide.id }) }
  function handleHelpful() { dispatch({ type: 'HELPFUL_GUIDE', payload: guide.id }) }
  function handleSave() { dispatch({ type: 'SAVE_GUIDE', payload: guide.id }) }
  function handleShare() { showToast('Link copied!') }

  // All neighborhoods for chip row
  const allNeighborhoods = [
    guide.neighborhood,
    ...(guide.additionalNeighborhoods ?? []),
  ].filter(Boolean)

  return (
    <>
      {/* Success banner */}
      {showBanner && (
        <div className={styles.banner}>
          <span>Your guide is live! Share it with friends.</span>
          <button
            className={styles.bannerShare}
            onClick={() => showToast('Link copied!')}
          >
            ↗ Share
          </button>
          <button
            className={styles.bannerClose}
            onClick={() => { setShowBanner(false); clearTimeout(bannerTimerRef.current) }}
            aria-label="Dismiss banner"
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.page}>
        {/* Hero */}
        <div className={styles.hero}>
          {guide.coverImage && (
            <img src={guide.coverImage} alt={guide.title} className={styles.heroCover} fetchpriority="high" />
          )}
          <div className={styles.heroScrim} />
          {guide.isSponsored && (
            <span className={styles.sponsoredPill}>Sponsored</span>
          )}
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{guide.title}</h1>
          </div>
        </div>

        {/* Author identity (below hero, not overlaid) */}
        {author && (
          <div className={styles.authorRow}>
            <div className={styles.authorAvatar}>{getInitials(author.displayName)}</div>
            <Link to={`/profile/${author.slug}`} className={styles.authorInfo}>
              <span className={styles.authorName}>{author.displayName}</span>
              <span className={styles.authorHandle}>@{author.handle}</span>
            </Link>
            {author.yearsInChicago != null && (
              <span className={styles.yearsBadge}>{author.yearsInChicago} yrs in Chicago</span>
            )}
            <button className={styles.followBtn}>
              Follow {author.displayName.split(' ')[0]}
            </button>
          </div>
        )}

        <div className={styles.content}>
          {/* Description */}
          {guide.description && (
            <p className={styles.description}>{guide.description}</p>
          )}

          {/* Neighborhood chips */}
          {allNeighborhoods.length > 0 && (
            <div className={styles.chipRow}>
              {allNeighborhoods.map((n) => (
                <Link
                  key={n}
                  to={`/neighborhood/${toSlug(n)}`}
                  className={styles.neighborhoodChip}
                >
                  {n}
                </Link>
              ))}
            </div>
          )}

          {/* Badge chips */}
          {guide.badges?.length > 0 && (
            <div className={styles.chipRow}>
              {guide.badges.map((b) => (
                <span key={b} className={styles.badgeChip}>{b}</span>
              ))}
            </div>
          )}

          {/* Sponsored attribution */}
          {guide.isSponsored && guide.sponsorName && (
            <p className={styles.sponsoredAttr}>
              Created in partnership with {guide.sponsorName}
            </p>
          )}

          {/* Remix attribution */}
          {remixSource && (
            <div className={styles.remixAttr}>
              Remixed from{' '}
              <Link to={`/guide/${remixSource.id}`} className={styles.remixLink}>
                {remixSource.title}
              </Link>
              {remixAuthor && (
                <> by <span className={styles.remixHandle}>@{remixAuthor.handle}</span></>
              )}
            </div>
          )}

          {/* Module list */}
          <div className={styles.moduleList}>
            {(guide.modules ?? []).map((mod, i) => {
              const Component = MODULE_COMPONENTS[mod.type]
              if (!Component) return null
              return <Component key={i} module={mod} />
            })}
          </div>

          {/* GuideMap — rendered after all modules, only when place modules exist */}
          {placeModules.length > 0 && (
            <GuideMap placeModules={placeModules} collapsible={true} />
          )}

          {/* Collaborators */}
          {collaborators.length > 0 && (
            <div className={styles.collaborators}>
              <span className={styles.collaboratorsLabel}>Also contributed by:</span>
              <div className={styles.collaboratorChips}>
                {collaborators.map((c) => (
                  <div key={c.id} className={styles.collabChip}>
                    <span className={styles.collabAvatar}>{getInitials(c.displayName)}</span>
                    <span className={styles.collabHandle}>@{c.handle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engagement row */}
          <div className={styles.engagementRow}>
            <button
              className={`${styles.engBtn} ${isLiked ? styles.liked : ''}`}
              onClick={handleLike}
              aria-pressed={isLiked}
            >
              {isLiked ? '♥' : '♡'} {likeCount}
            </button>
            <button
              className={`${styles.engBtn} ${isHelpful ? styles.helpful : ''}`}
              onClick={handleHelpful}
              aria-pressed={isHelpful}
            >
              ✓ {helpfulCount}
            </button>
            <button
              className={`${styles.engBtn} ${isSaved ? styles.saved : ''}`}
              onClick={handleSave}
              aria-pressed={isSaved}
            >
              ★ Save
            </button>
            <button className={styles.engBtn} onClick={handleShare}>
              ↗ Share
            </button>
          </div>

          {/* CTA */}
          <div className={styles.ctaRow}>
            <button
              className={styles.remixBtn}
              onClick={() => navigate(`/guide/${guide.id}/remix`)}
            >
              Remix this guide →
            </button>
          </div>
        </div>
      </div>

      <Toast message={message} visible={visible} onDismiss={dismiss} />
    </>
  )
}
