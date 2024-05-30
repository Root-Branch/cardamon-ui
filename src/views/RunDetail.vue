<template>
    <MainLayout>
        <template #title>
            <h1 class="text-2xl font-bold">Run Detail</h1>
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
import { useSingleRunStore } from '@/stores/singleRun';
import { ViewType } from '@/types/views.types';

const route = useRoute();
const runId = route.params.runId;

const singleRunStore = useSingleRunStore();
const widgetStore = useWidgetStore();

const loading = ref(true);
const widgets = ref([] as any[]);

const fetchAllData = async () => {
    try {
        loading.value = true;
        await Promise.all([
            singleRunStore.fetchScenarios(runId as string),
            singleRunStore.fetchMetrics(runId as string),
            singleRunStore.fetchCpuMetrics(runId as string),
        ]);
        await widgetStore.initializeWidgets(ViewType.SINGLE_RUN, runId as string);
        widgets.value = widgetStore.singleRunWidgets;
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
    () => widgetStore.singleRunWidgets,
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
