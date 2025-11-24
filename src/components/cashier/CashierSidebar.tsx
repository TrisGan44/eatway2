import { NavLink } from 'react-router-dom'

import logoText from '../../assets/images/EATWAY_text.png'
import logoSmall from '../../assets/images/logo_small.png'
import { cashierNavigation, systemIcons } from '../../data/mock'

interface CashierSidebarProps {
  onLogout: () => void
}

export default function CashierSidebar({ onLogout }: CashierSidebarProps) {
  return (
    <aside className="cashier-sidebar">
      <div className="cashier-sidebar__brand">
        <img src={logoText} alt="Eatway" className="cashier-sidebar__logo" />
        <img src={logoSmall} alt="Maskot" className="cashier-sidebar__logo-icon" />
      </div>
      <nav className="cashier-sidebar__nav">
        {cashierNavigation.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `cashier-sidebar__link ${isActive ? 'is-active' : ''}`}
            end={link.path === '/cashier'}
          >
            <img src={link.icon} alt="" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="sidebar__logout" onClick={onLogout}>
        <img src={systemIcons.logout} alt="" /> Logout
      </button>
    </aside>
  )
}
