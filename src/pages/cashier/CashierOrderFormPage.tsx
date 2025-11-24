import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getOrder, updateOrder } from '../../api/pesanan'
import { getOrderDetails } from '../../api/detailPesanan'
import Button from '../../components/common/Button'
import fallbackImage from '../../assets/images/pizza.png'

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

export default function CashierOrderFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<ApiOrder | null>(null)
  const [details, setDetails] = useState<ApiOrderDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const orderRes = await getOrder(Number(id))
        const orderData = orderRes?.data ?? orderRes
        setOrder(orderData)

        const detailRes = await getOrderDetails()
        const rows = Array.isArray(detailRes?.data) ? detailRes.data : Array.isArray(detailRes) ? detailRes : []
        setDetails(rows.filter((row: ApiOrderDetail) => row.pesanan_id === Number(id)))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat detail pesanan')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [id])

  const statusLabel =
    order?.status === 'Diproses'
      ? 'Diproses'
      : order?.status === 'Pending'
        ? 'Menunggu'
        : order?.status || '-'
  const totalAmount = details.reduce((sum, item) => sum + (item.subtotal || 0), 0)
  const totalItems = details.reduce((sum, item) => sum + (item.jumlah_order || 0), 0)

  const handleStatusChange = async (nextStatus: string) => {
    if (!order) return
    setLoading(true)
    setError(null)
    try {
      await updateOrder(order.pesanan_id, {
        user_id: order.user_id,
        pesanan_date: order.pesanan_date,
        status: nextStatus,
        note: order.note || '',
      })
      navigate('/cashier')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengubah status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cashier-order-form">
      <div className="cashier-page__header cashier-page__header--center">
        <div>
          <div className="cashier-page__meta">
            <span>Monday</span>
            <span>23 Okt 2025</span>
          </div>
          <h1>Form Pesanan</h1>
        </div>
        <span className={`order-status ${statusLabel === 'Menunggu' ? 'order-status--waiting' : ''}`}>
          {statusLabel}
        </span>
      </div>
      {error && <p className="form-error">{error}</p>}
      {loading && <p>Memuat data...</p>}
      <div className="customer-card">
        <p className="customer-card__name">
          <strong>ID User #{order?.user_id ?? '-'}</strong>
        </p>
        <p className="customer-card__address">Catatan: {order?.note || 'Tidak ada catatan'}</p>
      </div>
      <div className="cashier-items">
        {details.map((item) => (
          <div key={item.detail_id} className="cashier-item-row">
            <div className="cashier-item-row__image">
              <img src={fallbackImage} alt={`Produk ${item.produk_id}`} />
            </div>
            <div className="cashier-item-row__info">
              <p className="cashier-item-row__name">Produk #{item.produk_id}</p>
              <span className="cashier-item-row__qty">x{item.jumlah_order}</span>
              <p className="cashier-item-row__price">Subtotal: {item.subtotal}</p>
            </div>
            <div className="cashier-item-row__counter">
              <button type="button">-</button>
              <span>{item.jumlah_order}</span>
              <button type="button">+</button>
            </div>
          </div>
        ))}
        {!loading && details.length === 0 && <p>Tidak ada detail pesanan.</p>}
      </div>
      <div className="payment-section">
        <h3>Metode Pembayaran</h3>
        <div className="payment-card">
          <div className="payment-card__icon" />
          <span>Manual</span>
        </div>
      </div>
      <div className="payment-section">
        <h3>Upload Bukti Pembayaran</h3>
        <div className="payment-upload">
          <div className="payment-upload__icon">PDF</div>
          <div>
            <p className="payment-upload__file">Belum ada bukti</p>
            <span className="payment-upload__status">-</span>
          </div>
        </div>
      </div>
      <div className="cashier-summary">
        <div>
          <p>Total Pesanan</p>
          <p>Jumlah produk</p>
          <p>Total Pembayaran</p>
          <p>Tanggal Transaksi</p>
        </div>
        <div className="cashier-summary__values">
          <p className="cashier-summary__value">{totalAmount}</p>
          <p>{totalItems} Produk</p>
          <p>{totalAmount}</p>
          <p>{order?.pesanan_date ?? '-'}</p>
        </div>
      </div>
      <div className="cashier-order-form__actions">
        <Button
          variant="ghost"
          className="cashier-action--ghost"
          onClick={() => handleStatusChange('Dibatalkan')}
          disabled={loading}
        >
          Tolak
        </Button>
        <Button onClick={() => handleStatusChange('Diproses')} disabled={loading}>
          Setuju
        </Button>
      </div>
    </div>
  )
}
