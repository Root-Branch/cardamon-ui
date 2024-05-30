<template>
    <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
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

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

interface ChartProps {
    chartData: ChartData<'line'>;
    chartOptions: ChartOptions<'line'>;
}

defineProps<ChartProps>();
</script>,
