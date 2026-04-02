import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '16px',
      padding: '32px',
      textAlign: 'center',
    }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '3rem', color: 'var(--black)' }}>
        404 — Page not found
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--gray-500)' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/feed"
        style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--red)', textDecoration: 'underline' }}
      >
        Go back to the feed →
      </Link>
    </div>
  )
}
