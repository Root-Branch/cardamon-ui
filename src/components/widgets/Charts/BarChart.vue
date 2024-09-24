<template>
  <Bar :data="chartData" :options="computedChartOptions" />
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  type ChartData,
  type ChartOptions
} from 'chart.js'
import { useThemeStore } from '@/stores/theme'

ChartJS.register(Title, Tooltip, Legend, BarElement, PointElement, LinearScale, CategoryScale)

interface ChartProps {
  chartData: ChartData<'bar'>
  chartOptions: ChartOptions<'bar'>
}

const props = defineProps<ChartProps>()

const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)

const computedChartOptions = computed(() => {
  const baseOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: darkMode.value ? 'white' : 'black' // Adjust legend text color
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: darkMode.value ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)', // Adjust tooltip background color
        titleColor: darkMode.value ? 'black' : 'white', // Adjust tooltip title color
        bodyColor: darkMode.value ? 'black' : 'white' // Adjust tooltip body color
      },
      title: {
        display: true,
        text: 'Bar Chart',
        color: darkMode.value ? 'white' : 'black' // Adjust title color
      }
    },
    scales: {
      x: {
        ticks: {
          color: darkMode.value ? 'white' : 'black' // Adjust x-axis tick color
        },
        grid: {
          color: darkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' // Adjust x-axis grid color
        }
      },
      y: {
        ticks: {
          color: darkMode.value ? 'white' : 'black' // Adjust y-axis tick color
        },
        grid: {
          color: darkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' // Adjust y-axis grid color
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }

  return {
    ...baseOptions,
    ...props.chartOptions
  }
})
</script>
