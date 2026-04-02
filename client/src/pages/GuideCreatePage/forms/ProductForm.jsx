import { useState } from 'react'
import { COVER_PHOTOS } from '../../../data/seed.js'
import styles from './ProductForm.module.css'

export default function ProductForm({ onAddModule }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [whereToBuy, setWhereToBuy] = useState('')
  const [isMemberDeal, setIsMemberDeal] = useState(false)
  const [dealDescription, setDealDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [editorNote, setEditorNote] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!description.trim()) e.description = 'Description is required'
    if (!whereToBuy.trim()) e.whereToBuy = 'Where to get it is required'
    if (isMemberDeal && !dealDescription.trim()) e.dealDescription = 'Deal description is required'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onAddModule({
      type: 'product',
      name: name.trim(),
      description: description.trim(),
      price: price.trim() || undefined,
      whereToBuy: whereToBuy.trim(),
      isMemberDeal,
      dealDescription: isMemberDeal ? dealDescription.trim() : undefined,
      coverImage: coverImage || undefined,
      editorNote: editorNote.trim(),
    })
  }

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Name *</label>
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
          placeholder="Product name"
        />
        {errors.name && <span className={styles.err}>{errors.name}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description *</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: '' })) }}
          placeholder="Describe the product"
          rows={3}
        />
        {errors.description && <span className={styles.err}>{errors.description}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Price <span className={styles.optional}>(optional)</span></label>
        <input
          className={styles.input}
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. $18, $45–$60, Free"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Where to get it *</label>
        <input
          className={styles.input}
          type="text"
          value={whereToBuy}
          onChange={(e) => { setWhereToBuy(e.target.value); setErrors((p) => ({ ...p, whereToBuy: '' })) }}
          placeholder="Store name or URL"
        />
        {errors.whereToBuy && <span className={styles.err}>{errors.whereToBuy}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={isMemberDeal}
            onChange={(e) => setIsMemberDeal(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.toggleText}>★ CPM Member Deal</span>
        </label>
        {isMemberDeal && (
          <div className={styles.dealField}>
            <input
              className={styles.input}
              type="text"
              value={dealDescription}
              onChange={(e) => { setDealDescription(e.target.value); setErrors((p) => ({ ...p, dealDescription: '' })) }}
              placeholder="Deal description (e.g. 10% off with CPM membership)"
            />
            {errors.dealDescription && <span className={styles.err}>{errors.dealDescription}</span>}
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Photo <span className={styles.optional}>(optional)</span></label>
        <div className={styles.photoGrid}>
          {COVER_PHOTOS.map((url) => (
            <button
              key={url}
              type="button"
              className={`${styles.photoThumb} ${coverImage === url ? styles.photoSelected : ''}`}
              onClick={() => setCoverImage(coverImage === url ? '' : url)}
            >
              <img src={url} alt="" />
              {coverImage === url && <span className={styles.photoCheck}>✓</span>}
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
          placeholder="Why are you recommending this product?"
          rows={2}
        />
      </div>

      <button type="button" className={styles.addBtn} onClick={handleSubmit}>
        Add to guide
      </button>
    </div>
  )
}
