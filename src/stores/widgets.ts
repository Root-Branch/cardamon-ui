import { defineStore } from 'pinia'
import { WidgetType, type Widget } from '@/types/widgets.types'
import { useRunsStore } from './runs'
import { useDateRangeStore } from './dateRange'
import { useSingleRunStore } from './singleRun'
import { useScenarioStore } from './scenario'
import { defaultWidgets } from '@/constants/widget.const'
import { ViewType } from '@/types/views.types'

export const useWidgetStore = defineStore('widgets', {
  state: () => ({
    runsWidgets: [] as Widget[],
    singleRunWidgets: [] as Widget[],
    scenarioWidgets: [] as Widget[],
    sidebarVisible: false
  }),
  actions: {
    async addWidgets(widgets: Widget[], viewType: ViewType, id?: string | null) {
      for (const widget of widgets) {
        if (viewType === ViewType.RUNS) {
          await this.updateRunsWidgetData(widget)
          this.runsWidgets.push(widget)
        } else if (viewType === ViewType.SINGLE_RUN && id) {
          await this.updateSingleRunWidgetData(widget, id)
          this.singleRunWidgets.push(widget)
        } else if (viewType === ViewType.SCENARIO && id) {
          await this.updateScenarioWidgetData(widget, id)
          this.scenarioWidgets.push(widget)
        }
      }
    },
    async initializeWidgets(viewType: ViewType, id?: string) {
      if (viewType === ViewType.RUNS && this.runsWidgets.length) return
      if (viewType === ViewType.SINGLE_RUN && this.singleRunWidgets.length) return
      if (viewType === ViewType.SCENARIO && this.scenarioWidgets.length) return
      const widgets = JSON.parse(JSON.stringify(defaultWidgets))
      await this.addWidgets(widgets, viewType, id)
    },
    async deleteWidget(widgetId: string, viewType: ViewType) {
      if (viewType === ViewType.RUNS) {
        this.runsWidgets = this.runsWidgets.filter((widget) => widget.id !== widgetId)
      } else if (viewType === ViewType.SINGLE_RUN) {
        this.singleRunWidgets = this.singleRunWidgets.filter((widget) => widget.id !== widgetId)
      } else if (viewType === ViewType.SCENARIO) {
        this.scenarioWidgets = this.scenarioWidgets.filter((widget) => widget.id !== widgetId)
      }
    },
    duplicateWidget(widget: Widget, viewType: ViewType, id?: string | null) {
      const newWidget = JSON.parse(JSON.stringify(widget));
      newWidget.id = this.getWidgetId(viewType);
      this.addWidgets([newWidget], viewType, id);
    },
    async updateRunsWidgetData(widget: Widget) {
      const runsStore = useRunsStore()
      const dateRangeStore = useDateRangeStore()
      const { startDate, endDate } = dateRangeStore

      switch (widget.type) {
        case WidgetType.METRIC: {
          const totalMetrics = runsStore.getTotalMetricsData(startDate, endDate)
          widget.metadata.value =
            totalMetrics.find((metric: any) => metric.metricType === widget.metadata.key)?.value ||
            0
          break
        }
        case WidgetType.CHART:
          widget.metadata.data = runsStore.getRunsData(startDate, endDate)
          widget.metadata.totals = runsStore.getTotalMetricsData(startDate, endDate)
          break
        case WidgetType.CPU_USAGE:
          widget.metadata.data = runsStore.getCpuMetricsData(startDate, endDate)
          break
        case WidgetType.TABLE:
          widget.metadata.data = runsStore.getRunsData(startDate, endDate)
          break
      }
    },
    async updateSingleRunWidgetData(widget: Widget, runId: string) {
      const singleRunStore = useSingleRunStore()

      switch (widget.type) {
        case WidgetType.METRIC: {
          const totalMetrics = singleRunStore.getTotalMetricsData(runId)
          widget.metadata.value =
            totalMetrics.find((metric: any) => metric.metricType === widget.metadata.key)?.value ||
            0
          break
        }
        case WidgetType.CHART:
          widget.metadata.data = singleRunStore.getScenariosData(runId)
          widget.metadata.totals = singleRunStore.getTotalMetricsData(runId)
          break
        case WidgetType.CPU_USAGE:
          widget.metadata.data = singleRunStore.getCpuMetricsData(runId)
          break
        case WidgetType.TABLE:
          widget.metadata.data = singleRunStore.getScenariosData(runId)
          break
      }
    },
    async updateScenarioWidgetData(widget: Widget, scenarioId: string) {
      const scenarioStore = useScenarioStore()

      switch (widget.type) {
        case WidgetType.METRIC: {
          const totalMetrics = scenarioStore.getTotalMetricsData(scenarioId)
          widget.metadata.value =
            totalMetrics.find((metric: any) => metric.metricType === widget.metadata.key)?.value ||
            0
          break
        }
        case WidgetType.CHART:
          widget.metadata.data = scenarioStore.getIterationsData(scenarioId)
          widget.metadata.totals = scenarioStore.getTotalMetricsData(scenarioId)
          break
        case WidgetType.CPU_USAGE:
          widget.metadata.data = scenarioStore.getCpuMetricsData(scenarioId)
          break
        case WidgetType.TABLE:
          widget.metadata.data = scenarioStore.getIterationsData(scenarioId)
          break
      }
    },
    setSidebarVisible(visible: boolean) {
      this.sidebarVisible = visible
    }
  },
  getters: {
    getWidgetId: (state) => (viewType: ViewType) => {
      let maxId = 0;
      if (viewType === ViewType.RUNS) {
        maxId = Math.max(...state.runsWidgets.map(widget => parseInt(widget.id, 10)), 0);
      } else if (viewType === ViewType.SINGLE_RUN) {
        maxId = Math.max(...state.singleRunWidgets.map(widget => parseInt(widget.id, 10)), 0);
      } else if (viewType === ViewType.SCENARIO) {
        maxId = Math.max(...state.scenarioWidgets.map(widget => parseInt(widget.id, 10)), 0);
      }
      return (maxId + 1).toString();
    },
  },
})
