import baseApi from '../baseApi'
import type { DatabaseEndpointResponse } from './types'

export const getDatabaseEndpoint = async (): Promise<DatabaseEndpointResponse> => {
  const response = await baseApi.get<DatabaseEndpointResponse>(`/api/database_endpoint`)
  return response.data
}
