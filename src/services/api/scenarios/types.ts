export interface Scenario {
  name: string
  avg_co2_emission: number
  avg_cpu_utilization: number
  avg_power_consumption: number
  last_start_time: number
  co2_emission_trend: number[]
}

export interface Run {
  run_id: string
  iteration: number
  start_time: number
  end_time: number
  co2_emission: number
  power_consumption: number
  cpu_utilization: {
    [process_name: string]: Array<{
      cpu_usage: number
      timestamp: number
    }>
  }
}

export interface ScenariosResponse {
  scenarios: Scenario[]
  pagination: {
    current_page: number
    total_pages: number
    per_page: number
    total_scenarios: number
  }
}

export interface ScenarioResponse {
  scenario: {
    name: string
    avg_co2_emission: number
    avg_power_consumption: number
    avg_cpu_utilization: number
  }
  runs: Run[]
  pagination: {
    current_page: number
    total_pages: number
    per_page: number
    total_runs: number
  }
}
