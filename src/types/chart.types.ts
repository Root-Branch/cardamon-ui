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
