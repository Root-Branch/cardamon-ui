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
  metric_type: MetricType
  type: string
  value: number
}

export interface CpuUsage {
  [process_name: string]: Array<{
    cpu_usage: number
    timestamp: number
  }>
}

export interface Run {
  run_id: string
  iteration: number
  start_time: number
  end_time: number
  co2_emission: number
  power_consumption: number
  cpu_utilization: CpuUsage[]
}

export interface MetaData {
  scenario: {
    name: string
    avg_co2_emission: number
    avg_cpu_utilization: number
    avg_power_consumption: number
  }
  runs: Run[]
  totals: Metric[]
  pagination: any
}
