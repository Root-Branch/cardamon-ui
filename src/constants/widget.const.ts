import { WidgetType } from '@/types/widgets.types'

export const defaultWidgets = [
  {
    id: '1',
    title: 'Total CO2 Emission',
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2 },
    metadata: { key: 'CO2', unit: 'kg' }
  },
  {
    id: '2',
    title: 'Total Power Consumption',
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2 },
    metadata: { key: 'POWER', unit: 'kWh' }
  },
  {
    id: '3',
    title: 'Total CPU Utilization',
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2 },
    metadata: { key: 'CPU', unit: '%' }
  },
  {
    id: '4',
    title: 'CO2 Emission Overview',
    type: WidgetType.CHART,
    grid: { w: 4, h: 4 },
    metadata: { key: 'TOTAL' }
  },
  {
    id: '5',
    title: 'CPU Usage Breakdown by Processes',
    type: WidgetType.CPU_USAGE,
    grid: { w: 2, h: 6 },
    metadata: { key: 'CPU' }
  },
  {
    id: '6',
    title: 'Data Table',
    type: WidgetType.TABLE,
    grid: { w: 6, h: 4 },
    metadata: { key: 'RUNS' }
  }
]

export const availableWidgets = [
  {
    title: 'Dynamic Chart',
    description: 'Select chart types to visualize different metrics.',
    image: '/src/assets/images/dynamic-chart-widget.svg',
    type: WidgetType.CHART,
    grid: { w: 4, h: 4 },
    metadata: { key: 'TOTAL' }
  },
  {
    title: 'Data Table',
    description: 'Display various metrics in a data table format.',
    image: '/src/assets/images/table-widget.svg',
    type: WidgetType.TABLE,
    grid: { w: 6, h: 4 },
    metadata: { key: 'RUNS' }
  },
  {
    title: 'CPU Usage Breakdown by Processes',
    description: 'Visualize CPU usage metrics in a pie chart format.',
    image: '/src/assets/images/cpu-widget.svg',
    type: WidgetType.CPU_USAGE,
    grid: { w: 1, h: 2 },
    metadata: { key: 'CPU' }
  },
  {
    title: 'Total CO2 Emission',
    description: 'Display key metric values.',
    image: '/src/assets/images/co2-metric-card-widget.svg',
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2 },
    metadata: { key: 'CO2', unit: 'kg' }
  },
  {
    title: 'Total Power Consumption',
    description: 'Display key metric values.',
    image: '/src/assets/images/power-metric-card-widget.svg',
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2 },
    metadata: { key: 'POWER', unit: 'kWh' }
  },
  {
    title: 'Total CPU Utilization',
    description: 'Display key metric values.',
    image: '/src/assets/images/cpu-metric-card-widget.svg',
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2 },
    metadata: { key: 'CPU', unit: '%' }
  }
]
