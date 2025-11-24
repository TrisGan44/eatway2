import { useEffect, useMemo, useState } from 'react'

import RevenueAreaChart from '../components/charts/RevenueAreaChart'
import PageHeading from '../components/common/PageHeading'
import StatCard from '../components/common/StatCard'
import { getOrderDetails } from '../api/detailPesanan'
import { getOrders } from '../api/pesanan'
import { getProducts } from '../api/produk'
import { lowStockProducts as lowStockMock, reportOverview } from '../data/mock'
import fallbackImage from '../assets/images/pizza.png'

interface ApiProduct {
  produk_id: number
  nama_produk: string
  deskripsi: string
  stock: number
  price: number
  image_url?: string
}

interface ApiOrder {
  pesanan_id: number
  user_id: number
  pesanan_date: string
  status: string
  note?: string
}

interface ApiOrderDetail {
  detail_id: number
  pesanan_id: number
  produk_id: number
  jumlah_order: number
  subtotal: number
}

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export default function ReportsPage() {
  const [cards, setCards] = useState(reportOverview)
  const [revenue, setRevenue] = useState<{ label: string; value: number }[]>([])
  const [lowStock, setLowStock] = useState(lowStockMock)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rangeMonths, setRangeMonths] = useState<1 | 3 | 6>(6)
  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    [],
  )

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [productsRes, ordersRes, detailsRes] = await Promise.all([
        getProducts(),
        getOrders(),
        getOrderDetails(),
      ])

      const products: ApiProduct[] = Array.isArray(productsRes?.data)
        ? productsRes.data
        : Array.isArray(productsRes)
          ? productsRes
          : []
      const orders: ApiOrder[] = Array.isArray(ordersRes?.data)
        ? ordersRes.data
        : Array.isArray(ordersRes)
          ? ordersRes
          : []
      const details: ApiOrderDetail[] = Array.isArray(detailsRes?.data)
        ? detailsRes.data
        : Array.isArray(detailsRes)
          ? detailsRes
          : []

      const totalProductsSold = details.reduce((sum, item) => sum + (item.jumlah_order || 0), 0)
      const totalOrders = orders.length
      const totalIncome = details.reduce((sum, item) => sum + (item.subtotal || 0), 0)

      setCards((prev) =>
        prev.map((card) => {
          if (card.id === 'products') return { ...card, value: String(totalProductsSold || 0) }
          if (card.id === 'orders') return { ...card, value: String(totalOrders || 0) }
          if (card.id === 'income')
            return { ...card, value: `Rp. ${totalIncome.toLocaleString('id-ID')}`, helper: 'Total subtotal' }
          return card
        }),
      )

      const computedLowStock = products
        .filter((p) => Number(p.stock) <= 5)
        .map((p) => ({
          id: p.produk_id,
          name: p.nama_produk,
          stock: p.stock,
          image: p.image_url || fallbackImage,
        }))
      setLowStock(computedLowStock.length ? computedLowStock : lowStockMock)

      const orderMap = new Map<number, ApiOrder>()
      orders.forEach((o) => orderMap.set(o.pesanan_id, o))

      const buckets = new Map<string, number>()
      details.forEach((detail) => {
        const order = orderMap.get(detail.pesanan_id)
        if (!order) return
        const date = new Date(order.pesanan_date)
        if (isNaN(date.getTime())) return
        const key = `${date.getFullYear()}-${date.getMonth()}`
        const current = buckets.get(key) || 0
        buckets.set(key, current + (detail.subtotal || 0))
      })

      const points = Array.from(buckets.entries())
        .sort((a, b) => (a[0] > b[0] ? 1 : -1))
        .slice(-rangeMonths)
        .map(([key, value]) => {
          const [year, month] = key.split('-').map(Number)
          const label = `${monthLabels[month] ?? 'N/A'} ${String(year).slice(-2)}`
          return { label, value }
        })
      setRevenue(points.length ? points : [{ label: 'N/A', value: 0 }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat laporan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const totalIncome = useMemo(() => {
    return revenue.reduce((sum, item) => sum + item.value, 0)
  }, [revenue])

  return (
    <div className='page'>
      <PageHeading title='Laporan' dateLabel={todayLabel} />
      {error && <p className="form-error">{error}</p>}
      {loading && <p>Memuat data...</p>}
      <div className='stats-grid'>
        {cards.map((item) => (
          <StatCard key={item.id} item={item} />
        ))}
      </div>
      <div className='reports-grid'>
        <div className='reports-grid__chart'>
          <div className='section-heading'>
            <h3>Pendapatan</h3>
            <div className='chip-group'>
              {[1, 3, 6].map((num) => (
                <button
                  key={num}
                  className={`chip ${rangeMonths === num ? 'chip--active' : ''}`}
                  onClick={() => setRangeMonths(num as 1 | 3 | 6)}
                >
                  {num} bulan
                </button>
              ))}
            </div>
          </div>
          <RevenueAreaChart data={revenue} />
          <div className='reports-grid__legend'>
            <div>
              <span className='dot dot--primary' /> Total
            </div>
            <strong>Rp. {totalIncome.toLocaleString('id-ID')}</strong>
          </div>
        </div>
        <div className='reports-grid__aside'>
          <h3>Produk Hampir Habis</h3>
          <div className='low-stock-card'>
            {lowStock.map((product) => (
              <div key={product.id} className='low-stock-row'>
                <img src={product.image} alt={product.name} />
                <div>
                  <p>{product.name}</p>
                  <small>Stok: {product.stock}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
