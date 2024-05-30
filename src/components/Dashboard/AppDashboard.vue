<template>
  <div ref="gridContainer" class="grid-stack pd-0">
    <component v-for="widget in props.widgets" :is="getComponent(widget.type)" :key="widget.id" :data="widget"
      @duplicate="handleDuplicateWidget" @delete="handleDeleteWidget" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount, watch } from 'vue';
import { WidgetType, type Widget } from '@/types/widgets.types';
import { ViewType } from '@/types/views.types';
import { GridStack } from 'gridstack';
import { useRoute } from 'vue-router';
import { useWidgetStore } from '@/stores/widgets';
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';
import MetricCard from '@/components/Widgets/MetricCard/MetricCard.vue';
import DynamicChart from '@/components/Widgets/DynamicChart/DynamicChart.vue';
import CpuUsageChart from '@/components/Widgets/CpuUsageChart/CpuUsageChart.vue';
import DataTable from '@/components/Widgets/Table/DataTable.vue';
import { determineViewTypeAndId } from '@/utils/route.utils'

const props: any = defineProps({
  widgets: Array,
});

const gridContainer = ref<HTMLElement | null>(null);
const grid = ref<GridStack | null>(null);
const widgetStore = useWidgetStore();
const route = useRoute();

const getComponent = (type: string) => {
  switch (type) {
    case WidgetType.METRIC:
      return MetricCard;
    case WidgetType.CHART:
      return DynamicChart;
    case WidgetType.CPU_USAGE:
      return CpuUsageChart;
    case WidgetType.TABLE:
      return DataTable;
    default:
      return null;
  }
};

const initGridStack = async () => {
  await nextTick();
  if (gridContainer.value) {
    grid.value = GridStack.init({
      column: 6,
      cellHeight: 100,
      margin: 10,
    });
    makeWidgets(props.widgets);
  }
};

const makeWidgets = (widgets: Array<Widget>) => {
  widgets.forEach((widget) => {
    makeWidget(widget);
  });
};

const makeWidget = (widget: Widget) => {
  const element = gridContainer.value?.querySelector(`[gs-id="${widget.id}"]`) as HTMLElement;
  if (element && grid.value) {
    grid.value.addWidget(element);
  }
};

const handleDeleteWidget = async (widget: Widget) => {
  const index = props.widgets.findIndex((w: Widget) => w.id === widget.id);
  if (index === -1) {
    return;
  }
  const element = gridContainer.value?.querySelector(`[gs-id="${widget.id}"]`) as HTMLElement;
  if (element && grid.value) {
    grid.value.removeWidget(element, false);
    grid.value.compact();
  }
  const { viewType } = determineViewTypeAndId(route);
  widgetStore.deleteWidget(widget.id, viewType);
};

const handleDuplicateWidget = async (widget: Widget) => {
  const { viewType, id } = determineViewTypeAndId(route);
  widgetStore.duplicateWidget(widget, viewType, id);
};

watch(
  () => props.widgets,
  async () => {
    if (grid.value) {
      await nextTick();
      makeWidget(props.widgets[props.widgets.length - 1]);
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (grid.value) {
    grid.value.destroy(false);
  }
});

onMounted(initGridStack);
</script>

<style scoped>
.grid-stack {
  height: auto !important;
}
</style>
