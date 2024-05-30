import { getCpuMetrics } from '@/services/api/cpuMetrics/cpuMetricsApi'
import type { CpuMetric } from '@/services/api/cpuMetrics/types'
import { getMetrics } from '@/services/api/metrics/metricsApi'
import { getRuns } from '@/services/api/runs/runsApi'
import type { Run, Metric } from '@/services/api/runs/types'
import { defineStore } from 'pinia'

export const useRunsStore = defineStore('runs', {
  state: () => ({
    runsData: {} as Record<string, Run[]>,
    totalMetricsData: {} as Record<string, Metric[]>,
    cpuMetricsData: {} as Record<string, CpuMetric[]>,
    loading: false,
    error: null as string | null,
    fetchedRanges: [] as string[]
  }),
  actions: {
    async fetchRuns(startDate?: string, endDate?: string) {
      const rangeKey = `${startDate}-${endDate}`
      if (this.fetchedRanges.includes(rangeKey)) return

      try {
        const response = await getRuns(startDate, endDate)
        this.runsData[rangeKey] = response.data as any
        this.fetchedRanges.push(rangeKey)
      } catch (error) {
        this.error = 'Failed to fetch runs'
      }
    },
    async fetchMetrics(startDate?: string, endDate?: string) {
      const rangeKey = `${startDate}-${endDate}-total`
      if (this.fetchedRanges.includes(rangeKey)) return

      this.error = null
      try {
        const response = await getMetrics({ startDate, endDate, type: 'TOTAL' })
        this.totalMetricsData[rangeKey] = response.metrics
        this.fetchedRanges.push(rangeKey)
      } catch (error) {
        this.error = 'Failed to fetch metrics'
      }
    },
    async fetchCpuMetrics(startDate?: string, endDate?: string) {
      const rangeKey = `${startDate}-${endDate}-cpu`
      if (this.fetchedRanges.includes(rangeKey)) return

      this.error = null
      try {
        const response = await getCpuMetrics({ startDate, endDate })
        this.cpuMetricsData[rangeKey] = response.cpuMetrics
        this.fetchedRanges.push(rangeKey)
      } catch (error) {
        this.error = 'Failed to fetch CPU metrics'
      }
    }
  },
  getters: {
    getRunsData: (state) => (startDate?: string, endDate?: string) => {
      const rangeKey = `${startDate}-${endDate}`
      return state.runsData[rangeKey] || null
    },
    getTotalMetricsData: (state) => (startDate?: string, endDate?: string) => {
      const rangeKey = `${startDate}-${endDate}-total`
      return state.totalMetricsData[rangeKey] || null
    },
    getCpuMetricsData: (state) => (startDate?: string, endDate?: string) => {
      const rangeKey = `${startDate}-${endDate}-cpu`
      return state.cpuMetricsData[rangeKey] || null
    }
  }
  // persist: true
})
