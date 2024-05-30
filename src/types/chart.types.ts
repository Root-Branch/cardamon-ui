export enum ChartType {
  LINE = 'LINE',
  BAR = 'BAR',
  PIE = 'PIE'
}

export enum MetricType {
  CO2 = 'CO2',
  POWER = 'POWER',
  CPU = 'CPU'
}

export interface Metric {
  metricType: MetricType
  type: string
  value: number
}

export interface CpuUsageMetaData {
  data: Array<{
    cpuUsage: number
    processId: string
    processName: string
    totalUsage: number
    id: string
    coreCount: number
    timestamp: string
  }>
}

export interface MetaData {
  data: Array<{
    metrics: Metric[]
    startTime: string
    id: string
    endTime: string
  }>
  totals: Metric[]
}
