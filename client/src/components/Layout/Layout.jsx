import styles from './Layout.module.css'

export default function Layout({ children, sidebar = false }) {
  return (
    <div className={`${styles.layout} ${sidebar ? styles.withSidebar : ''}`}>
      {children}
    </div>
  )
}
