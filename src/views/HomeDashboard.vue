<template>
  <MainLayout :show-add-widget="false">
    <template #title>
      <h1 class="main-layout__title">Cardamon Dashboard</h1>
    </template>
    <template #dashboard>
      <div class="dashboard__header">
        <p class="dashboard__header-title">Scenarios</p>
        <p class="dashboard__header-subtitle">Total scenarios: {{ totalScenarios }}</p>
      </div>
      <div class="dashboard__filters">
        <div class="dashboard__filters-group">
          <!-- <div class="dashboard__filters-input-container dashboard__filters-search-input">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search by scenario name"
              class="input-with-icon"
              @input="debouncedSearch"
            />
            <font-awesome-icon icon="fa-solid fa-search" class="input-icon" />
          </div> -->
          <div class="dashboard__filters-input-container dashboard__filters-date-input">
            <select v-model="dateFilter" @change="handleDateFilterChange" class="input-with-icon">
              <option value="all">All time</option>
              <option value="5m">Last 5 minutes</option>
              <option value="30m">Last 30 minutes</option>
              <option value="1d">Last 1 day</option>
              <option value="1w">Last week</option>
              <option value="1m">Last month</option>
              <option value="custom">Custom date</option>
            </select>
            <font-awesome-icon icon="fa-solid fa-calendar" class="input-icon pr-3" />
          </div>
          <div v-if="dateFilter === 'custom'" class="dashboard__filters-dates">
            <div class="dashboard__filters-input-container">
              <input type="date" v-model="fromDate" class="input-with-icon" />
            </div>
            <span class="font-light text-sm text-gray-500 dark:text-gray-400">to</span>
            <div class="dashboard__filters-input-container">
              <input type="date" v-model="toDate" class="input-with-icon" />
            </div>
          </div>
        </div>
      </div>
      <div class="main-layout__dashboard">
        <ListTable
          :data="scenarios"
          :loading="loading"
          :totalPages="totalPages"
          v-model:currentPage="currentPage"
        />
      </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import ListTable from '@/components/Widgets/Table/ListTable.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useScenarioStore } from '@/stores/scenario'
// import { debounce } from '@/utils/debounce.utils'

const store = useScenarioStore()

const searchQuery = ref('')
const dateFilter = ref('all')
const fromDate = ref('')
const toDate = ref('')

const loading = computed(() => store.loading)
const scenarios = computed(() => store.scenariosData?.scenarios || [])
const totalPages = computed(() => store.scenariosData?.pagination?.totalPages || 1)
const currentPage = ref(1)
const totalScenarios = computed(() => store.scenariosData?.pagination?.totalScenarios || 0)

const fetchScenarios = async (params: { page?: number } = {}) => {
  if (params.page === undefined) {
    currentPage.value = 1
  }
  await store.fetchScenarios({ ...params, page: currentPage.value })
}

// const debouncedSearch = debounce(async () => {
//   currentPage.value = 1
//   await fetchScenarios({
//     searchQuery: searchQuery.value ? searchQuery.value : undefined,
//     fromDate: fromDate.value ? new Date(fromDate.value).getTime() : 0,
//     toDate: toDate.value ? new Date(toDate.value).getTime() : Date.now()
//   })
// }, 500)

const handleDateFilterChange = async () => {
  if (dateFilter.value === 'all') {
    await fetchScenarios()
  }
  if (dateFilter.value === 'custom') return
  currentPage.value = 1
  applyDateFilter()
}

const applyDateFilter = async () => {
  const now = new Date()
  toDate.value = now.toISOString().split('T')[0]
  switch (dateFilter.value) {
    case '5m':
      fromDate.value = new Date(now.getTime() - 5 * 60000).toISOString().split('T')[0]
      break
    case '30m':
      fromDate.value = new Date(now.getTime() - 30 * 60000).toISOString().split('T')[0]
      break
    case '1d':
      fromDate.value = new Date(now.getTime() - 24 * 60 * 60000).toISOString().split('T')[0]
      break
    case '1w':
      fromDate.value = new Date(now.getTime() - 7 * 24 * 60 * 60000).toISOString().split('T')[0]
      break
    case '1m':
      fromDate.value = new Date(now.getTime() - 30 * 24 * 60 * 60000).toISOString().split('T')[0]
      break
    default:
      fromDate.value = ''
  }

  await fetchScenarios({
    fromDate: new Date(fromDate.value).getTime(),
    toDate: new Date(toDate.value).getTime()
    // searchQuery: searchQuery.value ? searchQuery.value : undefined
  })
}

const applyCustomDateFilter = async () => {
  currentPage.value = 1
  await fetchScenarios({
    fromDate: fromDate.value ? new Date(fromDate.value).getTime() : 0,
    toDate: toDate.value ? new Date(toDate.value).getTime() : Date.now(),
    searchQuery: searchQuery.value ? searchQuery.value : undefined
  })
}

onMounted(async () => {
  await fetchScenarios()
})

watch([fromDate, toDate], async () => {
  if (dateFilter.value === 'custom') {
    await applyCustomDateFilter()
  }
})

watch(currentPage, (newPage) => {
  fetchScenarios({ page: newPage })
})
</script>

<style scoped>
.main-layout__title {
  @apply text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-10;
}

.dashboard__header {
  @apply mb-8;
}

.dashboard__header-title {
  @apply text-xl font-semibold text-gray-900 dark:text-gray-200;
}

.dashboard__header-subtitle {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.dashboard__filters {
  @apply flex justify-between items-center mb-4 w-full;
}

.dashboard__filters-group {
  @apply flex space-x-2 items-center w-full;
}

.dashboard__filters-input-container {
  @apply relative;
}

.dashboard__filters-dates {
  @apply flex space-x-2 justify-center items-center;
}

.dashboard__filter-button {
  @apply py-2 px-5 bg-blue-500 font-light text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-gray-100;
}

.main-layout__dashboard {
  @apply mt-4;
}

.main-layout__loading-spinner {
  @apply flex items-center justify-center h-full;
}

.input-with-icon {
  @apply p-2 w-full rounded-md border pl-10 text-sm font-light dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:[color-scheme:dark];
}

.input-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500;
}

.dashboard__filters-search-input {
  @apply w-1/4;
}

.dashboard__filters-date-input {
  @apply w-48;
}

.dark-mode-date {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
}

.dark-mode-text {
  @apply text-gray-500 dark:text-gray-400;
}
</style>
