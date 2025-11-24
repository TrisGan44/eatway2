import Button from '../common/Button'
import type { CashierOrder } from '../../types'

interface CashierOrderCardProps {
  order: CashierOrder
  primaryLabel: string
  secondaryLabel?: string
  onCardClick?: (order: CashierOrder) => void
  onPrimaryAction: (order: CashierOrder) => void
  onSecondaryAction?: (order: CashierOrder) => void
}

export default function CashierOrderCard({
  order,
  primaryLabel,
  secondaryLabel,
  onCardClick,
  onPrimaryAction,
  onSecondaryAction,
}: CashierOrderCardProps) {
  return (
    <div
      className={`cashier-order-card ${onCardClick ? 'cashier-order-card--clickable' : ''}`}
      onClick={() => onCardClick?.(order)}
      role={onCardClick ? 'button' : undefined}
      tabIndex={onCardClick ? 0 : undefined}
    >
      <div className="cashier-order-card__body">
        <div className="cashier-order-card__image">
          <span
            className={`cashier-order-card__chip ${
              order.status === 'waiting'
                ? 'is-waiting'
                : order.status === 'processing'
                  ? 'is-processing'
                  : 'is-done'
            }`}
          >
            {order.status === 'waiting' ? 'Menunggu' : order.status === 'processing' ? 'Diproses' : 'Selesai'}
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
          <Button
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation()
              onSecondaryAction(order)
            }}
          >
            {secondaryLabel}
          </Button>
        )}
        <Button
          onClick={(event) => {
            event.stopPropagation()
            onPrimaryAction(order)
          }}
        >
          {primaryLabel}
        </Button>
      </div>
    </div>
  )
}
