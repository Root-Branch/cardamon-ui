import baseApi from '../baseApi'
import type { MetricsResponse } from './types'

export const getMetrics = async (params: {
  startDate?: string
  endDate?: string
  runId?: string
  scenarioId?: string
  type: string
}): Promise<MetricsResponse> => {
  const response = await baseApi.get<MetricsResponse>('/api/metrics', { params })
  return response.data
}
