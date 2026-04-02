import { useState } from 'react'
import { useAppContext } from '../../../context/AppContext.jsx'
import styles from './ArticlePickerForm.module.css'

const ALLOWED_DOMAINS = ['chicago.suntimes.com', 'wbez.org']

function inferSource(url) {
  if (url.includes('suntimes.com')) return 'suntimes'
  if (url.includes('wbez.org')) return 'wbez'
  return 'unknown'
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

export default function ArticlePickerForm({ onAddModule }) {
  const { state } = useAppContext()
  const [tab, setTab] = useState('recent')
  const [pastedUrl, setPastedUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [editorNote, setEditorNote] = useState('')

  function handleSelectArticle(article) {
    setSelectedArticle(article)
    setEditorNote('')
  }

  function handleConfirm() {
    onAddModule({
      type: 'article',
      title: selectedArticle.title,
      summary: selectedArticle.summary ?? '',
      source: selectedArticle.source,
      publishedAt: selectedArticle.publishedAt,
      url: selectedArticle.url,
      editorNote: editorNote.trim(),
    })
    setSelectedArticle(null)
    setEditorNote('')
    setPastedUrl('')
  }

  function handlePasteAdd() {
    const url = pastedUrl.trim()
    const allowed = ALLOWED_DOMAINS.some((d) => url.includes(d))
    if (!allowed) {
      setUrlError('Paste a URL from chicago.suntimes.com or wbez.org')
      return
    }
    setUrlError('')
    const cached = state.rssArticles.find((a) => a.url === url)
    if (cached) {
      setSelectedArticle(cached)
    } else {
      const source = inferSource(url)
      setSelectedArticle({
        title: 'Article from ' + (source === 'suntimes' ? 'Chicago Sun-Times' : source === 'wbez' ? 'WBEZ' : 'unknown source'),
        summary: '',
        source,
        publishedAt: new Date().toISOString(),
        url,
      })
    }
    setEditorNote('')
  }

  if (selectedArticle) {
    return (
      <div className={styles.notePanel}>
        <p className={styles.notePanelTitle}>
          Adding: <strong>{selectedArticle.title}</strong>
        </p>
        <textarea
          className={styles.noteInput}
          value={editorNote}
          onChange={(e) => setEditorNote(e.target.value)}
          placeholder="Why did you include this article? (optional)"
          rows={3}
        />
        <div className={styles.noteActions}>
          <button type="button" className={styles.cancelBtn} onClick={() => setSelectedArticle(null)}>
            ← Back
          </button>
          <button type="button" className={styles.confirmBtn} onClick={handleConfirm}>
            Add to guide
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'recent' ? styles.tabActive : ''}`}
          onClick={() => setTab('recent')}
        >
          Recent articles
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'url' ? styles.tabActive : ''}`}
          onClick={() => setTab('url')}
        >
          Paste a URL
        </button>
      </div>

      {tab === 'recent' && (
        <div className={styles.articleList}>
          {state.rssArticles.length === 0 && (
            <p className={styles.empty}>No recent articles loaded. Try pasting a URL instead.</p>
          )}
          {state.rssArticles.map((article, i) => (
            <div key={article.url ?? i} className={styles.articleRow}>
              <div className={styles.articleInfo}>
                <span className={styles.articleTitle}>{article.title}</span>
                <span className={styles.articleMeta}>
                  {article.source === 'suntimes' ? 'Chicago Sun-Times' : 'WBEZ'}
                  {article.publishedAt && ' · ' + formatDate(article.publishedAt)}
                </span>
              </div>
              <button
                type="button"
                className={styles.addBtn}
                onClick={() => handleSelectArticle(article)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'url' && (
        <div className={styles.urlPanel}>
          <input
            className={styles.urlInput}
            type="url"
            value={pastedUrl}
            onChange={(e) => { setPastedUrl(e.target.value); setUrlError('') }}
            placeholder="https://chicago.suntimes.com/… or https://wbez.org/…"
          />
          {urlError && <p className={styles.urlError}>{urlError}</p>}
          <button type="button" className={styles.addUrlBtn} onClick={handlePasteAdd}>
            Add
          </button>
        </div>
      )}
    </div>
  )
}
