<template>
    <div class="absolute top-2 right-2 flex space-x-2">
        <fwb-dropdown text="Bottom" align-to-end>
            <template #trigger>
                <button :class="buttonClass">
                    <font-awesome-icon icon="ellipsis-v" />
                </button>
            </template>
            <div class="bg-white rounded shadow-lg p-2">
                <button @click="duplicateWidget"
                    class="flex items-center space-x-2 p-2 cursor-pointer hover:bg-blue-50 rounded text-blue-600 w-full text-left">
                    <font-awesome-icon icon="clone" />
                    <span class='text-sm font-light'>Duplicate</span>
                </button>
                <button @click="deleteWidget"
                    class="flex items-center space-x-2 p-2 cursor-pointer hover:bg-red-50 rounded text-red-600 w-full text-left">
                    <font-awesome-icon icon="trash" />
                    <span class='text-sm font-light'>Delete</span>
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
    return props.darkBackground ? 'text-white' : 'text-gray-800';
});
</script>