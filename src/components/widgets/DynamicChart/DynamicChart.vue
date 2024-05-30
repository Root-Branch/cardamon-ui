<template>
  <div :id="data.id" :gs-id="data.id" :gs-x="data.grid.x" :gs-y="data.grid.y" :gs-w="data.grid.w" :gs-h="data.grid.h"
    :gs-min-w="minWidth" :gs-min-h="minHeight">
    <div class="grid-stack-item-content grid-stack-item p-6 rounded-lg drop-shadow-widget bg-white">
      <!-- Header with title and actions -->
      <div class="header">
        <h3 class="title">{{ titleText }}</h3>
        <WidgetActions @duplicateWidget="duplicateWidget" @deleteWidget="deleteWidget" :dark-background="false" />
      </div>
      <!-- Metric buttons and chart type selector -->
      <div class="controls">
        <div class="metrics">
          <button v-for="metric in metrics" :key="metric" @click="selectMetric(metric)"
            :class="['metric-button', { active: selectedMetric === metric }]">
            {{ metric }}
          </button>
        </div>
        <fwb-dropdown :text="chartTypeText" align-to-end>
          <template #trigger>
            <button class="chart-type-button">
              <span class="mr-2">{{ chartTypeText }}</span>
              <font-awesome-icon icon="chevron-down" />
            </button>
          </template>
          <div class="dropdown-menu">
            <button @click="() => changeChartType(ChartType.LINE)" class="dropdown-item">Line Chart</button>
            <button @click="() => changeChartType(ChartType.BAR)" class="dropdown-item">Bar Chart</button>
            <button @click="() => changeChartType(ChartType.PIE)" class="dropdown-item">Pie Chart</button>
          </div>
        </fwb-dropdown>
      </div>
      <!-- Total value display -->
      <div class="total">
        <div class="total-title">TOTAL {{ selectedMetric.replace('_', ' ') }}</div>
        <div class="total-value">{{ totalValue }} {{ unit }}</div>
      </div>
      <!-- Chart canvas -->
      <div class="chart-container mt-4">
        <component :is="ChartComponent" :chart-data="chartData" :chart-options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { FwbDropdown } from 'flowbite-vue';
import WidgetActions from '../WidgetActions.vue';
import { useWidgetActions } from '@/composables/useWidgetActions';
import type { Widget } from '@/types/widgets.types';
import LineChart from '../Charts/LineChart.vue';
import BarChart from '../Charts/BarChart.vue';
import PieChart from '../Charts/PieChart.vue';
import { ChartType, MetricType, type MetaData } from '@/types/chart.types';
import { chartBackgroundColor, chartBorderColor } from '@/constants/chart.const';

const minWidth = 3;
const minHeight = 5;

const props = defineProps<{
  data: Widget<MetaData>;
}>();

const selectedMetric = ref<MetricType>(MetricType.POWER);
const chartType = ref<ChartType>(ChartType.LINE);

const metrics = Object.values(MetricType);

const totalValue = computed(() => {
  const total = props.data.metadata.totals.find(t => t.metricType === selectedMetric.value)?.value || 0;
  return total.toFixed(2);
});

const unit = computed(() => {
  switch (selectedMetric.value) {
    case MetricType.CO2:
      return 'kg';
    case MetricType.POWER:
      return 'kWh';
    case MetricType.CPU:
      return '%';
    default:
      return '';
  }
});

const titleText = computed(() => {
  switch (selectedMetric.value) {
    case MetricType.CO2:
      return 'CO2 Emissions';
    case MetricType.POWER:
      return 'Power Consumption';
    case MetricType.CPU:
      return 'CPU Usage';
    default:
      return 'Metric';
  }
});

const ChartComponent = computed(() => {
  switch (chartType.value) {
    case ChartType.LINE:
      return LineChart;
    case ChartType.BAR:
      return BarChart;
    case ChartType.PIE:
      return PieChart;
    default:
      return LineChart;
  }
});

const chartTypeText = computed(() => {
  switch (chartType.value) {
    case ChartType.LINE:
      return 'Line Chart';
    case ChartType.BAR:
      return 'Bar Chart';
    case ChartType.PIE:
      return 'Pie Chart';
    default:
      return 'Chart';
  }
});

const chartData = computed(() => ({
  labels: props.data.metadata.data.map(d => new Date(d.startTime).toLocaleDateString()),
  datasets: [
    {
      label: selectedMetric.value,
      data: props.data.metadata.data.map(d => {
        const metric = d.metrics.find(m => m.metricType === selectedMetric.value);
        return metric ? metric.value : 0;
      }),
      backgroundColor: chartType.value === ChartType.PIE ? chartBackgroundColor : chartBackgroundColor[0],
      borderColor: chartType.value === ChartType.PIE ? chartBorderColor : chartBorderColor[0],
      borderWidth: 1,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      enabled: true,
    },
    legend: {
      display: true,
      position: 'bottom',
    },
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
};

// Change chart type and selected metric
const changeChartType = (type: ChartType) => {
  chartType.value = type;
};

const selectMetric = (metric: MetricType) => {
  selectedMetric.value = metric;
};

const emit = defineEmits(['duplicate', 'delete']);

const { duplicateWidget, deleteWidget } = useWidgetActions(props, emit);
</script>

<style scoped>
.header {
  @apply flex justify-between items-center;
}

.title {
  @apply text-lg font-semibold;
}

.controls {
  @apply flex justify-between items-center mt-4;
}

.metrics {
  @apply flex space-x-2;
}

.metric-button {
  @apply bg-gray-400 text-white px-6 py-2 rounded-full text-xs font-light;
}

.metric-button.active {
  @apply bg-blue-500 text-white;
}

.metric-button:not(.active):hover {
  @apply bg-gray-300;
}

.chart-type-button {
  @apply text-gray-500 flex justify-between items-center rounded-full px-6 py-2 border border-gray-300 text-sm;
}

.dropdown-menu {
  @apply bg-white rounded shadow-lg w-40 text-sm;
}

.dropdown-item {
  @apply p-2 w-full hover:bg-gray-100;
}

.total {
  @apply text-left mt-8;
}

.total-title {
  @apply text-sm font-light text-gray-500;
}

.total-value {
  @apply text-5xl font-bold text-chart-value mt-2;
}

.chart-container {
  @apply mt-4;
}
</style>import { chartBackgroundColor, chartBorderColor } from '@/constants/chart';
