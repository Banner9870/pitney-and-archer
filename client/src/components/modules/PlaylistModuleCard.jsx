import { useState } from 'react'
import styles from './PlaylistModuleCard.module.css'

const PLATFORM_ICONS = {
  spotify: '🎵',
  bandcamp: '🎸',
}

const IFRAME_HEIGHT = 352

export default function PlaylistModuleCard({ module: m }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.platformIcon}>
          {PLATFORM_ICONS[m.platform] ?? '🎵'}
        </span>
        <div className={styles.headerText}>
          <h3 className={styles.title}>{m.title}</h3>
          {m.description && <p className={styles.description}>{m.description}</p>}
        </div>
      </div>
      {m.editorNote && (
        <p className={styles.editorNote}>"{m.editorNote}"</p>
      )}
      <div className={styles.iframeWrapper} style={{ height: IFRAME_HEIGHT }}>
        {!loaded && (
          <div className={styles.skeleton} style={{ height: IFRAME_HEIGHT }} />
        )}
        <iframe
          src={m.embedUrl}
          width="100%"
          height={IFRAME_HEIGHT}
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={m.title}
          className={loaded ? styles.iframe : styles.iframeHidden}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  )
}
