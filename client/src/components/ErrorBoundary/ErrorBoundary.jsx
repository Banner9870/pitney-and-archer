import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', fontFamily: 'var(--font-body)', padding: '32px' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--black)' }}>Something went wrong —{' '}
            <Link to="/feed" style={{ color: 'var(--red)', textDecoration: 'underline' }}>
              go back to the feed
            </Link>
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
