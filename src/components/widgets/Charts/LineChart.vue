<template>
    <Line :data="chartData" :options="computedChartOptions" />
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    type ChartData,
    type ChartOptions
} from 'chart.js';
import { useThemeStore } from '@/stores/theme';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

interface ChartProps {
    chartData: ChartData<'line'>;
    chartOptions: ChartOptions<'line'>;
}

const props = defineProps<ChartProps>();

const themeStore = useThemeStore();
const darkMode = computed(() => themeStore.darkMode);

const computedChartOptions = computed(() => {
    const baseOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: darkMode.value ? 'white' : 'black'
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: darkMode.value ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)', 
                titleColor: darkMode.value ? 'black' : 'white',
                bodyColor: darkMode.value ? 'black' : 'white'
            },
            title: {
                display: true,
                text: 'Line Chart',
                color: darkMode.value ? 'white' : 'black' 
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
            intersect: false,
        },
    };

    return {
        ...props.chartOptions,
        ...baseOptions
    };
});
</script>
