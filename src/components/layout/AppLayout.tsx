import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface AppLayoutProps {
  onLogout: () => void
}

export default function AppLayout({ onLogout }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <Sidebar onLogout={onLogout} />
      <div className="app-shell__content">
        <Topbar userName="Admin" email="admin@gmail.com" />
        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
