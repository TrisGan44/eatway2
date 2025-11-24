import { NavLink } from 'react-router-dom'

import { navigationLinks, systemIcons } from '../../data/mock'
import brandText from '../../assets/images/EATWAY_text.png'
import logoSmall from '../../assets/images/logo_small.png'

interface SidebarProps {
  onLogout: () => void
}

export default function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src={brandText} alt="Eatway" className="sidebar__brand-text" />
        <img src={logoSmall} alt="Maskot Eatway" className="sidebar__brand-icon" />
      </div>
      <nav className="sidebar__nav">
        {navigationLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            <img src={link.icon} alt="" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="sidebar__logout" onClick={onLogout}>
        <img src={systemIcons.logout} alt="" />
        Logout
      </button>
    </aside>
  )
}
