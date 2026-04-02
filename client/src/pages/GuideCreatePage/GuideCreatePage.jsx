import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext.jsx'
import useToast from '../../components/Toast/useToast.js'
import Toast from '../../components/Toast/Toast.jsx'
import StepBasics from './StepBasics.jsx'
import StepModules from './StepModules.jsx'
import StepReview from './StepReview.jsx'
import styles from './GuideCreatePage.module.css'

const STEPS = [
  { label: 'Basics' },
  { label: 'Modules' },
  { label: 'Review' },
]

export default function GuideCreatePage() {
  const navigate = useNavigate()
  const { dispatch } = useAppContext()
  const { message, visible, showToast, dismiss } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [guideData, setGuideData] = useState({
    title: '',
    description: '',
    neighborhood: '',
    badges: [],
    coverImage: '',
    privacy: 'public',
    modules: [],
  })

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
      createdAt: new Date().toISOString(),
      likeCount: 0,
      helpfulCount: 0,
      modules: finalData.modules,
      collaborators: [],
    }
    dispatch({ type: 'ADD_GUIDE', payload: guide })

    if (finalData.privacy === 'public') {
      showToast('Your guide has been submitted for review. It will appear in the feed shortly.')
    }

    setTimeout(() => {
      showToast('Your guide has been matched to ' + finalData.neighborhood + '. Neighborhood matching is still being refined.')
    }, 1500)

    navigate('/guide/' + newId, { state: { isNew: true } })
  }

  return (
    <>
      <div className={styles.page}>
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
          <StepReview guideData={guideData} onBack={onBack} onPublish={onPublish} />
        )}
      </div>

      <Toast message={message} visible={visible} onDismiss={dismiss} />
    </>
  )
}
