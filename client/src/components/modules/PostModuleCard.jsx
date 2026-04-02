import { useState } from 'react'
import styles from './PostModuleCard.module.css'

export default function PostModuleCard({ module: m }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={styles.card}>
      {m.images && m.images.length > 0 && (
        <div className={`${styles.gallery} ${m.images.length === 1 ? styles.gallerySingle : ''}`}>
          {m.images.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt="" className={styles.galleryImage} />
          ))}
        </div>
      )}
      <div className={styles.body}>
        <div className={`${styles.bodyText} ${m.isLong && !expanded ? styles.collapsed : ''}`}>
          {m.body}
        </div>
        {m.isLong && (
          <button
            className={styles.toggleBtn}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? 'Read less' : 'Read more →'}
          </button>
        )}
        {m.editorNote && (
          <p className={styles.editorNote}>"{m.editorNote}"</p>
        )}
      </div>
    </div>
  )
}
