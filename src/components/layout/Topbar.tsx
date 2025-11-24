import SearchInput from '../common/SearchInput'
import heroChef from '../../assets/images/hero-chef.png'

interface TopbarProps {
  userName: string
  email: string
}

export default function Topbar({ userName, email }: TopbarProps) {
  return (
    <header className="topbar">
      <SearchInput />
      <div className="topbar__actions">
        <button className="icon-button" aria-label="notifications">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2a6 6 0 0 1 6 6v3.59l1.71 3.42A1 1 0 0 1 18.83 16H5.17a1 1 0 0 1-.88-1.49L6 11.59V8a6 6 0 0 1 6-6zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"
              fill="currentColor"
            />
          </svg>
        </button>
        <div className="user-chip">
          <img src={heroChef} alt={userName} />
          <div>
            <strong>{userName}</strong>
            <span>{email}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
