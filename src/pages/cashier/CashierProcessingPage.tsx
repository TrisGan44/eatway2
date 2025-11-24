import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getOrders, updateOrder } from '../../api/pesanan'
import { getOrderDetails } from '../../api/detailPesanan'
import { getProducts } from '../../api/produk'
import { getUsers } from '../../api/users'
import CashierOrderCard from '../../components/cashier/CashierOrderCard'
import CashierOrderModal from '../../components/cashier/CashierOrderModal'
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

interface ApiProduct {
  produk_id: number
  nama_produk: string
  deskripsi: string
  stock: number
  price: number
  image_url?: string
}

interface ApiUser {
  user_id: number
  username?: string
  name?: string
  image?: string
}

export default function CashierProcessingPage() {
  const navigate = useNavigate()
  const [rawOrders, setRawOrders] = useState<ApiOrder[]>([])
  const [detailSummary, setDetailSummary] = useState<Record<number, { count: number; sum: number }>>({})
  const [modalDetails, setModalDetails] = useState<ApiOrderDetail[]>([])
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [productMap, setProductMap] = useState<Record<number, { name: string; image?: string }>>({})
  const [userMap, setUserMap] = useState<Record<number, { name: string; image?: string }>>({})
  const [orderLeadImage, setOrderLeadImage] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [orderRes, detailRes, productRes, userRes] = await Promise.all([
        getOrders(),
        getOrderDetails(),
        getProducts(),
        getUsers(),
      ])
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

      const products = Array.isArray(productRes?.data) ? productRes.data : Array.isArray(productRes) ? productRes : []
      const mapping: Record<number, { name: string; image?: string }> = {}
      ;(products as ApiProduct[]).forEach((p) => {
        mapping[p.produk_id] = { name: p.nama_produk, image: p.image_url }
      })
      setProductMap(mapping)

      const lead: Record<number, string> = {}
      ;(details as ApiOrderDetail[]).forEach((d) => {
        if (lead[d.pesanan_id]) return
        const prod = mapping[d.produk_id]
        lead[d.pesanan_id] = prod?.image || fallbackImage
      })
      setOrderLeadImage(lead)

      const users = Array.isArray(userRes?.data) ? userRes.data : Array.isArray(userRes) ? userRes : []
      const userMapping: Record<number, { name: string; image?: string }> = {}
      ;(users as ApiUser[]).forEach((u) => {
        userMapping[u.user_id] = { name: u.username || u.name || `User #${u.user_id}`, image: u.image }
      })
      setUserMap(userMapping)
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
      image: orderLeadImage[order.pesanan_id] || fallbackImage,
    }
  }

  const processingOrders = rawOrders
    .map(mapOrderToCard)
    .filter((order) => order.status === 'processing')

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
      setSelectedOrder(null)
      setModalDetails([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui pesanan')
      setLoading(false)
    }
  }

  const handleComplete = async (order: ApiOrder) => {
    setLoading(true)
    setError(null)
    try {
      await handleUpdateStatus(order, 'Selesai')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyelesaikan pesanan')
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
          Daftar Pesanan Diproses, Konfirmasi jika Selesai !
        </p>
      </div>
      {error && <p className="form-error">{error}</p>}
      {loading && <p>Memuat data...</p>}
      <div className="cashier-order-grid">
        {processingOrders.map((orderCard) => {
          const base = rawOrders.find((o) => o.pesanan_id === orderCard.id)
          return (
            <CashierOrderCard
              key={orderCard.id}
              order={orderCard}
              primaryLabel="Selesai"
              onCardClick={async () => {
                if (!base) return
                setSelectedOrder(base)
                setModalLoading(true)
                try {
                  const detailRes = await getOrderDetails()
                  const details = Array.isArray(detailRes?.data)
                    ? detailRes.data
                    : Array.isArray(detailRes)
                      ? detailRes
                      : []
                  const filtered = (details as ApiOrderDetail[]).filter(
                    (d) => d.pesanan_id === base.pesanan_id,
                  )
                  const withNames = filtered.map((item) => ({
                    ...item,
                    productName: productMap[item.produk_id]?.name,
                    productImage: productMap[item.produk_id]?.image,
                  }))
                  setModalDetails(withNames)
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Gagal memuat detail pesanan')
                } finally {
                  setModalLoading(false)
                }
              }}
              onPrimaryAction={() => base && handleComplete(base)}
            />
          )
        })}
      </div>
      {!loading && processingOrders.length === 0 && <p>Tidak ada pesanan diproses.</p>}

      <CashierOrderModal
        open={Boolean(selectedOrder)}
        loading={modalLoading}
        onClose={() => {
          setSelectedOrder(null)
          setModalDetails([])
        }}
        title="Detail Pesanan"
        summary={
          selectedOrder
            ? {
                id: selectedOrder.pesanan_id,
                userId: selectedOrder.user_id,
                userName: userMap[selectedOrder.user_id]?.name,
                status: selectedOrder.status,
                note: selectedOrder.note,
                date: selectedOrder.pesanan_date,
                totalProducts: modalDetails.reduce((sum, d) => sum + Number(d.jumlah_order || 0), 0),
                totalAmount: modalDetails.reduce((sum, d) => sum + Number(d.subtotal || 0), 0),
                leadImage: userMap[selectedOrder.user_id]?.image || fallbackImage,
              }
            : null
        }
        details={modalDetails}
        primaryLabel="Selesai"
        onPrimary={() => selectedOrder && handleComplete(selectedOrder)}
      />
    </div>
  )
}
