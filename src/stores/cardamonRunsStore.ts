import { getRuns } from '@/services/api/cardamonRuns/cardamonRunsApi'
import type { Run } from '@/services/api/cardamonRuns/types'
import { defineStore } from 'pinia'

export const useCardamonRunsStore = defineStore('runs', {
  state: () => ({
    runs: [] as Run[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchCardamonRuns(startDate?: string, endDate?: string) {
      this.loading = true
      this.error = null
      try {
        const response = await getRuns(startDate, endDate)
        this.runs = response.data
      } catch (error) {
        this.error = 'Failed to fetch runs'
      } finally {
        this.loading = false
      }
    }
  }
})
