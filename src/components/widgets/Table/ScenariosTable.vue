<template>
  <div class="data-table__container">
    <div class="data-table__table-container">
      <fwb-table hoverable>
        <fwb-table-head class="data-table__table-header">
          <fwb-table-head-cell class="data-table__table-head-cell">Name</fwb-table-head-cell>
          <fwb-table-head-cell class="data-table__table-head-cell"
            >Lastest Run Co2 Emission</fwb-table-head-cell
          >
          <fwb-table-head-cell class="data-table__table-head-cell"
            >Lastest Run Power Consumption</fwb-table-head-cell
          >
          <fwb-table-head-cell class="data-table__table-head-cell"
            >Last execution</fwb-table-head-cell
          >
          <fwb-table-head-cell class="data-table__table-head-cell fixed-width"
            >CO2 Emission of last 5 runs</fwb-table-head-cell
          >
          <fwb-table-head-cell class="data-table__table-head-cell fixed-width"
            >Trend (over 5 runs)</fwb-table-head-cell
          >
        </fwb-table-head>
        <fwb-table-body>
          <fwb-table-row v-for="(item, index) in data" :key="index" class="data-table__table-row">
            <fwb-table-cell class="data-table__table-cell">
              <a
                :href="`/scenarios/${item.scenarioName.replace(/\s/g, '-')}`"
                class="data-table__link"
                >{{ item.scenarioName }}</a
              >
            </fwb-table-cell>
            <fwb-table-cell class="data-table__table-cell"
              >{{ item.co2.toFixed(2) }} g</fwb-table-cell
            >
            <fwb-table-cell class="data-table__table-cell"
              >{{ item.pow.toFixed(2) }} W</fwb-table-cell
            >
            <fwb-table-cell class="data-table__table-cell">{{
              formatLastExecution(item.lastRun)
            }}</fwb-table-cell>
            <fwb-table-cell class="data-table__table-cell fixed-width">
              <Sparkline v-if="item.sparkline.length > 1" :data="item.sparkline" />
              <span v-else>-</span>
            </fwb-table-cell>
            <fwb-table-cell class="data-table__table-cell fixed-width">
              <div class="trend-chart-container">
                <span
                  :class="{
                    'trend-up': item.trend > 0,
                    'trend-down': item.trend < 0
                  }"
                >
                  <template v-if="item.trend !== 0">
                    <font-awesome-icon
                      :icon="item.trend > 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"
                      size="xl"
                    />
                  </template>
                  <template v-else> - </template>
                </span>
              </div>
            </fwb-table-cell>
          </fwb-table-row>
        </fwb-table-body>
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
import { type Scenario } from '@/types/scenario.types'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  data: {
    type: Array as () => Scenario[],
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
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

.trend-container {
  @apply flex items-center justify-center;
}

.trend-up {
  @apply text-green-500;
}

.trend-down {
  @apply text-red-500;
}
</style>
