import styles from './HingePromptCard.module.css'

export default function HingePromptCard({ prompt, answer }) {
  return (
    <div className={styles.card}>
      <p className={styles.prompt}>{prompt}</p>
      <p className={styles.answer}>{answer}</p>
    </div>
  )
}
