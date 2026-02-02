import {useState, useMemo} from 'react'
import type {FundConfig, CashFlowEntry} from './types'
import {computeMetrics, createDefaultCashFlows} from './utils'
import {FundConfigPanel} from './components/FundConfigPanel'
import {CashFlowTable} from './components/CashFlowTable'
import {MetricsPanel} from './components/MetricsPanel'
import {CashFlowChart} from './components/CashFlowChart'

const defaultConfig: FundConfig = {
  name: 'Nordic PE Fund I',
  vintageYear: 2020,
  commitmentSize: 100_000_000,
  fundLifeYears: 10,
  currency: 'SEK',
}

export default function App() {
  const [config, setConfig] = useState<FundConfig>(defaultConfig)
  const [cashFlows, setCashFlows] = useState<CashFlowEntry[]>([])
  const [nav, setNav] = useState<number>(0)

  const metrics = useMemo(() => computeMetrics(config, cashFlows, nav), [config, cashFlows, nav])

  const handleGenerate = () => {
    const flows = createDefaultCashFlows(config)
    setCashFlows(flows)
    // Set a reasonable NAV estimate
    const totalDrawn = flows
      .filter(f => f.type === 'drawdown')
      .reduce((s, f) => s + f.amount, 0)
    setNav(Math.round(totalDrawn * 0.3))
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.h1}>PE Flow Simulator</h1>
        <span style={styles.subtitle}>Simulera private equity-kassaflöden</span>
      </header>
      <main style={styles.main}>
        <FundConfigPanel config={config} onChange={setConfig} onGenerate={handleGenerate} />
        <MetricsPanel metrics={metrics} currency={config.currency} nav={nav} onNavChange={setNav} />
        <CashFlowChart cashFlows={cashFlows} currency={config.currency} />
        <CashFlowTable cashFlows={cashFlows} currency={config.currency} onChange={setCashFlows} />
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: '100vh',
    background: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    background: '#1e293b',
    color: '#fff',
    padding: '20px 32px',
    display: 'flex',
    alignItems: 'baseline',
    gap: 16,
  },
  h1: {margin: 0, fontSize: 22, fontWeight: 700},
  subtitle: {fontSize: 14, color: '#94a3b8'},
  main: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
}
