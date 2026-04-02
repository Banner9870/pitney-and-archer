import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow })

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import { useAppContext } from '../../context/AppContext.jsx'
import GuideCard from '../../components/GuideCard/GuideCard.jsx'
import ArticleCard from '../../components/ArticleCard/ArticleCard.jsx'
import styles from './NeighborhoodPage.module.css'

function FitBoundsLayer({ feature }) {
  const map = useMap()
  useEffect(() => {
    if (feature) {
      const layer = L.geoJSON(feature)
      map.fitBounds(layer.getBounds(), { padding: [20, 20] })
    }
  }, [feature, map])
  return null
}

export default function NeighborhoodPage() {
  const { slug } = useParams()
  const { state } = useAppContext()
  const { communityAreas, guides, rssArticles } = state

  const [geoFeature, setGeoFeature] = useState(null)
  const [geoLoading, setGeoLoading] = useState(true)

  const area = communityAreas.find((a) => a.slug === slug)

  useEffect(() => {
    if (!area) {
      setGeoLoading(false)
      return
    }
    setGeoLoading(true)
    fetch('/chicago-community-areas.geojson')
      .then((r) => r.json())
      .then((data) => {
        const feature = data.features.find(
          (f) => String(f.properties.area_numbe) === String(area.id)
        )
        setGeoFeature(feature ?? null)
      })
      .catch(() => setGeoFeature(null))
      .finally(() => setGeoLoading(false))
  }, [area?.id])

  if (communityAreas.length === 0) {
    return <div className={styles.loading}>Loading neighborhood data…</div>
  }

  if (!area) {
    return (
      <div className={styles.notFound}>
        <h1>Neighborhood not found</h1>
        <p>
          <Link to="/feed">Back to feed</Link>
        </p>
      </div>
    )
  }

  const neighborhoodGuides = guides.filter(
    (g) =>
      g.neighborhood === area.name ||
      (g.additionalNeighborhoods && g.additionalNeighborhoods.includes(area.name))
  )

  const neighborhoodArticles = rssArticles.filter(
    (a) =>
      a.title?.toLowerCase().includes(area.name.toLowerCase()) ||
      a.summary?.toLowerCase().includes(area.name.toLowerCase())
  )

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h1 className={styles.name}>{area.name.toUpperCase()}</h1>
          <span className={styles.areaNum}>Community Area #{area.id}</span>
        </div>
        {area.population && (
          <div className={styles.statsStrip}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Population</span>
              <span className={styles.statValue}>{Number(area.population).toLocaleString()}</span>
            </div>
          </div>
        )}
        <button className={styles.followBtn}>Follow this neighborhood</button>
      </div>

      {/* Boundary map */}
      <div className={styles.mapSection}>
        {geoLoading ? (
          <div className={styles.mapSkeleton} aria-hidden="true" />
        ) : (
          <MapContainer
            center={[41.8827, -87.6278]}
            zoom={12}
            style={{ height: '320px', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geoFeature && (
              <>
                <GeoJSON
                  data={geoFeature}
                  style={{ color: 'var(--red)', weight: 2, fillOpacity: 0.1, fillColor: 'var(--red)' }}
                />
                <FitBoundsLayer feature={geoFeature} />
              </>
            )}
          </MapContainer>
        )}
      </div>

      {/* Guides section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Guides about {area.name}</h2>
        {neighborhoodGuides.length > 0 ? (
          <div className={styles.guideGrid}>
            {neighborhoodGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No guides yet for {area.name}. Be the first to create one.</p>
            <Link to="/guide/new" className={styles.createLink}>
              Create a guide
            </Link>
          </div>
        )}
      </section>

      {/* RSS articles section */}
      {neighborhoodArticles.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>From the newsroom</h2>
          <div className={styles.articleGrid}>
            {neighborhoodArticles.map((article, i) => (
              <ArticleCard key={article.url ?? i} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
