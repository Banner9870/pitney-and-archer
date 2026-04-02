import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow })

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import styles from './GuideMap.module.css'

// Hardcoded neighborhood → coordinate map for the 8 required neighborhoods + extras
const NEIGHBORHOOD_COORDS = {
  'Humboldt Park':    [41.9025, -87.7230],
  'Hyde Park':        [41.7943, -87.5907],
  'Wicker Park':      [41.9083, -87.6764],
  'Lincoln Square':   [41.9678, -87.6826],
  'Pilsen':           [41.8556, -87.6594],
  'Bronzeville':      [41.8300, -87.6136],
  'Logan Square':     [41.9217, -87.7029],
  'Andersonville':    [41.9811, -87.6694],
  'Lakeview':         [41.9437, -87.6483],
  'Loop':             [41.8827, -87.6278],
  'River North':      [41.8919, -87.6341],
  'Uptown':           [41.9653, -87.6556],
  'Ukrainian Village':[41.8944, -87.6841],
  'South Loop':       [41.8604, -87.6281],
  'Bridgeport':       [41.8427, -87.6503],
  'Little Italy':     [41.8722, -87.6536],
}

function getCoords(neighborhood) {
  return NEIGHBORHOOD_COORDS[neighborhood] ?? [41.8827, -87.6278] // fallback: Loop
}

function computeCenter(placeModules) {
  const coords = placeModules.map((m) => getCoords(m.neighborhood))
  const lat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length
  const lng = coords.reduce((sum, c) => sum + c[1], 0) / coords.length
  return [lat, lng]
}

export default function GuideMap({ placeModules, collapsible }) {
  const [collapsed, setCollapsed] = useState(true)

  if (!placeModules || placeModules.length === 0) return null

  const center = computeCenter(placeModules)

  return (
    <div className={styles.wrapper}>
      {collapsible && (
        <button
          className={styles.toggle}
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
        >
          {collapsed ? '▼ Show map' : '▲ Hide map'}
        </button>
      )}
      {(!collapsible || !collapsed) && (
        <div className={styles.mapContainer}>
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {placeModules.map((place, i) => {
              const pos = getCoords(place.neighborhood)
              return (
                <Marker key={place.placeId ?? i} position={pos}>
                  <Popup>
                    <strong>{place.name}</strong>
                    {place.editorNote && (
                      <p style={{ marginTop: 4, fontSize: '0.85rem' }}>
                        {place.editorNote.slice(0, 100)}{place.editorNote.length > 100 ? '…' : ''}
                      </p>
                    )}
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      )}
    </div>
  )
}
