import { WidgetType } from '@/types/widgets.types'
import { getImageUrl } from '@/utils/image.utils'

export const defaultWidgets = [
  {
    id: '1',
    title: 'Total CO2 Emission',
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2, x: 0, y: 0 },
    metadata: { key: 'CO2', unit: 'kg' }
  },
  {
    id: '2',
    title: 'Total Power Consumption',
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2, x: 1, y: 0 },
    metadata: { key: 'POWER', unit: 'kWh' }
  },
  {
    id: '3',
    title: 'Total CPU Utilization',
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2, x: 2, y: 0 },
    metadata: { key: 'CPU', unit: '%' }
  },
  {
    id: '4',
    title: 'CO2 Emission Overview',
    type: WidgetType.CHART,
    grid: { w: 4, h: 4, x: 0, y: 6 },
    metadata: { key: 'TOTAL' }
  },
  {
    id: '5',
    title: 'CPU Usage Breakdown by Processes',
    type: WidgetType.CPU_USAGE,
    grid: { w: 2, h: 6, x: 4, y: 6 },
    metadata: { key: 'CPU' }
  },
  {
    id: '6',
    title: 'Data Table',
    type: WidgetType.TABLE,
    grid: { w: 6, h: 4, x: 0, y: 2 },
    metadata: { key: 'RUNS' }
  }
]

export const availableWidgets = [
  {
    title: 'Dynamic Chart',
    description: 'Select chart types to visualize different metrics.',
    image: getImageUrl('dynamic-chart-widget', 'svg'),
    type: WidgetType.CHART,
    grid: { w: 4, h: 4 },
    metadata: { key: 'TOTAL' }
  },
  {
    title: 'Data Table',
    description: 'Display various metrics in a data table format.',
    image: getImageUrl('table-widget', 'svg'),
    type: WidgetType.TABLE,
    grid: { w: 6, h: 4 },
    metadata: { key: 'RUNS' }
  },
  {
    title: 'CPU Usage Breakdown by Processes',
    description: 'Visualize CPU usage metrics in a pie chart format.',
    image: getImageUrl('cpu-widget', 'svg'),
    type: WidgetType.CPU_USAGE,
    grid: { w: 1, h: 2 },
    metadata: { key: 'CPU' }
  },
  {
    title: 'Total CO2 Emission',
    description: 'Display key metric values.',
    image: getImageUrl('co2-metric-card-widget', 'svg'),
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2 },
    metadata: { key: 'CO2', unit: 'kg' }
  },
  {
    title: 'Total Power Consumption',
    description: 'Display key metric values.',
    image: getImageUrl('power-metric-card-widget', 'svg'),
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2 },
    metadata: { key: 'POWER', unit: 'kWh' }
  },
  {
    title: 'Total CPU Utilization',
    description: 'Display key metric values.',
    image: getImageUrl('cpu-metric-card-widget', 'svg'),
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2 },
    metadata: { key: 'CPU', unit: '%' }
  }
]
