export enum WidgetType {
  METRIC = 'METRIC',
  CHART = 'CHART',
  TABLE = 'TABLE',
  CPU_USAGE = 'CPU_USAGE'
}

export interface Grid {
  x?: number
  y?: number
  w?: number
  h?: number
}

export interface Widget<T = any> {
  id: string
  title: string
  type: WidgetType
  grid: Grid
  metadata: T
}

export interface WidgetPosition {
  id: string
  x: number
  y: number
  w: number
  h: number
}

export interface WidgetOption<T = any> {
  title: string
  type: WidgetType
  image: string
  description: string
  grid: Grid
  metadata: T
}