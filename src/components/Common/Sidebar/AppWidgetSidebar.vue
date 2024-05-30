<template>
    <transition name="slide">
        <div v-if="isVisible" class="sidebar">
            <div class="sidebar-header">
                <div class="flex items-center">
                    <font-awesome-icon icon="layer-group" class="mr-3" />
                    <h2 class="sidebar-title">Add Widgets</h2>
                </div>
                <button @click="closeSidebar" class="close-button">&times;</button>
            </div>
            <div class="flex space-x-2 mt-4 filter-section">
                <fwb-dropdown text="All Widgets" align-to-end>
                    <template #trigger>
                        <button class="dropdown-button">
                            <div>
                                {{ selectedTypeLabel }}
                            </div>
                            <font-awesome-icon icon="chevron-down" class="ml-2" />
                        </button>
                    </template>
                    <div class="dropdown-menu">
                        <div v-for="option in widgetTypes" :key="option.value" @click="selectType(option)"
                            class="dropdown-item">
                            {{ option.label }}
                        </div>
                    </div>
                </fwb-dropdown>
                <input v-model="searchQuery" type="text" placeholder="Search widgets here..." class="search-input" />
            </div>
            <div class="widget-list mt-4">
                <button v-for="widget in filteredWidgets" :key="widget.id" @click="addWidget(widget)"
                    class="widget-item">
                    <div class="widget-info">
                        <h3>{{ widget.title }}</h3>
                        <p>{{ widget.description }}</p>
                    </div>
                    <div class="widget-preview">
                        <img :src="widget.image" alt="widget preview" />
                    </div>
                </button>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWidgetStore } from '@/stores/widgets';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { WidgetType } from '@/types/widgets.types';
import { ViewType } from '@/types/views.types';
import { useRoute } from 'vue-router';
import { availableWidgets } from '@/constants/widget.const';
import { FwbDropdown } from 'flowbite-vue';
import { determineViewTypeAndId } from '@/utils/route.utils';

const widgetStore = useWidgetStore();
const route = useRoute();

const isVisible = computed(() => widgetStore.sidebarVisible);

const searchQuery = ref('');
const selectedType = ref('');

const widgetTypes = [
    { value: '', label: 'All Widgets' },
    { value: WidgetType.CHART, label: 'Chart' },
    { value: WidgetType.TABLE, label: 'Table' },
    { value: WidgetType.METRIC, label: 'Metric' },
    { value: WidgetType.CPU_USAGE, label: 'CPU Usage' }
];

const selectedTypeLabel = computed(() => {
    const type = widgetTypes.find(type => type.value === selectedType.value);
    return type ? type.label : 'All Widgets';
});

const selectType = (option: { value: string; label: string }) => {
    selectedType.value = option.value;
};

const filteredWidgets = computed(() => {
    return availableWidgets.filter(widget => {
        const matchesType = selectedType.value ? widget.type === selectedType.value : true;
        const matchesSearch = widget.title.toLowerCase().includes(searchQuery.value.toLowerCase());
        return matchesType && matchesSearch;
    });
});

const closeSidebar = () => {
    widgetStore.setSidebarVisible(false);
};

const addWidget = (widget) => {
    const { viewType, id } = determineViewTypeAndId(route);
    if (viewType) {
        widgetStore.addWidgets([{
            ...widget,
            id: widgetStore.getWidgetId(viewType),
        }], viewType, id as string);
    }
    closeSidebar();
};
</script>

<style scoped>
.sidebar {
    @apply fixed top-0 right-0 h-full bg-white shadow-lg z-50 p-7 w-[720px] overflow-y-auto;
}

.sidebar-header {
    @apply flex justify-between items-center mb-4;
}

.sidebar-title {
    @apply text-xl font-bold;
}

.close-button {
    @apply text-2xl;
}

.search-input {
    @apply p-2 w-full border rounded-md;
}

.widget-list {
    @apply overflow-y-auto grid grid-cols-2 gap-4 mt-4;
}

.widget-item {
    @apply flex flex-col justify-start items-start mb-4 p-4 border rounded-2xl hover:bg-gray-50;
}

.widget-info {
    @apply h-1/3;
}

.widget-preview {
    @apply w-full;
}

.widget-preview img {
    @apply mt-6 w-full;
}

.widget-info h3 {
    @apply text-lg font-semibold text-start;
}

.widget-info p {
    @apply mt-3 text-sm text-gray-600 text-start;
}

.dropdown-button {
    @apply flex justify-between items-center bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium font-light text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-48;
}

.dropdown-menu {
    @apply bg-white rounded shadow-lg p-2 cursor-pointer border-b border-gray-200 text-sm w-48 font-light;
}

.dropdown-item {
    @apply p-2 hover:bg-gray-100 font-light;
}

.filter-section {
    @apply my-6;
}

.search-input {
    @apply font-light text-sm;
}
</style>
