import { WidgetType } from '@/types/widgets.types'
import { getImageUrl } from '@/utils/image.utils'

export const defaultWidgets = [
  {
    id: '1',
    title: 'Avg. CO2 Emission',
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2, x: 0, y: 0 },
    metadata: { key: 'CO2', unit: 'kg' }
  },
  {
    id: '2',
    title: 'Avg. Power Consumption',
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2, x: 1, y: 0 },
    metadata: { key: 'POWER', unit: 'kWh' }
  },
  {
    id: '3',
    title: 'Avg. CPU Utilization',
    type: WidgetType.METRIC,
    grid: { w: 1, h: 2, x: 2, y: 0 },
    metadata: { key: 'CPU', unit: '%' }
  },
  {
    id: '4',
    title: 'Data Table',
    type: WidgetType.TABLE,
    grid: { w: 6, h: 5, x: 0, y: 2 },
    metadata: { key: 'RUNS' }
  },
  {
    id: '5',
    title: 'Dynamic Chart',
    type: WidgetType.CHART,
    grid: { w: 3, h: 5, x: 0, y: 7 },
    metadata: { key: 'TOTAL' }
  },
  {
    id: '6',
    title: 'CPU Usage Timeline',
    type: WidgetType.CPU_USAGE,
    grid: { w: 3, h: 5, x: 3, y: 7 },
    metadata: { key: 'CPU' }
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
    title: 'CPU Usage Timeline',
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
