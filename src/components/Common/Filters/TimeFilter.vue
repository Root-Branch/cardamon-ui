<template>
    <div class="time-filter-container flex items-center space-x-4">
        <div class="relative inline-block text-left">
            <fwb-dropdown text="Bottom" align-to-end>
                <template #trigger>
                    <button class="dropdown-button">
                        <div>
                            <font-awesome-icon icon="clock" class="mr-2" />
                            {{ selectedOption }}
                        </div>
                        <font-awesome-icon icon="chevron-down" class="ml-2" />
                    </button>
                </template>
                <div class="dropdown-menu">
                    <div v-for="option in options" :key="option" @click="selectOption(option)" class="dropdown-item">
                        {{ option }}
                    </div>
                </div>
            </fwb-dropdown>
        </div>
        <div class="selected-date-range">
            {{ formattedDateRange }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { FwbDropdown } from 'flowbite-vue'
import { useDateRangeStore } from '@/stores/dateRange'

const dateRangeStore = useDateRangeStore()

const options = [
    'Past 1 day',
    'Past 5 days',
    'Past 15 days',
    'Past 1 month',
    'Past 3 months',
]

const selectedOption = ref(options[0])

const selectOption = (option: string) => {
    selectedOption.value = option
    dateRangeStore.updateDateRange(option)
}

const formattedDateRange = computed(() => dateRangeStore.formattedDateRange)
</script>

<style scoped>
.time-filter-container {
    @apply flex items-center space-x-4 z-50;
}

.dropdown-button {
    @apply flex justify-between items-center bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium font-light text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-48;
}

.selected-date-range {
    @apply bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-500 font-light;
}

.dropdown-menu {
    @apply bg-white rounded shadow-lg p-2 cursor-pointer border-b border-gray-200 text-sm w-48 font-light;
}

.dropdown-item {
    @apply p-2 hover:bg-gray-100 font-light;
}
</style>