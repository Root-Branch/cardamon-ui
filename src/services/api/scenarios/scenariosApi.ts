import type { ScenariosResponse, ScenarioResponse } from '@/types/scenario.types'
import baseApi from '../baseApi'

export const getScenarios = async (params?: {
  fromDate?: number
  toDate?: number
  searchQuery?: string
  page?: number
  limit?: number
}): Promise<ScenariosResponse> => {
  const response = await baseApi.get<ScenariosResponse>(`/api/scenarios`, { params })
  return response.data
}

export const getScenario = async (
  scenarioName: string,
  params?: {
    page?: number
    limit?: number
  }
): Promise<ScenarioResponse> => {
  const response = await baseApi.get<ScenarioResponse>(`/api/scenarios/${scenarioName}`, { params })
  return response.data
}
