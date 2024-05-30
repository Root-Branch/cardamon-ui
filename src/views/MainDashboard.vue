<template>
    <MainLayout>
        <template #title>
            <h1 class="text-2xl font-bold">Cardamon Dashboard</h1>
        </template>
        <template #filters>
            <TimeFilter />
        </template>
        <template #dashboard>
            <AppDashboard v-if="!loading" :widgets="widgets" />
            <div v-else class="loading-spinner">Loading...</div>
        </template>
    </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import AppDashboard from '@/components/Dashboard/AppDashboard.vue';
import TimeFilter from '@/components/Common/Filters/TimeFilter.vue';
import { useWidgetStore } from '@/stores/widgets';
import { useDateRangeStore } from '@/stores/dateRange';
import { useRunsStore } from '@/stores/runs';
import { ViewType } from '@/types/views.types';

const runsStore = useRunsStore();
const widgetStore = useWidgetStore();
const dateRangeStore = useDateRangeStore();

const loading = ref(true);
const widgets = ref([] as any[]);

const fetchAllData = async () => {
    try {
        loading.value = true;
        const { startDate, endDate } = dateRangeStore;
        await Promise.all([
            runsStore.fetchRuns(startDate, endDate),
            runsStore.fetchMetrics(startDate, endDate),
            runsStore.fetchCpuMetrics(startDate, endDate)
        ]);
        await widgetStore.initializeWidgets(ViewType.RUNS);
        widgets.value = widgetStore.runsWidgets;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await fetchAllData();
});

watch(
    () => [dateRangeStore.startDate, dateRangeStore.endDate],
    async () => await fetchAllData()
);

watch(
    () => widgetStore.runsWidgets,
    (newWidgets) => {
        widgets.value = newWidgets;
    }
);

</script>

<style scoped>
.loading-spinner {
    @apply flex items-center justify-center h-full;
}
</style>
