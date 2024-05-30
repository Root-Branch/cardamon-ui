export interface CpuMetric {
  cpuUsage: number
  processId: string
  processName: string
  timestamp: string
  id: string
  coreCount: number
}

export interface CpuMetricsResponse {
  cpuMetrics: CpuMetric[]
}
