import type {FundMetrics} from '../types'
import {formatCurrency, formatPercent} from '../utils'

interface Props {
  metrics: FundMetrics
  currency: string
  nav: number
  onNavChange: (nav: number) => void
}

export function MetricsPanel({metrics, currency, nav, onNavChange}: Props) {
  const cards: Array<{label: string; value: string; color?: string}> = [
    {label: 'Totalt indraget', value: formatCurrency(metrics.totalDrawn, currency)},
    {label: 'Totalt distribuerat', value: formatCurrency(metrics.totalDistributed, currency), color: '#16a34a'},
    {label: 'Netto kassaflöde', value: formatCurrency(metrics.netCashFlow, currency), color: metrics.netCashFlow >= 0 ? '#16a34a' : '#dc2626'},
    {label: 'Ofonderat åtagande', value: formatCurrency(metrics.unfundedCommitment, currency)},
    {label: 'NAV', value: formatCurrency(metrics.nav, currency)},
    {label: 'DPI', value: formatPercent(metrics.dpi)},
    {label: 'RVPI', value: formatPercent(metrics.rvpi)},
    {label: 'TVPI', value: formatPercent(metrics.tvpi), color: metrics.tvpi >= 1 ? '#16a34a' : '#dc2626'},
  ]

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h2 style={styles.title}>Nyckeltal</h2>
        <label style={styles.navLabel}>
          Nuvarande NAV:
          <input
            type="number"
            style={styles.navInput}
            value={nav}
            onChange={e => onNavChange(parseFloat(e.target.value) || 0)}
          />
        </label>
      </div>
      <div style={styles.grid}>
        {cards.map(card => (
          <div key={card.label} style={styles.card}>
            <div style={styles.cardLabel}>{card.label}</div>
            <div style={{...styles.cardValue, color: card.color || '#111'}}>{card.value}</div>
          </div>
        ))}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {margin: 0, fontSize: 18, fontWeight: 600},
  navLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: '#555',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  navInput: {
    padding: '6px 10px',
    border: '1px solid #ddd',
    borderRadius: 4,
    fontSize: 14,
    width: 140,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 12,
  },
  card: {
    padding: 16,
    background: '#f9fafb',
    borderRadius: 6,
    border: '1px solid #f3f4f6',
  },
  cardLabel: {fontSize: 12, color: '#666', marginBottom: 4},
  cardValue: {fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums'},
}
