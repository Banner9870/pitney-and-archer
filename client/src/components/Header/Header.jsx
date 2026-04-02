import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styles from './Header.module.css'

const NEIGHBORHOODS = [
  'Lincoln Square',
  'Humboldt Park',
  'Pilsen',
  'Hyde Park',
  'Bronzeville',
  'Wicker Park',
]

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [neighborhoodsOpen, setNeighborhoodsOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Left: wordmark */}
        <Link to="/feed" className={styles.wordmark}>
          <span className={styles.star}>★</span>
          chicago.com
        </Link>

        {/* Center: desktop nav */}
        <nav className={styles.nav}>
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Feed
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Explore
          </NavLink>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownTrigger}
              onClick={() => setNeighborhoodsOpen((o) => !o)}
              aria-expanded={neighborhoodsOpen}
            >
              Neighborhoods ▾
            </button>
            {neighborhoodsOpen && (
              <div className={styles.dropdownMenu}>
                {NEIGHBORHOODS.map((name) => (
                  <Link
                    key={name}
                    to={`/neighborhood/${name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={styles.dropdownItem}
                    onClick={() => setNeighborhoodsOpen(false)}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right: create + account chip */}
        <div className={styles.actions}>
          <Link to="/guide/new" className={styles.createBtn}>
            + Create Guide
          </Link>
          <div className={styles.accountChip}>
            <span className={styles.accountName}>Alex Rivera</span>
            <span className={styles.accountHandle}>@alexrivera</span>
          </div>
        </div>

        {/* Mobile: hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setDrawerOpen((o) => !o)}
          aria-label="Toggle navigation"
          aria-expanded={drawerOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className={styles.drawer}>
          <Link to="/feed" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            Feed
          </Link>
          <Link to="/explore" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            Explore
          </Link>
          <div className={styles.drawerSection}>Neighborhoods</div>
          {NEIGHBORHOODS.map((name) => (
            <Link
              key={name}
              to={`/neighborhood/${name.toLowerCase().replace(/\s+/g, '-')}`}
              className={styles.drawerSubLink}
              onClick={() => setDrawerOpen(false)}
            >
              {name}
            </Link>
          ))}
          <Link
            to="/guide/new"
            className={styles.drawerCreateBtn}
            onClick={() => setDrawerOpen(false)}
          >
            + Create Guide
          </Link>
        </div>
      )}
    </header>
  )
}
