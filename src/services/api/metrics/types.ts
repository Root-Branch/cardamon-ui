export interface Metric {
  metricType: string
  type: string
  value: number
}

export interface MetricsResponse {
  metrics: Metric[]
}
