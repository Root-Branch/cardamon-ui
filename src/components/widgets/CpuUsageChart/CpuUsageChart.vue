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
    <div class="cpu-usage grid-stack-item-content grid-stack-item">
      <!-- Header with title and actions -->
      <div class="cpu-usage__header">
        <h3 class="cpu-usage__title">
          CPU Usage Timeline for Run ID: {{ widgetStore.currentRunId }}
        </h3>
      </div>
      <!-- Selector for run and iteration -->
      <div class="cpu-usage__selectors">
        <div class="cpu-usage__selector-container">
          <label for="run-iteration-select" class="cpu-usage__label">Iteration</label>
          <select
            id="run-iteration-select"
            v-model="selectedRunIteration"
            @change="updateChartData"
            class="cpu-usage__select"
          >
            <option
              v-for="run in filteredRunIterations"
              :key="`${run.runId}-${run.iteration}`"
              :value="`${run.runId}-${run.iteration}`"
            >
              Iteration {{ run.iteration }}
            </option>
          </select>
        </div>
      </div>
      <!-- Average CPU utilization display -->
      <div class="cpu-usage__total">
        <div class="cpu-usage__total-title">AVG. CPU UTILIZATION</div>
        <div class="cpu-usage__total-value">{{ avgCpuUtilization }} %</div>
      </div>
      <!-- Chart canvas -->
      <div class="cpu-usage__chart-container">
        <LineChart :chartData="chartData" :chartOptions="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { defineProps } from 'vue'
import { useWidgetStore } from '@/stores/widgets'
import LineChart from '../Charts/LineChart.vue'
import type { Widget } from '@/types/widgets.types'
import { getColor } from '@/utils/color.utils'
import type { MetaData } from '@/types/scenario.types'
import type { ChartData } from 'chart.js'

const widgetStore = useWidgetStore()

const minWidth = 2
const minHeight = 5

const props = defineProps<{
  data: Widget<MetaData>
}>()

const selectedRunIteration = ref('')

const filteredRunIterations = computed(() => {
  const currentRunId = widgetStore.currentRunId
  if (!currentRunId) return []

  const currentRun = props.data.metadata.runs.find((run) => run.run_id === currentRunId)
  if (!currentRun) return []

  return currentRun.iterations.map((iteration) => ({
    runId: currentRun.run_id,
    iteration: iteration.iteration
  }))
})

const chartData = ref({ labels: [], datasets: [] } as ChartData<'line'>)

const updateChartData = () => {
  const [selectedRunId, selectedIteration] = selectedRunIteration.value.split('-')
  const selectedRun = props.data.metadata.runs.find((run) => run.run_id === selectedRunId)
  const selectedRunData = selectedRun?.iterations.find(
    (iteration) => iteration.iteration === Number(selectedIteration)
  )

  if (!selectedRunData || !selectedRunData.usage) {
    chartData.value = { labels: [], datasets: [] }
    return
  }

  const labels = selectedRunData.usage.map((d) => new Date(d.timestamp).toLocaleTimeString())

  const datasets = [
    {
      label: 'CPU Usage',
      data: selectedRunData.usage.map((d) => d.cpuUsage),
      backgroundColor: getColor(0),
      borderColor: getColor(0),
      borderWidth: 1,
      fill: false,
      tension: 0.1
    }
  ]

  chartData.value = {
    labels,
    datasets
  }
}

const avgCpuUtilization = computed(() => {
  const [selectedRunId, selectedIteration] = selectedRunIteration.value.split('-')
  const selectedRun = props.data.metadata.runs.find((run) => run.run_id === selectedRunId)
  const selectedRunData = selectedRun?.iterations.find(
    (iteration) => iteration.iteration === Number(selectedIteration)
  )

  if (!selectedRunData || !selectedRunData.usage) return '0.00'

  const totalCpuUsage = selectedRunData.usage.reduce((acc, usage) => acc + usage.cpuUsage, 0)
  const count = selectedRunData.usage.length

  return (totalCpuUsage / count).toFixed(2)
})

const initializeSelections = () => {
  if (filteredRunIterations.value.length > 0) {
    const firstRun = filteredRunIterations.value[0]
    selectedRunIteration.value = `${firstRun.runId}-${firstRun.iteration}`
  }
}

onMounted(() => {
  initializeSelections()
  updateChartData()
})

watch(selectedRunIteration, updateChartData)

watch(
  [() => props.data, () => widgetStore.currentRunId],
  async () => {
    await nextTick()
    initializeSelections()
    updateChartData()
  },
  { deep: true }
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'CPU Usage (%)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Time'
      }
    }
  }
}
</script>

<style scoped>
.cpu-usage {
  @apply p-6 rounded-lg drop-shadow-widget bg-white dark:bg-gray-800 cursor-move;
}

.cpu-usage__header {
  @apply flex justify-between items-center;
}

.cpu-usage__title {
  @apply text-lg font-semibold dark:text-gray-200;
}

.cpu-usage__selectors {
  @apply flex space-x-4 my-4;
}

.cpu-usage__selector-container {
  @apply relative;
}

.cpu-usage__label {
  @apply text-sm font-semibold dark:text-gray-200;
}

.cpu-usage__select {
  @apply cursor-pointer block w-full p-2 rounded-xl font-light text-sm border dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700;
}

.cpu-usage__total {
  @apply text-left mt-8;
}

.cpu-usage__total-title {
  @apply text-sm font-light text-gray-500 dark:text-gray-400;
}

.cpu-usage__total-value {
  @apply text-5xl font-bold text-chart-value mt-2 dark:text-white;
}

.cpu-usage__chart-container {
  @apply mt-4 cursor-pointer;
}
</style>
