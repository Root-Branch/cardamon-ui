<template>
    <header class="header">
        <div class="header-container">
            <div class="logo-section">
                <img src="/logo.svg" alt="Logo" class="logo-image">
            </div>

            <div class="right-section">
                <!-- Add Widget Button -->
                <div class="button-container">
                    <fwb-button pill class="add-widget-button" @click="openSidebar">
                        <template #prefix>
                            <font-awesome-icon icon="circle-plus" class="mr-2" />
                        </template>
                        Add Widget
                    </fwb-button>
                </div>

                <!-- Database Info Icon with Tooltip -->
                <fwb-tooltip placement="bottom">
                    <template #trigger>
                        <font-awesome-layers class="fa-lg db-icon">
                            <font-awesome-icon icon="fa-solid fa-circle" class="circle-icon" transform="grow-13" />
                            <font-awesome-icon icon="fa-solid fa-database" class="database-icon" />
                        </font-awesome-layers>
                    </template>
                    <template #content>
                        <div class="tooltip-content">
                            <span class="text-sm font-bold">Database Endpoint: </span>
                            <span class="text-sm text-gray-500 font-normal">Database URL info</span>
                        </div>
                    </template>
                </fwb-tooltip>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { FwbButton, FwbTooltip } from 'flowbite-vue';
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';
import { useWidgetStore } from '@/stores/widgets';

const widgetStore = useWidgetStore();

const openSidebar = () => {
    widgetStore.setSidebarVisible(true);
};
</script>

<style scoped>
.header {
    @apply fixed top-0 z-50 h-[81px] w-full border-b border-solid border-gray-200 bg-white
}

.header-container {
    @apply flex h-full items-center justify-between pr-10;
}

.logo-section {
    @apply flex items-center justify-center min-w-[240px] h-full border-r border-solid border-gray-200;
}

.logo-image {
    @apply h-10;
}

.right-section {
    @apply flex items-center space-x-4 pr-10;
}

.button-container {
    @apply pr-4;
}

.add-widget-button {
    @apply bg-blue-600 text-white border-none;
}

.db-icon {
    @apply text-gray-600;
}

.circle-icon {
    @apply text-neutral-400;
}

.database-icon {
    @apply text-white;
}

.tooltip-content {
    @apply p-2 mr-4 rounded-lg border border-gray-200;
}
</style>