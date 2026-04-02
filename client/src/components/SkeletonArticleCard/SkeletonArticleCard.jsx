import styles from './SkeletonArticleCard.module.css'

export default function SkeletonArticleCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.shimmer} ${styles.sourceBar}`} />
      <div className={`${styles.shimmer} ${styles.headlineBar}`} />
      <div className={`${styles.shimmer} ${styles.headlineBarShort}`} />
      <div className={`${styles.shimmer} ${styles.summaryBar}`} />
      <div className={`${styles.shimmer} ${styles.summaryBarShort}`} />
      <div className={`${styles.shimmer} ${styles.timestampBar}`} />
    </div>
  )
}
