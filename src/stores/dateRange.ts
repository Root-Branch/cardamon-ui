import { defineStore } from 'pinia'

export const useDateRangeStore = defineStore('dateRange', {
  state: () => ({
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString()
  }),
  actions: {
    updateDateRange(option: string) {
      const endDate = new Date()
      endDate.setHours(23, 59, 59, 999)
      const startDate = new Date()
      startDate.setHours(0, 0, 0, 0)

      switch (option) {
        case 'Past 1 day':
          startDate.setDate(endDate.getDate() - 1)
          break
        case 'Past 5 days':
          startDate.setDate(endDate.getDate() - 5)
          break
        case 'Past 15 days':
          startDate.setDate(endDate.getDate() - 15)
          break
        case 'Past 1 month':
          startDate.setMonth(endDate.getMonth() - 1)
          break
        case 'Past 3 months':
          startDate.setMonth(endDate.getMonth() - 3)
          break
        default:
          break
      }

      this.startDate = startDate.toISOString()
      this.endDate = endDate.toISOString()
    }
  },
  getters: {
    formattedDateRange: (state) => {
      return `${new Date(state.startDate).toLocaleString()} - ${new Date(state.endDate).toLocaleString()}`
    }
  }
  // persist: true
})
