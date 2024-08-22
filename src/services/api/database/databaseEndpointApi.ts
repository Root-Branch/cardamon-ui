import baseApi from '../baseApi'

export const getDatabaseEndpoint = async (): Promise<string> => {
  const response = await baseApi.get<string>(`/api/database_url`)
  return response.data
}
