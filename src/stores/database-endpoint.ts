import { getDatabaseEndpoint } from '@/services/api/database/databaseEndpointApi'
import { defineStore } from 'pinia'

export const useDatabaseStore = defineStore('databaseStore', {
  state: () => ({
    databaseEndpoint: '' as string,
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchDatabaseEndpoint() {
      if (this.databaseEndpoint) return

      this.loading = true
      this.error = null
      try {
        const response = await getDatabaseEndpoint()
        this.databaseEndpoint = response
      } catch (error) {
        this.error = 'Failed to fetch database endpoint'
      } finally {
        this.loading = false
      }
    }
  },
  getters: {
    getDatabaseEndpoint: (state) => () => {
      return state.databaseEndpoint
    }
  }
})
