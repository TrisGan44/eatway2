import type { RevenuePoint } from '../../types'

interface RevenueAreaChartProps {
  data: RevenuePoint[]
}

export default function RevenueAreaChart({ data }: RevenueAreaChartProps) {
  const width = 520
  const height = 220
  const maxValue = Math.max(...data.map((item) => item.value)) || 1
  const segments = Math.max(1, data.length - 1)

  const points = data.map((point, index) => {
    const x = (index / segments) * (width - 40) + 20
    const y = height - ((point.value / maxValue) * (height - 40) + 20)
    return `${x},${y}`
  })

  const areaPath = `M20,${height - 20} ` +
    points.map((pair) => `L${pair}`).join(' ') +
    ` L${width - 20},${height - 20} Z`

  return (
    <div className="revenue-chart">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#721E1E" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#F8E7D7" stopOpacity={0.25} />
          </linearGradient>
        </defs>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#chartBackground)"
          fillOpacity={0}
        />
        <path d={areaPath} fill="url(#chartGradient)" stroke="#721E1E" strokeWidth={2} />
        {data.map((point, index) => {
          const x = (index / segments) * (width - 40) + 20
          const y = height - ((point.value / maxValue) * (height - 40) + 20)
          return <circle key={point.label} cx={x} cy={y} r={4} fill="#721E1E" />
        })}
      </svg>
      <div className="revenue-chart__labels">
        {data.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  )
}
