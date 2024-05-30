<template>
    <div :id="data.id" :gs-id="data.id" :gs-x="data.grid.x" :gs-y="data.grid.y" :gs-w="data.grid.w" :gs-h="data.grid.h"
        :gs-min-w="minWidth" :gs-min-h="minHeight">
        <div class="grid-stack-item-content grid-stack-item p-6 rounded-lg drop-shadow-widget bg-white">
            <!-- Header with title and actions -->
            <div class="header">
                <h3 class="title">{{ data.title }}</h3>
                <WidgetActions @duplicateWidget="duplicateWidget" @deleteWidget="deleteWidget"
                    :dark-background="false" />
            </div>
            <!-- Average value display -->
            <div class="average-container">
                <div class="average-title">AVERAGE CPU UTILIZATION</div>
                <div class="average-value">{{ averageCpuUsage }} %</div>
            </div>
            <!-- Chart canvas -->
            <div class="chart-container mt-4">
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
import { chartBackgroundColor, chartBorderColor } from '@/constants/chart.const';

const minWidth = 2;
const minHeight = 5;

const props = defineProps<{
    data: Widget<CpuUsageMetaData>;
}>();

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
            backgroundColor: chartBackgroundColor,
            borderColor: chartBorderColor,
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
.header {
    @apply flex justify-between items-center;
}

.title {
    @apply text-lg font-semibold;
}

.average-container {
    @apply text-left mt-8;
}

.average-title {
    @apply text-sm font-light text-gray-500;
}

.average-value {
    @apply text-5xl font-bold text-chart-value mt-2;
}

.chart-container {
    @apply mt-4;
}
</style>