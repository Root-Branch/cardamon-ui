<template>
    <div class="flex justify-between items-center mt-4">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>{{ currentPage }} / {{ total }}</span>
        <button @click="nextPage" :disabled="currentPage === total">Next</button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    total: {
        type: Number,
        required: true
    },
    current: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['page-changed']);

const prevPage = () => {
    if (props.current > 1) {
        emit('page-changed', props.current - 1);
    }
};

const nextPage = () => {
    if (props.current < props.total) {
        emit('page-changed', props.current + 1);
    }
};
</script>

<style scoped>
button {
    @apply px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300;
}
</style>