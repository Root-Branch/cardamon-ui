<template>
    <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Bar } from 'vue-chartjs';
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
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, PointElement, LinearScale, CategoryScale);

interface ChartProps {
    chartData: ChartData<'bar'>;
    chartOptions: ChartOptions<'bar'>;
}

defineProps<ChartProps>();
</script>,
