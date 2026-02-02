export interface FundConfig {
  name: string
  vintageYear: number
  commitmentSize: number // total commitment in currency
  fundLifeYears: number
  currency: string
}

export interface CashFlowEntry {
  id: string
  date: string // YYYY-MM-DD
  quarter: string // e.g. "Q1 2024"
  type: 'drawdown' | 'distribution'
  amount: number // positive = drawdown, negative = distribution
  description: string
}

export interface FundMetrics {
  totalDrawn: number
  totalDistributed: number
  netCashFlow: number
  dpi: number // Distributions to Paid-In
  rvpi: number // Residual Value to Paid-In
  tvpi: number // Total Value to Paid-In
  irr: number | null
  unfundedCommitment: number
  nav: number
}
