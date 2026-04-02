import styles from './PlaceModuleCard.module.css'

const CATEGORY_ICONS = {
  cafe: '☕',
  restaurant: '🍽️',
  bar: '🍺',
  park: '🌳',
  trail: '🥾',
  museum: '🏛️',
  bookstore: '📚',
  'bookstore cafe': '📚',
  'music venue': '🎵',
  'jazz club': '🎷',
  brewery: '🍻',
  bakery: '🥐',
  market: '🛒',
  shop: '🛍️',
  'record store': '🎧',
  'event venue': '🎪',
  'cultural center': '🏢',
  'arts district': '🎨',
  gallery: '🖼️',
  cinema: '🎬',
  'shopping center': '🏬',
  landmark: '⭐',
  'community center': '🏘️',
  grocery: '🛒',
  'wine shop': '🍷',
}

function renderStars(rating) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return '★'.repeat(full) + (half ? '½' : '')
}

export default function PlaceModuleCard({ module: m }) {
  return (
    <div className={styles.card}>
      {m.coverImage && (
        <img src={m.coverImage} alt={m.name} className={styles.cover} />
      )}
      <div className={styles.body}>
        <h3 className={styles.name}>{m.name}</h3>
        {m.address && <p className={styles.address}>{m.address}</p>}
        {(m.name || m.address) && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([m.name, m.address].filter(Boolean).join(', '))}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapsLink}
          >
            Open in Google Maps →
          </a>
        )}
        <div className={styles.meta}>
          <span className={styles.category}>
            {CATEGORY_ICONS[m.category] ?? '📍'} {m.category}
          </span>
          {m.rating != null && (
            <span className={styles.rating}>
              <span className={styles.stars}>{renderStars(m.rating)}</span>
              {m.rating.toFixed(1)}
              {m.reviewCount != null && (
                <span className={styles.reviewCount}> ({m.reviewCount.toLocaleString()})</span>
              )}
            </span>
          )}
        </div>
        {m.editorNote && (
          <p className={styles.editorNote}>"{m.editorNote}"</p>
        )}
      </div>
    </div>
  )
}
