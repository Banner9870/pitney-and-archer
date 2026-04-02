import { useState } from 'react'
import { COVER_PHOTOS } from '../../../data/seed.js'
import styles from './PostForm.module.css'

export default function PostForm({ onAddModule }) {
  const [body, setBody] = useState('')
  const [photos, setPhotos] = useState([])
  const [editorNote, setEditorNote] = useState('')
  const [bodyError, setBodyError] = useState('')

  function togglePhoto(url) {
    setPhotos((prev) =>
      prev.includes(url)
        ? prev.filter((p) => p !== url)
        : prev.length < 3
          ? [...prev, url]
          : prev
    )
  }

  function handleSubmit() {
    if (!body.trim()) {
      setBodyError('Post body is required')
      return
    }
    onAddModule({
      type: 'post',
      body: body.trim(),
      isLong: body.trim().length > 300,
      photos,
      editorNote: editorNote.trim(),
    })
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Post body *</label>
        <textarea
          className={styles.textarea}
          value={body}
          onChange={(e) => { setBody(e.target.value); setBodyError('') }}
          placeholder="Write your post here…"
          rows={6}
        />
        <span className={styles.charCount}>{body.length} chars{body.length > 300 ? ' · will collapse with "Read more"' : ''}</span>
        {bodyError && <span className={styles.err}>{bodyError}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Photos <span className={styles.optional}>(optional, up to 3)</span>
        </label>
        {photos.length >= 3 && (
          <p className={styles.limitNote}>3 photos selected — deselect one to choose a different photo</p>
        )}
        <div className={styles.photoGrid}>
          {COVER_PHOTOS.map((url) => {
            const selected = photos.includes(url)
            const atLimit = photos.length >= 3 && !selected
            return (
              <button
                key={url}
                type="button"
                className={`${styles.photoThumb} ${selected ? styles.photoSelected : ''} ${atLimit ? styles.photoDisabled : ''}`}
                onClick={() => togglePhoto(url)}
                disabled={atLimit}
              >
                <img src={url} alt="" />
                {selected && <span className={styles.photoCheck}>✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Editor note <span className={styles.optional}>(optional)</span></label>
        <textarea
          className={styles.textarea}
          value={editorNote}
          onChange={(e) => setEditorNote(e.target.value)}
          placeholder="Context for this post…"
          rows={2}
        />
      </div>

      <button type="button" className={styles.addBtn} onClick={handleSubmit}>
        Add to guide
      </button>
    </div>
  )
}
