<template>
  <div
    :id="data.id"
    :gs-id="data.id"
    :gs-x="data.grid.x"
    :gs-y="data.grid.y"
    :gs-w="data.grid.w"
    :gs-h="data.grid.h"
    :gs-min-w="minWidth"
    :gs-min-h="minHeight"
  >
    <div class="grid-stack-item-content grid-stack-item data-table__container">
      <!-- Header with title, actions, and Run ID -->
      <div class="data-table__header">
        <div class="data-table__title-container">
          <h3 class="data-table__title">Runs</h3>
          <p class="data-table__subtitle">Total runs: {{ totalRuns }}</p>
          <p class="data-table__run-id">
            Showing Iterations of Run ID: <span class="font-medium">{{ currentRun?.run_id }}</span>
          </p>
        </div>
      </div>

      <!-- Table -->
      <div class="data-table__table-container">
        <fwb-table hoverable class="data-table__table">
          <fwb-table-head class="data-table__table-header">
            <fwb-table-head-cell class="data-table__table-head-cell">Iteration</fwb-table-head-cell>
            <fwb-table-head-cell class="data-table__table-head-cell"
              >Start Time</fwb-table-head-cell
            >
            <fwb-table-head-cell class="data-table__table-head-cell">Stop Time</fwb-table-head-cell>
            <fwb-table-head-cell class="data-table__table-head-cell"
              >Avg. CPU Usage</fwb-table-head-cell
            >
            <fwb-table-head-cell class="data-table__table-head-cell"
              >Total CO2 Emission</fwb-table-head-cell
            >
            <fwb-table-head-cell class="data-table__table-head-cell"
              >Total Power Consumption</fwb-table-head-cell
            >
          </fwb-table-head>
          <fwb-table-body class="data-table__table-body">
            <fwb-table-row
              v-for="iteration in currentRun.iterations"
              :key="iteration.iteration"
              class="data-table__table-row"
            >
              <fwb-table-cell class="data-table__table-cell">{{
                iteration.iteration
              }}</fwb-table-cell>
              <fwb-table-cell class="data-table__table-cell">{{
                formatDateTime(iteration.start_time)
              }}</fwb-table-cell>
              <fwb-table-cell class="data-table__table-cell">{{
                formatDateTime(iteration.stop_time)
              }}</fwb-table-cell>
              <fwb-table-cell class="data-table__table-cell"
                >{{ calculateAvgCpuUsage(iteration.usage) }}%</fwb-table-cell
              >
              <fwb-table-cell class="data-table__table-cell"
                >{{ calculateTotalCo2Emission(iteration.usage) }} g</fwb-table-cell
              >
              <fwb-table-cell class="data-table__table-cell"
                >{{ calculateTotalPowerConsumption(iteration.usage) }} Wh</fwb-table-cell
              >
            </fwb-table-row>
          </fwb-table-body>
        </fwb-table>
      </div>

      <!-- Run Navigation -->
      <div class="data-table__run-navigation">
        <button
          @click="previousRun"
          :disabled="currentRunIndex === 0 && currentPage === 1"
          class="data-table__nav-button"
          aria-label="Previous Run"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span class="data-table__run-count">Run {{ currentRunNumber }} of {{ totalRuns }}</span>
        <button
          @click="nextRun"
          :disabled="currentRunIndex === runs.length - 1 && currentPage === pagination.totalPages"
          class="data-table__nav-button"
          aria-label="Next Run"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, watch, onMounted } from 'vue'
import {
  FwbTable,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableBody,
  FwbTableRow,
  FwbTableCell
} from 'flowbite-vue'
import type { Widget } from '@/types/widgets.types'
import type { MetaData } from '@/types/chart.types'
import { useWidgetStore } from '@/stores/widgets'
import { calculateCo2Emission, calculatePowerConsumption } from '@/utils/usage.util'

const minWidth = 3
const minHeight = 5

const props = defineProps<{
  data: any
}>()

const widgetStore = useWidgetStore()

const emit = defineEmits(['updatePage'])

const runs = computed(() => props.data.metadata.runs)
const pagination = computed(() => props.data.metadata.pagination)
const totalRuns = computed(() => pagination.value.totalScenarios)

const currentPage = ref(pagination.value.currentPage)
const currentRunIndex = ref(0)
const currentRun = computed(() => runs.value[currentRunIndex.value])
const currentRunNumber = computed(
  () => (currentPage.value - 1) * pagination.value.perPage + currentRunIndex.value + 1
)

const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

const calculateAvgCpuUsage = (usage: { cpuUsage: number }[] | null) => {
  if (!usage) return 'N/A'
  const sum = usage.reduce((acc, curr) => acc + curr.cpuUsage, 0)
  return (sum / usage.length).toFixed(2)
}

// Mock calculation functions for demonstration purposes
const calculateTotalCo2Emission = (usage: { cpuUsage: number; timestamp: number }[] | null) => {
  if (!usage) return 'N/A'
  const totalEmission = usage.reduce((acc, curr) => acc + calculateCo2Emission(curr), 0)
  return totalEmission.toFixed(4) // Already in grams, round to 2 decimal places
}

const calculateTotalPowerConsumption = (
  usage: { cpuUsage: number; timestamp: number }[] | null
) => {
  if (!usage) return 'N/A'
  const totalPower = usage.reduce((acc, curr) => acc + calculatePowerConsumption(curr), 0)
  const totalWh = (totalPower * usage.length) / 3600 // Convert to Wh
  return totalWh.toFixed(4) // Round to 2 decimal places
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  emit('updatePage', page)
}

const previousRun = () => {
  if (currentRunIndex.value > 0) {
    currentRunIndex.value--
  } else if (currentPage.value > 1) {
    handlePageChange(currentPage.value - 1)
    currentRunIndex.value = pagination.value.perPage - 1
  }
}

const nextRun = () => {
  if (currentRunIndex.value < runs.value.length - 1) {
    currentRunIndex.value++
  } else if (currentPage.value < pagination.value.totalPages) {
    handlePageChange(currentPage.value + 1)
    currentRunIndex.value = 0
  }
}

onMounted(() => {
  widgetStore.setCurrentRunId(currentRun.value.run_id)
})

watch(currentRun, (newRun) => {
  if (newRun) {
    widgetStore.setCurrentRunId(newRun.run_id)
  }
})
</script>

<style scoped>
.data-table__container {
  @apply bg-white dark:bg-gray-800 rounded-lg p-6 drop-shadow-widget cursor-move;
}

.data-table__header {
  @apply mb-8 flex justify-between items-center;
}

.data-table__title-container {
  @apply flex flex-col;
}

.data-table__title {
  @apply text-xl font-semibold text-gray-900 dark:text-gray-200;
}

.data-table__subtitle {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.data-table__run-id {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.data-table__table-container {
  @apply overflow-x-auto cursor-default mb-4 overflow-y-auto h-72;
}

.data-table__table {
  @apply shadow-none;
}

.data-table__table-header {
  @apply text-center bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200;
}

.data-table__table-body {
  @apply overflow-y-auto;
}

.data-table__table-row {
  @apply bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-light text-center border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 overflow-y-auto;
}

.data-table__table-cell {
  @apply text-center text-gray-600 dark:text-gray-300 font-light;
}

.data-table__run-navigation {
  @apply flex justify-center items-center space-x-2;
}

.data-table__nav-button {
  @apply p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed;
}

.data-table__run-count {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}
</style>
