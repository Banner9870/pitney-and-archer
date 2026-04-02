import { useState } from 'react'
import styles from './PlaylistForm.module.css'

const SPOTIFY_RE = /open\.spotify\.com\/(playlist|album|track)\/([A-Za-z0-9]+)/
const BANDCAMP_RE = /bandcamp\.com/

function toSpotifyEmbed(url) {
  const m = url.match(SPOTIFY_RE)
  if (!m) return null
  return `https://open.spotify.com/embed/${m[1]}/${m[2]}`
}

function validateUrl(platform, url) {
  if (!url.trim()) return null
  if (platform === 'spotify') {
    return SPOTIFY_RE.test(url) ? 'valid' : 'invalid'
  }
  if (platform === 'bandcamp') {
    return BANDCAMP_RE.test(url) ? 'valid' : 'invalid'
  }
  return null
}

export default function PlaylistForm({ onAddModule }) {
  const [platform, setPlatform] = useState('spotify')
  const [embedUrl, setEmbedUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editorNote, setEditorNote] = useState('')
  const [errors, setErrors] = useState({})

  const urlStatus = validateUrl(platform, embedUrl)
  const previewUrl = platform === 'spotify' && urlStatus === 'valid' ? toSpotifyEmbed(embedUrl) : null

  function handlePlatformChange(p) {
    setPlatform(p)
    setEmbedUrl('')
    setErrors({})
  }

  function handleSubmit() {
    const e = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!embedUrl.trim()) {
      e.embedUrl = 'Paste a valid Spotify or Bandcamp URL'
    } else if (urlStatus === 'invalid') {
      e.embedUrl = 'Paste a valid Spotify or Bandcamp URL'
    }
    if (Object.keys(e).length > 0) { setErrors(e); return }

    const finalEmbedUrl = platform === 'spotify' ? toSpotifyEmbed(embedUrl) : embedUrl
    onAddModule({
      type: 'playlist',
      title: title.trim(),
      description: description.trim() || undefined,
      platform,
      embedUrl: finalEmbedUrl,
      editorNote: editorNote.trim(),
    })
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Platform</label>
        <div className={styles.platformToggle}>
          {['spotify', 'bandcamp'].map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.platformBtn} ${platform === p ? styles.platformActive : ''}`}
              onClick={() => handlePlatformChange(p)}
            >
              {p === 'spotify' ? '🎵 Spotify' : '🎸 Bandcamp'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          {platform === 'spotify' ? 'Spotify URL' : 'Bandcamp URL'} *
        </label>
        <input
          className={`${styles.input} ${errors.embedUrl ? styles.inputError : ''}`}
          type="url"
          value={embedUrl}
          onChange={(e) => { setEmbedUrl(e.target.value); setErrors((p) => ({ ...p, embedUrl: '' })) }}
          placeholder={
            platform === 'spotify'
              ? 'https://open.spotify.com/playlist/…'
              : 'https://artist.bandcamp.com/album/…'
          }
        />
        {errors.embedUrl && <span className={styles.err}>{errors.embedUrl}</span>}
        {urlStatus === 'valid' && (
          <span className={styles.urlValid}>✓ Valid URL</span>
        )}
      </div>

      {/* Live Spotify preview */}
      {previewUrl && (
        <div className={styles.previewWrapper}>
          <iframe
            src={previewUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className={styles.previewFrame}
            title="Spotify preview"
          />
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>Title *</label>
        <input
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: '' })) }}
          placeholder="Playlist title"
        />
        {errors.title && <span className={styles.err}>{errors.title}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description <span className={styles.optional}>(optional)</span></label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this playlist"
          rows={2}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Editor note <span className={styles.optional}>(optional)</span></label>
        <textarea
          className={styles.textarea}
          value={editorNote}
          onChange={(e) => setEditorNote(e.target.value)}
          placeholder="Why are you including this playlist?"
          rows={2}
        />
      </div>

      <button type="button" className={styles.addBtn} onClick={handleSubmit}>
        Add to guide
      </button>
    </div>
  )
}
