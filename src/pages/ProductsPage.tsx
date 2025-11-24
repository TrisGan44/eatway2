import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import DataTable from '../components/common/DataTable'
import PageHeading from '../components/common/PageHeading'
import { deleteProduct, getProducts } from '../api/produk'
import { systemIcons } from '../data/mock'

interface ApiProduct {
  produk_id: number
  nama_produk: string
  deskripsi: string
  price: number
  stock: number
  image_url?: string
}

export default function ProductsPage() {
  const navigate = useNavigate()
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

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Hapus produk ini?')
    if (!confirmDelete) return
    try {
      await deleteProduct(id)
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus produk')
    }
  }

  const columns = useMemo(
    () => [
      { label: 'id_produk', key: 'produk_id', width: '80px' },
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
        render: (row: ApiProduct) => (
          <div className="table-actions">
            <img
              src={systemIcons.delete}
              alt="Delete"
              onClick={() => handleDelete(row.produk_id)}
            />
            <img
              src={systemIcons.edit}
              alt="Edit"
              onClick={() => navigate(`/products/${row.produk_id}/edit`)}
            />
          </div>
        ),
      },
    ],
    [navigate],
  )

  return (
    <div className="page">
      <PageHeading
        title='Produk'
        dateLabel='Monday 23 Okt 2025'
        actionLabel='Tambah Produk'
        onAction={() => navigate('/products/add')}
      />
      <h3>Tabel Produk</h3>
      {error && <p className="form-error">{error}</p>}
      {loading ? <p>Memuat data...</p> : <DataTable columns={columns} rows={products} zebra />}
      {!loading && products.length === 0 && <p>Tidak ada data produk.</p>}
    </div>
  )
}
