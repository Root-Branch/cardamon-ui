export interface Metric {
  metricType: string
  type: string
  value: number
}

export interface Scenario {
  id: string
  startTime: string
  endTime: string
  metrics: Metric[]
  scenarioName: string
}

export interface ScenariosResponse {
  data: Scenario[]
}
