import { getCpuMetrics } from '@/services/api/cpuMetrics/cpuMetricsApi'
import type { CpuMetric } from '@/services/api/cpuMetrics/types'
import { getMetrics } from '@/services/api/metrics/metricsApi'
import { getScenarios } from '@/services/api/scenarios/scenariosApi'
import type { Scenario, Metric } from '@/services/api/scenarios/types'
import { defineStore } from 'pinia'

export const useSingleRunStore = defineStore('singleRun', {
  state: () => ({
    scenariosData: {} as Record<string, Scenario[]>,
    totalMetricsData: {} as Record<string, Metric[]>,
    cpuMetricsData: {} as Record<string, CpuMetric[]>,
    loading: false,
    error: null as string | null,
    fetchedRuns: [] as string[]
  }),
  actions: {
    async fetchScenarios(runId: string) {
      if (this.fetchedRuns.includes(runId)) return

      try {
        const response = await getScenarios(runId)
        this.scenariosData[runId] = response.data
        this.fetchedRuns.push(runId)
      } catch (error) {
        this.error = 'Failed to fetch scenarios'
      }
    },
    async fetchMetrics(runId: string) {
      const metricsKey = `${runId}-total`
      if (this.totalMetricsData[metricsKey]) return

      this.error = null
      try {
        const response = await getMetrics({ runId, type: 'TOTAL' })
        this.totalMetricsData[metricsKey] = response.metrics
      } catch (error) {
        this.error = 'Failed to fetch metrics'
      }
    },
    async fetchCpuMetrics(runId: string) {
      const cpuMetricsKey = `${runId}-cpu`
      if (this.cpuMetricsData[cpuMetricsKey]) return

      this.error = null
      try {
        const response = await getCpuMetrics({ runId })
        this.cpuMetricsData[cpuMetricsKey] = response.cpuMetrics
      } catch (error) {
        this.error = 'Failed to fetch CPU metrics'
      }
    }
  },
  getters: {
    getScenariosData: (state) => (runId: string) => {
      return state.scenariosData[runId] || null
    },
    getTotalMetricsData: (state) => (runId: string) => {
      const metricsKey = `${runId}-total`
      return state.totalMetricsData[metricsKey] || null
    },
    getCpuMetricsData: (state) => (runId: string) => {
      const cpuMetricsKey = `${runId}-cpu`
      return state.cpuMetricsData[cpuMetricsKey] || null
    }
  }
  // persist: true
})
