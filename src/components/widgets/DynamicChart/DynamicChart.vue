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
      <!-- Header with title and actions -->
      <div class="dynamic-chart__header">
        <h3 class="dynamic-chart__title">
          CO2 Emission and Power Consumption for Run ID: {{ widgetStore.currentRunId }}
        </h3>
      </div>
      <!-- Metric buttons and chart type selector -->
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
        <fwb-dropdown :text="chartTypeText" align-to-end>
          <template #trigger>
            <button class="dynamic-chart__chart-type-button">
              <span class="mr-2">{{ chartTypeText }}</span>
              <font-awesome-icon icon="chevron-down" />
            </button>
          </template>
          <div class="dynamic-chart__dropdown-menu">
            <button
              @click="() => changeChartType(ChartType.LINE)"
              class="dynamic-chart__dropdown-item"
            >
              Line Chart
            </button>
            <button
              @click="() => changeChartType(ChartType.BAR)"
              class="dynamic-chart__dropdown-item"
            >
              Bar Chart
            </button>
            <button
              @click="() => changeChartType(ChartType.PIE)"
              class="dynamic-chart__dropdown-item"
            >
              Pie Chart
            </button>
          </div>
        </fwb-dropdown>
      </div>
      <!-- Total value display -->
      <div class="dynamic-chart__total">
        <div class="dynamic-chart__total-title">TOTAL {{ selectedMetric.replace('_', ' ') }}</div>
        <div class="dynamic-chart__total-value">{{ totalValue }} {{ unit }}</div>
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { FwbDropdown } from 'flowbite-vue'
import { useWidgetStore } from '@/stores/widgets'
import type { Widget } from '@/types/widgets.types'
import LineChart from '../Charts/LineChart.vue'
import BarChart from '../Charts/BarChart.vue'
import PieChart from '../Charts/PieChart.vue'
import { ChartType, MetricType, type MetaData } from '@/types/chart.types'
import {
  chartBackgroundColor,
  chartBorderColor,
  darkModeChartBackgroundColor,
  darkModeChartBorderColor
} from '@/constants/chart.const'
import { useThemeStore } from '@/stores/theme'

const minWidth = 3
const minHeight = 5

const props = defineProps<{
  data: Widget<MetaData>
}>()

const widgetStore = useWidgetStore()

const selectedMetric = ref<MetricType>(MetricType.CO2)
const chartType = ref<ChartType>(ChartType.BAR)

const metrics = Object.values(MetricType)

// Mock function to generate random data
const generateMockData = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

const currentRun = computed(() => {
  return (
    props.data.metadata.runs.find((run) => run.run_id === widgetStore.currentRunId) || {
      iterations: []
    }
  )
})

const totalValue = computed(() => {
  const iterations = currentRun.value.iterations
  let total = 0
  for (const iteration of iterations) {
    switch (selectedMetric.value) {
      case MetricType.CO2:
        total += generateMockData(0.1, 1) // Mock CO2 emission data (0.1 to 1 kg)
        break
      case MetricType.POWER:
        total += generateMockData(1, 10) // Mock power consumption data (1 to 10 kWh)
        break
    }
  }
  return total.toFixed(2)
})

const unit = computed(() => {
  switch (selectedMetric.value) {
    case MetricType.CO2:
      return 'kg'
    case MetricType.POWER:
      return 'kWh'
    default:
      return ''
  }
})

const titleText = computed(() => {
  switch (selectedMetric.value) {
    case MetricType.CO2:
      return 'Total CO2 Emissions'
    case MetricType.POWER:
      return 'Total Power Consumption'
    default:
      return 'Metric'
  }
})

const ChartComponent = computed(() => {
  switch (chartType.value) {
    case ChartType.LINE:
      return LineChart
    case ChartType.BAR:
      return BarChart
    case ChartType.PIE:
      return PieChart
    default:
      return LineChart
  }
})

const chartTypeText = computed(() => {
  switch (chartType.value) {
    case ChartType.LINE:
      return 'Line Chart'
    case ChartType.BAR:
      return 'Bar Chart'
    case ChartType.PIE:
      return 'Pie Chart'
    default:
      return 'Chart'
  }
})

const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)

const chartData = computed(() => ({
  labels: currentRun.value.iterations.map((iteration) => `Iteration ${iteration.iteration}`),
  datasets: [
    {
      label: selectedMetric.value,
      data: currentRun.value.iterations.map(() => {
        switch (selectedMetric.value) {
          case MetricType.CO2:
            return generateMockData(0.1, 1) // Mock CO2 emission data (0.1 to 1 kg)
          case MetricType.POWER:
            return generateMockData(1, 10) // Mock power consumption data (1 to 10 kWh)
          default:
            return 0
        }
      }),
      backgroundColor:
        chartType.value === ChartType.PIE
          ? darkMode.value
            ? darkModeChartBackgroundColor
            : chartBackgroundColor
          : darkMode.value
            ? darkModeChartBackgroundColor[0]
            : chartBackgroundColor[0],
      borderColor:
        chartType.value === ChartType.PIE
          ? darkMode.value
            ? darkModeChartBorderColor
            : chartBorderColor
          : darkMode.value
            ? darkModeChartBorderColor[0]
            : chartBorderColor[0],
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
  },
  scales: {
    x: {
      ticks: {
        color: darkMode.value ? 'white' : 'black'
      },
      grid: {
        color: darkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }
    },
    y: {
      ticks: {
        color: darkMode.value ? 'white' : 'black'
      },
      grid: {
        color: darkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
}))

// Change chart type and selected metric
const changeChartType = (type: ChartType) => {
  chartType.value = type
}

const selectMetric = (metric: MetricType) => {
  selectedMetric.value = metric
}
</script>

<style scoped>
.dynamic-chart {
  @apply p-6 rounded-lg drop-shadow-widget bg-white dark:bg-gray-800 dark:text-gray-200 cursor-move;
}

.dynamic-chart__header {
  @apply flex justify-between items-center;
}

.dynamic-chart__title {
  @apply text-lg font-semibold;
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

.dynamic-chart__chart-type-button {
  @apply text-gray-500 flex justify-between items-center rounded-xl px-6 py-2 border border-gray-300 text-sm dark:text-white dark:border-gray-600;
}

.dynamic-chart__dropdown-menu {
  @apply bg-white rounded shadow-lg w-40 text-sm dark:bg-gray-800 dark:text-gray-200;
}

.dynamic-chart__dropdown-item {
  @apply p-2 w-full hover:bg-gray-100 dark:hover:bg-gray-700;
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

.dynamic-chart__chart-container {
  @apply mt-4 cursor-pointer;
}
</style>
