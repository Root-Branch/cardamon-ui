import type { Metric } from './chart.types'

export interface Pagination {
  currentPage: number
  totalPages: number
  perPage: number
  totalScenarios: number
}

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
  scenarioName: string
  co2: number
  pow: number
  lastRun: number
  sparkline: number[]
  trend: number
}

export interface ScenariosResponse {
  scenarios: Scenario[]
  pagination: Pagination
}

export interface ScenarioResponse {
  scenario: Scenario
  pagination: Pagination
}

export interface MetaData {
  scenario: Scenario
  runs: Run[]
  totals: Metric[]
  pagination: Pagination
}
