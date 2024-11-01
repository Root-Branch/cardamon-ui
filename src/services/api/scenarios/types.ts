/* 
Endpoint: GET /api/scenarios
Query Parameters:
* fromDate (optional) - default to 0 
* toDate (optional) - default to current time 
* searchQuery (optional) - default to "all" 
* page (optional): The page number to retrieve. - default to 1 
* limit (optional): The number of scenarios per page. - default to 5 
*/

export interface Run {
  run_id: string
  iterations: Iteration[]
}

export interface Iteration {
  run_id: string
  scenario_name: string
  iteration: number
  start_time: number
  stop_time: number
  usage: {
    cpuUsage: number
    timestamp: number
  }[]
}

export interface Scenario {
  name: string
  avgCo2Emission: number
  last5AvgCpu: number
  avgPowerConsumption: number
  lastStartTime: number
  co2EmissionTrend: number[]
  runs: Run[]
}

export interface ScenariosResponse {
  scenarios: Scenario[]
  pagination: {
    currentPage: number
    totalPages: number
    perPage: number
    totalScenarios: number
  }
}

export interface ScenarioResponse {
  scenario: Scenario
  pagination: {
    currentPage: number
    totalPages: number
    perPage: number
    totalScenarios: number
  }
}
