import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.flagStripes}>
        <div className={styles.stripe} />
        <div className={styles.stripe} />
      </div>
      <div className={styles.inner}>
        <p className={styles.tagline}>Made in Chicago, for Chicago.</p>
        <nav className={styles.links}>
          <a href="#">About chicago.com</a>
          <a href="#">How guides work</a>
          <a href="#">How the feed is ordered</a>
          <a href="https://www.chicagopublicmedia.org" target="_blank" rel="noopener noreferrer">
            Chicago Public Media
          </a>
        </nav>
      </div>
    </footer>
  )
}
