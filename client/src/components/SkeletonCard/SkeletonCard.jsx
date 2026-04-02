import styles from './SkeletonCard.module.css'

export default function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.coverShimmer} />
      <div className={styles.body}>
        <div className={`${styles.shimmer} ${styles.titleBar}`} />
        <div className={`${styles.shimmer} ${styles.titleBarShort}`} />
        <div className={`${styles.shimmer} ${styles.metaBar}`} />
        <div className={`${styles.shimmer} ${styles.tagBar}`} />
      </div>
    </div>
  )
}
