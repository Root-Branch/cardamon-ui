export enum ChartType {
  LINE = 'LINE',
  BAR = 'BAR',
  PIE = 'PIE'
}

export enum MetricType {
  CO2 = 'CO2',
  POWER = 'POWER'
  // CPU = 'CPU'
}

export interface Metric {
  metricType: MetricType
  type: string
  value: number
}

export interface CpuUsage {
  [processName: string]: Array<{
    cpuUsage: number
    timestamp: number
  }>
}

export interface Run {
  runId: string
  iteration: number
  startTime: number
  endTime: number
  co2Emission: number
  powerConsumption: number
  cpuUtilization: CpuUsage[]
}

export interface MetaData {
  scenario: {
    name: string
    avgCo2Emission: number
    avgCpuUtilization: number
    avgPowerConsumption: number
  }
  runs: Run[]
  totals: Metric[]
  pagination: any
}
