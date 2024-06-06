export interface Metric {
  metricType: string
  type: string
  value: number
}

export interface Run {
  id: string
  startTime: string
  endTime: string
  metrics: Metric[]
}

export interface RunsResponse {
  data: Run[]
}
