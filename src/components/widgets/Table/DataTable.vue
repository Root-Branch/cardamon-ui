<template>
    <div :id="data.id" :gs-id="data.id" :gs-x="data.grid.x" :gs-y="data.grid.y" :gs-w="data.grid.w" :gs-h="data.grid.h"
        :gs-min-w="minWidth" :gs-min-h="minHeight">
        <div class="grid-stack-item-content grid-stack-item rounded-lg drop-shadow-widget bg-white">
            <!-- Header with title and actions -->
            <div class="header">
                <h3 class="title">{{ data.title }}</h3>
                <WidgetActions @duplicateWidget="duplicateWidget" @deleteWidget="deleteWidget"
                    :dark-background="false" />
            </div>
            <!-- Table -->
            <div class="table-container mt-4">
                <fwb-table hoverable>
                    <fwb-table-head class="table-header">
                        <fwb-table-head-cell v-for="column in columns" :key="column.field"
                            @click="sortTable(column.field)">
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
                        <fwb-table-row v-for="(row, index) in sortedData" :key="row.id">
                            <fwb-table-cell v-for="column in columns" :key="column.field">
                                <span v-if="column.field === 'id'">
                                    <a href="#" @click.prevent="goToId(row.id)"
                                        class="text-blue-400 font-light hover:underline">
                                        {{ row[column.field] }}
                                    </a>
                                </span>
                                <span v-else>
                                    {{ formatField(row, column.field) }}
                                </span>
                                <span
                                    v-if="metricFields.includes(column.field) && getPercentageChange(index, column.field) !== ''"
                                    class="inline-flex items-center">
                                    <span :class="getChangeClass(index, column.field)"
                                        class="text-xs ml-2 inline-flex items-center">
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
            <div class="pagination-container">
                <fwb-pagination class="pagination" v-model:current="currentPage" :total-pages="totalPages" show-icons
                    previousLabel="" nextLabel="" />
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

const minWidth = 3;
const minHeight = 3;

const props = defineProps<{
    data: Widget<MetaData>;
}>();

const columns = ref([]);
const currentPage = ref(1);
const itemsPerPage = 5;
const sortField = ref('');
const sortOrder = ref('desc');

const metricFields = ref([]);

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
                fieldA = a[sortField.value];
                fieldB = b[sortField.value];
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

const formatField = (row, field) => {
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

const getChangeClass = (index, field) => {
    const change = getPercentageChange(index, field);
    return change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400';
};

const getPercentageChange = (index, field) => {
    if (index === 0) return '';
    const current = sortedData.value[index].metrics.find(m => m.metricType === field).value;
    const previous = sortedData.value[index - 1].metrics.find(m => m.metricType === field).value;
    return (((current - previous) / previous) * 100).toFixed(2);
};

onMounted(() => {
    columns.value = getColumns(props.data.metadata.data);
    metricFields.value = props.data.metadata.data[0].metrics.map(m => m.metricType);
});

const emit = defineEmits(['duplicate', 'delete']);

const { duplicateWidget, deleteWidget } = useWidgetActions(props, emit);</script>

<style scoped>
.header {
    @apply flex justify-between items-center pt-6 px-6 pb-2;
}

.title {
    @apply text-lg font-semibold;
}

.table-container {
    @apply overflow-x-auto mb-5;
}

th {
    @apply text-center cursor-pointer bg-gray-50 text-white p-6 text-black normal-case;
}

tr {
    @apply bg-white text-gray-600 font-light text-center border-b border-gray-50 hover:bg-gray-50 cursor-pointer [&:not(:last-child)]:border-b [&:not(:last-child)]:dark:border-gray-50 p-6;
}

td:first-child {
    @apply text-gray-600 font-light;
}

.pagination-container {
    @apply flex justify-center mt-4 border-none;
}

.pagination-container .pagination *:not(svg, div) {
    @apply bg-white border-none text-gray-500 hover:bg-gray-100 text-sm;
}

.pagination-container .pagination *:not(svg, div):disabled {
    @apply bg-gray-100 border-none text-gray-500 hover:bg-gray-100 text-sm;
}
</style>