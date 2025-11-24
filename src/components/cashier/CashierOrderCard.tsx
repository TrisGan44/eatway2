import Button from '../common/Button'
import type { CashierOrder } from '../../types'

interface CashierOrderCardProps {
  order: CashierOrder
  primaryLabel: string
  secondaryLabel?: string
  onPrimaryAction: (order: CashierOrder) => void
  onSecondaryAction?: (order: CashierOrder) => void
}

export default function CashierOrderCard({
  order,
  primaryLabel,
  secondaryLabel,
  onPrimaryAction,
  onSecondaryAction,
}: CashierOrderCardProps) {
  return (
    <div className="cashier-order-card">
      <div className="cashier-order-card__body">
        <div className="cashier-order-card__image">
          <span
            className={`cashier-order-card__chip ${
              order.status === 'waiting' ? 'is-waiting' : 'is-processing'
            }`}
          >
            {order.status === 'waiting' ? 'Menunggu' : 'Diproses'}
          </span>
          <img src={order.image} alt={order.name} />
        </div>
        <div className="cashier-order-card__info">
          <p className="cashier-order-card__name">{order.name}</p>
          <p className="cashier-order-card__price">{order.price}</p>
          <p className="cashier-order-card__summary">
            Total {order.totalProducts} produk: <strong>{order.totalPrice}</strong>
          </p>
        </div>
      </div>
      <div className="cashier-order-card__actions">
        {secondaryLabel && onSecondaryAction && (
          <Button variant="ghost" onClick={() => onSecondaryAction(order)}>
            {secondaryLabel}
          </Button>
        )}
        <Button onClick={() => onPrimaryAction(order)}>{primaryLabel}</Button>
      </div>
    </div>
  )
}
