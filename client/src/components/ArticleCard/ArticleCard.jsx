import styles from './ArticleCard.module.css'

const SOURCE_LABELS = {
  suntimes: 'Chicago Sun-Times',
  wbez: 'WBEZ Chicago',
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function ArticleCard({ article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      aria-label={`Read article: ${article.title}`}
    >
      <div className={styles.sourceLabel}>{SOURCE_LABELS[article.source] ?? article.source}</div>
      <h3 className={styles.headline}>{article.title}</h3>
      {article.summary && (
        <p className={styles.summary}>{article.summary}</p>
      )}
      <span className={styles.timestamp}>{formatDate(article.publishedAt)}</span>
    </a>
  )
}
