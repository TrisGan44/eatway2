import { useEffect, useState } from 'react'

import { getOrderDetails } from '../../api/detailPesanan'
import { getOrders, updateOrder } from '../../api/pesanan'
import CashierOrderCard from '../../components/cashier/CashierOrderCard'
import type { CashierOrder } from '../../types'
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

export default function CashierOrdersPage() {
  const [rawOrders, setRawOrders] = useState<ApiOrder[]>([])
  const [detailSummary, setDetailSummary] = useState<Record<number, { count: number; sum: number }>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [orderRes, detailRes] = await Promise.all([getOrders(), getOrderDetails()])
      const apiRows = Array.isArray(orderRes?.data) ? orderRes.data : Array.isArray(orderRes) ? orderRes : []
      const unique = Array.from(new Map((apiRows as ApiOrder[]).map((o) => [o.pesanan_id, o])).values())
      setRawOrders(unique)

      const details = Array.isArray(detailRes?.data) ? detailRes.data : Array.isArray(detailRes) ? detailRes : []
      const summary: Record<number, { count: number; sum: number }> = {}
      ;(details as ApiOrderDetail[]).forEach((d) => {
        const current = summary[d.pesanan_id] ?? { count: 0, sum: 0 }
        current.count += Number(d.jumlah_order || 0)
        current.sum += Number(d.subtotal || 0)
        summary[d.pesanan_id] = current
      })
      setDetailSummary(summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat pesanan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const mapOrderToCard = (order: ApiOrder): CashierOrder => {
    const normalizedStatus =
      order.status === 'Diproses' ? 'processing' : order.status === 'Pending' ? 'waiting' : 'done'
    const summary = detailSummary[order.pesanan_id]
    const totalSum = summary?.sum ?? 0
    const totalCount = summary?.count ?? 0
    return {
      id: order.pesanan_id,
      name: `Pesanan #${order.pesanan_id}`,
      price: order.note || 'Tidak ada catatan',
      totalProducts: totalCount,
      totalPrice: totalSum ? `Rp. ${totalSum.toLocaleString('id-ID')}` : order.pesanan_date,
      status: normalizedStatus as CashierOrder['status'],
      image: fallbackImage,
    }
  }

  const waitingOrders = rawOrders
    .map(mapOrderToCard)
    .filter((order) => order.status === 'waiting')

  const handleUpdateStatus = async (order: ApiOrder, status: string) => {
    setLoading(true)
    setError(null)
    try {
      await updateOrder(order.pesanan_id, {
        user_id: order.user_id,
        pesanan_date: order.pesanan_date,
        status,
        note: order.note || '',
      })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui pesanan')
      setLoading(false)
    }
  }

  return (
    <div className="cashier-page">
      <div className="cashier-page__header">
        <div>
          <div className="cashier-page__meta">
            <span>Monday</span>
            <span>23 Okt 2025</span>
          </div>
          <h1>Pesanan</h1>
        </div>
        <p className="cashier-page__subtext">
          Berikut Pesanan yang Perlu <span>Anda</span> Konfirmasi !
        </p>
      </div>
      {error && <p className="form-error">{error}</p>}
      {loading && <p>Memuat data...</p>}
      <div className="cashier-order-grid">
        {waitingOrders.map((orderCard) => {
          const base = rawOrders.find((o) => o.pesanan_id === orderCard.id)
          return (
            <CashierOrderCard
              key={orderCard.id}
              order={orderCard}
              primaryLabel="Setujui Pesanan"
              secondaryLabel="Tolak"
              onPrimaryAction={() => base && handleUpdateStatus(base, 'Diproses')}
              onSecondaryAction={() => base && handleUpdateStatus(base, 'Dibatalkan')}
            />
          )
        })}
      </div>
      {!loading && waitingOrders.length === 0 && <p>Tidak ada pesanan menunggu.</p>}
    </div>
  )
}
