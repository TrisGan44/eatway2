export interface Product {
  id: number
  name: string
  description: string
  price: string
  stock: number
  image: string
}

export interface Account {
  id: number
  name: string
  email: string
  username: string
  password: string
  phone: string
  role: string
  image: string
}

export interface OverviewItem {
  id: string
  label: string
  value: string
  helper: string
  icon: string
  tone?: 'light' | 'dark'
}

export interface RevenuePoint {
  label: string
  value: number
}

export interface NavLinkItem {
  label: string
  path: string
  icon: string
}

export interface CashierOrder {
  id: number
  name: string
  price: string
  totalProducts: number
  totalPrice: string
  status: 'waiting' | 'processing'
  image: string
}

export interface CashierOrderItem {
  id: number
  name: string
  price: string
  quantity: number
  image: string
}

export interface CashierCustomer {
  name: string
  phone: string
  address: string
}

export interface CashierOrderDetail {
  status: string
  customer: CashierCustomer
  items: CashierOrderItem[]
  paymentMethod: string
  paymentFile: {
    name: string
    status: string
  }
  totals: {
    amount: string
    productCount: string
    date: string
  }
}
