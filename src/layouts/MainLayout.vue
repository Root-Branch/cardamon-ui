<template>
  <div class="layout">
    <div :class="{ blurred: widgetStore.sidebarVisible }" class="layout__main">
      <AppHeader />
      <!-- <AppSidebar /> -->
      <div class="layout__content">
        <div class="layout__title">
          <slot name="title"></slot>
        </div>
        <div class="layout__filters">
          <slot name="filters"></slot>
        </div>
        <div class="layout__breadcrumbs">
          <slot name="breadcrumbs"></slot>
        </div>
        <div class="layout__dashboard">
          <slot name="dashboard"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWidgetStore } from '@/stores/widgets'
import AppHeader from '@/components/Common/Header/AppHeader.vue'

const widgetStore = useWidgetStore()
</script>

<style scoped>
.layout {
  @apply h-full dark:bg-gray-900 overflow-auto;
}
.layout > * {
  @apply overflow-auto;
}

.layout__main {
  @apply flex flex-col pt-[81px] overflow-auto;
}

.layout__content {
  @apply m-4 h-full p-8 py-5 lg:min-h-[calc(100vh-122px)] overflow-auto;
}

.layout__title,
.layout__filters,
.layout__breadcrumbs,
.layout__dashboard {
  @apply mt-4 ml-2;
}

.blurred {
  filter: blur(5px);
  transition: filter 0.3s ease-in-out;
}
</style>
