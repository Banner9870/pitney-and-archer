import { useState } from 'react'
import PlaceSearchForm from './forms/PlaceSearchForm.jsx'
import ArticlePickerForm from './forms/ArticlePickerForm.jsx'
import ProductForm from './forms/ProductForm.jsx'
import EventForm from './forms/EventForm.jsx'
import PostForm from './forms/PostForm.jsx'
import PlaylistForm from './forms/PlaylistForm.jsx'
import ModuleListPanel from './ModuleListPanel.jsx'
import styles from './StepModules.module.css'

const MODULE_TYPES = [
  { type: 'place',    label: 'Place',    icon: '📍' },
  { type: 'article',  label: 'Article',  icon: '📰' },
  { type: 'product',  label: 'Product',  icon: '🛍️' },
  { type: 'event',    label: 'Event',    icon: '📅' },
  { type: 'post',     label: 'Post',     icon: '✏️' },
  { type: 'playlist', label: 'Playlist', icon: '🎵' },
]

const FORM_COMPONENTS = {
  place:    PlaceSearchForm,
  article:  ArticlePickerForm,
  product:  ProductForm,
  event:    EventForm,
  post:     PostForm,
  playlist: PlaylistForm,
}

export default function StepModules({ guideData, onNext, onBack }) {
  const [modules, setModules] = useState(guideData.modules ?? [])
  const [activeFormType, setActiveFormType] = useState(null)

  function handleAddModule(module) {
    setModules((prev) => [...prev, module])
    setActiveFormType(null)
  }

  function handleReorder(newOrder) {
    setModules(newOrder)
  }

  function handleRemove(index) {
    setModules((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSelectType(type) {
    setActiveFormType(activeFormType === type ? null : type)
  }

  function handleContinue() {
    onNext({ modules })
  }

  const canContinue = modules.length > 0
  const ActiveForm = activeFormType ? FORM_COMPONENTS[activeFormType] : null

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Add modules</h1>

      <div className={styles.layout}>
        <div className={styles.builder}>
          {/* Module type selector */}
          <div className={styles.typeGrid}>
            {MODULE_TYPES.map(({ type, label, icon }) => (
              <button
                key={type}
                type="button"
                className={`${styles.typeBtn} ${activeFormType === type ? styles.typeBtnActive : ''}`}
                onClick={() => handleSelectType(type)}
              >
                <span className={styles.typeIcon}>{icon}</span>
                <span className={styles.typeLabel}>{label}</span>
              </button>
            ))}
          </div>

          {/* Active form */}
          {ActiveForm && (
            <div className={styles.formPanel}>
              <div className={styles.formPanelHeader}>
                <span className={styles.formPanelTitle}>
                  {MODULE_TYPES.find((t) => t.type === activeFormType)?.icon}{' '}
                  Add {MODULE_TYPES.find((t) => t.type === activeFormType)?.label}
                </span>
                <button
                  type="button"
                  className={styles.closeFormBtn}
                  onClick={() => setActiveFormType(null)}
                  aria-label="Close form"
                >×</button>
              </div>
              <div className={styles.formPanelBody}>
                <ActiveForm onAddModule={handleAddModule} />
              </div>
            </div>
          )}
        </div>

        <div className={styles.panel}>
          <ModuleListPanel
            modules={modules}
            onReorder={handleReorder}
            onRemove={handleRemove}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.nav}>
        <button type="button" className={styles.backLink} onClick={() => onBack()}>
          ← Back to basics
        </button>
        <div
          className={styles.tooltipWrapper}
          title={!canContinue ? 'Add at least one module to continue' : ''}
        >
          <button
            type="button"
            className={styles.continueBtn}
            disabled={!canContinue}
            onClick={handleContinue}
          >
            Review guide →
          </button>
        </div>
      </div>
    </div>
  )
}
