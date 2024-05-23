import baseApi from '../baseApi'
import type { RunsResponse } from './types'

export const getRuns = async (startDate?: string, endDate?: string): Promise<RunsResponse> => {
  const params = {
    startDate,
    endDate
  }
  const response = await baseApi.get<RunsResponse>('/api/runs', { params })
  return response.data
}
