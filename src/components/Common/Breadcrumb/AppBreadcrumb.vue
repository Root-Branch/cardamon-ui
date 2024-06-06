<template>
    <fwb-breadcrumb>
        <fwb-breadcrumb-item class="breadcrumb__item" home href="/dashboard">
            <template #home-icon>
                <font-awesome-icon :icon="['fas', 'clone']" class="breadcrumb__icon breadcrumb__item-text" />
            </template>
            <div>
                <router-link to="/dashboard" class="flex items-center">
                    <span class="breadcrumb__item-text">Dashboard</span>
                </router-link>
            </div>
        </fwb-breadcrumb-item>
        <fwb-breadcrumb-item class="breadcrumb__item" v-if="runId">
            <span class="breadcrumb__item-text">Cardamon Run ID: {{ runId }}</span>
        </fwb-breadcrumb-item>
        <fwb-breadcrumb-item class="breadcrumb__item" v-if="scenarioId">
            <span class="breadcrumb__item-text">Scenario ID: {{ scenarioId }}</span>
        </fwb-breadcrumb-item>
    </fwb-breadcrumb>
</template>

<script setup lang="ts">
import { FwbBreadcrumb, FwbBreadcrumbItem } from 'flowbite-vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const route = useRoute();
const runId = route.params.runId;
const scenarioId = route.params.scenarioId;
</script>

<style scoped>
.breadcrumb__item {
    @apply text-gray-500 dark:text-gray-300;
}

.breadcrumb__item-text {
    @apply ml-2 font-light text-gray-500 dark:text-gray-300;
}

.breadcrumb__icon {
    @apply mr-2;
}
</style>
