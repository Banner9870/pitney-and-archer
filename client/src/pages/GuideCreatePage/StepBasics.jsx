import { useState } from 'react'
import { useAppContext } from '../../context/AppContext.jsx'
import { BADGES, COVER_PHOTOS } from '../../data/seed.js'
import styles from './StepBasics.module.css'

const FALLBACK_NEIGHBORHOODS = [
  'Andersonville', 'Bronzeville', 'Humboldt Park', 'Hyde Park',
  'Lincoln Square', 'Logan Square', 'Pilsen', 'Wicker Park',
]

export default function StepBasics({ guideData, onNext }) {
  const { state } = useAppContext()

  const [title, setTitle] = useState(guideData.title || '')
  const [description, setDescription] = useState(guideData.description || '')
  const [neighborhood, setNeighborhood] = useState(guideData.neighborhood || '')
  const [badges, setBadges] = useState(guideData.badges || [])
  const [coverImage, setCoverImage] = useState(guideData.coverImage || '')
  const [privacy, setPrivacy] = useState(guideData.privacy || 'public')

  const neighborhoods = state.communityAreas.length > 0
    ? state.communityAreas.map((a) => a.name).sort()
    : FALLBACK_NEIGHBORHOODS

  const canContinue = title.trim().length > 0 && neighborhood && badges.length > 0 && coverImage

  function toggleBadge(badge) {
    setBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!canContinue) return
    onNext({ title: title.trim(), description: description.trim(), neighborhood, badges, coverImage, privacy })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>Create a guide</h1>

      {/* Title */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="guide-title">
          Title <span className={styles.required}>*</span>
        </label>
        <input
          id="guide-title"
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="Give your guide a title"
          autoFocus
        />
        <span className={styles.charCount}>{title.length} / 100</span>
      </div>

      {/* Description */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="guide-desc">
          Description <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="guide-desc"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={280}
          placeholder="What's this guide about?"
          rows={3}
        />
        <span className={styles.charCount}>{description.length} / 280</span>
      </div>

      {/* Neighborhood */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="guide-neighborhood">
          Neighborhood <span className={styles.required}>*</span>
        </label>
        <select
          id="guide-neighborhood"
          className={styles.select}
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
        >
          <option value="">Select a neighborhood</option>
          {neighborhoods.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Badges */}
      <div className={styles.field}>
        <label className={styles.label}>
          Badges <span className={styles.required}>*</span>
          <span className={styles.optional}> — pick at least one</span>
        </label>
        <div className={styles.badgeGrid}>
          {BADGES.map((badge) => (
            <button
              key={badge}
              type="button"
              className={`${styles.badge} ${badges.includes(badge) ? styles.badgeActive : ''}`}
              onClick={() => toggleBadge(badge)}
              aria-pressed={badges.includes(badge)}
            >
              {badge}
            </button>
          ))}
        </div>
      </div>

      {/* Cover photo */}
      <div className={styles.field}>
        <label className={styles.label}>
          Cover photo <span className={styles.required}>*</span>
        </label>
        <div className={styles.photoGrid}>
          {COVER_PHOTOS.map((url) => (
            <button
              key={url}
              type="button"
              className={`${styles.photoThumb} ${coverImage === url ? styles.photoSelected : ''}`}
              onClick={() => setCoverImage(url)}
              aria-pressed={coverImage === url}
            >
              <img src={url} alt="" />
              {coverImage === url && <span className={styles.photoCheck}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className={styles.field}>
        <label className={styles.label}>Privacy</label>
        <div className={styles.radioGroup}>
          {[
            { value: 'private', label: 'Private', desc: 'Only you can see this' },
            { value: 'friends', label: 'Friends', desc: 'Shareable via link' },
            { value: 'public', label: 'Public', desc: 'Submitted for review before appearing in feed' },
          ].map(({ value, label, desc }) => (
            <label key={value} className={`${styles.radioLabel} ${privacy === value ? styles.radioActive : ''}`}>
              <input
                type="radio"
                name="privacy"
                value={value}
                checked={privacy === value}
                onChange={() => setPrivacy(value)}
                className={styles.radioInput}
              />
              <div className={styles.radioContent}>
                <span className={styles.radioTitle}>{label}</span>
                <span className={styles.radioDesc}>{desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Continue button */}
      <div className={styles.actions}>
        <div
          className={styles.tooltipWrapper}
          title={!canContinue ? 'Fill in required fields to continue' : ''}
        >
          <button
            type="submit"
            className={styles.continueBtn}
            disabled={!canContinue}
          >
            Continue to modules →
          </button>
        </div>
      </div>
    </form>
  )
}
