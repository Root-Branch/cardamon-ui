<template>
  <div class="data-table__container">
    <div class="data-table__table-container">
      <fwb-table hoverable>
        <fwb-table-head class="data-table__table-header">
          <fwb-table-head-cell class="data-table__table-head-cell">Name</fwb-table-head-cell>
          <fwb-table-head-cell class="data-table__table-head-cell"
            >Avg. Co2 Emission</fwb-table-head-cell
          >
          <fwb-table-head-cell class="data-table__table-head-cell"
            >Avg. Cpu Utilization</fwb-table-head-cell
          >
          <fwb-table-head-cell class="data-table__table-head-cell"
            >Avg. Power Consumption</fwb-table-head-cell
          >
          <fwb-table-head-cell class="data-table__table-head-cell"
            >Last execution</fwb-table-head-cell
          >
          <fwb-table-head-cell class="data-table__table-head-cell fixed-width"
            >CO2 Emission of last 10 runs</fwb-table-head-cell
          >
        </fwb-table-head>
        <fwb-table-body>
          <fwb-table-row v-for="(item, index) in data" :key="index" class="data-table__table-row">
            <fwb-table-cell class="data-table__table-cell">
              <a :href="`/scenarios/${item.name.replace(/\s/g, '-')}`" class="data-table__link">{{
                item.name
              }}</a>
            </fwb-table-cell>
            <fwb-table-cell class="data-table__table-cell"
              >{{ item.avgCo2Emission }} kg</fwb-table-cell
            >
            <fwb-table-cell class="data-table__table-cell"
              >{{ item.last5AvgCpu.toFixed(2) }} %</fwb-table-cell
            >
            <fwb-table-cell class="data-table__table-cell"
              >{{ item.avgPowerConsumption }} KWh</fwb-table-cell
            >
            <fwb-table-cell class="data-table__table-cell">{{
              formatLastExecution(item.lastStartTime)
            }}</fwb-table-cell>
            <fwb-table-cell class="data-table__table-cell fixed-width">
              <Sparkline :data="item.co2EmissionTrend" />
            </fwb-table-cell>
          </fwb-table-row>
        </fwb-table-body>
        <!-- <fwb-table-body v-else>
          <fwb-table-row class="data-table__table-row">
            <fwb-table-cell :colspan="6" class="data-table__table-cell text-center">
              <div class="animate-pulse">
                <div class="h-4 bg-gray-200 mt-3 mb-6 rounded"></div>
                <div class="h-4 bg-gray-300 mb-6 rounded"></div>
                <div class="h-4 bg-gray-200 mb-6 rounded"></div>
              </div>
            </fwb-table-cell>
          </fwb-table-row>
        </fwb-table-body> -->
      </fwb-table>
    </div>
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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { format } from 'date-fns'
import Sparkline from '@/components/widgets/Charts/SparklineChart.vue'
import {
  FwbTable,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableBody,
  FwbTableRow,
  FwbTableCell,
  FwbPagination
} from 'flowbite-vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:currentPage'])

const currentPage = ref(props.currentPage)

const handlePageChange = (page: number) => {
  currentPage.value = page
  emit('update:currentPage', page)
}

watch(
  () => props.currentPage,
  (newPage) => {
    currentPage.value = newPage
  }
)

const formatLastExecution = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()

  const minutesDiff = (now.getTime() - date.getTime()) / 60000
  if (minutesDiff < 60) {
    return `${Math.floor(minutesDiff)} minutes ago`
  } else {
    return format(date, 'PPpp')
  }
}
</script>

<style scoped>
.data-table__container {
  @apply bg-white dark:bg-gray-800 rounded-lg;
}

.data-table__header {
  @apply flex justify-between items-center mb-4;
}

.data-table__title {
  @apply text-lg font-semibold text-gray-900 dark:text-gray-200;
}

.data-table__table-container {
  @apply overflow-x-auto;
}

.data-table__table-header {
  @apply text-center bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200;
}

.data-table__table-row {
  @apply bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-center border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 h-20;
}

.data-table__table-cell {
  @apply text-gray-600 dark:text-gray-300 text-center;
}

.data-table__link {
  @apply text-blue-500 dark:text-blue-400 hover:underline cursor-pointer;
}

.fixed-width {
  width: 150px;
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
</style>
