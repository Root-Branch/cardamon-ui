import { getScenarios, getScenario } from '@/services/api/scenarios/scenariosApi'
import type { ScenariosResponse, ScenarioResponse } from '@/types/scenario.types'
import { defineStore } from 'pinia'

export const useScenarioStore = defineStore('scenarioStore', {
  state: () => ({
    scenariosData: {} as ScenariosResponse,
    scenarioDetails: {} as Record<string, ScenarioResponse>,
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchScenarios(params?: {
      fromDate?: number
      toDate?: number
      searchQuery?: string
      page?: number
      limit?: number
    }) {
      this.loading = true
      this.error = null
      try {
        const response = await getScenarios(params)
        this.scenariosData = response
      } catch (error) {
        this.error = 'Failed to fetch scenarios'
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 100)
      }
    },
    async fetchScenarioDetails(
      scenarioName: string,
      params?: {
        page?: number
        limit?: number
      }
    ) {
      this.loading = true
      this.error = null
      try {
        const response = await getScenario(scenarioName, params)
        console.log(1111, response)
        this.scenarioDetails[scenarioName] = response
      } catch (error) {
        this.error = `Failed to fetch details for scenario: ${scenarioName}`
      } finally {
        this.loading = false
      }
    }
  },
  getters: {
    getScenariosData: (state) => () => {
      return state.scenariosData?.scenarios || null
    },
    getScenarioDetails: (state) => (scenarioName: string) => {
      return state.scenarioDetails[scenarioName] || null
    }
  }
})
