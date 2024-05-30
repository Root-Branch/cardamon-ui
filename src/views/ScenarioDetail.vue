<template>
    <MainLayout>
        <template #title>
            <h1 class="text-2xl font-bold">Scenario Detail</h1>
        </template>
        <template #breadcrumbs>
            <AppBreadcrumb />
        </template>
        <template #dashboard>
            <AppDashboard v-if="!loading" :widgets="widgets" />
            <div v-else class="loading-spinner">Loading...</div>
        </template>
    </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import AppDashboard from '@/components/Dashboard/AppDashboard.vue';
import AppBreadcrumb from '@/components/Common/Breadcrumb/AppBreadcrumb.vue';
import { useWidgetStore } from '@/stores/widgets';
import { useScenarioStore } from '@/stores/scenario';
import { ViewType } from '@/types/views.types';

const route = useRoute();
const scenarioId = route.params.scenarioId;

const scenarioStore = useScenarioStore();
const widgetStore = useWidgetStore();

const loading = ref(true);
const widgets = ref([] as any[]);

const fetchAllData = async () => {
    try {
        loading.value = true;
        await Promise.all([
            scenarioStore.fetchIterations(scenarioId as string),
            scenarioStore.fetchMetrics(scenarioId as string),
            scenarioStore.fetchCpuMetrics(scenarioId as string),
        ]);
        await widgetStore.initializeWidgets(ViewType.SCENARIO, scenarioId as string);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    } finally {
        widgets.value = widgetStore.scenarioWidgets;
        loading.value = false;
    }
};

onMounted(async () => {
    await fetchAllData();
});

watch(
    () => widgetStore.scenarioWidgets,
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
