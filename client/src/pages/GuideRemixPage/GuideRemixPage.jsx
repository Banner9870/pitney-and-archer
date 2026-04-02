import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext.jsx'
import useToast from '../../components/Toast/useToast.js'
import Toast from '../../components/Toast/Toast.jsx'
import StepBasics from '../GuideCreatePage/StepBasics.jsx'
import StepModules from '../GuideCreatePage/StepModules.jsx'
import StepReview from '../GuideCreatePage/StepReview.jsx'
import styles from './GuideRemixPage.module.css'

const STEPS = [
  { label: 'Basics' },
  { label: 'Modules' },
  { label: 'Review' },
]

export default function GuideRemixPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const { message, visible, showToast, dismiss } = useToast()

  const original = state.guides.find((g) => g.id === id)
  const originalAuthor = original
    ? state.users.find((u) => u.id === original.authorId)
    : null

  // All hooks must be called unconditionally — initial state handles missing original
  const [currentStep, setCurrentStep] = useState(1)
  const [guideData, setGuideData] = useState(() => {
    if (!original) {
      return {
        title: '',
        description: '',
        neighborhood: '',
        badges: [],
        coverImage: '',
        privacy: 'public',
        modules: [],
      }
    }
    return {
      title: `My remix of ${original.title}`,
      description: '',
      neighborhood: original.neighborhood ?? '',
      badges: [...(original.badges ?? [])],
      coverImage: original.coverImage ?? '',
      privacy: 'public',
      modules: JSON.parse(JSON.stringify(original.modules ?? [])),
    }
  })

  useEffect(() => {
    if (!original) navigate('/feed', { replace: true })
  }, [original, navigate])

  if (!original) return null

  function onNext(partial) {
    setGuideData((prev) => ({ ...prev, ...partial }))
    setCurrentStep((s) => s + 1)
  }

  function onBack(partial) {
    if (partial) setGuideData((prev) => ({ ...prev, ...partial }))
    setCurrentStep((s) => s - 1)
  }

  function onPublish(finalData) {
    const newId = 'session-' + Date.now()
    const guide = {
      id: newId,
      title: finalData.title,
      description: finalData.description,
      neighborhood: finalData.neighborhood,
      additionalNeighborhoods: [],
      badges: finalData.badges,
      coverImage: finalData.coverImage,
      privacy: finalData.privacy,
      authorId: 'user-alex',
      isSessionCreated: true,
      remixOf: original.id,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      helpfulCount: 0,
      modules: finalData.modules,
      collaborators: [],
    }
    dispatch({ type: 'ADD_GUIDE', payload: guide })
    navigate('/guide/' + newId, { state: { isNew: true } })
  }

  return (
    <>
      {/* Persistent attribution banner — not dismissible */}
      <div className={styles.attributionBanner}>
        Remixing &ldquo;{original.title}&rdquo; by @{originalAuthor?.handle ?? 'unknown'}
      </div>

      <div className={styles.page}>
        {/* Progress bar */}
        <div className={styles.progressBar}>
          {STEPS.map((step, i) => {
            const num = i + 1
            const active = num === currentStep
            const done = num < currentStep
            return (
              <div
                key={step.label}
                className={`${styles.step} ${active ? styles.active : ''} ${done ? styles.done : ''}`}
              >
                <span className={styles.stepNum}>{done ? '✓' : num}</span>
                <span className={styles.stepLabel}>{step.label}</span>
              </div>
            )
          })}
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {currentStep === 1 && (
          <StepBasics guideData={guideData} onNext={onNext} />
        )}
        {currentStep === 2 && (
          <StepModules guideData={guideData} onNext={onNext} onBack={onBack} />
        )}
        {currentStep === 3 && (
          <>
            <StepReview guideData={guideData} onBack={onBack} onPublish={onPublish} />
            <div className={styles.reviewAttribution}>
              Saving this remix will credit{' '}
              <strong>&ldquo;{original.title}&rdquo;</strong>
              {originalAuthor && (
                <> by <strong>@{originalAuthor.handle}</strong></>
              )}
            </div>
          </>
        )}
      </div>

      <Toast message={message} visible={visible} onDismiss={dismiss} />
    </>
  )
}
