import { useState } from 'react'
import { SEED_PLACES } from '../../../data/seed.js'
import styles from './PlaceSearchForm.module.css'

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY

function seedSearch(query) {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return SEED_PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.neighborhood.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  ).slice(0, 12)
}

function placesApiResultToResult(place) {
  const type = (place.types ?? [])[0] ?? 'place'
  return {
    id: place.id,
    name: place.displayName?.text ?? 'Unknown',
    address: place.formattedAddress ?? '',
    neighborhood: '',
    category: type.replace(/_/g, ' '),
    rating: place.rating,
    reviewCount: place.userRatingCount,
    coverImage: undefined,
  }
}

export default function PlaceSearchForm({ onAddModule }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [editorNote, setEditorNote] = useState('')
  const [noteError, setNoteError] = useState('')
  const [usedFallback, setUsedFallback] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    setLoading(true)
    setError('')
    setSelected(null)
    setResults([])
    setUsedFallback(false)

    if (!API_KEY) {
      setResults(seedSearch(q))
      setUsedFallback(true)
      setLoading(false)
      return
    }

    try {
      const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.formattedAddress,places.types,places.rating,places.userRatingCount',
        },
        body: JSON.stringify({ textQuery: q + ' Chicago' }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const mapped = (data.places ?? []).slice(0, 10).map(placesApiResultToResult)
      if (mapped.length === 0) {
        setResults(seedSearch(q))
        setUsedFallback(true)
      } else {
        setResults(mapped)
      }
    } catch {
      setError('Search unavailable — try a different term')
      setResults(seedSearch(q))
      setUsedFallback(true)
    }

    setLoading(false)
  }

  function handleSelect(result) {
    setSelected(result)
    setEditorNote('')
    setNoteError('')
  }

  function handleConfirm() {
    if (!editorNote.trim()) {
      setNoteError('Editor note is required')
      return
    }
    const placeId = selected.id ?? selected.placeId ?? 'place-' + Date.now()
    onAddModule({
      type: 'place',
      placeId,
      name: selected.name,
      address: selected.address,
      neighborhood: selected.neighborhood,
      category: selected.category,
      rating: selected.rating,
      reviewCount: selected.reviewCount,
      coverImage: selected.coverImage,
      editorNote: editorNote.trim(),
    })
    setSelected(null)
    setEditorNote('')
    setResults([])
    setQuery('')
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.searchRow} onSubmit={handleSearch}>
        <input
          className={styles.input}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a place in Chicago…"
        />
        <button type="submit" className={styles.searchBtn} disabled={loading}>
          {loading ? '…' : 'Search'}
        </button>
      </form>

      {loading && <p className={styles.loadingNote} aria-live="polite">Searching…</p>}
      {error && <p className={styles.error}>{error}</p>}
      {usedFallback && !error && results.length > 0 && (
        <p className={styles.fallbackNote}>Showing local results — live search unavailable</p>
      )}

      {results.length > 0 && !selected && (
        <ul className={styles.resultsList}>
          {results.map((r, i) => (
            <li key={r.id ?? r.placeId ?? i} className={styles.result}>
              <div className={styles.resultInfo}>
                <span className={styles.resultName}>{r.name}</span>
                {r.address && <span className={styles.resultAddress}>{r.address}</span>}
                {r.category && <span className={styles.resultCategory}>{r.category}</span>}
              </div>
              <button
                type="button"
                className={styles.addBtn}
                onClick={() => handleSelect(r)}
              >
                Add to guide
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className={styles.notePanel}>
          <p className={styles.notePanelTitle}>Adding: <strong>{selected.name}</strong></p>
          <textarea
            className={styles.noteInput}
            value={editorNote}
            onChange={(e) => { setEditorNote(e.target.value); setNoteError('') }}
            placeholder="Why did you include this place? (required)"
            rows={3}
          />
          {noteError && <p className={styles.noteError}>{noteError}</p>}
          <div className={styles.noteActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setSelected(null)}>
              ← Back to results
            </button>
            <button type="button" className={styles.confirmBtn} onClick={handleConfirm}>
              Add to guide
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
