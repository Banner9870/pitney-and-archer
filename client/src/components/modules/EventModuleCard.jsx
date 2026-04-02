import styles from './EventModuleCard.module.css'

export default function EventModuleCard({ module: m }) {
  return (
    <div className={styles.card}>
      <div className={styles.layout}>
        <div className={styles.dateBadge}>
          <span>{m.date ?? 'TBD'}</span>
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{m.name}</h3>
          {(m.venue || m.address || m.neighborhood) && (
            <p className={styles.location}>
              {[m.venue, m.neighborhood].filter(Boolean).join(' · ')}
              {m.address && <span className={styles.address}> — {m.address}</span>}
            </p>
          )}
          {m.time && <p className={styles.time}>{m.time}</p>}
          {m.description && <p className={styles.description}>{m.description}</p>}
          {m.editorNote && (
            <p className={styles.editorNote}>"{m.editorNote}"</p>
          )}
          {m.url && (
            <a
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Get tickets / More info →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
