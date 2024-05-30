<template>
    <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
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

ChartJS.register(Title, Tooltip, Legend, PointElement, ArcElement, LinearScale, CategoryScale);

interface ChartProps {
    chartData: ChartData<'pie'>;
    chartOptions: ChartOptions<'pie'>;
}

defineProps<ChartProps>();
</script>,
