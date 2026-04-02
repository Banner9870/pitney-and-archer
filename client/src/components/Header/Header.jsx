import { useState, useMemo } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ChicagoStar from '../ChicagoStar.jsx'
import { useAppContext } from '../../context/AppContext.jsx'
import styles from './Header.module.css'

export default function Header() {
  const { state } = useAppContext()
  const { communityAreas } = state

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [neighborhoodsOpen, setNeighborhoodsOpen] = useState(false)
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('')

  const filteredAreas = useMemo(() => {
    if (!neighborhoodSearch.trim()) return communityAreas
    const q = neighborhoodSearch.toLowerCase()
    return communityAreas.filter((a) => a.name.toLowerCase().includes(q))
  }, [communityAreas, neighborhoodSearch])

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Left: wordmark */}
        <Link to="/feed" className={styles.wordmark}>
          <ChicagoStar className={styles.star} />
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
              onClick={() => {
                setNeighborhoodsOpen((o) => !o)
                setNeighborhoodSearch('')
              }}
              aria-expanded={neighborhoodsOpen}
            >
              Neighborhoods ▾
            </button>
            {neighborhoodsOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownSearch}>
                  <input
                    type="text"
                    className={styles.dropdownSearchInput}
                    placeholder="Search neighborhoods…"
                    value={neighborhoodSearch}
                    onChange={(e) => setNeighborhoodSearch(e.target.value)}
                    autoFocus
                    aria-label="Filter neighborhoods"
                  />
                </div>
                <div className={styles.dropdownList}>
                  {filteredAreas.map((area) => (
                    <Link
                      key={area.id}
                      to={`/neighborhood/${area.slug}`}
                      className={styles.dropdownItem}
                      onClick={() => {
                        setNeighborhoodsOpen(false)
                        setNeighborhoodSearch('')
                      }}
                    >
                      {area.name}
                    </Link>
                  ))}
                  {filteredAreas.length === 0 && (
                    <span className={styles.dropdownEmpty}>No results</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: create + account chip */}
        <div className={styles.actions}>
          <Link to="/guide/new" className={styles.createBtn}>
            + Create Guide
          </Link>
          <Link to="/profile/alexrivera" className={styles.accountChip}>
            <span className={styles.accountName}>Alex Rivera</span>
            <span className={styles.accountHandle}>@alexrivera</span>
          </Link>
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
          {communityAreas.map((area) => (
            <Link
              key={area.id}
              to={`/neighborhood/${area.slug}`}
              className={styles.drawerSubLink}
              onClick={() => setDrawerOpen(false)}
            >
              {area.name}
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
