import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'

import AppLayout from './components/layout/AppLayout'
import CashierLayout from './components/cashier/CashierLayout'
import './App.css'
import AccountFormPage from './pages/AccountFormPage'
import AccountsPage from './pages/AccountsPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import ProductFormPage from './pages/ProductFormPage'
import ProductsPage from './pages/ProductsPage'
import ReportsPage from './pages/ReportsPage'
import CashierOrdersPage from './pages/cashier/CashierOrdersPage'
import CashierProcessingPage from './pages/cashier/CashierProcessingPage'
import CashierOrderFormPage from './pages/cashier/CashierOrderFormPage'
import { loginUser, type LoginResponse } from './api/users'

type Role = 'admin' | 'cashier'

interface LoginCredentials {
  username: string
  password: string
}

const ROLE_STORAGE_KEY = 'eatway:role'
const TOKEN_STORAGE_KEY = 'eatway:token'

function normalizeRole(role?: string | null): Role | null {
  if (!role) return null
  const normalizedRole = role.toLowerCase()
  if (normalizedRole === 'admin') return 'admin'
  if (normalizedRole === 'cashier' || normalizedRole === 'kasir') return 'cashier'
  return null
}

function App() {
  const [role, setRole] = useState<Role | null>(() => {
    const storedRole = localStorage.getItem(ROLE_STORAGE_KEY)
    return storedRole === 'admin' || storedRole === 'cashier' ? storedRole : null
  })
  const [, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY))

  const persistSession = (nextRole: Role, response?: LoginResponse) => {
    setRole(nextRole)
    localStorage.setItem(ROLE_STORAGE_KEY, nextRole)

    if (response?.accessToken) {
      setToken(response.accessToken)
      localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken)
    } else {
      setToken(null)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }

  const handleLogin = async (credentials: LoginCredentials, expectedRole: Role) => {
    const response = await loginUser(credentials.username, credentials.password)
    const detectedRole = normalizeRole(response?.user?.role) ?? expectedRole

    persistSession(detectedRole, response)
  }

  const handleLogout = () => {
    setRole(null)
    setToken(null)
    localStorage.removeItem(ROLE_STORAGE_KEY)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  return (
    <BrowserRouter>
      <AppRoutes
        role={role}
        onAdminLogin={(credentials) => handleLogin(credentials, 'admin')}
        onCashierLogin={(credentials) => handleLogin(credentials, 'cashier')}
        onLogout={handleLogout}
      />
    </BrowserRouter>
  )
}

interface AppRoutesProps {
  role: Role | null
  onAdminLogin: (payload: LoginCredentials) => Promise<void>
  onCashierLogin: (payload: LoginCredentials) => Promise<void>
  onLogout: () => void
}

function AppRoutes({ role, onAdminLogin, onCashierLogin, onLogout }: AppRoutesProps) {
  const navigate = useNavigate()
  const fallbackPath = role === 'cashier' ? '/cashier' : role === 'admin' ? '/' : '/login'

  return (
    <Routes>
      <Route
        path='/login'
        element={
          role === 'admin' ? (
            <Navigate to='/' replace />
          ) : role === 'cashier' ? (
            <Navigate to='/cashier' replace />
          ) : (
            <LoginPage
              onLogin={onAdminLogin}
              title='Login Admin'
              subtitle='Masuk untuk mengelola dashboard Eatway'
              switchLabel='Masuk sebagai Kasir'
              onSwitch={() => navigate('/cashier/login')}
            />
          )
        }
      />
      <Route
        path='/cashier/login'
        element={
          role === 'cashier' ? (
            <Navigate to='/cashier' replace />
          ) : role === 'admin' ? (
            <Navigate to='/' replace />
          ) : (
            <LoginPage
              onLogin={onCashierLogin}
              title='Login Kasir'
              subtitle='Masuk untuk mengelola pesanan Eatway'
              submitLabel='Masuk'
              switchLabel='Masuk sebagai Admin'
              onSwitch={() => navigate('/login')}
            />
          )
        }
      />
      <Route
        path='/'
        element={
          role === 'admin' ? <AppLayout onLogout={onLogout} /> : <Navigate to={fallbackPath} replace />
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path='products' element={<ProductsPage />} />
        <Route path='products/add' element={<ProductFormPage mode='add' />} />
        <Route path='products/:id/edit' element={<ProductFormPage mode='edit' />} />
        <Route path='accounts' element={<AccountsPage />} />
        <Route path='accounts/add' element={<AccountFormPage mode='add' />} />
        <Route path='accounts/:id/edit' element={<AccountFormPage mode='edit' />} />
        <Route path='reports' element={<ReportsPage />} />
      </Route>
      <Route
        path='/cashier'
        element={
          role === 'cashier' ? (
            <CashierLayout onLogout={onLogout} />
          ) : (
            <Navigate to={fallbackPath} replace />
          )
        }
      >
        <Route index element={<CashierOrdersPage />} />
        <Route path='process' element={<CashierProcessingPage />} />
        <Route path='order/:id' element={<CashierOrderFormPage />} />
      </Route>
      <Route path='*' element={<Navigate to={fallbackPath} replace />} />
    </Routes>
  )
}

export default App
