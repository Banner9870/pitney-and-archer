import { useEffect, useRef } from 'react'
import styles from './Toast.module.css'

export default function Toast({ message, visible, onDismiss }) {
  const timerRef = useRef(null)

  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(() => {
        if (onDismiss) onDismiss()
      }, 4000)
    }
    return () => clearTimeout(timerRef.current)
  }, [visible, onDismiss])

  if (!visible) return null

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {message}
    </div>
  )
}
