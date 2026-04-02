import { useState } from 'react'
import { useAppContext } from '../../../context/AppContext.jsx'
import { COVER_PHOTOS } from '../../../data/seed.js'
import styles from './EventForm.module.css'

const FALLBACK_NEIGHBORHOODS = [
  'Andersonville', 'Bronzeville', 'Humboldt Park', 'Hyde Park',
  'Lincoln Square', 'Logan Square', 'Pilsen', 'Wicker Park',
]

export default function EventForm({ onAddModule }) {
  const { state } = useAppContext()
  const [eventName, setEventName] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [editorNote, setEditorNote] = useState('')
  const [errors, setErrors] = useState({})

  const neighborhoods = state.communityAreas.length > 0
    ? state.communityAreas.map((a) => a.name).sort()
    : FALLBACK_NEIGHBORHOODS

  function validate() {
    const e = {}
    if (!eventName.trim()) e.eventName = 'Event name is required'
    if (!date.trim()) e.date = 'Date is required'
    if (!location.trim()) e.location = 'Location is required'
    if (!neighborhood) e.neighborhood = 'Neighborhood is required'
    if (!description.trim()) e.description = 'Description is required'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onAddModule({
      type: 'event',
      name: eventName.trim(),
      date: date.trim(),
      location: location.trim(),
      neighborhood,
      description: description.trim(),
      url: url.trim() || undefined,
      coverImage: coverImage || undefined,
      editorNote: editorNote.trim(),
    })
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Event name *</label>
        <input
          className={styles.input}
          type="text"
          value={eventName}
          onChange={(e) => { setEventName(e.target.value); setErrors((p) => ({ ...p, eventName: '' })) }}
          placeholder="Event name"
        />
        {errors.eventName && <span className={styles.err}>{errors.eventName}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Date *</label>
        <input
          className={styles.input}
          type="text"
          value={date}
          onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: '' })) }}
          placeholder='e.g. "Saturday April 4" or "Every Sunday"'
        />
        {errors.date && <span className={styles.err}>{errors.date}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Location *</label>
        <input
          className={styles.input}
          type="text"
          value={location}
          onChange={(e) => { setLocation(e.target.value); setErrors((p) => ({ ...p, location: '' })) }}
          placeholder="Venue name or address"
        />
        {errors.location && <span className={styles.err}>{errors.location}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Neighborhood *</label>
        <select
          className={styles.select}
          value={neighborhood}
          onChange={(e) => { setNeighborhood(e.target.value); setErrors((p) => ({ ...p, neighborhood: '' })) }}
        >
          <option value="">Select a neighborhood</option>
          {neighborhoods.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        {errors.neighborhood && <span className={styles.err}>{errors.neighborhood}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description *</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: '' })) }}
          placeholder="What's happening at this event?"
          rows={3}
        />
        {errors.description && <span className={styles.err}>{errors.description}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>URL <span className={styles.optional}>(optional)</span></label>
        <input
          className={styles.input}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Photo <span className={styles.optional}>(optional)</span></label>
        <div className={styles.photoGrid}>
          {COVER_PHOTOS.map((photoUrl) => (
            <button
              key={photoUrl}
              type="button"
              className={`${styles.photoThumb} ${coverImage === photoUrl ? styles.photoSelected : ''}`}
              onClick={() => setCoverImage(coverImage === photoUrl ? '' : photoUrl)}
            >
              <img src={photoUrl} alt="" />
              {coverImage === photoUrl && <span className={styles.photoCheck}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Editor note <span className={styles.optional}>(optional)</span></label>
        <textarea
          className={styles.textarea}
          value={editorNote}
          onChange={(e) => setEditorNote(e.target.value)}
          placeholder="Why are you recommending this event?"
          rows={2}
        />
      </div>

      <button type="button" className={styles.addBtn} onClick={handleSubmit}>
        Add to guide
      </button>
    </div>
  )
}
