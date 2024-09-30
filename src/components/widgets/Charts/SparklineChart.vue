<template>
  <Line :data="chartData" :options="chartOptions" class="sparkline" />
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  type ChartOptions
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip)

interface SparklineProps {
  data: number[]
}

const props = defineProps<SparklineProps>()

const determineLineColor = (data: number[]) => {
  if (data.length < 2) return 'rgba(0, 0, 0, 1)'

  const redLine = 'rgba(255, 99, 132, 1)'
  const greenLine = 'rgba(75, 192, 75, 1)'

  return data[data.length - 1] > data[0] ? redLine : greenLine
}

const chartData = computed(() => ({
  labels: props.data?.map((_, index) => index + 1) || [],
  datasets: [
    {
      data: props.data || [],
      borderColor: determineLineColor(props.data || []),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderWidth: 2,
      pointRadius: 0
    }
  ]
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: false
    },
    y: {
      display: false
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      mode: 'nearest',
      intersect: false,
      callbacks: {
        label: (context) => `CO2 Value: ${context.raw}`
      }
    }
  },
  elements: {
    line: {
      tension: 0.4
    }
  }
}
</script>

<style scoped>
.sparkline {
  height: 40px;
  width: 150px; /* Match the width of the fixed-width column in the table */
}
</style>
