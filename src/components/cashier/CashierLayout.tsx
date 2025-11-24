import { Outlet } from 'react-router-dom'

import CashierSidebar from './CashierSidebar'
import Topbar from '../layout/Topbar'

interface CashierLayoutProps {
  onLogout: () => void
}

export default function CashierLayout({ onLogout }: CashierLayoutProps) {
  return (
    <div className="app-shell">
      <CashierSidebar onLogout={onLogout} />
      <div className="app-shell__content">
        <Topbar userName="Kasir" email="cashier@eatway.com" />
        <main className="app-shell__main cashier-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
