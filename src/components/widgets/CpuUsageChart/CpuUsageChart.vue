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
        <h3 class="cpu-usage__title">{{ data.title }}</h3>
      </div>
      <!-- Selectors for run, iteration, and processes -->
      <div class="cpu-usage__selectors">
        <div class="cpu-usage__selector-container w-1/3">
          <label for="run-iteration-select" class="cpu-usage__label">Run ID - Iteration</label>
          <select
            id="run-iteration-select"
            v-model="selectedRunIteration"
            @change="updateChartData"
            class="cpu-usage__select"
          >
            <option
              v-for="run in data.metadata.runs"
              :key="`${run.run_id}-${run.iteration}`"
              :value="`${run.run_id}-${run.iteration}`"
            >
              {{ run.run_id }} - {{ run.iteration }}
            </option>
          </select>
        </div>
        <div class="cpu-usage__selector-container w-1/3">
          <label for="process-select" class="cpu-usage__label">Processes</label>
          <select
            id="process-select"
            v-model="selectedProcess"
            @change="updateChartData"
            class="cpu-usage__select"
          >
            <option value="all">All Processes</option>
            <option v-for="process in processes" :key="process" :value="process">
              {{ process }}
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
import LineChart from '../Charts/LineChart.vue'
import type { Widget } from '@/types/widgets.types'
import type { MetaData } from '@/types/chart.types'
import { getColor } from '@/utils/color.utils'

const minWidth = 2
const minHeight = 5

const props = defineProps<{
  data: Widget<MetaData>
}>()

const selectedRunIteration = ref('')
const selectedProcess = ref('all')

const processes = computed(() => {
  const [selectedRunId, selectedIteration] = selectedRunIteration.value.split('-')
  const selectedRunData = props.data.metadata.runs.find(
    (run) => run.run_id === selectedRunId && run.iteration === Number(selectedIteration)
  )
  if (!selectedRunData) return []
  const processNames = selectedRunData.cpu_utilization.map((process) => Object.keys(process)[0])
  return processNames
})

const chartData = ref({ labels: [], datasets: [] })

const updateChartData = () => {
  const [selectedRunId, selectedIteration] = selectedRunIteration.value.split('-')
  const selectedRunData = props.data.metadata.runs.find(
    (run) => run.run_id === selectedRunId && run.iteration === Number(selectedIteration)
  )
  if (!selectedRunData) return

  const labels = selectedRunData.cpu_utilization[0][
    Object.keys(selectedRunData.cpu_utilization[0])[0]
  ].map((d) => new Date(d.timestamp * 1000).toLocaleTimeString())

  const datasets = selectedRunData.cpu_utilization
    .map((process, index) => {
      const processName = Object.keys(process)[0]
      if (selectedProcess.value !== 'all' && selectedProcess.value !== processName) return null
      return {
        label: processName,
        data: process[processName].map((d) => d.cpu_usage),
        backgroundColor: getColor(index),
        borderColor: getColor(index),
        borderWidth: 1,
        fill: false,
        tension: 0.1
      }
    })
    .filter((ds) => ds !== null)

  chartData.value = {
    labels,
    datasets
  }
}

const avgCpuUtilization = computed(() => {
  const [selectedRunId, selectedIteration] = selectedRunIteration.value.split('-')
  const selectedRunData = props.data.metadata.runs.find(
    (run) => run.run_id === selectedRunId && run.iteration === Number(selectedIteration)
  )
  if (!selectedRunData) return 0

  const totalCpuUsage = selectedRunData.cpu_utilization
    .flatMap((process) => Object.values(process)[0])
    .reduce((acc, usage) => acc + Number(usage.cpu_usage), 0)

  const count = selectedRunData.cpu_utilization.flatMap(
    (process) => Object.values(process)[0]
  ).length

  return (totalCpuUsage / count).toFixed(2)
})

const initializeSelections = () => {
  if (props.data.metadata.runs.length > 0) {
    selectedRunIteration.value = `${props.data.metadata.runs[0].run_id}-${props.data.metadata.runs[0].iteration}`
    selectedProcess.value = 'all'
  }
}

onMounted(() => {
  initializeSelections()
  updateChartData()
})

watch([selectedRunIteration, selectedProcess], updateChartData)

watch(
  () => props.data,
  async () => {
    await nextTick()
    initializeSelections()
    updateChartData()
  },
  { deep: true }
)
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
