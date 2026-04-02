import styles from './ArticleModuleCard.module.css'

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

export default function ArticleModuleCard({ module: m }) {
  const isSuntimes = m.source?.toLowerCase().includes('sun-times') || m.source?.toLowerCase().includes('suntimes')
  const isWBEZ = m.source?.toLowerCase().includes('wbez')

  return (
    <div className={styles.card}>
      <div className={styles.body}>
        <div className={styles.header}>
          <span className={`${styles.badge} ${isSuntimes ? styles.badgeSuntimes : isWBEZ ? styles.badgeWbez : styles.badgeDefault}`}>
            {m.source ?? 'Article'}
          </span>
          {m.publishedAt && (
            <span className={styles.date}>{formatDate(m.publishedAt)}</span>
          )}
        </div>
        <h3 className={styles.headline}>{m.title}</h3>
        {m.summary && (
          <p className={styles.summary}>{m.summary}</p>
        )}
        {m.editorNote && (
          <p className={styles.editorNote}>"{m.editorNote}"</p>
        )}
        {m.url && (
          <a
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.readLink}
          >
            Read →
          </a>
        )}
      </div>
    </div>
  )
}
