import PlaceModuleCard from '../../components/modules/PlaceModuleCard.jsx'
import ArticleModuleCard from '../../components/modules/ArticleModuleCard.jsx'
import ProductModuleCard from '../../components/modules/ProductModuleCard.jsx'
import EventModuleCard from '../../components/modules/EventModuleCard.jsx'
import PostModuleCard from '../../components/modules/PostModuleCard.jsx'
import PlaylistModuleCard from '../../components/modules/PlaylistModuleCard.jsx'
import styles from './StepReview.module.css'

const MODULE_COMPONENTS = {
  place: PlaceModuleCard,
  article: ArticleModuleCard,
  product: ProductModuleCard,
  event: EventModuleCard,
  post: PostModuleCard,
  playlist: PlaylistModuleCard,
}

const PRIVACY_LABELS = {
  private: 'Private',
  friends: 'Friends only',
  public: 'Public',
}

export default function StepReview({ guideData, onBack, onPublish }) {
  const { title, description, neighborhood, badges, coverImage, privacy, modules } = guideData

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Review your guide</h1>

      {/* Summary line */}
      <p className={styles.summary}>
        <strong>{modules.length}</strong> module{modules.length !== 1 ? 's' : ''}
        {' · '}
        <strong>{neighborhood}</strong>
        {' · '}
        <strong>{PRIVACY_LABELS[privacy] ?? privacy}</strong>
      </p>

      {/* Cover preview */}
      {coverImage && (
        <div className={styles.coverPreview}>
          <img src={coverImage} alt="Cover" className={styles.coverImg} />
          <div className={styles.coverOverlay}>
            <h2 className={styles.coverTitle}>{title}</h2>
          </div>
        </div>
      )}

      {/* Description */}
      {description && <p className={styles.description}>{description}</p>}

      {/* Badges */}
      {badges.length > 0 && (
        <div className={styles.badgeRow}>
          {badges.map((b) => (
            <span key={b} className={styles.badge}>{b}</span>
          ))}
        </div>
      )}

      {/* Module previews */}
      <div className={styles.moduleList}>
        {modules.map((mod, i) => {
          const Component = MODULE_COMPONENTS[mod.type]
          if (!Component) return null
          return <Component key={i} module={mod} />
        })}
      </div>

      {/* Navigation */}
      <div className={styles.nav}>
        <button type="button" className={styles.backLink} onClick={() => onBack()}>
          ← Edit modules
        </button>
        <button
          type="button"
          className={styles.publishBtn}
          onClick={() => onPublish(guideData)}
        >
          Publish guide
        </button>
      </div>
    </div>
  )
}
