import baseApi from '../baseApi'
import type { IterationsResponse } from './types'

export const getIterations = async (scenarioId: string): Promise<IterationsResponse> => {
  const response = await baseApi.get<IterationsResponse>(`/api/scenarios/${scenarioId}`)
  return response.data
}
