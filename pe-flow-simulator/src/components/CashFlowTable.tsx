import type {CashFlowEntry} from '../types'
import {formatCurrency, generateId, quarterFromDate} from '../utils'

interface Props {
  cashFlows: CashFlowEntry[]
  currency: string
  onChange: (cashFlows: CashFlowEntry[]) => void
}

export function CashFlowTable({cashFlows, currency, onChange}: Props) {
  const addRow = () => {
    const today = new Date().toISOString().slice(0, 10)
    onChange([
      ...cashFlows,
      {
        id: generateId(),
        date: today,
        quarter: quarterFromDate(today),
        type: 'drawdown',
        amount: 0,
        description: '',
      },
    ])
  }

  const updateRow = (id: string, partial: Partial<CashFlowEntry>) => {
    onChange(
      cashFlows.map(cf => {
        if (cf.id !== id) return cf
        const updated = {...cf, ...partial}
        if (partial.date) {
          updated.quarter = quarterFromDate(partial.date)
        }
        return updated
      })
    )
  }

  const removeRow = (id: string) => {
    onChange(cashFlows.filter(cf => cf.id !== id))
  }

  const sorted = [...cashFlows].sort((a, b) => a.date.localeCompare(b.date))

  let cumulativeDrawn = 0
  let cumulativeDistributed = 0

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h2 style={styles.title}>Kassaflöden</h2>
        <button style={styles.addButton} onClick={addRow}>
          + Lägg till rad
        </button>
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Datum</th>
              <th style={styles.th}>Kvartal</th>
              <th style={styles.th}>Typ</th>
              <th style={styles.th}>Belopp</th>
              <th style={styles.th}>Kum. drawdown</th>
              <th style={styles.th}>Kum. distribution</th>
              <th style={styles.th}>Beskrivning</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(cf => {
              if (cf.type === 'drawdown') cumulativeDrawn += cf.amount
              else cumulativeDistributed += cf.amount

              return (
                <tr key={cf.id} style={styles.tr}>
                  <td style={styles.td}>
                    <input
                      type="date"
                      style={styles.cellInput}
                      value={cf.date}
                      onChange={e => updateRow(cf.id, {date: e.target.value})}
                    />
                  </td>
                  <td style={styles.tdMuted}>{cf.quarter}</td>
                  <td style={styles.td}>
                    <select
                      style={styles.cellInput}
                      value={cf.type}
                      onChange={e =>
                        updateRow(cf.id, {type: e.target.value as CashFlowEntry['type']})
                      }
                    >
                      <option value="drawdown">Drawdown</option>
                      <option value="distribution">Distribution</option>
                    </select>
                  </td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      style={{
                        ...styles.cellInput,
                        color: cf.type === 'drawdown' ? '#dc2626' : '#16a34a',
                      }}
                      value={cf.amount}
                      onChange={e => updateRow(cf.id, {amount: parseFloat(e.target.value) || 0})}
                    />
                  </td>
                  <td style={styles.tdNumber}>{formatCurrency(cumulativeDrawn, currency)}</td>
                  <td style={styles.tdNumber}>
                    {formatCurrency(cumulativeDistributed, currency)}
                  </td>
                  <td style={styles.td}>
                    <input
                      style={styles.cellInput}
                      value={cf.description}
                      onChange={e => updateRow(cf.id, {description: e.target.value})}
                      placeholder="Valfri beskrivning"
                    />
                  </td>
                  <td style={styles.td}>
                    <button style={styles.deleteBtn} onClick={() => removeRow(cf.id)}>
                      &times;
                    </button>
                  </td>
                </tr>
              )
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} style={styles.empty}>
                  Inga kassaflöden. Generera exempelflöden eller lägg till rader manuellt.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
  },
  title: {margin: 0, fontSize: 18, fontWeight: 600},
  addButton: {
    padding: '6px 14px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontSize: 13,
    cursor: 'pointer',
  },
  tableWrap: {overflowX: 'auto'},
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  th: {
    textAlign: 'left',
    padding: '8px 6px',
    borderBottom: '2px solid #e5e7eb',
    fontWeight: 600,
    fontSize: 12,
    color: '#666',
    whiteSpace: 'nowrap',
  },
  tr: {borderBottom: '1px solid #f3f4f6'},
  td: {padding: '6px'},
  tdMuted: {padding: '6px', color: '#888', fontSize: 12},
  tdNumber: {padding: '6px', fontVariantNumeric: 'tabular-nums', textAlign: 'right'},
  cellInput: {
    padding: '4px 6px',
    border: '1px solid #e5e7eb',
    borderRadius: 3,
    fontSize: 13,
    width: '100%',
    boxSizing: 'border-box',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#dc2626',
    fontSize: 18,
    cursor: 'pointer',
    padding: '2px 6px',
  },
  empty: {
    textAlign: 'center',
    padding: 32,
    color: '#888',
  },
}
