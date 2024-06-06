import baseApi from '../baseApi'
import type { ScenariosResponse } from './types'

export const getScenarios = async (runId: string): Promise<ScenariosResponse> => {
  const response = await baseApi.get<ScenariosResponse>(`/api/runs/${runId}`)
  return response.data
}
