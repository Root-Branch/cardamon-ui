<template>
  <div
    :id="data.id"
    :gs-id="data.id"
    :gs-x="data.grid.x"
    :gs-y="data.grid.y"
    :gs-w="data.grid.w"
    :gs-h="data.grid.h"
    :gs-min-w="minWidth"
    :gs-min-h="minHeight"
  >
    <div
      class="metric-card__container grid-stack-item-content grid-stack-item p-4 rounded-lg drop-shadow-widget cursor-move"
      :class="cardClass"
    >
      <div class="metric-card__title">
        {{ data.title }}
      </div>
      <div class="metric-card__content">
        <span class="metric-card__value">{{ data.metadata.value }}</span>
        <span class="metric-card__unit">{{ data.metadata.unit }}</span>
      </div>
      <!-- Widget Actions -->
      <!-- <WidgetActions @duplicateWidget="duplicateWidget" @deleteWidget="deleteWidget" :dark-background="true" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { defineProps } from 'vue'
import type { Widget } from '@/types/widgets.types'

interface MetaData {
  value: number
  unit: string
}

const props = defineProps<{
  data: Widget<MetaData>
}>()

const minWidth = 1
const minHeight = 2

const cardClass = computed(() => {
  if (props.data.metadata.value < 10) {
    return 'metric-card--green'
  } else if (props.data.metadata.value < 20) {
    return 'metric-card--orange'
  } else {
    return 'metric-card--red'
  }
})

// const emit = defineEmits(['duplicate', 'delete'])

// const { duplicateWidget, deleteWidget } = useWidgetActions(props, emit)
</script>

<style scoped>
.metric-card__container {
  @apply p-4 rounded-lg drop-shadow-widget cursor-move;
}

.metric-card__title {
  @apply text-lg text-white;
}

.metric-card__content {
  @apply flex items-end mt-2;
}

.metric-card__value {
  @apply text-4xl font-bold text-white;
}

.metric-card__unit {
  @apply text-xl ml-2 text-white;
}

.metric-card--green {
  @apply bg-green-400 dark:bg-green-600;
}

.metric-card--orange {
  @apply bg-orange-300 dark:bg-orange-500;
}

.metric-card--red {
  @apply bg-red-400 dark:bg-red-600;
}
</style>
