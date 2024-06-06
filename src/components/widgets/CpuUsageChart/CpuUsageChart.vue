<template>
    <div :id="data.id" :gs-id="data.id" :gs-x="data.grid.x" :gs-y="data.grid.y" :gs-w="data.grid.w" :gs-h="data.grid.h"
        :gs-min-w="minWidth" :gs-min-h="minHeight">
        <div
            class="cpu-usage-chart grid-stack-item-content p-6 rounded-lg drop-shadow-widget bg-white dark:bg-gray-800">
            <!-- Header with title and actions -->
            <div class="cpu-usage-chart__header">
                <h3 class="cpu-usage-chart__title">{{ data.title }}</h3>
                <WidgetActions @duplicateWidget="duplicateWidget" @deleteWidget="deleteWidget"
                    :dark-background="darkMode" />
            </div>
            <!-- Average value display -->
            <div class="cpu-usage-chart__average-container">
                <div class="cpu-usage-chart__average-title">AVERAGE CPU UTILIZATION</div>
                <div class="cpu-usage-chart__average-value">{{ averageCpuUsage }} %</div>
            </div>
            <!-- Chart canvas -->
            <div class="cpu-usage-chart__chart-container">
                <PieChart :chartData="chartData" :chartOptions="chartOptions" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { defineProps, defineEmits } from 'vue';
import WidgetActions from '../WidgetActions.vue';
import { useWidgetActions } from '@/composables/useWidgetActions';
import type { Widget } from '@/types/widgets.types';
import PieChart from '../Charts/PieChart.vue';
import type { CpuUsageMetaData } from '@/types/chart.types';
import { chartBackgroundColor, chartBorderColor, darkModeChartBackgroundColor, darkModeChartBorderColor } from '@/constants/chart.const';
import { useThemeStore } from '@/stores/theme';

const minWidth = 2;
const minHeight = 5;

const props = defineProps<{
    data: Widget<CpuUsageMetaData>;
}>();

const themeStore = useThemeStore();
const darkMode = computed(() => themeStore.darkMode);

const averageCpuUsage = computed(() => {
    const totalCpuUsage = props.data.metadata.data.reduce((acc, d) => acc + d.cpuUsage, 0);
    return (totalCpuUsage / props.data.metadata.data.length).toFixed(2);
});

const chartData = computed(() => ({
    labels: props.data.metadata.data.map(d => d.processName),
    datasets: [
        {
            label: 'CPU Usage',
            data: props.data.metadata.data.map(d => d.cpuUsage),
            backgroundColor: darkMode.value ? darkModeChartBackgroundColor : chartBackgroundColor,
            borderColor: darkMode.value ? darkModeChartBorderColor : chartBorderColor,
            borderWidth: 1,
        },
    ],
}));

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'right',
        },
        tooltip: {
            enabled: true,
        },
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
    },
} as any;

const emit = defineEmits(['duplicate', 'delete']);

const { duplicateWidget, deleteWidget } = useWidgetActions(props, emit);
</script>

<style scoped>
.cpu-usage-chart {
    @apply p-6 rounded-lg drop-shadow-widget bg-white dark:bg-gray-800;
}

.cpu-usage-chart__header {
    @apply flex justify-between items-center;
}

.cpu-usage-chart__title {
    @apply text-lg font-semibold dark:text-gray-200;
}

.cpu-usage-chart__average-container {
    @apply text-left mt-8;
}

.cpu-usage-chart__average-title {
    @apply text-sm font-light text-gray-500 dark:text-gray-400;
}

.cpu-usage-chart__average-value {
    @apply text-5xl font-bold text-chart-value mt-2 dark:text-white;
}

.cpu-usage-chart__chart-container {
    @apply mt-4;
}
</style>
