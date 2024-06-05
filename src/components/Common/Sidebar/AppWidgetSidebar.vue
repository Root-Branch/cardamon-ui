<template>
    <transition name="slide">
        <div v-if="isVisible" class="sidebar">
            <div class="sidebar__header">
                <div class="sidebar__header-content">
                    <font-awesome-icon icon="layer-group" class="sidebar__icon" />
                    <h2 class="sidebar__title">Add Widgets</h2>
                </div>
                <button @click="closeSidebar" class="sidebar__close-button">&times;</button>
            </div>
            <div class="sidebar__filter-section">
                <fwb-dropdown text="All Widgets" align-to-end>
                    <template #trigger>
                        <button class="sidebar__dropdown-button">
                            <div>
                                {{ selectedTypeLabel }}
                            </div>
                            <font-awesome-icon icon="chevron-down" class="sidebar__dropdown-icon" />
                        </button>
                    </template>
                    <div class="sidebar__dropdown-menu">
                        <div v-for="option in widgetTypes" :key="option.value" @click="selectType(option)"
                            class="sidebar__dropdown-item">
                            {{ option.label }}
                        </div>
                    </div>
                </fwb-dropdown>
                <input v-model="searchQuery" type="text" placeholder="Search widgets here..." class="sidebar__search-input" />
            </div>
            <div class="sidebar__widget-list">
                <button v-for="widget in filteredWidgets" :key="widget.id" @click="addWidget(widget)"
                    class="sidebar__widget-item">
                    <div class="sidebar__widget-info">
                        <h3 class="sidebar__widget-title">{{ widget.title }}</h3>
                        <p class="sidebar__widget-description">{{ widget.description }}</p>
                    </div>
                    <div class="sidebar__widget-preview">
                        <img :src="widget.image" alt="widget preview" class="sidebar__widget-image" />
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
    @apply fixed top-0 right-0 h-full bg-white dark:bg-gray-900 shadow-lg z-50 p-7 w-[720px] overflow-y-auto;
}

.sidebar__header {
    @apply flex justify-between items-center mb-4;
}

.sidebar__header-content {
    @apply flex items-center;
}

.sidebar__icon {
    @apply mr-3 dark:text-gray-200;
}

.sidebar__title {
    @apply text-xl font-bold text-gray-900 dark:text-gray-200;
}

.sidebar__close-button {
    @apply text-2xl text-gray-900 dark:text-gray-200;
}

.sidebar__filter-section {
    @apply flex space-x-2 mt-4;
}

.sidebar__dropdown-button {
    @apply flex justify-between items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm px-4 py-2 text-sm font-medium font-light text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-48;
}

.sidebar__dropdown-icon {
    @apply ml-2;
}

.sidebar__dropdown-menu {
    @apply bg-white dark:bg-gray-800 rounded shadow-lg p-2 cursor-pointer border-b border-gray-200 dark:border-gray-700 text-sm w-48 font-light;
}

.sidebar__dropdown-item {
    @apply p-2 hover:bg-gray-100 dark:hover:bg-gray-600 font-light dark:text-gray-200;
}

.sidebar__search-input {
    @apply p-2 w-full border rounded-md font-light text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-300;
}

.sidebar__widget-list {
    @apply overflow-y-auto grid grid-cols-2 gap-4 mt-4;
}

.sidebar__widget-item {
    @apply flex flex-col justify-start items-start mb-4 p-4 border rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700 cursor-pointer;
}

.sidebar__widget-info {
    @apply h-1/3;
}

.sidebar__widget-preview {
    @apply w-full;
}

.sidebar__widget-image {
    @apply mt-6 w-full;
}

.sidebar__widget-title {
    @apply text-lg font-semibold text-start text-gray-900 dark:text-gray-200;
}

.sidebar__widget-description {
    @apply mt-3 text-sm text-gray-600 dark:text-gray-400 text-start;
}
</style>
