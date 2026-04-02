import { useRef } from 'react'
import styles from './ModuleListPanel.module.css'

const TYPE_ICONS = {
  place: '📍',
  article: '📰',
  product: '🛍️',
  event: '📅',
  post: '✏️',
  playlist: '🎵',
}

function getPreview(module) {
  switch (module.type) {
    case 'place': return module.name
    case 'article': return module.title
    case 'product': return module.name
    case 'event': return module.name
    case 'post': return module.body?.slice(0, 40) + (module.body?.length > 40 ? '…' : '')
    case 'playlist': return module.title
    default: return module.type
  }
}

export default function ModuleListPanel({ modules, onReorder, onRemove }) {
  const dragItemRef = useRef(null)
  const dragOverRef = useRef(null)

  function handleDragStart(i) {
    dragItemRef.current = i
  }

  function handleDragEnter(i) {
    dragOverRef.current = i
  }

  function handleDragEnd() {
    const from = dragItemRef.current
    const to = dragOverRef.current
    if (from === null || to === null || from === to) return
    const newOrder = [...modules]
    const [moved] = newOrder.splice(from, 1)
    newOrder.splice(to, 0, moved)
    onReorder(newOrder)
    dragItemRef.current = null
    dragOverRef.current = null
  }

  function moveUp(i) {
    if (i === 0) return
    const newOrder = [...modules]
    ;[newOrder[i - 1], newOrder[i]] = [newOrder[i], newOrder[i - 1]]
    onReorder(newOrder)
  }

  function moveDown(i) {
    if (i === modules.length - 1) return
    const newOrder = [...modules]
    ;[newOrder[i], newOrder[i + 1]] = [newOrder[i + 1], newOrder[i]]
    onReorder(newOrder)
  }

  if (modules.length === 0) {
    return (
      <div className={styles.empty}>
        <span>No modules yet — add one above</span>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      <p className={styles.listHeader}>{modules.length} module{modules.length !== 1 ? 's' : ''}</p>
      {modules.map((mod, i) => (
        <div
          key={i}
          className={styles.item}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragEnter={() => handleDragEnter(i)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
        >
          <span className={styles.dragHandle} title="Drag to reorder">⠿</span>
          <span className={styles.icon}>{TYPE_ICONS[mod.type] ?? '📦'}</span>
          <span className={styles.preview}>{getPreview(mod)}</span>
          <div className={styles.mobileArrows}>
            <button
              type="button"
              className={styles.arrowBtn}
              onClick={() => moveUp(i)}
              disabled={i === 0}
              aria-label="Move up"
            >↑</button>
            <button
              type="button"
              className={styles.arrowBtn}
              onClick={() => moveDown(i)}
              disabled={i === modules.length - 1}
              aria-label="Move down"
            >↓</button>
          </div>
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => onRemove(i)}
            aria-label="Remove module"
          >×</button>
        </div>
      ))}
    </div>
  )
}
