<template>
  <div :id="data.id" :gs-id="data.id" :gs-x="data.grid.x" :gs-y="data.grid.y" :gs-w="data.grid.w" :gs-h="data.grid.h"
    :gs-min-w="minWidth" :gs-min-h="minHeight">
    <div class="grid-stack-item-content grid-stack-item p-4 rounded-lg drop-shadow-widget cursor-move"
      :class="cardClass">
      <div class="metric-title text-white">
        {{ data.title }}
      </div>
      <div class="metric-content flex items-end mt-2">
        <span class="metric-value text-white text-4xl font-bold">{{ data.metadata.value }}</span>
        <span class="metric-unit text-white text-xl ml-2">{{ data.metadata.unit }}</span>
      </div>
      <!-- Widget Actions -->
      <WidgetActions @duplicateWidget="duplicateWidget" @deleteWidget="deleteWidget" :dark-background="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { useWidgetActions } from '@/composables/useWidgetActions';
import WidgetActions from '../WidgetActions.vue';
import type { Widget } from '@/types/widgets.types';

interface MetaData {
  value: number;
  unit: string;
}

const props = defineProps<{
  data: Widget<MetaData>;
}>();

const minWidth = 1;
const minHeight = 2;

const cardClass = computed(() => {
  if (props.data.metadata.value < 10) {
    return 'bg-green-400';
  } else if (props.data.metadata.value < 20) {
    return 'bg-orange-300';
  } else {
    return 'bg-red-400';
  }
});

const emit = defineEmits(['duplicate', 'delete']);

const { duplicateWidget, deleteWidget } = useWidgetActions(props, emit);
</script>

<style scoped>
.metric-title {
  @apply text-lg;
}

.metric-content {
  @apply mt-2;
}
</style>
