import baseApi from '../baseApi'
import type { CpuMetricsResponse } from './types'

export const getCpuMetrics = async (params: {
  startDate?: string
  endDate?: string
  runId?: string
  scenarioId?: string
}): Promise<CpuMetricsResponse> => {
  const response = await baseApi.get<CpuMetricsResponse>('/api/cpu-metrics', {
    params
  })
  return response.data
}
