<template>
    <fwb-breadcrumb>
        <fwb-breadcrumb-item class="breadcrumb-item" home href="/dashboard">
            <template #home-icon>
                <font-awesome-icon :icon="['fas', 'clone']" class="icon breadcrumb-item__text" />'
            </template>
            <span class="breadcrumb-item__text">Dashboard</span>
        </fwb-breadcrumb-item>
        <fwb-breadcrumb-item class="breadcrumb-item" v-if="runId">
            <span class="breadcrumb-item__text">Cardamon Run ID: {{ runId }}</span>
        </fwb-breadcrumb-item>
        <fwb-breadcrumb-item class="breadcrumb-item" v-if="scenarioId">
            <span class="breadcrumb-item__text">Scenario ID: {{ scenarioId }}</span>
        </fwb-breadcrumb-item>
    </fwb-breadcrumb>
</template>

<script setup>
import { FwbBreadcrumb, FwbBreadcrumbItem } from 'flowbite-vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const route = useRoute();
const runId = route.params.runId;
const scenarioId = route.params.scenarioId;
</script>

<style scoped>
.mr-2 {
    margin-right: 0.5rem;
}

.breadcrumb-item {
    @apply text-gray-500;
}

.breadcrumb-item__text {
    @apply ml-2 font-light text-gray-500;
}
</style>
