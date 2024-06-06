<!-- ErrorBoundary.vue -->
<template>
    <div>
        <slot v-if="!error"></slot>
        <div v-else class="error-widget">
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onErrorCaptured } from 'vue';

export default defineComponent({
    name: 'ErrorBoundary',
    setup(props, { slots }) {
        const error = ref(false);
        const errorMessage = ref('');

        onErrorCaptured((err: Error) => {
            error.value = true;
            errorMessage.value = err.message;
            console.error(err);
            return false;
        });

        return {
            error,
            errorMessage,
            slots,
        };
    }
});
</script>

<style scoped>
.error-widget {
    @apply p-4;
}
</style>