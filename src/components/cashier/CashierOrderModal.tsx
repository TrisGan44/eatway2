import type { ReactNode } from 'react'

import Button from '../common/Button'

interface OrderSummary {
  id: number
  userId: number
  userName?: string
  status: string
  note?: string
  date?: string
  totalProducts: number
  totalAmount: number
  leadImage?: string
}

interface OrderDetailItem {
  detail_id: number
  produk_id: number
  jumlah_order: number
  subtotal: number
  productName?: string
  productImage?: string
}

interface CashierOrderModalProps {
  open: boolean
  loading?: boolean
  title?: string
  summary?: OrderSummary | null
  details?: OrderDetailItem[]
  paymentInfo?: ReactNode
  onClose: () => void
  primaryLabel: string
  secondaryLabel?: string
  onPrimary: () => void
  onSecondary?: () => void
}

export default function CashierOrderModal({
  open,
  loading,
  title = 'Detail Pesanan',
  summary,
  details = [],
  paymentInfo,
  onClose,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: CashierOrderModalProps) {
  if (!open) return null

  const totalProducts = summary?.totalProducts ?? 0
  const totalAmount = summary?.totalAmount ?? 0

  return (
    <div className='modal-backdrop' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()} role='dialog' aria-modal='true'>
        <div className='modal__header'>
          <div>
            <p className='modal__eyebrow'>{summary?.status || 'Status tidak tersedia'}</p>
            <h3>{title}</h3>
            <small>{summary?.date}</small>
          </div>
          <button className='modal__close' onClick={onClose} aria-label='Tutup'>
            ×
          </button>
        </div>

        <div className='modal__section'>
          <h4>Pemesan</h4>
          <div className='modal__customer'>
            {summary?.leadImage && <img src={summary.leadImage} alt="Produk utama" />}
            <div>
              <p className='modal__label'>{summary?.userName || `ID User #${summary?.userId ?? '-'}`}</p>
              <p className='modal__note'>Catatan: {summary?.note || 'Tidak ada catatan'}</p>
            </div>
          </div>
        </div>

          <div className='modal__section'>
            <h4>Item Pesanan</h4>
            {loading && <p>Memuat detail...</p>}
            {!loading && details.length === 0 && <p>Tidak ada item.</p>}
            {!loading &&
              details.map((item) => (
                <div key={item.detail_id} className='modal__item-row'>
                  <div className='modal__item-left'>
                    {item.productImage && (
                      <img src={item.productImage} alt={item.productName || `Produk #${item.produk_id}`} />
                    )}
                    <strong>{item.productName || `Produk #${item.produk_id}`}</strong>
                    <p className='muted'>x{item.jumlah_order}</p>
                  </div>
                  <div className='modal__price'>Subtotal: Rp. {Number(item.subtotal || 0).toLocaleString('id-ID')}</div>
                </div>
              ))}
          </div>

        <div className='modal__section'>
          <h4>Ringkasan</h4>
          <table className='modal__summary-table'>
            <tbody>
              <tr>
                <td>Total produk</td>
                <td className='modal__summary-value'>{totalProducts} produk</td>
              </tr>
              <tr>
                <td>Jumlah bayar</td>
                <td className='modal__summary-value'>Rp. {totalAmount.toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='modal__section'>
          <h4>Bukti/Metode Pembayaran</h4>
          {paymentInfo ?? <p className='muted'>Belum ada bukti pembayaran.</p>}
        </div>

        <div className='modal__actions'>
          {secondaryLabel && onSecondary && (
            <Button variant='ghost' onClick={onSecondary} disabled={loading}>
              {secondaryLabel}
            </Button>
          )}
          <Button onClick={onPrimary} disabled={loading}>
            {primaryLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
