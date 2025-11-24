import { useState, type FormEvent } from 'react'

import Button from '../components/common/Button'
import { systemIcons } from '../data/mock'
import loginIllustration from '../assets/images/login-illustration.png'
import logoSmall from '../assets/images/logo_small.png'
import eatwayText from '../assets/images/EATWAY_text.png'

interface LoginCredentials {
  username: string
  password: string
}

interface LoginPageProps {
  onLogin: (payload: LoginCredentials) => Promise<void>
  title?: string
  subtitle?: string
  submitLabel?: string
  switchLabel?: string
  onSwitch?: () => void
}

export default function LoginPage({
  onLogin,
  title = 'Login',
  subtitle = 'Masuk untuk mengelola dashboard Eatway',
  submitLabel = 'Login',
  switchLabel,
  onSwitch,
}: LoginPageProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onLogin(credentials)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal login, coba lagi.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof LoginCredentials) => (value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="login-page">
      <div className="login-page__visual">
        <div className="login-page__mockup">
          <img src={loginIllustration} alt="Eatway dashboard" />
        </div>
      </div>
      <div className="login-page__form">
        <div className="login-logo">
          <img src={logoSmall} alt="Eatway mascot" className="login-logo__icon" />
          <div>
            <img src={eatwayText} alt="Eatway" className="login-logo__badge" />
            <p className="muted">Selamat Datang!</p>
          </div>
        </div>
        <h2 className="login-page__title">{title}</h2>
        <p className="login-page__subtitle">{subtitle}</p>
        <form onSubmit={handleSubmit}>
          <div className="input-with-icon">
            <img src={systemIcons.email} alt="Username" />
            <input
              type="text"
              placeholder="Username"
              required
              value={credentials.username}
              onChange={(event) => handleChange('username')(event.target.value)}
            />
          </div>
          <div className="input-with-icon">
            <img src={systemIcons.password} alt="Password" />
            <input
              type="password"
              placeholder="Password"
              required
              value={credentials.password}
              onChange={(event) => handleChange('password')(event.target.value)}
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </form>
        <p className="created-by">
          Created by <img src={eatwayText} alt="Eatway" className="created-by__logo" />
        </p>
        {switchLabel && onSwitch && (
          <button type="button" className="switch-login" onClick={onSwitch}>
            {switchLabel}
          </button>
        )}
      </div>
    </div>
  )
}
