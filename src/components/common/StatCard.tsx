import type { OverviewItem } from '../../types'

interface StatCardProps {
  item: OverviewItem
}

export default function StatCard({ item }: StatCardProps) {
  return (
    <div className={`stat-card ${item.tone === 'dark' ? 'stat-card--dark' : ''}`}>
      <div className="stat-card__icon">
        <img src={item.icon} alt="" />
      </div>
      <div>
        <p className="stat-card__label">{item.label}</p>
        <p className="stat-card__value">{item.value}</p>
        <span className="stat-card__helper">{item.helper}</span>
      </div>
    </div>
  )
}
