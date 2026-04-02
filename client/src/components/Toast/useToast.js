import { useState, useCallback } from 'react'

export default function useToast() {
  const [toast, setToast] = useState({ message: '', visible: false })

  const showToast = useCallback((message, duration = 4000) => {
    setToast({ message, visible: true })
    setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }))
    }, duration)
  }, [])

  return { message: toast.message, visible: toast.visible, showToast }
}
