import { useEffect, useMemo, useState } from 'react'

import Button from '../components/common/Button'
import DataTable from '../components/common/DataTable'
import StatCard from '../components/common/StatCard'
import { getProducts } from '../api/produk'
import { dashboardOverview, systemIcons } from '../data/mock'

interface ApiProduct {
  produk_id: number
  nama_produk: string
  deskripsi: string
  price: number
  stock: number
  image_url?: string
}

export default function DashboardPage() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getProducts()
      const rows = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
      setProducts(rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat produk')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const productColumns = useMemo(
    () => [
      { label: 'id_produk', key: 'produk_id' },
      { label: 'nama_produk', key: 'nama_produk' },
      { label: 'deskripsi', key: 'deskripsi' },
      { label: 'harga', key: 'price' },
      { label: 'stok', key: 'stock', align: 'center' as const },
      {
        label: 'image_url',
        key: 'image_url',
        render: (row: ApiProduct) => row.image_url || '-',
      },
      {
        label: 'Aksi',
        key: 'actions',
        render: () => (
          <div className="table-actions">
            <img src={systemIcons.view} alt="View" />
            <img src={systemIcons.edit} alt="Edit" />
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <div>
          <p className="dashboard-page__eyebrow">
            <span>Monday</span>
            <span>24 Nov 2025</span>
          </p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="dashboard-hero">
        <div className="dashboard-hero__content">
          <p className="dashboard-hero__eyebrow">Eatway's always on the go.</p>
          <span className="dashboard-hero__meta">Hi, Admin</span>
          <h2>Ayo pastikan pesanan tetap terkontrol hari ini!</h2>
        </div>
        <div className="dashboard-hero__illus">
          <img src="/src/assets/images/hero-chef.png" alt="Chef" />
        </div>
      </div>

      <div className="dashboard-stats">
        {dashboardOverview.map((item) => (
          <StatCard key={item.id} item={item} />
        ))}
      </div>

      <div className="dashboard-table">
        <div className="dashboard-table__header">
          <div>
            <h3>Tabel Produk</h3>
            <p>Data produk terbaru yang terdaftar</p>
          </div>
          <Button variant="ghost">Lihat Semua</Button>
        </div>
        {error && <p className="form-error">{error}</p>}
        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <DataTable columns={productColumns} rows={products} zebra />
        )}
        {!loading && products.length === 0 && <p>Tidak ada data produk.</p>}
      </div>
    </div>
  )
}
