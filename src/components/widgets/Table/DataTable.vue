<template>
    <div :id="data.id" :gs-id="data.id" :gs-x="data.grid.x" :gs-y="data.grid.y" :gs-w="data.grid.w" :gs-h="data.grid.h"
        :gs-min-w="minWidth" :gs-min-h="minHeight">
        <div
            class="data-table__container grid-stack-item-content grid-stack-item rounded-lg drop-shadow-widget bg-white dark:bg-gray-800">
            <!-- Header with title and actions -->
            <div class="data-table__header">
                <h3 class="data-table__title">{{ data.title }}</h3>
                <WidgetActions @duplicateWidget="duplicateWidget" @deleteWidget="deleteWidget"
                    :dark-background="darkMode" />
            </div>
            <!-- Table -->
            <div class="data-table__table-container">
                <fwb-table hoverable>
                    <fwb-table-head class="data-table__table-header">
                        <fwb-table-head-cell v-for="column in columns" :key="column.field"
                            @click="sortTable(column.field)" class="data-table__table-head-cell">
                            {{ column.label }}
                            <span>
                                <font-awesome-icon v-if="sortField === column.field && sortOrder === 'asc'"
                                    icon="arrow-up" />
                                <font-awesome-icon v-else-if="sortField === column.field && sortOrder === 'desc'"
                                    icon="arrow-down" />
                                <font-awesome-icon v-else icon="sort" />
                            </span>
                        </fwb-table-head-cell>
                    </fwb-table-head>
                    <fwb-table-body>
                        <fwb-table-row v-for="(row, index) in sortedData" :key="row.id" class="data-table__table-row">
                            <fwb-table-cell v-for="column in columns" :key="column.field"
                                class="data-table__table-cell">
                                <span v-if="column.field === 'id'">
                                    <a href="#" @click.prevent="goToId(row.id)" class="data-table__link">
                                        {{ row[column.field] }}
                                    </a>
                                </span>
                                <span v-else>
                                    {{ formatField(row, column.field) }}
                                </span>
                                <span
                                    v-if="metricFields.includes(column.field) && getPercentageChange(index, column.field) !== 0"
                                    class="data-table__change-container">
                                    <span :class="getPercentageChangeClass(index, column.field)"
                                        class="data-table__change-text">
                                        {{ getPercentageChange(index, column.field) }}%
                                        <font-awesome-icon v-if="getPercentageChange(index, column.field) > 0"
                                            class="ml-1" icon="arrow-up" />
                                        <font-awesome-icon v-else-if="getPercentageChange(index, column.field) < 0"
                                            class="ml-1" icon="arrow-down" />
                                    </span>
                                </span>
                            </fwb-table-cell>
                        </fwb-table-row>
                    </fwb-table-body>
                </fwb-table>
            </div>
            <!-- Pagination -->
            <div class="data-table__pagination-container">
                <fwb-pagination class="data-table__pagination" v-model:current="currentPage" :total-pages="totalPages"
                    show-icons previousLabel="" nextLabel="" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import WidgetActions from '../WidgetActions.vue';
import { useWidgetActions } from '@/composables/useWidgetActions';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { FwbTable, FwbTableHead, FwbTableHeadCell, FwbTableBody, FwbTableRow, FwbTableCell, FwbPagination } from 'flowbite-vue';
import type { Widget } from '@/types/widgets.types';
import type { MetaData } from '@/types/chart.types';
import { useRouter, useRoute } from 'vue-router';
import { useThemeStore } from '@/stores/theme';

interface Column {
    label: string;
    field: string;
}

interface Metric {
    metricType: string;
    value: number;
}

interface DataRow {
    [key: string]: any;
    id: string;
    startTime: string;
    endTime: string;
    metrics: Metric[];
}

const themeStore = useThemeStore();
const darkMode = computed(() => themeStore.darkMode);
console.log(darkMode);

const minWidth = 3;
const minHeight = 3;

const props = defineProps<{
    data: Widget<MetaData>;
}>();

const columns = ref<Column[]>([]);
const currentPage = ref<number>(1);
const itemsPerPage = 5;
const sortField = ref<string>('');
const sortOrder = ref<string>('desc');

const metricFields = ref<string[]>([]);

const getColumns = (data: any[]): { label: string; field: string }[] => {
    if (!data.length) return [];

    const sample = data[0];
    const metricColumns = sample.metrics.map((metric: any) => ({
        label: metric.metricType.replace('_', ' '),
        field: metric.metricType,
    }));

    const additionalColumns = Object.keys(sample).filter(key => key !== 'metrics').map(key => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        field: key,
    }));

    return [...additionalColumns, ...metricColumns];
};

const sortTable = (field: string) => {
    if (sortField.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortField.value = field;
        sortOrder.value = 'asc';
    }
};

const sortedData = computed(() => {
    let sorted = [...props.data.metadata.data];

    if (sortField.value) {
        sorted.sort((a, b) => {
            let fieldA, fieldB;

            if (['id', 'startTime', 'endTime'].includes(sortField.value)) {
                fieldA = (a as any)[sortField.value];
                fieldB = (b as any)[sortField.value];
            } else {
                fieldA = a.metrics.find(m => m.metricType === sortField.value)?.value;
                fieldB = b.metrics.find(m => m.metricType === sortField.value)?.value;
            }

            if (fieldA < fieldB) return sortOrder.value === 'asc' ? -1 : 1;
            if (fieldA > fieldB) return sortOrder.value === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sorted.slice(start, end);
});


const totalPages = computed(() => Math.ceil(props.data.metadata.data.length / itemsPerPage));

const formatField = (row: DataRow, field: string) => {
    if (field === 'startTime' || field === 'endTime') {
        return new Date(row[field]).toLocaleString();
    }
    const metric = row.metrics.find(m => m.metricType === field);
    return metric ? `${metric.value.toFixed(2)} ${field === 'CO2' ? 'kg' : field === 'POWER' ? 'kWh' : '%'}` : row[field];
};

const router = useRouter();
const route = useRoute();

const goToId = async (id: string) => {
    if (route.name === 'MainDashboard') {
        await router.push({ path: `/runs/${id}` });
    } else if (route.name === 'RunDetail') {
        await router.push({ path: `/scenarios/${id}` });
    }
};

const getPercentageChangeClass = (index: number, field: string) => {
    const change = getPercentageChange(index, field);
    return change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400';
};

const getPercentageChange = (index: number, field: string): number => {
    if (index === 0) return 0;
    const current = sortedData.value[index].metrics.find(m => m.metricType === field)?.value || 0;
    const previous = sortedData.value[index - 1].metrics.find(m => m.metricType === field)?.value || 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
};

onMounted(() => {
    columns.value = getColumns(props.data.metadata.data);
    metricFields.value = props.data.metadata.data[0].metrics.map(m => m.metricType);
});

const emit = defineEmits(['duplicate', 'delete']);

const { duplicateWidget, deleteWidget } = useWidgetActions(props, emit);
</script>

<style scoped>
.data-table__header {
    @apply flex justify-between items-center pt-6 px-6 pb-2;
}

.data-table__title {
    @apply text-lg font-semibold text-gray-900 dark:text-gray-200 mb-6;
}

.data-table__table-container {
    @apply overflow-x-auto mb-5;
}

.data-table__table-header {
    @apply text-center bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-6 normal-case;
}

.data-table__table-head-cell {
    @apply cursor-pointer;
}

.data-table__table-row {
    @apply bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-light text-center border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700;
}

.data-table__table-cell {
    @apply text-gray-600 dark:text-gray-300 font-light;
}

.data-table__link {
    @apply text-blue-400 dark:text-blue-300 font-light hover:underline;
}

.data-table__change-container {
    @apply inline-flex items-center;
}

.data-table__change-text {
    @apply text-xs ml-2 inline-flex items-center;
}

.data-table__pagination-container {
    @apply flex justify-center mt-4 border-none;
}

.data-table__pagination *:not(svg, div) {
    @apply bg-white dark:bg-gray-800 border-none text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm;
}

.data-table__pagination *:not(svg, div):disabled {
    @apply bg-gray-100 dark:bg-gray-700 border-none text-gray-500 dark:text-gray-400 text-sm;
}
</style>