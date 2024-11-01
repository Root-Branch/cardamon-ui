<template>
    <Pie :data="chartData" :options="computedChartOptions" />
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { Pie } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PointElement,
    ArcElement,
    LinearScale,
    CategoryScale,
    type ChartData,
    type ChartOptions
} from 'chart.js';
import { useThemeStore } from '@/stores/theme';

ChartJS.register(Title, Tooltip, Legend, PointElement, ArcElement, LinearScale, CategoryScale);

interface ChartProps {
    chartData: ChartData<'pie'>;
    chartOptions: ChartOptions<'pie'>;
}

const props = defineProps<ChartProps>();

const themeStore = useThemeStore();
const darkMode = computed(() => themeStore.darkMode);

const computedChartOptions = computed(() => {
    const baseOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    color: darkMode.value ? 'white' : 'black'
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: darkMode.value ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                titleColor: darkMode.value ? 'black' : 'white',
                bodyColor: darkMode.value ? 'black' : 'white'
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
