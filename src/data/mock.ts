import heroChef from '../assets/images/hero-chef.png'
import iconAccount from '../assets/images/icon-user.png'
import iconDashboard from '../assets/images/icon-dashboard.png'
import iconDelete from '../assets/images/icon-delete.png'
import iconEdit from '../assets/images/icon-edit.png'
import iconEye from '../assets/images/icon-view.png'
import iconIncome from '../assets/images/icon-income.png'
import iconLogout from '../assets/images/icon-logout.png'
import iconOrder from '../assets/images/icon-order.png'
import iconPassword from '../assets/images/icon-password.png'
import iconProduct from '../assets/images/icon-product.png'
import iconReport from '../assets/images/icon-report.png'
import iconEmail from '../assets/images/icon-email.png'
import pizzaImage from '../assets/images/pizza.png'
import pizzaMargherita from '../assets/images/pizza_margarita.png'

import type {
  Account,
  CashierOrder,
  CashierOrderDetail,
  NavLinkItem,
  OverviewItem,
  Product,
  RevenuePoint,
} from '../types'

export const navigationLinks: NavLinkItem[] = [
  { label: 'Dashboard', path: '/', icon: iconDashboard },
  { label: 'Produk', path: '/products', icon: iconProduct },
  { label: 'Akun', path: '/accounts', icon: iconAccount },
  { label: 'Laporan', path: '/reports', icon: iconReport },
]

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Pizza Margherita Classica',
    description: 'Kelezatan Italia dalam kesederhanaan saus tomat dan mozzarella.',
    price: '130.000,00',
    stock: 100,
    image: pizzaMargherita,
  },
  {
    id: 2,
    name: 'Truffle Mushroom Pizza',
    description: 'Rasa gurih jamur premium dengan sentuhan minyak truffle.',
    price: '152.000,00',
    stock: 48,
    image: pizzaImage,
  },
  {
    id: 3,
    name: 'Pepperoni Volcano',
    description: 'Taburan pepperoni ganda dengan saus pedas rahasia Eatway.',
    price: '140.000,00',
    stock: 32,
    image: pizzaImage,
  },
]

export const mockAccounts: Account[] = [
  {
    id: 1,
    name: 'Adelia Tri Ramdhani',
    email: 'adel@gmail.com',
    username: 'adel',
    password: '12345',
    phone: '08123456',
    role: 'Admin',
    image: heroChef,
  },
  {
    id: 2,
    name: 'Raka Nugraha',
    email: 'raka@gmail.com',
    username: 'raka',
    password: '12345',
    phone: '08126789',
    role: 'Pengguna',
    image: heroChef,
  },
  {
    id: 3,
    name: 'Dita Kirana',
    email: 'dita@gmail.com',
    username: 'dita',
    password: '12345',
    phone: '08561234',
    role: 'Pengguna',
    image: heroChef,
  },
]

export const dashboardOverview: OverviewItem[] = [
  {
    id: 'products',
    label: 'Produk',
    value: '15',
    helper: 'Produk Terdaftar',
    icon: iconProduct,
  },
  {
    id: 'accounts',
    label: 'Akun',
    value: '125',
    helper: 'Akun Terdaftar',
    icon: iconAccount,
    tone: 'dark',
  },
  {
    id: 'orders',
    label: 'Pesanan',
    value: '100',
    helper: 'Pesanan Dibuat',
    icon: iconOrder,
  },
]

export const reportOverview: OverviewItem[] = [
  {
    id: 'products',
    label: 'Produk',
    value: '135',
    helper: 'Produk Terjual Hari Ini',
    icon: iconProduct,
  },
  {
    id: 'orders',
    label: 'Pesanan',
    value: '125',
    helper: 'Pesanan Hari Ini',
    icon: iconOrder,
  },
  {
    id: 'income',
    label: 'Total pemasukan',
    value: 'Rp. 15.000.000',
    helper: '6 bulan terakhir',
    icon: iconIncome,
    tone: 'dark',
  },
]

export const revenueHistory: RevenuePoint[] = [
  { label: 'Apr', value: 6 },
  { label: 'Mei', value: 12 },
  { label: 'Jun', value: 10 },
  { label: 'Jul', value: 16 },
  { label: 'Agu', value: 13 },
  { label: 'Sep', value: 18 },
  { label: 'Okt', value: 15 },
]

export const lowStockProducts = [
  { id: 1, name: 'Pizza Margherita Classica', stock: 4, image: pizzaMargherita },
  { id: 2, name: 'Pepperoni Volcano', stock: 2, image: pizzaImage },
  { id: 3, name: 'Truffle Mushroom Pizza', stock: 3, image: pizzaImage },
  { id: 4, name: 'Spinach Ricotta Pizza', stock: 1, image: pizzaImage },
]

export const systemIcons = {
  email: iconEmail,
  password: iconPassword,
  delete: iconDelete,
  edit: iconEdit,
  view: iconEye,
  logout: iconLogout,
}

export const cashierNavigation: NavLinkItem[] = [
  { label: 'Check Pesanan', path: '/cashier', icon: iconOrder },
  { label: 'Proses Pesanan', path: '/cashier/process', icon: iconProduct },
]

const baseOrder: CashierOrder = {
  id: 101,
  name: 'Pizza Margherita Classica',
  price: 'Rp. 130.000',
  totalProducts: 3,
  totalPrice: 'Rp. 390.000',
  status: 'waiting',
  image: pizzaMargherita,
}

export const cashierOrdersWaiting: CashierOrder[] = Array.from({ length: 6 }).map((_, index) => ({
  ...baseOrder,
  id: index + 1,
}))

export const cashierOrdersProcessing: CashierOrder[] = cashierOrdersWaiting.map((order) => ({
  ...order,
  id: order.id + 100,
  status: 'processing',
}))

export const cashierOrderDetail: CashierOrderDetail = {
  status: 'Menunggu',
  customer: {
    name: 'Adelia Tri Ramadhani',
    phone: '0812345678',
    address:
      'Outlet Akses UI, ARV No.8 Jl M. Jassin Akses UI Kel.Tugu Kec.Cimanggis Kota Depok 16451',
  },
  items: [
    { id: 1, name: 'Pizza Margherita Classica', price: 'Rp. 130.000', quantity: 1, image: pizzaMargherita },
    { id: 2, name: 'Pizza Margherita Classica', price: 'Rp. 130.000', quantity: 1, image: pizzaMargherita },
    { id: 3, name: 'Pizza Margherita Classica', price: 'Rp. 130.000', quantity: 1, image: pizzaMargherita },
  ],
  paymentMethod: 'Transfer Bank',
  paymentFile: {
    name: 'Bukti Transfer.pdf',
    status: 'Upload complete',
  },
  totals: {
    amount: 'Rp. 390.000',
    productCount: '3 Produk',
    date: '17/10/2025',
  },
}
