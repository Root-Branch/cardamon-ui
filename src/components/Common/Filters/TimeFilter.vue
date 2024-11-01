<template>
    <div class="time-filter__container">
        <div class="time-filter__dropdown">
            <fwb-dropdown text="Bottom" align-to-end>
                <template #trigger>
                    <button class="time-filter__dropdown-button">
                        <div class="time-filter__button-content">
                            <font-awesome-icon icon="clock" class="time-filter__icon--clock" />
                            {{ selectedOption }}
                        </div>
                        <font-awesome-icon icon="chevron-down" class="time-filter__icon--chevron" />
                    </button>
                </template>
                <div class="time-filter__dropdown-menu">
                    <div v-for="option in options" :key="option" @click="selectOption(option)" class="time-filter__dropdown-item">
                        {{ option }}
                    </div>
                </div>
            </fwb-dropdown>
        </div>
        <div class="time-filter__selected-date-range">
            {{ formattedDateRange }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FwbDropdown } from 'flowbite-vue';
import { useDateRangeStore } from '@/stores/dateRange';

const dateRangeStore = useDateRangeStore();

const options = [
  'Past 1 day',
  'Past 5 days',
  'Past 15 days',
  'Past 1 month',
  'Past 3 months',
];

const selectedOption = ref(options[0]);

const selectOption = (option: string) => {
  selectedOption.value = option;
  dateRangeStore.updateDateRange(option);
};

const formattedDateRange = computed(() => dateRangeStore.formattedDateRange);
</script>

<style scoped>
.time-filter__container {
    @apply flex items-center space-x-4 z-50;
}

.time-filter__dropdown {
    @apply relative inline-block text-left;
}

.time-filter__dropdown-button {
    @apply flex justify-between items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm px-4 py-2 text-sm font-medium font-light text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-48;
}

.time-filter__button-content {
    @apply flex items-center;
}

.time-filter__icon--clock {
    @apply mr-2;
}

.time-filter__icon--chevron {
    @apply ml-2;
}

.time-filter__selected-date-range {
    @apply bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300 font-light;
}

.time-filter__dropdown-menu {
    @apply bg-white dark:bg-gray-800 rounded shadow-lg p-2 cursor-pointer border-b border-gray-200 dark:border-gray-700 text-sm w-48 font-light;
}

.time-filter__dropdown-item {
    @apply p-2 hover:bg-gray-100 dark:hover:bg-gray-700 font-light dark:text-gray-200;
}
</style>
