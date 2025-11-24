import heroChef from '../../assets/images/hero-chef.png'

interface WelcomeBannerProps {
  name: string
  subtitle: string
}

export default function WelcomeBanner({ name, subtitle }: WelcomeBannerProps) {
  return (
    <div className="welcome-banner">
      <div>
        <p className="welcome-banner__title">Hi, {name}</p>
        <p className="welcome-banner__subtitle">{subtitle}</p>
      </div>
      <img src={heroChef} alt="Chef" />
    </div>
  )
}
