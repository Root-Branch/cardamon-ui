import { getCpuMetrics } from '@/services/api/cpuMetrics/cpuMetricsApi'
import type { CpuMetric } from '@/services/api/cpuMetrics/types'
import { getMetrics } from '@/services/api/metrics/metricsApi'
import type { Iteration, Metric } from '@/services/api/iterations/types'
import { getIterations } from '@/services/api/iterations/iterationApi'
import { defineStore } from 'pinia'

export const useScenarioStore = defineStore('scenario', {
  state: () => ({
    iterationsData: {} as Record<string, Iteration[]>,
    totalMetricsData: {} as Record<string, Metric[]>,
    cpuMetricsData: {} as Record<string, CpuMetric[]>,
    loading: false,
    error: null as string | null,
    fetchedScenarios: [] as string[]
  }),
  actions: {
    async fetchIterations(scenarioId: string) {
      if (this.fetchedScenarios.includes(scenarioId)) return

      try {
        const response = await getIterations(scenarioId)
        this.iterationsData[scenarioId] = response.data
        this.fetchedScenarios.push(scenarioId)
      } catch (error) {
        this.error = 'Failed to fetch iterations'
      }
    },
    async fetchMetrics(scenarioId: string) {
      const metricsKey = `${scenarioId}-total`
      if (this.totalMetricsData[metricsKey]) return

      this.error = null
      try {
        const response = await getMetrics({ scenarioId, type: 'TOTAL' })
        this.totalMetricsData[metricsKey] = response.metrics
      } catch (error) {
        this.error = 'Failed to fetch metrics'
      }
    },
    async fetchCpuMetrics(scenarioId: string) {
      const cpuMetricsKey = `${scenarioId}-cpu`
      if (this.cpuMetricsData[cpuMetricsKey]) return

      this.error = null
      try {
        const response = await getCpuMetrics({ scenarioId })
        this.cpuMetricsData[cpuMetricsKey] = response.cpuMetrics
      } catch (error) {
        this.error = 'Failed to fetch CPU metrics'
      }
    }
  },
  getters: {
    getIterationsData: (state) => (scenarioId: string) => {
      return state.iterationsData[scenarioId] || null
    },
    getTotalMetricsData: (state) => (scenarioId: string) => {
      const metricsKey = `${scenarioId}-total`
      return state.totalMetricsData[metricsKey] || null
    },
    getCpuMetricsData: (state) => (scenarioId: string) => {
      const cpuMetricsKey = `${scenarioId}-cpu`
      return state.cpuMetricsData[cpuMetricsKey] || null
    }
  },
  persist: true
})
