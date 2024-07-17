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
    <div class="data-table__container grid-stack-item-content grid-stack-item">
      <!-- Header with title and actions -->
      <div class="data-table__header">
        <h3 class="data-table__title">Runs</h3>
        <p class="data-table__subtitle">Total runs: {{ totalRuns }}</p>
        <!-- <WidgetActions
          @duplicateWidget="duplicateWidget"
          @deleteWidget="deleteWidget"
          :dark-background="darkMode"
        /> -->
      </div>
      <!-- Table -->
      <div class="data-table__table-container">
        <fwb-table hoverable>
          <fwb-table-head class="data-table__table-header">
            <fwb-table-head-cell class="data-table__table-head-cell">Run ID</fwb-table-head-cell>
            <fwb-table-head-cell class="data-table__table-head-cell">Iteration</fwb-table-head-cell>
            <fwb-table-head-cell class="data-table__table-head-cell"
              >Start Time</fwb-table-head-cell
            >
            <fwb-table-head-cell class="data-table__table-head-cell">End Time</fwb-table-head-cell>
            <fwb-table-head-cell class="data-table__table-head-cell"
              >CO2 Emission</fwb-table-head-cell
            >
            <fwb-table-head-cell class="data-table__table-head-cell"
              >Power Consumption</fwb-table-head-cell
            >
          </fwb-table-head>
          <fwb-table-body>
            <fwb-table-row
              v-for="(item, index) in props.data.metadata.runs"
              :key="index"
              class="data-table__table-row"
            >
              <fwb-table-cell class="data-table__table-cell">
                {{ item.run_id }}
              </fwb-table-cell>
              <fwb-table-cell class="data-table__table-cell">{{ item.iteration }}</fwb-table-cell>
              <fwb-table-cell class="data-table__table-cell">{{
                formatDateTime(item.start_time)
              }}</fwb-table-cell>
              <fwb-table-cell class="data-table__table-cell">{{
                formatDateTime(item.end_time)
              }}</fwb-table-cell>
              <fwb-table-cell class="data-table__table-cell"
                >{{ item.co2_emission }} kg</fwb-table-cell
              >
              <fwb-table-cell class="data-table__table-cell"
                >{{ item.power_consumption }} kWh</fwb-table-cell
              >
            </fwb-table-row>
          </fwb-table-body>
        </fwb-table>
      </div>
      <!-- Pagination -->
      <div class="data-table__pagination-container">
        <fwb-pagination
          class="data-table__pagination"
          v-model="currentPage"
          :total-pages="totalPages"
          :slice-length="5"
          @update:model-value="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineEmits } from 'vue'
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
import type { MetaData } from '@/types/chart.types'

const minWidth = 3
const minHeight = 5

const props = defineProps<{
  data: Widget<MetaData>
}>()

const currentPage = ref(props.data.metadata.pagination.current_page || 1)
const totalPages = computed(() => props.data.metadata.pagination.total_pages || 1)

const totalRuns = computed(() => props.data.metadata.pagination.total_runs || 0)

const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  emit('updatePage', page)
}

watch(
  () => currentPage.value,
  (newPage) => {
    currentPage.value = newPage
  }
)

const emit = defineEmits(['duplicate', 'delete', 'updatePage'])

// const { duplicateWidget, deleteWidget } = useWidgetActions(props, emit)
</script>

<style scoped>
.data-table__container {
  @apply bg-white dark:bg-gray-800 rounded-lg p-6 drop-shadow-widget bg-white dark:bg-gray-800 cursor-move;
}

.data-table__header {
  @apply mb-8;
}

.data-table__title {
  @apply text-xl font-semibold text-gray-900 dark:text-gray-200;
}

.data-table__subtitle {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.data-table__table-container {
  @apply overflow-x-auto mb-4 cursor-default;
}

.data-table__table-header {
  @apply text-center bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200;
}

.data-table__table-row {
  @apply bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-light text-center border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700;
}

.data-table__table-cell {
  @apply text-center text-gray-600 dark:text-gray-300 font-light;
}

.data-table__link {
  @apply text-blue-500 dark:text-blue-400 hover:underline cursor-pointer;
}

.data-table__pagination-container {
  @apply flex justify-center mt-4;
}

.data-table__pagination *:not(svg, div) {
  @apply bg-white dark:bg-gray-800 border-none text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm;
}

.data-table__pagination *:not(svg, div):disabled {
  @apply bg-gray-100 dark:bg-gray-700 border-none text-gray-500 dark:text-gray-400 text-sm;
}
</style>
