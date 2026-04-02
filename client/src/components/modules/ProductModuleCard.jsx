import ChicagoStar from '../ChicagoStar.jsx'
import styles from './ProductModuleCard.module.css'

export default function ProductModuleCard({ module: m }) {
  return (
    <div className={m.isMemberDeal ? `${styles.card} ${styles.cardMemberDeal}` : styles.card}>
      {m.coverImage && (
        <img src={m.coverImage} alt={m.name} className={styles.cover} />
      )}
      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.name}>{m.name}</h3>
          {m.price && (
            <span className={styles.price}>{m.price}</span>
          )}
        </div>
        {m.description && (
          <p className={styles.description}>{m.description}</p>
        )}
        {m.where && (
          <p className={styles.where}><strong>Where to get it:</strong> {m.where}</p>
        )}
        {m.isMemberDeal && m.dealDescription && (
          <div className={styles.memberDeal}>
            <ChicagoStar /> CPM Member Deal — {m.dealDescription}
          </div>
        )}
        {m.editorNote && (
          <p className={styles.editorNote}>"{m.editorNote}"</p>
        )}
      </div>
    </div>
  )
}
