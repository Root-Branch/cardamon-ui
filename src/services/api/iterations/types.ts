export interface Metric {
  metricType: string
  type: string
  value: number
}

export interface Iteration {
  iteration: string
  startTime: string
  endTime: string
  metrics: Metric[]
}

export interface IterationsResponse {
  data: Iteration[]
}
