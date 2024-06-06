<template>
    <div class="widget-actions">
        <fwb-dropdown text="Bottom" align-to-end>
            <template #trigger>
                <button :class="buttonClass">
                    <font-awesome-icon icon="ellipsis-v" />
                </button>
            </template>
            <div class="widget-actions__dropdown-menu">
                <button @click="duplicateWidget" class="widget-actions__button widget-actions__button--duplicate">
                    <font-awesome-icon icon="clone" />
                    <span class="widget-actions__text">Duplicate</span>
                </button>
                <button @click="deleteWidget" class="widget-actions__button widget-actions__button--delete">
                    <font-awesome-icon icon="trash" />
                    <span class="widget-actions__text">Delete</span>
                </button>
            </div>
        </fwb-dropdown>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { FwbDropdown } from 'flowbite-vue';

const props = defineProps<{
    darkBackground: boolean;
}>();

const emit = defineEmits(['duplicateWidget', 'deleteWidget']);

const duplicateWidget = () => {
    emit('duplicateWidget');
};

const deleteWidget = () => {
    emit('deleteWidget');
};

const buttonClass = computed(() => {
    return props.darkBackground ? 'widget-actions__trigger--dark' : 'widget-actions__trigger';
});
</script>

<style scoped>
.widget-actions {
    @apply absolute top-2 right-2 flex space-x-2;
}

.widget-actions__dropdown-menu {
    @apply bg-white dark:bg-gray-800 rounded shadow-lg p-2;
}

.widget-actions__button {
    @apply flex items-center space-x-2 p-2 cursor-pointer rounded w-full text-left;
}

.widget-actions__button--duplicate {
    @apply hover:bg-blue-50 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400;
}

.widget-actions__button--delete {
    @apply hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400;
}

.widget-actions__text {
    @apply text-sm font-light;
}

.widget-actions__trigger {
    @apply text-gray-800;
}

.widget-actions__trigger--dark {
    @apply text-white;
}
</style>
