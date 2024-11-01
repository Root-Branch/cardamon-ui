<template>
  <header class="app-header">
    <div class="app-header__container">
      <div class="app-header__logo-section">
        <img src="/logo-dark.svg" alt="Logo" class="app-header__logo-image block dark:hidden" />
        <img src="/logo-light.svg" alt="Logo" class="app-header__logo-image hidden dark:block" />
      </div>

      <div class="app-header__right-section">
        <!-- Dark Mode Toggle Button -->
        <button @click="toggleDarkMode" class="app-header__toggle-theme-button">
          <font-awesome-icon :icon="darkMode ? 'moon' : 'sun'" />
          <span>{{ darkMode ? 'Dark Mode' : 'Light Mode' }}</span>
        </button>

        <!-- Add Widget Button -->
        <!-- <div v-if="showAddWidget" class="app-header__button-container">
          <fwb-button pill class="app-header__add-widget-button" @click="openSidebar">
            <template #prefix>
              <font-awesome-icon icon="circle-plus" class="mr-2" />
            </template>
            Add Widget
          </fwb-button>
        </div> -->

        <!-- Database Info Icon with Tooltip -->
        <fwb-tooltip placement="bottom" class="cursor-pointer">
          <template #trigger>
            <font-awesome-layers class="fa-lg app-header__db-icon">
              <font-awesome-icon
                icon="fa-solid fa-circle"
                class="app-header__circle-icon"
                transform="grow-13"
              />
              <font-awesome-icon icon="fa-solid fa-database" class="app-header__database-icon" />
            </font-awesome-layers>
          </template>
          <template #content>
            <div class="app-header__tooltip-content">
              <span class="tooltip-content__label">Database Endpoint: </span>
              <span class="tooltip-content__info">{{ databaseEndpoint }}</span>
            </div>
          </template>
        </fwb-tooltip>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { FwbTooltip } from 'flowbite-vue'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'
import { useThemeStore } from '@/stores/theme'
import { computed, onMounted } from 'vue'
import { useDatabaseStore } from '@/stores/database-endpoint'

const databaseStore = useDatabaseStore()

const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)

const toggleDarkMode = () => {
  themeStore.toggleDarkMode()
}

const databaseEndpoint = computed(() => databaseStore.databaseEndpoint)

onMounted(() => {
  databaseStore.fetchDatabaseEndpoint()
})
</script>

<style scoped>
.app-header {
  @apply fixed top-0 z-50 h-[81px] w-full border-b border-solid border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800;
}

.app-header__container {
  @apply flex h-full items-center justify-between pr-10;
}

.app-header__logo-section {
  @apply flex items-center justify-center min-w-[240px] h-full;
}

.app-header__logo-image {
  @apply h-10;
}

.app-header__right-section {
  @apply flex items-center space-x-4 pr-10;
}

.app-header__button-container {
  @apply pr-4;
}

.app-header__add-widget-button {
  @apply bg-blue-600 text-white border-none dark:bg-blue-700 dark:text-white;
}

.app-header__db-icon {
  @apply text-gray-600 dark:text-gray-300;
}

.app-header__circle-icon {
  @apply text-neutral-400 dark:text-neutral-600;
}

.app-header__database-icon {
  @apply text-white dark:text-gray-200;
}

.app-header__tooltip-content {
  @apply p-2 mr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800;
}

.tooltip-content__label {
  @apply text-sm font-bold dark:text-white;
}

.tooltip-content__info {
  @apply text-sm text-gray-500 font-normal dark:text-gray-400;
}

.app-header__toggle-theme-button {
  @apply flex items-center text-sm space-x-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-2xl;
}
</style>
