import type {CashFlowEntry} from '../types'
import {formatCurrency} from '../utils'

interface Props {
  cashFlows: CashFlowEntry[]
  currency: string
}

export function CashFlowChart({cashFlows, currency}: Props) {
  if (cashFlows.length === 0) {
    return (
      <div style={styles.panel}>
        <h2 style={styles.title}>Kassaflödesdiagram</h2>
        <div style={styles.empty}>Lägg till kassaflöden för att se diagrammet.</div>
      </div>
    )
  }

  const sorted = [...cashFlows].sort((a, b) => a.date.localeCompare(b.date))

  // Build quarterly aggregation
  const quarterMap = new Map<string, {drawdown: number; distribution: number; net: number}>()
  let cumNet = 0
  for (const cf of sorted) {
    const q = cf.quarter
    if (!quarterMap.has(q)) quarterMap.set(q, {drawdown: 0, distribution: 0, net: 0})
    const entry = quarterMap.get(q)!
    if (cf.type === 'drawdown') {
      entry.drawdown += cf.amount
      cumNet -= cf.amount
    } else {
      entry.distribution += cf.amount
      cumNet += cf.amount
    }
    entry.net = cumNet
  }

  const data = Array.from(quarterMap.entries()).map(([quarter, values]) => ({
    quarter,
    ...values,
  }))

  const maxVal = Math.max(...data.flatMap(d => [d.drawdown, d.distribution, Math.abs(d.net)]), 1)
  const chartHeight = 250
  const barWidth = Math.max(20, Math.min(50, 600 / data.length))

  return (
    <div style={styles.panel}>
      <h2 style={styles.title}>Kassaflödesdiagram</h2>
      <div style={styles.legend}>
        <span style={styles.legendItem}>
          <span style={{...styles.dot, background: '#dc2626'}} /> Drawdowns
        </span>
        <span style={styles.legendItem}>
          <span style={{...styles.dot, background: '#16a34a'}} /> Distributioner
        </span>
        <span style={styles.legendItem}>
          <span style={{...styles.dot, background: '#2563eb'}} /> Kumulativt netto
        </span>
      </div>
      <div style={styles.chartWrap}>
        <svg
          width={data.length * (barWidth + 16) + 40}
          height={chartHeight + 60}
          style={{display: 'block'}}
        >
          {/* Bars */}
          {data.map((d, i) => {
            const x = i * (barWidth + 16) + 20
            const drawH = (d.drawdown / maxVal) * chartHeight
            const distH = (d.distribution / maxVal) * chartHeight

            return (
              <g key={d.quarter}>
                {/* Drawdown bar */}
                <rect
                  x={x}
                  y={chartHeight - drawH}
                  width={barWidth / 2 - 1}
                  height={drawH}
                  fill="#dc2626"
                  opacity={0.8}
                  rx={2}
                >
                  <title>
                    {d.quarter}: Drawdown {formatCurrency(d.drawdown, currency)}
                  </title>
                </rect>
                {/* Distribution bar */}
                <rect
                  x={x + barWidth / 2 + 1}
                  y={chartHeight - distH}
                  width={barWidth / 2 - 1}
                  height={distH}
                  fill="#16a34a"
                  opacity={0.8}
                  rx={2}
                >
                  <title>
                    {d.quarter}: Distribution {formatCurrency(d.distribution, currency)}
                  </title>
                </rect>
                {/* Net line point */}
                <circle
                  cx={x + barWidth / 2}
                  cy={chartHeight - (d.net / maxVal) * (chartHeight / 2) - chartHeight / 2}
                  r={4}
                  fill="#2563eb"
                />
                {/* Quarter label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#666"
                  transform={`rotate(45, ${x + barWidth / 2}, ${chartHeight + 16})`}
                >
                  {d.quarter}
                </text>
              </g>
            )
          })}
          {/* Net line */}
          {data.length > 1 && (
            <polyline
              points={data
                .map((d, i) => {
                  const x = i * (barWidth + 16) + 20 + barWidth / 2
                  const y = chartHeight - (d.net / maxVal) * (chartHeight / 2) - chartHeight / 2
                  return `${x},${y}`
                })
                .join(' ')}
              fill="none"
              stroke="#2563eb"
              strokeWidth={2}
              opacity={0.7}
            />
          )}
          {/* Baseline */}
          <line
            x1={0}
            y1={chartHeight}
            x2={data.length * (barWidth + 16) + 40}
            y2={chartHeight}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        </svg>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    background: '#fff',
    borderRadius: 8,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {margin: '0 0 12px', fontSize: 18, fontWeight: 600},
  legend: {display: 'flex', gap: 20, marginBottom: 16, fontSize: 13},
  legendItem: {display: 'flex', alignItems: 'center', gap: 6},
  dot: {width: 10, height: 10, borderRadius: '50%', display: 'inline-block'},
  chartWrap: {overflowX: 'auto'},
  empty: {textAlign: 'center', padding: 32, color: '#888'},
}
