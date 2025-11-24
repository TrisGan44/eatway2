import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface AppLayoutProps {
  onLogout: () => void
}

export default function AppLayout({ onLogout }: AppLayoutProps) {
  const [search, setSearch] = useState('')

  return (
    <div className="app-shell">
      <Sidebar onLogout={onLogout} />
      <div className="app-shell__content">
        <Topbar userName="Admin" email="admin@gmail.com" searchValue={search} onSearchChange={setSearch} />
        <main className="app-shell__main">
          <Outlet context={{ search }} />
        </main>
      </div>
    </div>
  )
}
