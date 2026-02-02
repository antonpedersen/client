import type {FundConfig} from '../types'

interface Props {
  config: FundConfig
  onChange: (config: FundConfig) => void
  onGenerate: () => void
}

export function FundConfigPanel({config, onChange, onGenerate}: Props) {
  const update = (partial: Partial<FundConfig>) =>
    onChange({...config, ...partial})

  return (
    <div style={styles.panel}>
      <h2 style={styles.title}>Fondkonfiguration</h2>
      <div style={styles.grid}>
        <label style={styles.label}>
          Fondnamn
          <input
            style={styles.input}
            value={config.name}
            onChange={e => update({name: e.target.value})}
          />
        </label>
        <label style={styles.label}>
          Vintage-år
          <input
            style={styles.input}
            type="number"
            value={config.vintageYear}
            onChange={e => update({vintageYear: parseInt(e.target.value) || 2020})}
          />
        </label>
        <label style={styles.label}>
          Åtagande (commitment)
          <input
            style={styles.input}
            type="number"
            value={config.commitmentSize}
            onChange={e => update({commitmentSize: parseFloat(e.target.value) || 0})}
          />
        </label>
        <label style={styles.label}>
          Fondlivslängd (år)
          <input
            style={styles.input}
            type="number"
            min={1}
            max={20}
            value={config.fundLifeYears}
            onChange={e => update({fundLifeYears: parseInt(e.target.value) || 10})}
          />
        </label>
        <label style={styles.label}>
          Valuta
          <select
            style={styles.input}
            value={config.currency}
            onChange={e => update({currency: e.target.value})}
          >
            <option value="SEK">SEK</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </label>
      </div>
      <div style={styles.actions}>
        <button style={styles.button} onClick={onGenerate}>
          Generera exempelflöden
        </button>
        <button style={styles.buttonSecondary} disabled title="Kommer snart">
          Importera drawdown-fil
        </button>
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
  title: {
    margin: '0 0 16px',
    fontSize: 18,
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 13,
    fontWeight: 500,
    color: '#555',
    gap: 4,
  },
  input: {
    padding: '8px 10px',
    border: '1px solid #ddd',
    borderRadius: 4,
    fontSize: 14,
  },
  actions: {
    marginTop: 20,
    display: 'flex',
    gap: 12,
  },
  button: {
    padding: '10px 20px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '10px 20px',
    background: '#f3f4f6',
    color: '#888',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'not-allowed',
  },
}
