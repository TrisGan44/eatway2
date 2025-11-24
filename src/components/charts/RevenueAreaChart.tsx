import type { RevenuePoint } from '../../types'

interface RevenueAreaChartProps {
  data: RevenuePoint[]
}

export default function RevenueAreaChart({ data }: RevenueAreaChartProps) {
  const width = 828
  const height = 260
  const paddingX = 48
  const paddingY = 30
  const maxValue = Math.max(...data.map((item) => item.value)) || 1
  const segments = Math.max(1, data.length - 1)
  const chartWidth = width - paddingX * 2
  const chartHeight = height - paddingY * 2
  const gridLines = 5

  const points = data.map((point, index) => {
    const x = paddingX + (index / segments) * chartWidth
    const y = paddingY + chartHeight - (point.value / maxValue) * chartHeight
    return `${x},${y}`
  })

  const areaPath =
    `M${paddingX},${paddingY + chartHeight} ` +
    points.map((pair) => `L${pair}`).join(' ') +
    ` L${paddingX + chartWidth},${paddingY + chartHeight} Z`

  const totalAmount = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="revenue-chart">
      <div className="revenue-chart__card">
        <div className="revenue-chart__header">
          <h4>Pendapatan</h4>
          <span className="chip chip--ghost">Periode terpilih</span>
        </div>
        <svg
          width="100%"
          height="260"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#721E1E" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#F8E7D7" stopOpacity={0.25} />
          </linearGradient>
        </defs>
          {/* horizontal grid + labels */}
          {Array.from({ length: gridLines + 1 }).map((_, idx) => {
            const y = paddingY + (chartHeight / gridLines) * idx
            const value = Math.round(maxValue - (maxValue / gridLines) * idx)
            return (
              <g key={idx}>
                <line x1={paddingX} x2={paddingX + chartWidth} y1={y} y2={y} stroke="#e8e0d9" strokeWidth={1} />
                <text x={paddingX - 10} y={y + 4} textAnchor="end" fill="#6c5b57" fontSize="10">
                  {value.toLocaleString('id-ID')}
                </text>
              </g>
            )
          })}
          {/* vertical grid + labels */}
          {data.map((point, index) => {
            const x = paddingX + (index / segments) * chartWidth
            return (
              <g key={point.label}>
                <line x1={x} x2={x} y1={paddingY} y2={paddingY + chartHeight} stroke="#eee1d7" strokeWidth={1} />
                <text x={x} y={paddingY + chartHeight + 16} textAnchor="middle" fill="#6c5b57" fontSize="11">
                  {point.label}
                </text>
              </g>
            )
          })}
          {/* area */}
          <path d={areaPath} fill="url(#chartGradient)" stroke="#721E1E" strokeWidth={2} />
          {data.map((point, index) => {
            const x = paddingX + (index / segments) * chartWidth
            const y = paddingY + chartHeight - (point.value / maxValue) * chartHeight
            return <circle key={point.label} cx={x} cy={y} r={4} fill="#721E1E" />
          })}
        </svg>
        <div className="revenue-chart__footer">
          <div className="revenue-chart__total">
            <strong>Rp. {totalAmount.toLocaleString('id-ID')}</strong>
            <span className="muted">Total subtotal</span>
          </div>
          <div className="revenue-chart__legend">
            <span className="dot dot--primary" /> Product
          </div>
        </div>
      </div>
    </div>
  )
}
