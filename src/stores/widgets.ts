import { defineStore } from 'pinia'
import { WidgetType, type Widget } from '@/types/widgets.types'
import { useScenarioStore } from './scenario'
import { defaultWidgets } from '@/constants/widget.const'
import type { GridStackNode } from 'gridstack'

export const useWidgetStore = defineStore('widgets', {
  state: () => ({
    scenarioWidgets: {} as Record<string, Widget[]>,
    sidebarVisible: false,
    selectedRun: null as any | null // Add this line
  }),
  actions: {
    async initializeWidgets(scenarioName: string) {
      if (this.scenarioWidgets[scenarioName]?.length) {
        const scenarioStore = useScenarioStore()
        const scenarioDetails = await scenarioStore.getScenarioDetails(scenarioName)
        await this.updateWidgetsData(scenarioName, scenarioDetails)
        return
      }
      const widgets = JSON.parse(JSON.stringify(defaultWidgets))
      await this.addWidgets(scenarioName, widgets)
    },
    async getMetrics(scenarioDetails: any) {
      return [
        {
          metricType: 'CO2',
          value: scenarioDetails.scenario.avgCo2Emission
        },
        {
          metricType: 'POWER',
          value: scenarioDetails.scenario.avgPowerConsumption
        },
        {
          metricType: 'CPU',
          value: scenarioDetails.scenario.avgCpuUtilization
        }
      ]
    },
    async updateWidgetMetadata(widget: Widget, scenarioDetails: any) {
      switch (widget.type) {
        // case WidgetType.METRIC: {
        //   const avgMetrics = await this.getMetrics(scenarioDetails)
        //   widget.metadata.value =
        //     avgMetrics.find((metric: any) => metric.metricType === widget.metadata.key)?.value || 0
        //   break
        // }
        case WidgetType.CHART: {
          widget.metadata.runs = scenarioDetails.runs || []
          break
        }
        case WidgetType.CPU_USAGE: {
          widget.metadata.runs = scenarioDetails.runs || []
          break
        }
        case WidgetType.TABLE: {
          widget.metadata.runs = scenarioDetails.runs || []
          widget.metadata.pagination = scenarioDetails.pagination || {}
          break
        }
      }
    },
    async addWidgets(scenarioName: string, widgets: Widget[]) {
      const scenarioStore = useScenarioStore()
      const scenarioDetails = await scenarioStore.getScenarioDetails(scenarioName)
      if (!this.scenarioWidgets[scenarioName]) {
        this.scenarioWidgets[scenarioName] = []
      }
      for (const widget of widgets) {
        await this.updateWidgetMetadata(widget, scenarioDetails)
        this.scenarioWidgets[scenarioName].push(widget)
      }
    },
    async updateWidgetsData(scenarioName: string, scenarioDetails: any) {
      if (!this.scenarioWidgets[scenarioName]) return
      for (const widget of this.scenarioWidgets[scenarioName]) {
        await this.updateWidgetMetadata(widget, scenarioDetails)
      }
    },
    async deleteWidget(scenarioName: string, widgetId: string) {
      if (this.scenarioWidgets[scenarioName]) {
        this.scenarioWidgets[scenarioName] = this.scenarioWidgets[scenarioName].filter(
          (widget) => widget.id !== widgetId
        )
      }
    },
    async duplicateWidget(scenarioName: string, widget: Widget) {
      const newWidget = JSON.parse(JSON.stringify(widget))
      newWidget.id = this.getWidgetId(scenarioName)
      await this.addWidgets(scenarioName, [newWidget])
    },
    updateWidgetsPos(scenarioName: string, updatedPositions: GridStackNode[]) {
      const widgets = this.scenarioWidgets[scenarioName]
      if (!widgets) return
      updatedPositions.forEach((pos) => {
        const widget = widgets.find((w) => w.id === pos.id)
        if (widget) {
          widget.grid.x = pos.x
          widget.grid.y = pos.y
          widget.grid.w = pos.w
          widget.grid.h = pos.h
        }
      })
    },
    setSidebarVisible(visible: boolean) {
      this.sidebarVisible = visible
    },
    setSelectedRun(run: any) {
      this.selectedRun = run
    }
  },
  getters: {
    getWidgetId: (state) => (scenarioName: string) => {
      let maxId = 0
      if (state.scenarioWidgets[scenarioName]) {
        maxId = Math.max(
          ...state.scenarioWidgets[scenarioName].map((widget) => parseInt(widget.id, 10)),
          0
        )
      }
      return (maxId + 1).toString()
    }
  }
})
