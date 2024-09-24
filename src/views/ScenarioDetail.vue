<template>
  <MainLayout>
    <template #title>
      <h1 class="main-layout__title">Scenario Detail</h1>
    </template>
    <template #breadcrumbs>
      <AppBreadcrumb />
    </template>
    <template #dashboard>
      <div ref="gridContainer" class="grid-stack pd-0">
        <component
          v-for="widget in widgets"
          :is="getComponent(widget.type)"
          :key="widget.id"
          :data="widget"
          @updatePage="handlePageChange"
        />
      </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AppBreadcrumb from '@/components/Common/Breadcrumb/AppBreadcrumb.vue'
import { useWidgetStore } from '@/stores/widgets'
import { useScenarioStore } from '@/stores/scenario'
import { WidgetType, type Widget } from '@/types/widgets.types'
import { GridStack, type GridStackNode } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import MetricCard from '@/components/widgets/MetricCard/MetricCard.vue'
import DynamicChart from '@/components/widgets/DynamicChart/DynamicChart.vue'
import CpuUsageChart from '@/components/widgets/CpuUsageChart/CpuUsageChart.vue'
import RunsTable from '@/components/widgets/Table/RunsTable.vue'

const route = useRoute()
const scenarioName = route.params.scenarioName

const scenarioStore = useScenarioStore()
const widgetStore = useWidgetStore()

const loading = ref(true)
const widgets = ref([] as any[])

const fetchAllData = async (page: number) => {
  try {
    loading.value = true
    await scenarioStore.fetchScenarioDetails(scenarioName as string, { page })
    await widgetStore.initializeWidgets(scenarioName as string)
  } finally {
    widgets.value = widgetStore.scenarioWidgets[scenarioName as string] || []
    loading.value = false
  }
}

const gridContainer = ref<HTMLElement | null>(null)
const grid = ref<GridStack | null>(null)

const getComponent = (type: string) => {
  switch (type) {
    // case WidgetType.METRIC:
    //   return MetricCard
    case WidgetType.CHART:
      return DynamicChart
    case WidgetType.CPU_USAGE:
      return CpuUsageChart
    case WidgetType.TABLE:
      return RunsTable
    default:
      return null
  }
}

const initGridStack = async () => {
  await nextTick()
  if (gridContainer.value) {
    grid.value = GridStack.init({
      column: 6,
      cellHeight: 100,
      margin: 10
    })
    grid.value.on('change', onChange)
    makeWidgets(widgets.value)
  }
}

const makeWidgets = (widgets: Array<Widget>) => {
  widgets.forEach((widget) => {
    makeWidget(widget)
  })
}

const makeWidget = (widget: Widget) => {
  const element = gridContainer.value?.querySelector(`[gs-id="${widget.id}"]`) as HTMLElement
  if (element && grid.value) {
    grid.value.addWidget(element)
  }
}

const onChange = (event: Event, items: Array<GridStackNode>) => {
  const updatedPositions = items.map((item) => ({
    id: item.id,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h
  }))
  widgetStore.updateWidgetsPos(scenarioName as string, updatedPositions)
}

const handlePageChange = async (page: number) => {
  await scenarioStore.fetchScenarioDetails(scenarioName as string, { page })
  await widgetStore.updateWidgetsData(
    scenarioName as string,
    scenarioStore.scenarioDetails[scenarioName as string]
  )
}

watch(
  () => widgets.value,
  async () => {
    if (grid.value) {
      await nextTick()
      makeWidget(widgets.value[widgets.value.length - 1])
    }
  },
  { deep: true }
)

watch(
  () => widgetStore.scenarioWidgets[scenarioName as string],
  (newWidgets) => {
    widgets.value = newWidgets || []
  }
)

onBeforeUnmount(() => {
  if (grid.value) {
    grid.value.destroy(false)
  }
})

onMounted(async () => {
  await fetchAllData(1)
  initGridStack()
})
</script>

<style scoped>
.main-layout__title {
  @apply text-2xl font-bold dark:text-white ml-3;
}

.main-layout__loading-spinner {
  @apply flex items-center justify-center h-full;
}

.grid-stack {
  height: auto !important;
}
</style>
