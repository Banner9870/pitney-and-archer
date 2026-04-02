import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext.jsx'
import useToast from '../Toast/useToast.js'
import Toast from '../Toast/Toast.jsx'
import styles from './GuideCard.module.css'

const MODULE_ICONS = {
  place: '📍',
  article: '📰',
  product: '🛍️',
  event: '📅',
  post: '📝',
  playlist: '🎵',
}

const MODULE_LABELS = {
  place: 'Places',
  article: 'Articles',
  product: 'Products',
  event: 'Events',
  post: 'Posts',
  playlist: 'Playlist',
}

export default function GuideCard({ guide }) {
  const { state, dispatch } = useAppContext()
  const navigate = useNavigate()
  const { showToast, message, visible, dismiss } = useToast()

  const isLiked = state.likedGuideIds.includes(guide.id)
  const isHelpful = state.helpfulGuideIds.includes(guide.id)

  // Look up author from seed users
  const author = state.users.find((u) => u.id === guide.authorId)

  // Cover image fallback chain
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
  const firstPlace = guide.modules?.find((m) => m.type === 'place')
  let coverSrc = guide.coverImage || null
  if (!coverSrc && firstPlace && apiKey) {
    const encoded = encodeURIComponent(firstPlace.address)
    coverSrc = `https://maps.googleapis.com/maps/api/staticmap?center=${encoded}&zoom=15&size=800x450&maptype=roadmap&markers=color:red|${encoded}&key=${apiKey}`
  }

  // Module type icon strip — unique types, up to 4 shown
  const uniqueTypes = [...new Set(guide.modules?.map((m) => m.type) ?? [])]
  const shownTypes = uniqueTypes.slice(0, 4)
  const extraCount = uniqueTypes.length - shownTypes.length

  function handleCardClick(e) {
    // Don't navigate when clicking the engagement row
    if (e.target.closest('[data-engagement]')) return
    navigate(`/guide/${guide.id}`)
  }

  function handleLike(e) {
    e.stopPropagation()
    dispatch({ type: 'LIKE_GUIDE', payload: guide.id })
  }

  function handleHelpful(e) {
    e.stopPropagation()
    dispatch({ type: 'HELPFUL_GUIDE', payload: guide.id })
  }

  function handleRemix(e) {
    e.stopPropagation()
    navigate(`/guide/${guide.id}/remix`)
  }

  function handleShare(e) {
    e.stopPropagation()
    showToast('Link copied!')
  }

  const likeCount = guide.likeCount + (isLiked ? 1 : 0)
  const helpfulCount = guide.helpfulCount + (isHelpful ? 1 : 0)

  return (
    <>
      <article
        className={`${styles.card} ${guide.isSponsored ? styles.sponsored : ''}`}
        onClick={handleCardClick}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/guide/${guide.id}`) }}
        aria-label={`Guide: ${guide.title}`}
      >
        {/* Cover image area */}
        <div className={styles.coverWrap}>
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={firstPlace ? `Map of ${firstPlace.name}` : guide.title}
              className={styles.coverImg}
              loading="lazy"
            />
          ) : (
            <div className={styles.coverPlaceholder} aria-hidden="true" />
          )}

          {/* Overlay badges */}
          <div className={styles.overlayBadges}>
            <span className={styles.guidePill}>★ GUIDE</span>
            {guide.isSponsored && (
              <span className={styles.sponsoredPill}>Sponsored</span>
            )}
          </div>
          {guide.isEditorsPick && (
            <span className={styles.editorsPickLabel}>★ Editor's Pick</span>
          )}
          {guide.isReviewed && !guide.isEditorsPick && (
            <span className={styles.reviewedLabel}>Reviewed</span>
          )}
          {guide.isNewsroom && (
            <span className={styles.newsroomLabel}>★ From the newsroom</span>
          )}
        </div>

        {/* Card body */}
        <div className={styles.body}>
          <h3 className={styles.title}>{guide.title}</h3>

          {author && (
            <p className={styles.authorRow}>
              {author.displayName}
              <span className={styles.handle}> @{author.handle}</span>
            </p>
          )}

          {guide.neighborhood && (
            <span className={styles.neighborhoodTag}>{guide.neighborhood}</span>
          )}

          {/* Module type icon strip */}
          {shownTypes.length > 0 && (
            <div className={styles.moduleStrip}>
              {shownTypes.map((type) => (
                <span key={type} className={styles.moduleIcon}>
                  {MODULE_ICONS[type]} {MODULE_LABELS[type]}
                </span>
              ))}
              {extraCount > 0 && (
                <span className={styles.moduleIcon}>+{extraCount} more</span>
              )}
            </div>
          )}

          {/* Engagement row */}
          <div className={styles.engagementRow} data-engagement="true">
            <button
              className={`${styles.engBtn} ${isLiked ? styles.liked : ''}`}
              onClick={handleLike}
              aria-label={isLiked ? 'Unlike guide' : 'Like guide'}
              aria-pressed={isLiked}
            >
              {isLiked ? '♥' : '♡'} {likeCount}
            </button>
            <button
              className={`${styles.engBtn} ${isHelpful ? styles.helpful : ''}`}
              onClick={handleHelpful}
              aria-label={isHelpful ? 'Mark not helpful' : 'Mark helpful'}
              aria-pressed={isHelpful}
            >
              ✓ {helpfulCount}
            </button>
            <button className={styles.engBtn} onClick={handleRemix}>
              Remix →
            </button>
            <button className={styles.engBtn} onClick={handleShare}>
              ↗ Share
            </button>
          </div>
        </div>
      </article>
      <Toast message={message} visible={visible} onDismiss={dismiss} />
    </>
  )
}
