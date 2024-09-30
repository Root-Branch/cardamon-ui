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
        <h3 class="cpu-usage__title">CPU Usage Timeline</h3>
      </div>
      <!-- Selector for run and iteration -->
      <div class="cpu-usage__selectors">
        <div class="cpu-usage__selector-container">
          <select
            id="run-iteration-select"
            v-model="selectedRunIteration"
            @change="updateChartData"
            class="cpu-usage__select"
          >
            <option v-for="(iteration, index) in iterations" :key="index" :value="index">
              Iteration {{ index + 1 }}
            </option>
          </select>
        </div>
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

const selectedRunIteration = ref(0)

const selectedRun = computed(() => widgetStore.selectedRun)

const iterations = computed(() => {
  return selectedRun.value?.processes[0]?.iterationMetrics || []
})

const chartData = ref({ labels: [], datasets: [] } as ChartData<'line'>)

const updateChartData = () => {
  const iterationIndex = selectedRunIteration.value

  if (!selectedRun.value || !selectedRun.value.processes.length) {
    chartData.value = { labels: [], datasets: [] }
    return
  }

  const allTimestamps = new Set<number>()
  selectedRun.value.processes.forEach((process) => {
    const iteration = process.iterationMetrics[iterationIndex]
    if (iteration && iteration.length > 1) {
      iteration.slice(1).forEach((d) => allTimestamps.add(d.timestamp))
    }
  })

  const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b)

  const datasets = selectedRun.value.processes
    .map((process, index) => {
      const iteration = process.iterationMetrics[iterationIndex]
      if (!iteration || iteration.length <= 1) return null

      const dataMap = new Map(iteration.slice(1).map((d) => [d.timestamp, d.cpu_usage]))

      return {
        label: process.processName,
        data: sortedTimestamps.map((ts) => ({
          x: ts,
          y: dataMap.get(ts) ?? null
        })),
        backgroundColor: getColor(index),
        borderColor: getColor(index),
        borderWidth: 1,
        fill: false,
        tension: 0.1,
        spanGaps: true
      }
    })
    .filter(Boolean)

  chartData.value = {
    datasets
  }
}

onMounted(() => {
  updateChartData()
})

watch(selectedRunIteration, updateChartData)

watch(
  () => selectedRun.value,
  async () => {
    await nextTick()
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
      title: {
        display: true,
        text: 'CPU Usage (%)'
      }
    },
    x: {
      type: 'time',
      time: {
        unit: 'second',
        stepSize: 1,
        displayFormats: {
          second: 'HH:mm:ss'
        }
      },
      title: {
        display: true,
        text: 'Time'
      },
      ticks: {
        source: 'auto',
        autoSkip: false,
        maxRotation: 0
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        title: (context) => {
          const timestamp = context[0].parsed.x
          return new Date(timestamp).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3
          })
        }
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

.cpu-usage__chart-container {
  @apply mt-4 cursor-pointer h-72;
}
</style>
