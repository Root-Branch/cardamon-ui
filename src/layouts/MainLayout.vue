<template>
    <div class="flex flex-col font-sans">
        <div :class="{ 'blurred': widgetStore.sidebarVisible }" class="flex flex-col pt-[81px]">
            <AppHeader />
            <AppSidebar />
            <div class="ml-[240px] h-full p-8 py-5 lg:min-h-[calc(100vh-122px)]">
                <div class="mt-4 ml-2">
                    <slot name="title"></slot>
                </div>
                <div class="mt-4 ml-2">
                    <slot name="filters"></slot>
                </div>
                <div class="mt-4 ml-2">
                    <slot name="breadcrumbs"></slot>
                </div>
                <div class="mt-4">
                    <slot name="dashboard"></slot>
                </div>
            </div>
        </div>
        <AddWidgetSidebar />
    </div>
</template>

<script setup lang="ts">
import { useWidgetStore } from '@/stores/widgets';
import AppSidebar from '@/components/Common/Sidebar/AppSidebar.vue';
import AppHeader from '@/components/Common/Header/AppHeader.vue';
import AddWidgetSidebar from '@/components/Common/Sidebar/AppWidgetSidebar.vue';

const widgetStore = useWidgetStore();
</script>

<style scoped>
.blurred {
    filter: blur(5px);
    transition: filter 0.3s ease-in-out;
}
</style>
