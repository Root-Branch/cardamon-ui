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
          <h3 class="data-table__title">List of runs</h3>
          <!-- <p class="data-table__subtitle">Total runs: {{ totalRuns }}</p> -->
        </div>
      </div>

      <!-- Table -->
      <div class="data-table__table-container">
        <fwb-table hoverable>
          <fwb-table-head class="data-table__table-header">
            <fwb-table-head-cell class="data-table__table-head-cell"
              >Start Time</fwb-table-head-cell
            >
            <fwb-table-head-cell class="data-table__table-head-cell">Duration</fwb-table-head-cell>
            <fwb-table-head-cell class="data-table__table-head-cell"
              >Power Consumption</fwb-table-head-cell
            >
            <fwb-table-head-cell class="data-table__table-head-cell"
              >CO2 Emission</fwb-table-head-cell
            >
          </fwb-table-head>
          <fwb-table-body>
            <fwb-table-row
              v-for="(run, index) in runs"
              :key="index"
              :class="{ 'data-table__table-row--selected': run === selectedRun }"
              class="data-table__table-row"
              @click="selectRun(run)"
            >
              <fwb-table-cell class="data-table__table-cell">{{
                formatDateTime(run.startTime)
              }}</fwb-table-cell>
              <fwb-table-cell class="data-table__table-cell"
                >{{ run.duration.toFixed(2) }} s</fwb-table-cell
              >
              <fwb-table-cell class="data-table__table-cell"
                >{{ run.pow.toFixed(2) }} W</fwb-table-cell
              >
              <fwb-table-cell class="data-table__table-cell"
                >{{ run.co2.toFixed(2) }} g</fwb-table-cell
              >
            </fwb-table-row>
          </fwb-table-body>
        </fwb-table>
      </div>

      <!-- Pagination -->
      <div class="data-table__pagination-container">
        <fwb-pagination
          v-model="currentPage"
          :total-pages="totalPages"
          :slice-length="5"
          class="data-table__pagination"
          @update:model-value="handlePageChange"
          @page-changed="handlePageChange"
        >
        </fwb-pagination>
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
  FwbTableCell,
  FwbPagination
} from 'flowbite-vue'
import type { Widget } from '@/types/widgets.types'
import { useWidgetStore } from '@/stores/widgets'

const props = defineProps<{
  data: Widget<{
    runs: any[]
    pagination: { currentPage: number; totalPages: number; perPage: number }
  }>
}>()

const emit = defineEmits(['updatePage'])

const widgetStore = useWidgetStore()
const runs = computed(() => props.data.metadata.runs)
const pagination = computed(() => props.data.metadata.pagination)
const currentPage = ref(pagination.value.currentPage)
const totalPages = computed(() => pagination.value.totalPages)
const selectedRun = computed(() => widgetStore.selectedRun)

const handlePageChange = (page: number) => {
  currentPage.value = page
  emit('updatePage', page)
}

const selectRun = (run: any) => {
  console.log('selectRun', run)
  widgetStore.setSelectedRun(run)
}

watch(
  () => pagination.value.currentPage,
  (newPage) => {
    currentPage.value = newPage
  }
)

// Watch the runs array and set the first run as the selected run by default
watch(
  runs,
  (newRuns) => {
    if (newRuns.length > 0 && !selectedRun.value) {
      selectRun(newRuns[0])
    }
  },
  { immediate: true }
)

const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}
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
  @apply overflow-x-auto cursor-default mb-8 overflow-y-auto;
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
  @apply bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-light text-center border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 overflow-y-auto cursor-pointer;
}

.data-table__table-row--selected {
  @apply bg-blue-100 dark:bg-blue-900;
}

.data-table__table-cell {
  @apply text-center text-gray-600 dark:text-gray-300 font-light;
}

.data-table__pagination-container {
  @apply flex justify-center mt-4 pb-4;
}

.data-table__pagination *:not(svg, div) {
  @apply bg-white dark:bg-gray-800 border-none text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm;
}

.data-table__pagination *:not(svg, div):disabled {
  @apply bg-gray-100 dark:bg-gray-700 border-none text-gray-500 dark:text-gray-400 text-sm;
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
