import type {CashFlowEntry, FundConfig, FundMetrics} from './types'

let idCounter = 0
export function generateId(): string {
  return `cf-${++idCounter}-${Date.now()}`
}

export function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function quarterFromDate(date: string): string {
  const d = new Date(date)
  const q = Math.ceil((d.getMonth() + 1) / 3)
  return `Q${q} ${d.getFullYear()}`
}

export function computeMetrics(
  config: FundConfig,
  cashFlows: CashFlowEntry[],
  currentNav: number
): FundMetrics {
  const totalDrawn = cashFlows
    .filter(cf => cf.type === 'drawdown')
    .reduce((sum, cf) => sum + cf.amount, 0)

  const totalDistributed = cashFlows
    .filter(cf => cf.type === 'distribution')
    .reduce((sum, cf) => sum + cf.amount, 0)

  const netCashFlow = totalDistributed - totalDrawn
  const paidIn = totalDrawn || 1 // avoid division by zero

  return {
    totalDrawn,
    totalDistributed,
    netCashFlow,
    dpi: totalDistributed / paidIn,
    rvpi: currentNav / paidIn,
    tvpi: (totalDistributed + currentNav) / paidIn,
    irr: null, // TODO: implement IRR calculation
    unfundedCommitment: config.commitmentSize - totalDrawn,
    nav: currentNav,
  }
}

export function createDefaultCashFlows(config: FundConfig): CashFlowEntry[] {
  const flows: CashFlowEntry[] = []
  const year = config.vintageYear
  const drawdownPcts = [0.15, 0.2, 0.2, 0.15, 0.1, 0.1, 0.05, 0.05]
  const distributionStartYear = 4

  for (let i = 0; i < Math.min(drawdownPcts.length, config.fundLifeYears); i++) {
    const date = `${year + i}-03-15`
    flows.push({
      id: generateId(),
      date,
      quarter: quarterFromDate(date),
      type: 'drawdown',
      amount: Math.round(config.commitmentSize * drawdownPcts[i]),
      description: `Capital call year ${i + 1}`,
    })
  }

  for (let i = distributionStartYear; i < config.fundLifeYears; i++) {
    const pct = 0.05 + (i - distributionStartYear) * 0.08
    const date = `${year + i}-09-15`
    flows.push({
      id: generateId(),
      date,
      quarter: quarterFromDate(date),
      type: 'distribution',
      amount: Math.round(config.commitmentSize * pct),
      description: `Distribution year ${i + 1}`,
    })
  }

  return flows.sort((a, b) => a.date.localeCompare(b.date))
}
