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
    <div class="grid-stack-item-content grid-stack-item dynamic-chart">
      <!-- Header with title -->
      <div class="dynamic-chart__header">
        <h3 class="dynamic-chart__title">Distribution by Processes</h3>
        <div class="dynamic-chart__controls">
          <div class="dynamic-chart__metrics">
            <button
              v-for="metric in metrics"
              :key="metric"
              @click="selectMetric(metric)"
              :class="['dynamic-chart__metric-button', { active: selectedMetric === metric }]"
            >
              {{ metric }}
            </button>
          </div>
        </div>
      </div>
      <!-- Total value display -->
      <div class="dynamic-chart__total">
        <div class="dynamic-chart__total-title">TOTAL {{ selectedMetric }}</div>
        <div class="dynamic-chart__total-value">
          {{ totalValue }}
        </div>
      </div>
      <!-- Chart canvas -->
      <div class="dynamic-chart__chart-container">
        <component :is="ChartComponent" :chart-data="chartData" :chart-options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { defineProps } from 'vue'
import { useWidgetStore } from '@/stores/widgets'
import PieChart from '../Charts/PieChart.vue'
import {
  chartBackgroundColor,
  chartBorderColor,
  darkModeChartBackgroundColor,
  darkModeChartBorderColor
} from '@/constants/chart.const'
import { useThemeStore } from '@/stores/theme'
import type { MetaData } from '@/types/scenario.types'
import type { Widget } from '@/types/widgets.types'
import { MetricType } from '@/types/chart.types'

const minWidth = 3
const minHeight = 5

const props = defineProps<{
  data: Widget<MetaData>
}>()

const widgetStore = useWidgetStore()
const selectedRun = computed(() => widgetStore.selectedRun)

const selectedMetric = ref<MetricType>(MetricType.POWER)

const metrics = Object.values(MetricType)

const ChartComponent = ref(PieChart)

const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)

const totalValue = computed(() => {
  return selectedMetric.value === MetricType.POWER
    ? `${selectedRun.value?.pow.toFixed(4)} W`
    : `${selectedRun.value?.co2.toFixed(4)} g`
})

const chartData = computed(() => ({
  labels: selectedRun.value?.processes.map((process: any) => process.processName) || [],
  datasets: [
    {
      label: 'Power Contribution',
      data: selectedRun.value?.processes.map((process: any) => process.powContribPerc) || [],
      backgroundColor: darkMode.value ? darkModeChartBackgroundColor : chartBackgroundColor,
      borderColor: darkMode.value ? darkModeChartBorderColor : chartBorderColor,
      borderWidth: 1
    }
  ]
}))

const chartOptions: any = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      enabled: true,
      backgroundColor: darkMode.value ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
      titleColor: darkMode.value ? 'black' : 'white',
      bodyColor: darkMode.value ? 'black' : 'white'
    },
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: darkMode.value ? 'white' : 'black'
      }
    }
  }
}))

const selectMetric = (metric: MetricType) => {
  selectedMetric.value = metric
}
</script>

<style scoped>
.dynamic-chart {
  @apply p-6 rounded-lg drop-shadow-widget bg-white dark:bg-gray-800 dark:text-gray-200 cursor-move;
}

.dynamic-chart__header {
  @apply mb-4 flex justify-between items-center;
}

.dynamic-chart__title {
  @apply text-xl font-semibold text-gray-900 dark:text-gray-200;
}

.dynamic-chart__total {
  @apply text-left mt-8;
}

.dynamic-chart__total-title {
  @apply text-sm font-light text-gray-500 dark:text-gray-400;
}

.dynamic-chart__total-value {
  @apply text-5xl font-bold text-chart-value mt-2 dark:text-white;
}

.dynamic-chart__controls {
  @apply flex justify-between items-center mt-4;
}

.dynamic-chart__metrics {
  @apply flex space-x-2;
}

.dynamic-chart__metric-button {
  @apply bg-gray-400 text-white px-6 py-2 rounded-xl text-xs font-light;
}

.dynamic-chart__metric-button.active {
  @apply bg-blue-500 text-white;
}

.dynamic-chart__metric-button:not(.active):hover {
  @apply bg-gray-300;
}

.dynamic-chart__chart-container {
  @apply h-72 cursor-pointer;
}
</style>
